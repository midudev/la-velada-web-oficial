---
description: Rules for server-side sessions
globs:
  - "src/pages/**/*"
  - "src/actions/**/*"
  - "src/middleware.ts"
  - "astro.config.mjs"
---

# Sessions Rules

## When to Use Sessions

Use sessions for server-side state that persists across requests: user data, shopping carts, form state, preferences. Sessions are more secure and flexible than cookies for storing structured data.

## MUST DO

- Configure a storage driver in `astro.config.mjs` (or use an adapter that provides one)
- Use optional chaining: `Astro.session?.get()` — session may be undefined
- Call `session.regenerate()` after login to prevent session fixation
- Call `session.destroy()` on logout to clean up server data
- Type session data via `App.SessionData` in `src/env.d.ts`
- Use sessions only in on-demand rendered pages (`prerender = false`)

## MUST NOT DO

- Access `Astro.session` in prerendered/static pages — sessions require a server
- Store large blobs in sessions — keep data small, store references/IDs
- Use sessions in edge middleware — not supported
- Forget to handle undefined session (when driver isn't configured)
- Store sensitive secrets directly — sessions are server-side but still use reasonable data hygiene

## Pattern: Session with Auth

```astro
---
export const prerender = false;

const user = await Astro.session?.get('user');
if (!user) {
  return Astro.redirect('/login');
}
---

<h1>Welcome, {user.name}</h1>
```
