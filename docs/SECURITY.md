# Frontend Security Policy

## Security Scope

Frontend security concerns include:

- Token exposure through browser storage.
- Unsafe rendering of user-generated content.
- Cross-origin API misconfiguration.
- Accidental leakage of environment values.
- Dependency vulnerabilities.
- Analytics or logs containing personal information.
- Broken route guards that expose private UI state.

## Authentication Safety

The frontend never stores JWTs directly. Auth uses:

- httpOnly cookie set by the backend.
- Axios `withCredentials: true`.
- React state for sanitized user data only.

Do not add token storage in:

- `localStorage`
- `sessionStorage`
- URL query strings
- Redux/devtools-visible state
- analytics events

## Environment Variables

Only `REACT_APP_*` variables are exposed to the browser. Treat them as public configuration, not secrets.

Safe:

- API URL
- canonical site URL
- public analytics measurement ID
- search console verification token

Unsafe:

- JWT secrets
- database credentials
- private API keys
- admin tokens

## Content Safety

- Avoid `dangerouslySetInnerHTML`.
- If rich HTML is required, sanitize it with a trusted library.
- Escape or validate formulas and code snippets before rendering as HTML.
- Keep MathJax rendering scoped and avoid injecting untrusted script content.

## Dependency Security

Run:

```bash
npm audit
```

Review dependency changes carefully. Avoid adding packages for small utilities.

## Reporting a Vulnerability

Do not open public issues for sensitive reports. Contact maintainers privately through the repository security advisory workflow or organization contact channel.

Include:

- Affected route or file.
- Reproduction steps.
- Browser and environment details.
- Impact and suggested fix, if known.

## Release Hardening Checklist

- Production `REACT_APP_API_URL` points to HTTPS backend.
- Backend allows the production frontend origin.
- Login, refresh, and logout are tested.
- No secrets are present in build artifacts.
- Source maps are acceptable for the release policy.
- Analytics events do not contain passwords, emails unless intentionally allowed, tokens, or raw request payloads.

