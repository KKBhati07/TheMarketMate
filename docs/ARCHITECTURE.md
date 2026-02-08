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
│  │  │   App Root   │  │   Home      │  │   Header    │      │   │
│  │  │  Component   │  │  Component  │  │  Component  │      │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   User       │  │   Chat       │  │   Filters    │    │   │
│  │  │   Profile    │  │  Component   │  │  Component   │    │   │
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
│  │        Shared Library (@marketmate/shared)                │   │
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
│  SpringMate  │    │   Chat       │    │   Browser    │
│  Backend API │    │   Service    │    │   Storage    │
│  (REST)      │    │  (WebSocket) │    │(LocalStorage)│
└──────────────┘    └──────────────┘    └──────────────┘
```

### Key Architectural Decisions

- **Monorepo with Shared Library**: Both apps consume `@marketmate/shared` (located at `libs/shared`) to avoid duplication and ensure consistency
- **Standalone Components Architecture**: All components are standalone (Angular 21), eliminating NgModules for better tree-shaking and performance
- **Lazy-Loaded Routes**: Routes are lazy-loaded for code splitting and performance optimization
- **Server-Side Rendering (SSR)**: MarketMate app supports SSR with incremental hydration for improved SEO and initial load performance
- **REST API Communication**: All backend communication via REST API through centralized `ApiService`

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

- **ApiService**: Centralized HTTP client with interceptors for auth headers, error handling, and request/response transformation
- **AuthService**: Session management with cookie-based JWT (httpOnly cookies managed by backend)
- **StorageService**: Typed abstraction over localStorage with expiration support
- **GlobalErrorHandler**: Catches unhandled errors to prevent white-screen crashes, logs to console in dev mode

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

**Security Decision**: JWT stored in httpOnly cookies (backend-managed) prevents XSS token theft. Frontend never directly accesses tokens.

### Listing Creation Flow

```
PublishListingFormComponent → ListingService → ApiService
                                              ↓
                                    HTTP POST (withCredentials)
                                              ↓
                                    SpringMate Backend
                                              ↓
                                    Response → NotificationService
```

### 3. Real-time Chat Flow
```
ChatInputComponent → ChatSocketService → Socket.IO emit('send_message')
                                              ↓
                                    Chat Service (NestJS)
                                              ↓
                                    Socket.IO on('new_message')
                                              ↓
                                    ChatStateService → ChatWindowComponent
```

**Architecture**: Chat state managed in `ChatStateService` (RxJS Subjects) to decouple Socket.IO events from component rendering. Enables offline message queuing and reconnection handling.

---

## Security Architecture

### Authentication & Authorization

- **Cookie-Based JWT**: Tokens stored in httpOnly cookies, preventing JavaScript access (XSS protection)
- **withCredentials**: All API calls include credentials for cookie transmission
- **Route Guards**: `LoginSignupGuard` prevents authenticated users from accessing auth pages
- **Session Validation**: `AuthService` validates session on app initialization and route navigation

### API Communication

- **HTTPS Only**: All API calls over HTTPS in production
- **CORS**: Configured on backend with specific origin whitelist
- **Request Interceptors**: `ApiService` automatically attaches auth headers and handles token refresh

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
- **Local Storage**: User preferences (theme, filters) persisted via `StorageService`
- **No Global State Store**: State scoped to feature services to avoid over-engineering

**Decision**: Service-based state with RxJS sufficient for current complexity. Signals adopted incrementally for new features. NgRx considered for future if state management becomes complex.

### SSR & Hydration

- **Server-Side Rendering**: Full SSR support with Express server
- **Incremental Hydration**: Progressive hydration using `provideClientHydration(withEventReplay())` for better performance
- **Prerendering**: Static routes are prerendered at build time
- **SSR Caching**: In-memory caching of rendered pages for improved performance

---

## Technology Stack

- **Angular**: 21.1.2 (standalone components, SSR, incremental hydration)
- **Nx**: 22.4.4 (monorepo tooling)
- **TypeScript**: ~5.9.3
- **Angular Material**: 21.1.2
- **RxJS**: ~7.8.0

## Related Documentation

- **System Architecture**: `mm-infra/docs/ARCHITECTURE.md` (system-level diagrams)
- **Backend Architecture**: `SpringMate/SpringMate/docs/ARCHITECTURE.md` (API details)
