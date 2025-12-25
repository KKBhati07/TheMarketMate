# MarketMate

The **MarketMate** is the customer-facing application of the MarketMate platform. It allows users to browse listings, view product details, manage profiles, and interact with the marketplace in a smooth, responsive UI.

This application is built with **Angular** and is part of an **Nx workspace**, sharing common UI components, styles, and services from the `mm-shared` library.

---

## 🎯 Purpose

* Provide a clean and responsive UI for end users
* Allow users to browse and interact with marketplace listings
* Handle user authentication flows (login / signup)
* Share UI, styles, and logic with the admin app via shared libraries

---

## 🧱 Tech Stack

* **Angular** (standalone + modules)
* **Nx Workspace**
* **Angular Material** (theming handled in shared library)
* **Angular Animations** (for smooth animations)
* **SCSS** for styling
* **RxJS** for state and async flows

---

## 📁 Project Location

```
apps/marketmate/
```

---

## 🚀 Running the app (local development)

### Using Nx (recommended)

```bash
nx serve marketmate
```

The app will be available at:

```
http://localhost:4200
```

---

### Using Docker (dev setup)

If running via Docker Compose:

```bash
docker compose up marketmate
```

> The Docker dev setup uses bind mounts for live reload and a dedicated `node_modules` volume.

---

## 🎨 Styling & Theming

* Global styles and Angular Material configuration are **not defined inside this app**
* They are provided by the shared library:

```
libs/mm-shared/src/styles
```

The app only contains **app-specific overrides** in:

```
apps/marketmate/src/styles.scss
```

> ⚠️ Do NOT call `mat.core()` or redefine global Material themes inside this app.

---

## 🔗 Shared Dependencies

This app depends heavily on:

* `mm-shared` library for:

    * UI components
    * Forms
    * Services
    * Animations
    * Global styles

Any reusable logic **must be added to the shared library**, not duplicated here.
---

## 🏗 Build

Create a production build:

```bash
nx build marketmate
```

Build output:

```
dist/marketmate
```

---

## 📌 Development Guidelines

* Keep app-specific logic only in this app
* Reusable components or services should move to `mm-shared`
* Avoid hardcoding environment-specific values
* Follow shared styling and Material conventions

---

## 📄 Notes

* This is a **public-facing app** (no admin functionality)
* Authentication and authorization logic is shared
* Designed to evolve independently while staying consistent with the admin app