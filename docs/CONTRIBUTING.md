# Contributing to the Frontend

Thank you for contributing to Boolforge, the React frontend for Digital Logics Studio. This app is both a learning platform and a set of interactive digital-logic tools, so contributions should protect usability, accessibility, correctness, and SEO.

## Local Workflow

1. Open or select an issue for non-trivial changes.
2. Branch from the latest default branch.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Start the app with `npm start`.
6. Run relevant tests with `npm test`.
7. Build before release-oriented work with `npm run build`.

## Contribution Types

Good first contributions:

- Fixing copy, formulas, or broken links.
- Adding tests around existing utilities.
- Improving accessibility labels and keyboard behavior.
- Updating docs when implementation changes.

Larger contributions:

- New topic pages.
- New interactive calculators or simulators.
- SEO route catalog changes.
- Authentication or progress UX changes.
- Design system changes shared across many sections.

Open an issue first for larger changes so maintainers can confirm scope.

## Code Standards

- Use functional React components.
- Prefer route-level lazy loading for new large pages.
- Keep shared components in `src/components`.
- Keep section-specific components inside the relevant page section folder.
- Keep API calls inside `src/services`.
- Keep cross-cutting state inside React contexts or purpose-built hooks.
- Do not store auth tokens in localStorage or sessionStorage.
- Do not add dependencies when existing React, CSS, and utility patterns are enough.

## Styling Standards

- Respect the existing CSS architecture and section-specific style files.
- Keep layouts responsive across mobile, tablet, and desktop.
- Avoid visual changes that make educational content harder to scan.
- Prefer semantic markup and accessible controls.
- Test dark/light theme behavior when touching shared UI.

## Routing and SEO

When adding a page:

1. Create the page component under the appropriate `src/pages` section.
2. Register the route in `src/App.js`.
3. Add the page to the relevant navigation data source.
4. Add SEO metadata in `src/seo/seoCatalog.mjs` when the route should be indexed.
5. Confirm `npm run build` regenerates SEO assets and prerender routes.

## Progress Integration

Progress features should use `src/services/progressService.js` instead of direct component-level API calls. The service maintains an in-memory cache and syncs authenticated user actions to the backend.

Rules:

- Keep guest state separate from authenticated user state.
- Do not reintroduce localStorage as the source of truth for progress.
- Preserve snapshot shape used by profile, problems, and topic progress widgets.
- Swallow offline progress sync failures only when the UI already has a safe local cache.

## Testing Expectations

Use the existing Create React App test setup.

Run:

```bash
npm test
```

For build-impacting or SEO-impacting changes, also run:

```bash
npm run build
```

PRs should include at least one of:

- Unit tests for utilities, services, validators, or complex components.
- Manual verification notes with browser, route, and expected behavior.
- Screenshot or visual explanation for UI changes.

## Pull Request Checklist

- The change is focused and named clearly.
- Tests or manual verification are included.
- `.env.example` is updated if configuration changes.
- Docs are updated when architecture, setup, auth, deployment, or API integration changes.
- New routes are added to SEO metadata when appropriate.
- No secrets, build artifacts, or machine-specific paths are committed.

