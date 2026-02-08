# MarketMate Workspace

This repository is an **Nx Angular workspace** that hosts multiple frontend applications and shared libraries for the **MarketMate platform**.

The workspace is designed to support **multiple apps**, **shared UI/logic**, and **independent development**, while keeping a single, well-structured codebase.

## 🚀 Technology Stack

* **Angular**: 21.1.2 (with standalone components, SSR, and incremental hydration)
* **Nx**: 22.4.4 (monorepo tooling and build optimization)
* **TypeScript**: ~5.9.3
* **Angular Material**: 21.1.2
* **RxJS**: ~7.8.0

---

## 🧭 Workspace Overview

The workspace contains:

* **Public application** – customer-facing marketplace UI with SSR support
* **Admin portal** – internal application for managing the platform
* **Shared library** – reusable UI components, services, styles, and utilities

All projects are managed using **Nx**, enabling scalable architecture, clear boundaries, and efficient builds.

---

## 📁 Repository Structure

```
.
├── apps/
│   ├── marketmate/           # Public application (SSR-enabled)
│   └── mm-admin-portal/      # Admin portal
│
├── libs/
│   └── shared/               # Shared Angular library (@marketmate/shared)
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/    # Reusable UI components
│       │   │   ├── services/      # Shared services
│       │   │   ├── models/        # TypeScript interfaces
│       │   │   ├── guards/        # Route guards
│       │   │   ├── interceptors/  # HTTP interceptors
│       │   │   ├── pipes/         # Custom pipes
│       │   │   └── utils/         # Utility functions
│       │   └── styles/            # Global SCSS styles
│       └── public-api.ts          # Library exports
│
├── docs/                     # Architecture and deployment docs
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md                 # (this file)
```

---

## 🧱 Applications

### 🟢 MarketMate – Public App

* Customer-facing marketplace UI
* **Server-Side Rendering (SSR)** enabled for improved SEO and performance
* **Incremental Hydration** support (Angular 21 feature)
* Browsing listings, user flows, profiles
* Standalone components architecture
* Runs independently

📍 Location:

```
apps/marketmate
```

📄 Documentation:

```
apps/marketmate/README.md
```

🔧 Key Features:

* SSR with Express server
* Prerendering for static routes
* HTTPS support in development
* SSR caching for performance

---

### 🔐 MarketMate – Admin Portal

* Internal/admin-only application
* Listing management, moderation, dashboards
* Restricted access

📍 Location:

```
apps/mm-admin-portal
```

📄 Documentation:

```
apps/mm-admin-portal/README.md
```

---

## 📦 Shared Libraries

### @marketmate/shared

A reusable Angular library shared across all applications.

**Includes:**

* **UI Components**: Standalone components (buttons, pills, cards, forms, etc.)
* **Services**: Auth, API, Storage, Notification, and more
* **Guards**: Route protection (LoginSignupGuard)
* **Interceptors**: HTTP interceptors for SSR and error handling
* **Models**: TypeScript interfaces for API responses, listings, users, etc.
* **Pipes**: Custom pipes (formatText, etc.)
* **Animations**: Reusable Angular animations
* **Utilities**: Common helper functions
* **Styles**: Global SCSS with design tokens and Angular Material theming

📍 Location:

```
libs/shared
```

📄 Documentation:

```
libs/shared/README.md
```

---

## 🎨 Styling & Theming

* Global SCSS styles and Angular Material setup live in `libs/shared/src/styles`
* Applications consume global styles via build configuration
* Apps define only app-specific overrides
* Design tokens and CSS variables for consistent theming

> Angular Material theme configuration exists **only once** in the shared library to avoid duplication and ensure consistency.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS recommended)
* npm
* Nx CLI (optional but helpful)

---

### Install dependencies

```bash
npm install
```

---

### Run applications

**Development mode (with HMR):**

```bash
# Public app (client-side only)
nx serve marketmate

# Public app with SSR
nx serve-ssr marketmate

# Admin portal
nx serve mm-admin-portal

# Run all apps
npm start
```

**Default ports:**

* Public app: `http://localhost:4200`
* Admin portal: `http://localhost:4201`
* SSR server: `http://localhost:4000` (when using `serve-ssr`)

---

## 🐳 Docker (Development)

The workspace supports Docker-based development:

* Bind mounts for live reload
* Isolated `node_modules` volumes per app
* Multiple apps can run in parallel

Refer to individual app READMEs for Docker-specific instructions.

---

## 🏗 Builds

**Build individual projects:**

```bash
# Production builds
nx build marketmate
nx build mm-admin-portal
nx build shared

# Development builds (with source maps)
nx build marketmate --configuration=development
nx build mm-admin-portal --configuration=development
```

**Build outputs:**

* Applications: `dist/marketmate/`, `dist/mm-admin-portal/`
* Shared library: `dist/mm-shared/`
* SSR server bundle: `dist/marketmate/server/`
* Browser bundle: `dist/marketmate/browser/`

**Bundle analysis:**

```bash
npm run analyze:marketmate   # Analyze public app bundle
npm run analyze:admin        # Analyze admin portal bundle
npm run analyze:all          # Analyze all bundles
```

---

## 🧠 Development Principles

* **Standalone Components**: Use Angular's standalone component architecture
* **Shared Library**: Move reusable logic to `libs/shared`
* **No Cross-App Imports**: Apps should only import from shared library
* **Nx Boundaries**: Follow Nx project boundaries and tags
* **DRY**: Prefer shared styles and components over duplication
* **SSR-First**: Design components with SSR compatibility in mind
* **Type Safety**: Use TypeScript interfaces from shared models

---

## 📚 Additional Documentation

* **Architecture Details**: `docs/ARCHITECTURE.md` - Detailed frontend architecture
* **Deployment Guide**: `docs/DEPLOYMENT.md` - Deployment instructions
* **App-Specific Docs**: See individual app READMEs in `apps/` directories

---

## 📌 Notes

* This workspace is structured for scalability and maintainability
* Additional apps or libraries can be added easily using Nx generators
* Nx tooling enables dependency graphs, affected builds, and intelligent caching
* All shared code must go through `libs/shared` to maintain consistency
