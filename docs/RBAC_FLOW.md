# Frontend RBAC Flow

## Current Access Model

The frontend currently supports two visible access states:

- Guest: can browse public learning pages and tools.
- Authenticated user: can access `/profile` and persistent progress features.

There is no role field currently consumed by the frontend, and there are no admin-only UI routes.

## Current Route Guard

`ProtectedRoute` checks:

```js
const { loading, isAuthenticated } = useAuth();
```

It redirects unauthenticated users to `/login`.

## Recommended Role-Aware Extension

If the backend adds roles, the frontend should consume:

```js
user: {
  id: String,
  name: String,
  email: String,
  role: "student" | "instructor" | "admin"
}
```

Add helper selectors:

```js
const hasRole = (...roles) => user && roles.includes(user.role);
const canManageContent = hasRole("instructor", "admin");
const canManageUsers = hasRole("admin");
```

## Route Pattern

```jsx
<ProtectedRoute roles={["admin"]}>
  <AdminDashboard />
</ProtectedRoute>
```

Important: frontend route guards improve UX but do not secure data. Backend authorization must enforce every restricted action.

## UI Rules

- Hide admin links from users who lack permission.
- Show a clear forbidden state for direct URL access.
- Never trust role values from URL params or localStorage.
- Do not render sensitive data and rely on CSS to hide it.
- Keep role labels human-readable but permission checks centralized.

## Future Permission Matrix

| Feature | Guest | Student | Instructor | Admin |
| --- | --- | --- | --- | --- |
| Browse public lessons | Yes | Yes | Yes | Yes |
| Use public tools | Yes | Yes | Yes | Yes |
| Save progress | No | Yes | Yes | Yes |
| View profile | No | Yes | Yes | Yes |
| Edit content drafts | No | No | Yes | Yes |
| Publish content | No | No | Limited | Yes |
| Manage users | No | No | No | Yes |

