# SSR & Adapters

Astro supports on-demand server rendering with various deployment adapters.

## Output Modes

### Static (Default)

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static', // Default - all pages prerendered
});
```

All pages built at build time. No server required.

### Server (Full SSR)

```javascript
// astro.config.mjs
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // All pages rendered on-demand
  adapter: node({
    mode: 'standalone',
  }),
});
```

All pages rendered per-request. Requires an adapter.

### Hybrid

```javascript
// astro.config.mjs
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'hybrid', // Static by default, opt-in to SSR
  adapter: vercel(),
});
```

Static by default, with option to make specific pages dynamic.

## Opting In/Out of Prerendering

### In Hybrid Mode (opt-out of prerendering)

```astro
---
// src/pages/api/time.ts
export const prerender = false; // Server-rendered

export const GET = () => {
  return new Response(new Date().toISOString());
};
---
```

### In Server Mode (opt-in to prerendering)

```astro
---
// src/pages/about.astro
export const prerender = true; // Static at build time
---

<h1>About Us</h1>
```

## Available Adapters

### Node.js

```bash
npx astro add node
```

```javascript
// astro.config.mjs
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone', // or 'middleware'
  }),
});
```

### Vercel

```bash
npx astro add vercel
```

```javascript
// astro.config.mjs
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
});
```

### Netlify

```bash
npx astro add netlify
```

```javascript
// astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true, // Use Edge Functions
  }),
});
```

### Cloudflare

```bash
npx astro add cloudflare
```

```javascript
// astro.config.mjs
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory', // or 'advanced'
    routes: {
      strategy: 'include',
      include: ['/api/*'],
    },
  }),
});
```

### Deno

```bash
npx astro add deno
```

```javascript
// astro.config.mjs
import deno from '@astrojs/deno';

export default defineConfig({
  output: 'server',
  adapter: deno(),
});
```

## SSR Features

### Request Object

```astro
---
// Available in SSR pages
const url = Astro.url;
const method = Astro.request.method;
const headers = Astro.request.headers;
const userAgent = headers.get('user-agent');

// Get request body (POST, PUT, etc.)
if (method === 'POST') {
  const formData = await Astro.request.formData();
  const json = await Astro.request.json();
}
---
```

### Cookies

```astro
---
// Reading cookies
const sessionId = Astro.cookies.get('session')?.value;
const prefs = Astro.cookies.get('prefs')?.json();

// Setting cookies
Astro.cookies.set('session', 'abc123', {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 1 week
});

// Deleting cookies
Astro.cookies.delete('session');
---
```

### Response Headers

```astro
---
Astro.response.headers.set('Cache-Control', 'max-age=3600');
Astro.response.headers.set('X-Custom-Header', 'value');
---
```

### Redirects

```astro
---
if (!user) {
  return Astro.redirect('/login', 302);
}
---
```

## Server Islands (Experimental)

Defer rendering of specific components to the server:

```javascript
// astro.config.mjs
export default defineConfig({
  experimental: {
    serverIslands: true,
  },
});
```

```astro
---
import UserProfile from '../components/UserProfile.astro';
---

<!-- Static content -->
<h1>Welcome</h1>

<!-- Server-rendered on each request -->
<UserProfile server:defer>
  <p slot="fallback">Loading profile...</p>
</UserProfile>
```

## API Endpoints

### GET, POST, PUT, DELETE

```typescript
// src/pages/api/users/[id].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const user = await db.users.findById(id);

  if (!user) {
    return new Response(null, { status: 404 });
  }

  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const data = await request.json();

  await db.users.update(id, data);

  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  await db.users.delete(id);
  return new Response(null, { status: 204 });
};
```

### Streaming Responses

```typescript
// src/pages/api/stream.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`data: ${i}\n\n`));
        await new Promise(r => setTimeout(r, 1000));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
};
```

## Context and Locals

Access shared data across middleware and pages:

```typescript
// src/middleware.ts
export const onRequest = async ({ locals, request }, next) => {
  const token = request.headers.get('authorization');
  locals.user = await validateToken(token);
  return next();
};
```

```astro
---
// src/pages/dashboard.astro
const { user } = Astro.locals;

if (!user) {
  return Astro.redirect('/login');
}
---

<h1>Welcome, {user.name}</h1>
```

## Best Practices

1. **Use hybrid mode** - Static by default, SSR only where needed
2. **Prerender where possible** - Better performance and caching
3. **Use appropriate adapter** - Match your deployment platform
4. **Handle errors gracefully** - Return proper status codes
5. **Set cache headers** - Control CDN and browser caching
6. **Validate user input** - Never trust request data
7. **Use locals for shared state** - Cleaner than passing through props
