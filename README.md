# MarketMate Workspace

This repository is an **Nx Angular workspace** that hosts multiple frontend applications and shared libraries for the **MarketMate platform**.

The workspace is designed to support **multiple apps**, **shared UI/logic**, and **independent development**, while keeping a single, well-structured codebase.

---

## 🧭 Workspace Overview

The workspace contains:

* **Public application** – customer-facing marketplace UI
* **Admin portal** – internal application for managing the platform
* **Shared library** – reusable UI components, services, styles, and utilities

All projects are managed using **Nx**, enabling scalable architecture, clear boundaries, and efficient builds.

---

## 📁 Repository Structure

```
.
├── apps/
│   ├── marketmate/           # Public application
│   └── mm-admin-portal/      # Admin portal
│   └── mm-shared/            # Shared Angular library
│
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md                 # (this file)
```

---

## 🧱 Applications

### 🟢 MarketMate – Public App

* Customer-facing marketplace UI
* Browsing listings, user flows, profiles
* Runs independently

📍 Location:

```
apps/marketmate
```

📄 Documentation:

```
apps/marketmate/README.md
```

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

### mm-shared

A reusable Angular library shared across all applications.

Includes:

* UI components
* Forms and validators
* Services and guards
* Animations and utilities
* Global styles and Angular Material configuration

📍 Location:

```
apps/mm-shared
```

📄 Documentation:

```
libs/mm-shared/README.md
```

---

## 🎨 Styling & Theming

* Global SCSS styles and Angular Material setup live in `mm-shared`
* Applications consume global styles via build configuration
* Apps define only app-specific overrides

> `mat.core()` and Material theme configuration must exist **only once** in the shared library.

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

```bash
nx serve marketmate
nx serve mm-admin-portal
```

Default ports:

* Public app: `http://localhost:4200`
* Admin portal: `http://localhost:4201`

---

## 🐳 Docker (Development)

The workspace supports Docker-based development:

* Bind mounts for live reload
* Isolated `node_modules` volumes per app
* Multiple apps can run in parallel

Refer to individual app READMEs for Docker-specific instructions.

---

## 🏗 Builds

Build individual projects:

```bash
nx build marketmate
nx build mm-admin-portal
nx build mm-shared
```

Build outputs are generated in the `dist/` directory.

---

## 🧠 Development Principles

* Keep applications independent
* Move reusable logic to shared libraries
* Avoid cross-app imports
* Follow Nx project boundaries
* Prefer shared styles and components over duplication

---

## 📌 Notes

* This workspace is structured for scalability
* Additional apps or libraries can be added easily
* Nx tooling enables dependency graphs, affected builds, and caching
