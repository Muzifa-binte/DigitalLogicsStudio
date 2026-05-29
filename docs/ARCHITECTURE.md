# Frontend Architecture

## Purpose

Boolforge is a React single-page application for learning and practicing digital logic. It combines educational content, interactive tools, user authentication, progress tracking, SEO metadata, analytics, and prerendered static output.

## Runtime Composition

```text
src/index.js
  HelmetProvider
  ThemeProvider
  AuthProvider
  App

src/App.js
  BrowserRouter
  RouteNormalizer
  RouteSeoManager
  AnalyticsTracker
  lazy route components
  ProtectedRoute for profile
```

## Major Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| App shell | `src/App.js`, `src/index.js` | Providers, router, lazy loading, route-level behaviors. |
| Shared components | `src/components` | Reusable UI, SEO helpers, auth guard, calculators, display widgets. |
| Pages | `src/pages` | Learning sections, tools, profile, auth screens, problems. |
| Context | `src/context` | Theme and authenticated user state. |
| Services | `src/services` | Axios API client, auth API wrapper, progress API/cache wrapper. |
| Hooks | `src/hooks` | Reusable React state and behavior. |
| Data | `src/data`, section data files | Static topic, gate, route, and problem metadata. |
| SEO | `src/seo`, `src/components/seo`, `scripts` | Metadata catalog, JSON-LD, sitemap, robots, prerender routes. |
| Utilities | `src/utils` | Boolean math, expression parsing, search, validation, prerender detection. |

## Routing

Routes are declared in `src/App.js` and most route components are lazy-loaded. Product areas include:

- `/`
- `/login`
- `/signup`
- `/profile`
- `/problems`
- `/boolforge`
- `/boolean/*`
- `/number-systems/*`
- `/arithmetic/*`
- `/encoder`, `/decoder`, `/mux`, `/demux`
- `/sequential/*`
- `/registers/*`
- `/memory/*`
- standalone tools such as `/kmapgenerator` and `/trainer-board`

Legacy number-system paths redirect to canonical routes.

## State Management

### Auth State

`AuthContext` owns:

- `user`
- `loading`
- `isAuthenticated`
- `solvedProblems`
- `login`
- `register`
- `logout`
- `markProblemSolved`
- `hasSolvedProblem`

The context restores sessions by calling `authService.getCurrentUser()` unless the app is prerendering.

### Theme State

`ThemeContext` applies the root theme class consumed by CSS.

### Progress State

`progressService` keeps an in-memory cache by user key. Authenticated actions are synced to the backend, while the UI receives synchronous snapshots for dashboards and progress widgets.

## API Integration

`apiClient.js` creates one Axios instance:

- `baseURL` from `REACT_APP_API_URL`.
- `withCredentials: true` for httpOnly cookie auth.
- JSON content type.
- Error interceptor that promotes backend `message` into thrown errors.

## SEO and Prerendering

SEO is centralized in `src/seo/seoCatalog.mjs` and route helpers. The app uses `react-helmet-async` and a custom prerender script to produce crawlable HTML snapshots for selected canonical routes.

`src/index.js` uses `hydrateRoot` when prerendered HTML exists and `createRoot` otherwise.

## Engineering Decisions

- **CRA instead of custom bundler:** preserves project stability and existing scripts.
- **Lazy route imports:** keeps initial bundle smaller across many educational pages.
- **httpOnly cookie auth:** avoids storing tokens in browser JavaScript state.
- **Service layer for API calls:** prevents API paths and request details from spreading across components.
- **SEO catalog:** keeps canonical metadata auditable and build-tool friendly.
- **In-memory progress cache:** gives fast UI reads while remote persistence catches up.

## Current Risks

- Progress cache is memory-only, so guest progress resets on reload.
- Auth depends on backend cookie/CORS configuration being exact.
- Some content pages are large and may need further code splitting.
- Add stronger E2E coverage before high-stakes production launches.

