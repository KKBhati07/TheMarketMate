# MarketMate Frontend Architecture Documentation (C4 Model)

This document provides detailed architecture diagrams for the MarketMate frontend applications using the C4 model (Component and Code levels).

> **Note**: For system-level architecture (System Context and Container diagrams), see `mm-infra/docs/ARCHITECTURE.md`.

---

## Table of Contents

1. [Component Diagram (Level 3)](#component-diagram-level-3)
2. [Code Diagram (Level 4)](#code-diagram-level-4)
3. [Technology Stack](#technology-stack)
4. [Data Flow Examples](#data-flow-examples)
5. [State Management](#state-management)
6. [Shared Library Architecture](#shared-library-architecture)

---

## Component Diagram (Level 3)

### Overview
The Component diagram shows the major components within the MarketMate frontend workspace.

```
┌─────────────────────────────────────────────────────────────────┐
│                  MarketMate Frontend Workspace                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MarketMate Public App                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   App Root   │  │   Home      │  │   Header    │   │   │
│  │  │  Component   │  │  Component  │  │  Component  │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   User       │  │   Chat       │  │   Filters    │   │   │
│  │  │   Profile    │  │   Module     │  │  Component   │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Admin Portal App                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Admin      │  │   User       │  │   Listing    │   │   │
│  │  │   Dashboard  │  │  Management │  │  Management │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Shared Library (mm-shared)                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   UI         │  │   Services   │  │   Forms     │   │   │
│  │  │  Components  │  │              │  │  Module     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Auth       │  │   Storage    │  │   Notification│   │   │
│  │  │   Service    │  │   Service    │  │   Module     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  SpringMate  │    │   Chat       │    │   Browser    │
│  Backend API │    │   Service    │    │   Storage    │
│  (REST)      │    │  (WebSocket) │    │  (LocalStorage)│
└──────────────┘    └──────────────┘    └──────────────┘
```

### Key Components

#### MarketMate Public App (`apps/marketmate`)

**Feature Modules:**
- **AppRootModule**: Root component with routing and layout
- **AppHeaderModule**: Header navigation and user menu
- **UserProfileModule**: User profile management
- **ChatModule**: Real-time chat functionality (lazy-loaded)
- **AppUtilModule**: Utility components (listing forms, filters, etc.)

**Components:**
- **AppRootComponent**: Main app container
- **HomeComponent**: Homepage with listings
- **FiltersComponent**: Listing filters (category, location, price)
- **UserProfileComponent**: User profile display and editing
- **ChatShellComponent**: Chat interface container
- **ChatWindowComponent**: Individual chat window
- **ConversationListComponent**: List of conversations
- **MessageBubbleComponent**: Individual message display

**Services:**
- **ListingService**: Listing CRUD operations
- **UserService**: User profile operations
- **CategoryService**: Category data
- **LocationService**: Location data
- **ChatSocketService**: WebSocket connection for chat
- **ChatStateService**: Chat state management

#### Admin Portal App (`apps/mm-admin-portal`)

**Feature Modules:**
- Admin-specific modules for user and listing management
- Shared components from `mm-shared`

#### Shared Library (`apps/mm-shared`)

**Modules:**
- **SharedModule**: Core UI components and services
- **FormsModule**: Reusable form components
- **NotificationModule**: Toast notifications
- **AppListingCardModule**: Listing card component

**Services:**
- **ApiService**: HTTP client wrapper with interceptors
- **AuthService**: Authentication and session management
- **StorageService**: Local storage abstraction
- **FavoriteService**: Favorite listings management
- **FilterService**: Filter state management
- **ThemeService**: Theme switching (light/dark)
- **LoggingService**: Centralized logging service for application-wide logging
- **DeviceDetectorService**: Device type and screen size detection
- **LocalStorageService**: Typed localStorage wrapper

**Components:**
- **AppButtonComponent**: Reusable button component
- **AppLoaderComponent**: Loading spinner
- **FormContainerComponent**: Login/signup forms
- **AppListingCardComponent**: Listing card display
- **ImageViewerComponent**: Image viewing
- **FourOFourComponent**: 404 page

**Utilities:**
- **Guards**: Route guards (LoginSignupGuard)
- **Initializers**: App initialization (auth, theme)
- **Error Handlers**: GlobalErrorHandler for unhandled errors
- **Animations**: Reusable Angular animations
- **Pipes**: Format text pipe
- **Models**: Shared TypeScript interfaces
- **Utils**: API response wrapper, common utilities, bootstrap logger

---

## Code Diagram (Level 4)

### Overview
The Code diagram shows the detailed structure of key components (Listing Service and Chat Module) as examples.

#### ListingService Component

```
┌─────────────────────────────────────────────────────────────────┐
│                      ListingService Component                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Public Methods                         │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │ createListing()                                    │   │   │
│  │  │ - Creates new listing                              │   │   │
│  │  │ - Returns Observable<ApiResponse>                  │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │ getAll()                                          │   │   │
│  │  │ - Fetches paginated listings                       │   │   │
│  │  │ - Supports query parameters                        │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │ getByUser()                                        │   │   │
│  │  │ - User's listings                                  │   │   │
│  │  │ - Pagination support                               │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │ getFavoriteByUser()                               │   │   │
│  │  │ - User's favorite listings                        │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │ uploadImageFallback()                             │   │   │
│  │  │ - Fallback image upload                            │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Dependencies                          │   │
│  │  ┌──────────────┐                                       │   │
│  │  │  ApiService  │  - HTTP client wrapper                │   │
│  │  │  (from       │  - Handles auth headers               │   │
│  │  │  mm-shared)  │  - Error handling                     │   │
│  │  └──────────────┘                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### ChatModule Component

```
┌─────────────────────────────────────────────────────────────────┐
│                      ChatModule Component                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Components                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   ChatShell  │  │   ChatWindow │  │ Conversation │   │   │
│  │  │  Component  │  │  Component  │  │ List Component│   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │  ┌──────────────┐  ┌──────────────┐                     │   │
│  │  │   ChatInput  │  │  Message     │                     │   │
│  │  │  Component   │  │  Bubble      │                     │   │
│  │  │              │  │  Component   │                     │   │
│  │  └──────────────┘  └──────────────┘                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Services                              │   │
│  │  ┌──────────────┐  ┌──────────────┐                     │   │
│  │  │  ChatSocket  │  │  ChatState   │                     │   │
│  │  │   Service    │  │   Service    │                     │   │
│  │  │              │  │              │                     │   │
│  │  │ - connect()  │  │ - State      │                     │   │
│  │  │ - disconnect()│ │   management│                     │   │
│  │  │ - joinConv() │  │ - Message    │                     │   │
│  │  │ - sendMsg()  │  │   handling   │                     │   │
│  │  │ - onMessage()│  │              │                     │   │
│  │  └──────────────┘  └──────────────┘                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Dependencies                          │   │
│  │  ┌──────────────┐                                       │   │
│  │  │  Socket.IO  │  - WebSocket client                    │   │
│  │  │  Client      │  - Real-time communication            │   │
│  │  └──────────────┘                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework
- **Angular**: 17+ (standalone components + modules)
- **Nx Workspace**: Monorepo management
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for async operations

### UI Libraries
- **Angular Material**: UI component library
- **SCSS**: Styling with variables and mixins
- **Angular Animations**: Smooth UI transitions

### Communication
- **HTTP Client**: Angular HttpClient for REST API calls
- **Socket.IO Client**: WebSocket for real-time chat
- **Fetch API**: Alternative HTTP client (via withFetch)

### State Management
- **RxJS Observables**: Reactive state management
- **Services**: Injectable services for state
- **Local Storage**: Browser storage for persistence

### Build & Development
- **Nx**: Build system and tooling
- **Angular CLI**: Development server and build
- **Docker**: Containerization for development

---

## Data Flow Examples

### 1. Listing Creation Flow
```
User Input → PublishListingFormComponent → ListingService
                                              ↓
                                        ApiService (mm-shared)
                                              ↓
                                        HTTP POST → SpringMate Backend
                                              ↓
                                        Response → Component Update
```

### 2. Listing Retrieval Flow (with Pagination)
```
HomeComponent → ListingService.getAll() → ApiService
                                              ↓
                                        HTTP GET with query params
                                              ↓
                                        SpringMate Backend → PaginatedResponse
                                              ↓
                                        Component renders listings
```

### 3. Real-time Chat Flow
```
User Input → ChatInputComponent → ChatSocketService
                                      ↓
                                Socket.IO emit('send_message')
                                      ↓
                                Chat Service (NestJS)
                                      ↓
                                Socket.IO on('new_message')
                                      ↓
                                ChatStateService → ChatWindowComponent
```

### 4. Authentication Flow
```
User Login → FormContainerComponent → AuthService (mm-shared)
                                          ↓
                                    ApiService → SpringMate Backend
                                          ↓
                                    JWT Cookie → Local Storage
                                          ↓
                                    Auth Guard → Route Protection
```

---

## State Management

### Service-Based State
The application uses Angular services with RxJS for state management:

- **AuthService**: User authentication state
- **ChatStateService**: Chat conversations and messages
- **FilterService**: Listing filter state
- **ThemeService**: Theme preference (light/dark)
- **LoggingService**: Application logging (dev mode only)
- **LoggingService**: Application logging (dev mode only)

### State Flow Pattern
```
Component → Service Method → HTTP/Socket → Response
     ↑                                           ↓
     └─────────── Update State ──────────────────┘
```

### Local Storage
- **Auth tokens**: Stored in httpOnly cookies (handled by backend)
- **User preferences**: Theme, filters (via StorageService)
- **Session data**: Managed by backend via cookies

---

## Shared Library Architecture

### mm-shared Library Structure

```
mm-shared/
├── lib/
│   ├── modules/
│   │   ├── shared/          # Core UI components
│   │   ├── forms/           # Form components
│   │   └── app-listing-card/ # Listing card
│   ├── services/            # Shared services
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── storage.service.ts
│   │   └── favorite.service.ts
│   ├── guards/              # Route guards
│   ├── initializers/        # App initializers
│   ├── animations/          # Reusable animations
│   ├── models/              # TypeScript interfaces
│   ├── pipes/               # Custom pipes
│   └── utils/               # Utility functions
└── styles/                  # Global SCSS
    ├── styles.scss          # Material core
    └── lib/                 # Variables, mixins
```

### Shared Module Configuration

The `SharedModule.forRoot()` pattern provides:
- **ApiService**: Configured with API URL
- **AuthService**: Authentication management
- **StorageService**: Local storage abstraction
- **FavoriteService**: Favorite listings

### Usage Pattern

```typescript
// In app.config.ts
importProvidersFrom(
  SharedModule.forRoot({
    apiUrl: environment.apiUrl
  })
)
```

---

## Routing Architecture

### MarketMate Public App Routes

```
/ (root)
├── /home                    # HomeComponent
├── /auth/login              # FormContainerComponent (login)
├── /auth/signup             # FormContainerComponent (signup)
├── /user/:uuid              # UserProfileComponent
├── /chat                    # ChatModule (lazy-loaded)
│   ├── /chat/:conversationId
│   └── /chat
└── /404                     # FourOFourComponent
```

### Route Guards
- **LoginSignupGuard**: Prevents authenticated users from accessing login/signup

---

## Component Communication Patterns

### 1. Parent-Child Communication
- **@Input()**: Data from parent to child
- **@Output()**: Events from child to parent

### 2. Service-Based Communication
- **Shared Services**: Cross-component communication
- **RxJS Subjects**: Reactive state updates

### 3. Event Bus (via Services)
- **NotificationService**: Toast notifications
- **ChatStateService**: Chat state updates

---

## Performance Optimizations

### Lazy Loading
- **ChatModule**: Lazy-loaded for code splitting
- **Route-based**: Components loaded on demand

### Change Detection
- **OnPush Strategy**: Where applicable
- **Zone.js**: Optimized change detection

### Caching
- **Service-level**: API response caching in services
- **Browser Cache**: HTTP cache headers

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based splitting
- **Shared Library**: Common code in mm-shared

---

## Security Architecture

### Authentication
- **JWT Tokens**: Stored in httpOnly cookies (backend-managed)
- **AuthService**: Token validation and refresh
- **Route Guards**: Protected routes

### API Communication
- **HTTPS**: All API calls over HTTPS
- **CORS**: Configured on backend
- **Credentials**: withCredentials for cookie-based auth

### Input Sanitization
- **Angular Sanitization**: Built-in XSS protection
- **Form Validation**: Reactive forms validation

### Error Handling
- **GlobalErrorHandler**: Catches unhandled runtime errors and prevents white-screen crashes
- **LoggingService**: Centralized logging for debugging and monitoring (dev mode only)
- **NotificationService**: User-friendly error notifications
- **Error Recovery**: Graceful error handling with user feedback

---

## Styling Architecture

### Global Styles (mm-shared)
- **Material Core**: Single import in shared styles
- **Design Tokens**: Colors, spacing, typography
- **Mixins**: Reusable SCSS patterns

### App-Specific Styles
- **Component Styles**: Scoped to components
- **App Overrides**: Minimal app-specific overrides

### Theming
- **ThemeService**: Light/dark theme switching
- **Material Theming**: Angular Material theme configuration

---

## Related Documentation

- **System Architecture**: See `mm-infra/docs/ARCHITECTURE.md` for system-level diagrams
- **Backend Architecture**: See `SpringMate/SpringMate/docs/ARCHITECTURE.md` for API details
- **Shared Library**: See `apps/mm-shared/README.md` for library documentation

---

## Notes

- The frontend uses a **service-based architecture** with RxJS for state management
- **mm-shared library** centralizes reusable components and services
- **Lazy loading** is used for feature modules (chat)
- **Standalone components** are used alongside modules for flexibility
- **Angular Material** provides consistent UI components
- **Socket.IO** handles real-time chat communication
- All API calls go through **ApiService** which handles authentication and error handling
- **GlobalErrorHandler** provides a safety net for unhandled errors
- **LoggingService** centralizes application logging (console output in dev mode only)
- **NotificationService** provides consistent user-facing error messages

---

## Future Enhancements

1. **State Management Library**: Consider NgRx for complex state
2. **Server-Side Rendering**: Enhance SSR capabilities
3. **Progressive Web App**: Add PWA features
4. **Component Library**: Expand shared component library
5. **Testing**: Increase unit and e2e test coverage