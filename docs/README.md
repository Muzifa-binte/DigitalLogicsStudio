# Boolforge Frontend Documentation

Boolforge is the React frontend for Digital Logics Studio. It provides interactive digital-logic learning pages, calculators, problem practice, authentication screens, profile progress, SEO metadata, and prerendered static output for production.

## Documentation Map

| Document | Purpose |
| --- | --- |
| `SETUP_GUIDE.md` | Local install, environment variables, scripts, backend dependency, and troubleshooting. |
| `DEPLOYMENT_GUIDE.md` | Production build, Vercel/static hosting notes, SEO assets, and release checklist. |
| `ARCHITECTURE.md` | React app architecture, route loading, context providers, services, SEO, and progress state. |
| `API_DOCUMENTATION.md` | Frontend API client contract and how browser requests map to backend endpoints. |
| `DATABASE_SCHEMA.md` | Client-side data contracts for progress snapshots, topic catalogs, and problem metadata. |
| `AUTH_FLOW.md` | Frontend login, signup, session restore, protected route, and logout flow. |
| `RBAC_FLOW.md` | Current user-access model and recommended role-aware UI extension plan. |
| `FOLDER_STRUCTURE.md` | Directory-by-directory explanation of the frontend source tree. |
| `CONTRIBUTING.md` | Contributor workflow, frontend standards, tests, and PR checklist. |
| `SECURITY.md` | Frontend security practices for auth, dependencies, content, and deployment. |
| `CODE_OF_CONDUCT.md` | Community behavior expectations. |
| `CHANGELOG.md` | Human-readable frontend release history. |
| `seo-architecture.md` | Existing SEO and prerender architecture notes. |
| `platform-redesign-architecture.md` | Existing product redesign architecture notes. |

## Application Summary

- Framework: React 18 with Create React App.
- Routing: React Router DOM v6.
- API client: Axios with `withCredentials: true`.
- Auth state: `AuthContext`.
- Theme state: `ThemeContext`.
- SEO: `react-helmet-async`, route metadata catalog, generated sitemap and robots files.
- Prerendering: `react-snap` through custom build scripts.
- Deployment: static build output suitable for Vercel or other static hosts.

## Main Product Areas

- Home and learning navigation.
- Boolean algebra, number systems, arithmetic, combinational circuits, sequential circuits, registers, and memory pages.
- Boolforge and standalone interactive tools.
- Problems practice workspace.
- Login, signup, protected profile dashboard.
- SEO and analytics instrumentation.

