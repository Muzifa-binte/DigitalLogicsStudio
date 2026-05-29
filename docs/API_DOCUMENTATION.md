# Frontend API Integration Documentation

This document describes how the frontend talks to the backend API. Backend endpoint details live in `backend/docs/API_DOCUMENTATION.md`.

## API Client

File: `src/services/apiClient.js`

```js
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});
```

Important behavior:

- `withCredentials: true` is required for the browser to send and receive the backend `token` cookie.
- The frontend never reads the JWT directly.
- Backend error messages are surfaced through the Axios error object.

## Auth Service

File: `src/services/authService.js`

| Method | Backend Endpoint | Purpose |
| --- | --- | --- |
| `register(payload)` | `POST /auth/register` | Create account and receive user state. |
| `login(payload)` | `POST /auth/login` | Log in and receive user state. |
| `logout()` | `POST /auth/logout` | Clear cookie session. |
| `getCurrentUser()` | `GET /auth/me` | Restore authenticated user. |
| `markProblemSolved(problemId)` | `POST /progress/problems/:id/complete` | Legacy solved-problem helper. |

## Progress Service

File: `src/services/progressService.js`

The service maintains a local cache and syncs writes to the backend.

| Method | Backend Endpoint | Purpose |
| --- | --- | --- |
| `loadFromDB(userKey)` | `GET /progress/snapshot` | Hydrate progress cache after login. |
| `recordAttempt(userKey, problem)` | `POST /progress/problems/:id/attempt` | Record an attempted problem. |
| `setProblemSolved(userKey, problem, solved)` | `POST /progress/problems/:id/complete` or `/uncomplete` | Toggle solved state. |
| `openTopic(userKey, topic)` | `POST /progress/topics/:topicId/open` | Mark topic opened. |
| `toggleSubtopicCompleted(userKey, topic, subtopicId)` | `POST /progress/topics/:topicId/subtopics/:subtopicId` | Toggle subtopic completion. |

## Request/Response Flow

Example login:

1. `LoginPage` calls `useAuth().login(email, password)`.
2. `AuthContext` calls `authService.login`.
3. `authService` posts to `/auth/login`.
4. Backend sets httpOnly cookie and returns sanitized user.
5. `AuthContext` stores user in React state.
6. UI re-renders authenticated navigation and protected pages.

Example progress update:

1. User attempts or solves a problem.
2. UI calls `progressService`.
3. Service updates in-memory cache immediately.
4. Service posts to backend unless prerendering/testing.
5. Backend persists the change.
6. UI reads a fresh snapshot from the service cache.

## Error Handling

API failures should produce user-facing messages where the action is critical, such as login or signup. Progress sync may fail silently when the local cache can keep the UI usable, but production monitoring should still capture repeated failures.

## Best Practices

- Never call `fetch` or `axios` directly from feature components when a service already exists.
- Keep endpoint paths relative to `REACT_APP_API_URL`.
- Keep request payloads minimal and explicit.
- Keep backend response shape changes backward compatible with services.
- Add service-level tests for non-trivial data transformations.

