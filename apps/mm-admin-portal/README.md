# MarketMate – Admin Portal

The **MarketMate Admin Portal** is the internal application used to manage and operate the MarketMate platform. It provides administrative capabilities such as managing listings, users, moderation workflows, and platform configuration.

This app is built with **Angular** and lives inside an **Nx workspace**, sharing UI components, styles, and business logic from the `mm-shared` library.

---

## 🎯 Purpose

* Manage marketplace listings and categories
* Moderate user-generated content
* Handle administrative workflows
* Provide internal dashboards and tools
* Share UI and logic with the public app while remaining admin-focused

---

## 🧱 Tech Stack

* **Angular**
* **Nx Workspace**
* **Angular Material** (global theming via shared library)
* **Angular Animations** (for smooth animations)
* **SCSS** for styling
* **RxJS** for state and async operations

---

## 📁 Project Location

```
apps/mm-admin-portal/
```

---

## 🚀 Running the app (local development)

### Using Nx (recommended)

```bash
nx serve mm-admin-portal
```

The admin portal will be available at:

```
http://localhost:4201
```

---

### Using Docker (dev setup)

When running with Docker Compose:

```bash
docker compose up admin-frontend
```

> The Docker dev setup uses live bind mounts for source code and a dedicated `node_modules` volume to enable hot reload.

---

## 🔐 Access & Security

* This is a **restricted application** intended for internal/admin users
* Authentication and authorization logic is shared via `mm-shared`
* Role-based access is enforced at route and service levels

---

## 🎨 Styling & Theming

* Global styles and Angular Material configuration are **defined in the shared library**
* This app must **not** redefine Material core or global themes

App-specific styling lives in:

```
apps/mm-admin-portal/src/styles.scss
```

---

## 🔗 Shared Dependencies

This application depends on the shared library:

* `mm-shared`

    * UI components
    * Forms and validators
    * Services and guards
    * Animations and utilities
    * Global styles and Material setup

Reusable logic should always be added to `mm-shared` instead of duplicating it here.

---

## 🏗 Build

Create a production build:

```bash
nx build mm-admin-portal
```

Build output:

```
dist/mm-admin-portal
```

---

## 📌 Development Guidelines

* Keep admin-only logic inside this app
* Do not expose admin features to shared modules
* Use shared services/components where applicable
* Follow global styling and Material conventions
* Avoid duplicating logic already present in `mm-shared`

---

## 📄 Notes

* This app is **not public-facing**
* Designed to evolve independently from the public app
* Shares a consistent look and feel via the shared design system
