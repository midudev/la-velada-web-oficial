# Middleware

Middleware intercepts requests and responses, allowing you to add logic before pages render.

## Setup

Create `src/middleware.ts` (or `.js`):

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Run before the page renders
  console.log('Request to:', context.url.pathname);

  // Call next() to continue to the page/endpoint
  const response = await next();

  // Run after the page renders
  console.log('Response status:', response.status);

  return response;
});
```

## Context Object

```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  // Request info
  const url = context.url;           // URL object
  const pathname = url.pathname;      // /about
  const params = context.params;      // { slug: 'hello' } for dynamic routes
  const request = context.request;    // Request object

  // Cookies
  const token = context.cookies.get('session')?.value;
  context.cookies.set('visited', 'true', { path: '/' });

  // Locals - share data with pages
  context.locals.user = await getUser(token);

  // Site info
  const site = context.site;          // From astro.config
  const generator = context.generator; // "Astro vX.X.X"

  // Redirect
  if (!context.locals.user && pathname.startsWith('/dashboard')) {
    return context.redirect('/login');
  }

  // Rewrite
  if (pathname === '/old-page') {
    return context.rewrite('/new-page');
  }

  return next();
});
```

## Authentication Example

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { verifyToken } from './lib/auth';

const protectedRoutes = ['/dashboard', '/settings', '/api/user'];

export const onRequest = defineMiddleware(async ({ cookies, url, locals, redirect }, next) => {
  const isProtected = protectedRoutes.some(route =>
    url.pathname.startsWith(route)
  );

  if (isProtected) {
    const token = cookies.get('auth_token')?.value;

    if (!token) {
      return redirect('/login?redirect=' + encodeURIComponent(url.pathname));
    }

    try {
      const user = await verifyToken(token);
      locals.user = user;
    } catch {
      cookies.delete('auth_token');
      return redirect('/login');
    }
  }

  return next();
});
```

## Using Locals

### Set in Middleware

```typescript
// src/middleware.ts
export const onRequest = defineMiddleware(async ({ locals, cookies }, next) => {
  const token = cookies.get('session')?.value;

  locals.user = token ? await getUserFromToken(token) : null;
  locals.theme = cookies.get('theme')?.value || 'light';
  locals.requestTime = Date.now();

  return next();
});
```

### Access in Pages

```astro
---
// src/pages/dashboard.astro
const { user, theme } = Astro.locals;

if (!user) {
  return Astro.redirect('/login');
}
---

<h1>Welcome, {user.name}</h1>
<p>Theme: {theme}</p>
```

### Access in Endpoints

```typescript
// src/pages/api/profile.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const { user } = locals;

  if (!user) {
    return new Response(null, { status: 401 });
  }

  return new Response(JSON.stringify(user));
};
```

## TypeScript Types

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: string;
      email: string;
      name: string;
    } | null;
    theme: 'light' | 'dark';
    requestTime: number;
  }
}
```

## Chaining Middleware

Use `sequence()` to run multiple middleware functions:

```typescript
// src/middleware.ts
import { sequence } from 'astro:middleware';

const logging = defineMiddleware(async (context, next) => {
  console.log(`[${new Date().toISOString()}] ${context.url.pathname}`);
  return next();
});

const auth = defineMiddleware(async ({ cookies, locals }, next) => {
  const token = cookies.get('session')?.value;
  locals.user = token ? await verifyToken(token) : null;
  return next();
});

const rateLimit = defineMiddleware(async ({ request, redirect }, next) => {
  const ip = request.headers.get('x-forwarded-for');

  if (await isRateLimited(ip)) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return next();
});

// Executes in order: logging → rateLimit → auth
export const onRequest = sequence(logging, rateLimit, auth);
```

## Modifying Responses

### Add Headers

```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
});
```

### Modify Response Body

```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Only modify HTML responses
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const modified = html.replace('</body>', '<script>/* injected */</script></body>');

  return new Response(modified, {
    status: response.status,
    headers: response.headers,
  });
});
```

## Redirects and Rewrites

### Redirect

```typescript
export const onRequest = defineMiddleware(async ({ url, redirect }, next) => {
  // Redirect old URLs
  if (url.pathname === '/old-blog') {
    return redirect('/blog', 301); // Permanent redirect
  }

  // Temporary redirect
  if (url.pathname === '/maintenance') {
    return redirect('/coming-soon', 302);
  }

  return next();
});
```

### Rewrite

Serve different content for a URL without changing the URL:

```typescript
export const onRequest = defineMiddleware(async ({ url, rewrite }, next) => {
  // A/B testing
  if (url.pathname === '/landing') {
    const variant = Math.random() > 0.5 ? 'a' : 'b';
    return rewrite(`/landing-${variant}`);
  }

  // Serve localized content
  const locale = getLocaleFromHeaders();
  if (url.pathname === '/about' && locale === 'es') {
    return rewrite('/es/about');
  }

  return next();
});
```

## Error Handling

```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  try {
    return await next();
  } catch (error) {
    console.error('Middleware error:', error);

    // Return error page
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
});
```

## Common Patterns

### CORS

```typescript
export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const response = await next();

  // Add CORS headers to response
  response.headers.set('Access-Control-Allow-Origin', '*');

  return response;
});
```

### Request Timing

```typescript
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const start = performance.now();

  const response = await next();

  const duration = performance.now() - start;
  response.headers.set('X-Response-Time', `${duration.toFixed(2)}ms`);

  console.log(`${url.pathname}: ${duration.toFixed(2)}ms`);

  return response;
});
```

## Best Practices

1. **Keep middleware fast** - Runs on every request
2. **Use locals for shared data** - Cleaner than headers
3. **Chain with sequence()** - Organize separate concerns
4. **Type your locals** - Update `env.d.ts`
5. **Handle errors gracefully** - Don't expose stack traces
6. **Use early returns** - For redirects and error responses
7. **Avoid heavy operations** - Cache where possible
