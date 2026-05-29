# Frontend Authentication Flow

The frontend uses React context to track authenticated user state. The JWT itself remains in an httpOnly cookie managed by the backend and browser.

## Providers

`src/index.js` wraps the app with:

```text
HelmetProvider
ThemeProvider
AuthProvider
App
```

`AuthProvider` is responsible for session restoration and user actions.

## Session Restore

1. App boots.
2. `AuthProvider` sets `loading: true`.
3. If prerendering, auth is skipped and user is set to `null`.
4. Otherwise, `authService.getCurrentUser()` calls `GET /auth/me`.
5. If the backend cookie is valid, user state is stored.
6. If the request fails, the app treats the visitor as signed out.
7. `loading` becomes `false`.

## Login

1. `LoginPage` collects email and password.
2. Page calls `login(email, password)` from `useAuth`.
3. `AuthContext` calls `authService.login`.
4. Backend sets the httpOnly cookie.
5. Frontend stores sanitized user state.
6. UI updates authenticated navigation and protected route access.

## Signup

Signup follows the same state path as login, but calls `authService.register` with `name`, `email`, and `password`.

## Protected Routes

`src/components/auth/ProtectedRoute.jsx` handles protected access.

- While auth is loading, it shows a session restoration state.
- If unauthenticated, it redirects to `/login` and preserves the attempted location.
- If authenticated, it renders children.

Currently protected route:

- `/profile`

## Logout

1. UI calls `logout()` from `useAuth`.
2. Frontend calls `POST /auth/logout`.
3. Backend clears the cookie.
4. Frontend clears `user` and `solvedProblems` state even if the API call fails.

## Security Notes

- The frontend does not store tokens.
- The frontend must use `withCredentials: true`.
- Production auth requires matching backend CORS allowlist and HTTPS cookies.
- Avoid putting user secrets in query strings, logs, analytics events, or error messages.

