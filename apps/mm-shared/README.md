# MM-Shared

A shared Angular library used across multiple applications in the workspace. This library centralizes **reusable UI components, services, utilities, animations, models, and global styles** to ensure consistency and reduce duplication between apps.

---

## ✨ What lives in this library

### 🔹 UI & Modules

* Reusable UI components (buttons, loaders, dialogs, cards, icons, etc.)
* Feature-level shared modules (forms, shared UI modules)

### 🔹 Styles

* Global SCSS styles and variables
* Angular Material core setup and overrides
* Common design tokens (colors, spacing, fonts)

### 🔹 Services & Utilities

* API and storage services
* Authentication and theme helpers
* Common utilities, constants, pipes, and types

### 🔹 Animations

* Reusable Angular animations for UI interactions

---

## 📁 Project structure (simplified)

```
libs/mm-shared
├── src
│   ├── lib            # Components, services, modules, utils
│   ├── styles         # Global and shared SCSS
│   │   ├── styles.scss        # Global entry (Material core + overrides)
│   │   └── lib/               # SCSS partials (variables, mixins, helpers)
│   └── public-api.ts  # Library public API
├── ng-package.json
├── project.json
└── README.md
```

---

## 🚀 Usage in applications

### Importing Angular modules

Import the shared Angular module in any app or feature module:

```ts
import { MmSharedModule } from '@mm-shared';
```

---

### Using global styles

Global styles from this library are consumed **via app build configuration**, not via SCSS imports.

Each application includes the shared styles in its `project.json`:

```json
"styles": [
  "libs/mm-shared/src/styles/styles.scss",
  "apps/<app-name>/src/styles.scss"
]
```

SCSS resolution is enabled using:

```json
"stylePreprocessorOptions": {
  "includePaths": [
    "libs/mm-shared/src/styles"
  ]
}
```

> ⚠️ `@include mat.core()` must exist **only once** and is intentionally placed in the shared global styles.

---

## 🛠 Code scaffolding

Generate new artifacts inside this library using Nx / Angular CLI:

```bash
nx g @schematics/angular:component component-name --project=mm-shared
```

You can also generate services, pipes, directives, guards, etc.

---

## 📦 Build

Build the library:

```bash
nx build mm-shared
```

Build artifacts will be available under:

```
dist/mm-shared
```

---

## 🎯 Design principles

* Single source of truth for shared UI and logic
* Framework-consistent (Angular + Angular Material)
* App-agnostic and reusable
* No direct app-specific dependencies

---

## 📚 Notes

* This library is consumed by multiple applications in the workspace
* Global styles should **never** be imported directly in app SCSS files
* Prefer adding new reusable logic here instead of duplicating in apps
