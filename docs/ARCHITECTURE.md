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
│  │  │   Profile    │  │   Module     │  │  Component   │    │   │
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
│  │              Shared Library (mm-shared)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   UI         │  │   Services   │  │   Forms      │    │   │
│  │  │  Components  │  │              │  │   Module     │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   Auth       │  │   Storage    │  │ Notification │    │   │
│  │  │   Service    │  │   Service    │  │    Module    │    │   │
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

- **Monorepo with Shared Library**: Both apps consume `mm-shared` to avoid duplication and ensure consistency
- **Lazy-Loaded Feature Modules**: Auth and UserProfile modules are lazy-loaded in both apps for code splitting and performance
- **Hybrid Module/Standalone**: Uses Angular modules for shared library and standalone components in apps for flexibility
- **REST API Communication**: All backend communication via REST API through centralized `ApiService`

---

## Shared Library Design

The `mm-shared` library centralizes reusable code and enforces architectural patterns across both applications.

### Module Configuration Pattern

Uses `forRoot()` pattern for singleton service configuration:

```typescript
// In app.config.ts
importProvidersFrom(
  SharedModule.forRoot({
    apiUrl: environment.apiUrl
  })
)
```

**Rationale**: Allows environment-specific configuration (API URLs, feature flags) while maintaining singleton services across the app.

### Core Services

- **ApiService**: Centralized HTTP client with interceptors for auth headers, error handling, and request/response transformation
- **AuthService**: Session management with cookie-based JWT (httpOnly cookies managed by backend)
- **StorageService**: Typed abstraction over localStorage with expiration support
- **GlobalErrorHandler**: Catches unhandled errors to prevent white-screen crashes, logs to console in dev mode

### Library Structure

```
mm-shared/
├── lib/
│   ├── modules/          # Feature modules (forms, notifications, listing cards)
│   ├── services/         # Shared business logic services
│   ├── guards/           # Route guards (LoginSignupGuard)
│   ├── initializers/     # App initialization (auth, theme)
│   ├── models/           # Shared TypeScript interfaces
│   └── utils/            # API response wrappers, common utilities
└── styles/               # Global SCSS with design tokens
```

**Design Principle**: All cross-app dependencies flow through `mm-shared`, preventing direct dependencies between apps.

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

- **Lazy-Loaded Feature Modules**: Auth and UserProfile modules loaded on-demand in both applications
- **Shared Library**: Common code bundled once via `mm-shared` to minimize bundle size

### State Management

- **Service-Based State**: RxJS Observables in services (no NgRx)
- **Local Storage**: User preferences (theme, filters) persisted via `StorageService`
- **No Global State Store**: State scoped to feature services to avoid over-engineering

**Decision**: Service-based state sufficient for current complexity. NgRx considered for future if state management becomes complex.

---

## Related Documentation

- **System Architecture**: `mm-infra/docs/ARCHITECTURE.md` (system-level diagrams)
- **Backend Architecture**: `SpringMate/SpringMate/docs/ARCHITECTURE.md` (API details)
