# MarketMate Frontend Architecture

> **Note**: For system-level architecture (System Context and Container diagrams), see `mm-infra/docs/ARCHITECTURE.md`.

---

## High-Level Structure

The MarketMate frontend is an Nx monorepo containing two Angular applications sharing a common library:

```
┌─────────────────────────────────────────────────────────────────┐
│                  MarketMate Frontend Workspace                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MarketMate Public App                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   App Root   │  │   Home      │  │   Header      │    │   │
│  │  │  Component   │  │  Component  │  │  Component    │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   User       │  │   Listing    │  │   Filters    │    │   │
│  │  │   Profile    │  │   Detail     │  │  Component   │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Admin Portal App                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   Admin      │  │   User       │  │   Listing    │    │   │
│  │  │   Dashboard  │  │  Management │  │  Management   │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Shared Library (@marketmate/shared)               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   UI         │  │   Services   │  │   Forms      │    │   │
│  │  │  Components  │  │              │  │   Components │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   Auth       │  │   Storage    │  │ Notification │    │   │
│  │  │   Service    │  │   Service    │  │   Service    │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Backend API │    │ Storage API  │    │   Browser    │
│   (REST)     │    │ (REST)       │    │ Storage      │
│              │    │              │    │ (theme)      │
└──────────────┘    └──────────────┘    └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Object Store │
                   │ (S3 via PUT) │
                   └──────────────┘
```

### Key Architectural Decisions

- **Monorepo with Shared Library**: Both apps consume `@marketmate/shared` (located at `libs/shared`) to avoid duplication and ensure consistency
- **Standalone Components Architecture**: All components are standalone (Angular 21), eliminating NgModules for better tree-shaking and performance
- **Lazy-Loaded Routes**: Routes are lazy-loaded for code splitting and performance optimization
- **Server-Side Rendering (SSR)**: MarketMate app supports SSR with incremental hydration for improved SEO and initial load performance
- **REST API Communication**: All backend communication via REST API through centralized `ApiService`

### Repo-Verified Runtime Configuration

- **API base URL injection**: Both apps pass `environment.apiUrl` into `provideSharedLib({ apiUrl })` (so the shared `ApiService` is environment-driven)
- **HttpClient transport**: Both apps use `provideHttpClient(withFetch())` (Fetch-based HttpClient backend)
- **Local dev ports (Nx dev-server)**:
  - `marketmate`: port `4200` with `publicHost` `marketmate.local:4200`
  - `mm-admin-portal`: port `4300` with `publicHost` `marketmate.local:4300`
- **SSR server entry (marketmate)**: `apps/marketmate/server.ts` boots an Express HTTPS server (default `PORT=4000`) and expects local certs at `/certs/*`

---

## Shared Library Design

The `@marketmate/shared` library (located at `libs/shared`) centralizes reusable code and enforces architectural patterns across both applications.

### Provider Configuration Pattern

Uses functional providers pattern for singleton service configuration:

```typescript
// In app.config.ts
import { provideSharedLib } from '@marketmate/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    ...provideSharedLib({
      apiUrl: environment.apiUrl
    }),
    // ... other providers
  ]
};
```

**Rationale**: Allows environment-specific configuration (API URLs, feature flags) while maintaining singleton services across the app.

### Core Services

- **ApiService**: Centralized HTTP client that wraps responses in `ApiHttpResponse` (so HTTP errors don't throw) and sends requests with `withCredentials: true`
- **AuthService**: Maintains in-memory auth state and loads session details on app startup via `authInitializerFactory` (cookie-based session via `withCredentials`)
- **StorageService**: Fetches presigned upload URLs from the backend and uploads files directly to the object store (PUT to the presigned URL)
- **LocalStorageService**: Browser-only local storage wrapper (currently used for app theme persistence; SSR-safe via platform checks)
- **ThemeService**: Initializes and applies theme at startup via `themeInitializerFactory`
- **NotificationService**: App-wide toast/notification event stream and UI container components
- **GlobalErrorHandler**: Catches unhandled errors and shows a user-facing notification; logs via `LoggingService` in dev mode

### Library Structure

```
libs/shared/
├── src/
│   ├── lib/
│   │   ├── components/      # Standalone UI components (buttons, pills, cards, forms, etc.)
│   │   ├── services/         # Shared business logic services
│   │   ├── guards/           # Route guards (LoginSignupGuard)
│   │   ├── interceptors/      # HTTP interceptors (SSR-aware)
│   │   ├── initializers/     # App initialization (auth, theme)
│   │   ├── models/           # Shared TypeScript interfaces
│   │   ├── pipes/            # Custom pipes (formatText, etc.)
│   │   ├── animations/       # Reusable Angular animations
│   │   ├── utils/            # API response wrappers, common utilities
│   │   └── constants/        # Shared constants (SHARED_UI_DEPS, etc.)
│   ├── styles/               # Global SCSS with design tokens
│   └── public-api.ts         # Library exports (tree-shakeable)
```

**Design Principles**:
- All cross-app dependencies flow through `@marketmate/shared`, preventing direct dependencies between apps
- Standalone components and functional providers for optimal tree-shaking
- Tree-shakeable exports via `public-api.ts`
---

## Key Data Flows

### Authentication Flow

```
User Login → AuthService → ApiService → SpringMate Backend
                                      ↓
                            JWT in httpOnly Cookie
                                      ↓
                            AuthService validates session
                                      ↓
                            Route Guards enforce protection
```

**Frontend behavior**: The frontend always uses `withCredentials` and does not store tokens in JavaScript.

### Listing Creation Flow

```
PublishEditListingFormComponent
  → StorageService.getPresignPutUrl()
    → Backend API
    → presigned URLs + required headers
  → StorageService.uploadFileToS3() (PUT file bytes)
    → Object Store
  → ListingService.createListing()
    → ApiService (withCredentials)
    → Backend API
  → NotificationService (success/error toast)
```

### Contact Seller Flow (Email)
```
ListingDetailComponent
  → ContactOptionsDialogComponent (select EMAIL/CHAT)
  → ContactEmailDialogComponent (draft subject/body)
  → ListingService.contactSellerByEmail()
    → ApiService (withCredentials)
    → Backend API
  → NotificationService (success/error toast)
```

**Note**: "CHAT" exists as a UI option but the actual chat flow is currently a TODO in this repo.

---

## Security Architecture

### Authentication & Authorization

- **Cookie-based session**: The frontend relies on browser cookies via `withCredentials` and does not store tokens in JavaScript
- **Startup session load**: `authInitializerFactory` calls `AuthService.loadUserDetails()` on app startup (fails open so the UI can still boot if the auth endpoint is down)
- **Route Guards**:
  - `LoginSignupGuard` prevents authenticated users from accessing auth pages
  - `AdminGuard` protects admin portal routes by requiring authentication
- **Auth-aware UX**: Some flows handle `401` by redirecting to login with a `redirect` query param (example: contacting seller by email)

### API Communication

- **HTTPS Only**: All API calls over HTTPS in production
- **CORS**: Configured on backend with specific origin whitelist
- **withCredentials**: API calls include credentials so the browser can send/receive session cookies
- **App Context Header (Login)**: `AuthService.loginUser(...)` sends `X-App-Context` to distinguish app context (public vs admin) for backend session issuance
- **SSR-safe HTTP**: `ssrNoHttpInterceptor` blocks HTTP calls during SSR to avoid server-side API fetches (returns an empty `HttpResponse`)

### Error Handling

- **GlobalErrorHandler**: Catches unhandled runtime errors, logs to console (dev mode), and prevents white-screen crashes
- **User-Facing Errors**: `NotificationService` provides consistent error messaging
- **Input Sanitization**: Angular's built-in sanitization for XSS protection
- **Form Validation**: Reactive forms with server-side validation feedback

---

## Performance & Optimization

### Code Splitting

- **Lazy-Loaded Routes**: Routes are lazy-loaded for on-demand code splitting
- **Standalone Components**: Each component is independently importable, enabling better tree-shaking
- **Shared Library**: Common code bundled once via `@marketmate/shared` to minimize bundle size
- **Server-Side Rendering**: SSR with incremental hydration for faster initial page load

### State Management

- **Service-Based State**: RxJS Observables in services (no NgRx)
- **Local Storage**: App theme preference persisted via `LocalStorageService` (SSR-safe via platform checks)
- **No Global State Store**: State scoped to feature services to avoid over-engineering

**Current state**: This repo uses service-based state with RxJS and does not include a global store (e.g. NgRx).

### SSR & Hydration

- **Server-Side Rendering**: Full SSR support with Express server
- **Incremental Hydration**: Progressive hydration using `provideClientHydration(withEventReplay())` for better performance
- **Prerendering**: Static routes are prerendered at build time
- **SSR Caching**: In-memory caching of rendered HTML by URL in `apps/marketmate/server.ts` (5 minute cache-control + Map-based cache)
- **HTTP Security Headers (SSR)**: SSR server uses `helmet` with CSP directives
- **Compression (SSR)**: SSR server enables `compression()` for gzip responses
- **Health Endpoint (SSR)**: SSR server exposes `GET /health` returning `OK`

---

## Technology Stack

- **Angular**: 21.1.2 (standalone components, SSR, incremental hydration)
- **Nx**: 22.4.4 (monorepo tooling)
- **TypeScript**: ~5.9.3
- **Angular Material**: 21.1.2
- **RxJS**: ~7.8.0
- **Express**: SSR server (`apps/marketmate/server.ts`)
- **helmet**: Security headers for SSR responses
- **compression**: SSR response compression

## Related Documentation

- **System Architecture**: `mm-infra/docs/ARCHITECTURE.md` (system-level diagrams)
- **Backend Architecture**: `SpringMate/SpringMate/docs/ARCHITECTURE.md` (API details)
