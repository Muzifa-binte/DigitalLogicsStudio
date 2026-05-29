# Frontend Folder Structure

```text
frontend/
|-- docs/
|-- public/
|-- scripts/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- context/
|   |-- data/
|   |-- hooks/
|   |-- pages/
|   |-- seo/
|   |-- services/
|   |-- utils/
|   |-- App.css
|   |-- App.js
|   |-- index.css
|   `-- index.js
|-- .env.example
|-- package.json
|-- package-lock.json
|-- react-snap-routes.json
`-- vercel.json
```

## Root Files

### `package.json`

Defines dependencies and scripts:

- `npm start`
- `npm run build`
- `npm test`
- `npm run eject`

The build lifecycle includes SEO asset generation and prerendering.

### `.env.example`

Documents required frontend environment variables.

### `react-snap-routes.json`

Generated route list used by the prerender workflow.

### `vercel.json`

Deployment configuration for static hosting.

## `public`

Static files served directly or copied into the build:

- `index.html`
- favicon and app icons
- Open Graph image
- `robots.txt`
- `sitemap.xml`
- screenshots
- manifest

## `scripts`

Build automation:

- `generateSeoAssets.js`: creates SEO assets from route metadata.
- `runReactSnap.js`: performs prerendering after build.
- `updateArithmeticPages.js`: project-specific content maintenance script.

## `src/components`

Shared UI and behavior:

- Auth guard: `auth/ProtectedRoute.jsx`
- SEO components: `seo/*`
- Learning/tool primitives: truth tables, K-map display, controls, calculators, result cards.
- Topic shells and reusable content blocks.

## `src/context`

Application-level state:

- `AuthContext.jsx`
- `ThemeContext.jsx`

## `src/pages`

Route-level feature areas:

- `Home`
- `Auth`
- `Problems`
- `BooleanAlgebra`
- `NumberSystems`
- `ArithmeticFunctionsAndHDLs`
- `EncoderAndDecoder`
- `MultiplexersAndDemultiplexers`
- `SequentialCircuits`
- `RegistersAndTransfers`
- `Memory`
- standalone tool pages such as `Boolforge.jsx`, `KmapGenerator.jsx`, `TrainerBoard.jsx`

Section folders may contain their own `components`, `data`, `utils`, and CSS files.

## `src/services`

Backend integration:

- `apiClient.js`: Axios instance.
- `authService.js`: auth endpoints.
- `progressService.js`: progress cache and sync layer.

## `src/seo`

SEO metadata and utility helpers:

- `seoCatalog.mjs`
- `seoUtils.js`

## `src/utils`

Domain utilities such as Boolean algebra helpers, expression parsing, search, analytics, and prerender detection.

