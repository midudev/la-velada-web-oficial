---
description: Rules for SSR and hybrid rendering
globs:
  - "astro.config.mjs"
  - "src/pages/**/*"
  - "src/middleware.ts"
---

# Astro SSR Rules

## Output Modes

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',  // Default - all prerendered
  output: 'server',  // All server-rendered
  output: 'hybrid',  // Static default, opt-in SSR
  adapter: vercel(), // Required for server/hybrid
});
```

## MUST DO

- Use `hybrid` mode when only some pages need SSR
- Install appropriate adapter for deployment target
- Use `export const prerender = false` to opt into SSR (hybrid mode)
- Use `export const prerender = true` to opt out of SSR (server mode)
- Handle errors and return proper HTTP status codes
- Validate and sanitize all user input

## MUST NOT DO

- Forget to install an adapter for server/hybrid output
- Access request/cookies in prerendered pages
- Trust user input without validation
- Expose sensitive data in responses
- Use SSR when static would work

## Opting In/Out of Prerendering

```astro
---
// In hybrid mode (default: prerendered)
export const prerender = false; // Make this page SSR

// In server mode (default: SSR)
export const prerender = true; // Prerender this page
---
```

## Request Handling

```astro
---
// SSR page
const url = Astro.url;
const pathname = url.pathname;
const searchParams = url.searchParams;

const method = Astro.request.method;
const headers = Astro.request.headers;
const userAgent = headers.get('user-agent');

// Cookies
const session = Astro.cookies.get('session')?.value;
Astro.cookies.set('visited', 'true', {
  path: '/',
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24,
});

// Redirects
if (!session) {
  return Astro.redirect('/login');
}
---
```

## Middleware

```typescript
// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';

const auth = defineMiddleware(async ({ cookies, locals, redirect }, next) => {
  const token = cookies.get('token')?.value;
  locals.user = token ? await verifyToken(token) : null;

  if (!locals.user && url.pathname.startsWith('/dashboard')) {
    return redirect('/login');
  }

  return next();
});

const logging = defineMiddleware(async ({ url }, next) => {
  console.log(`[${new Date().toISOString()}] ${url.pathname}`);
  return next();
});

export const onRequest = sequence(logging, auth);
```

## Type Locals

```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    user: { id: string; name: string } | null;
  }
}
```

## Adapters

```bash
# Node.js
npx astro add node

# Vercel
npx astro add vercel

# Netlify
npx astro add netlify

# Cloudflare
npx astro add cloudflare
```

## Response Headers

```astro
---
Astro.response.headers.set('Cache-Control', 'max-age=3600');
Astro.response.headers.set('X-Custom-Header', 'value');
---
```
