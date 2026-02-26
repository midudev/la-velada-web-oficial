# Astro Framework Guidelines

> Compiled guidelines for AI coding agents. This document contains all rules from the `rules/` directory in a single file for agents that prefer consolidated documentation.

**Version:** 1.0.0
**Last Updated:** 2025-01-25

---

## Table of Contents

1. [Astro Components](#astro-components)
2. [Client Hydration](#client-hydration)
3. [Content Collections](#content-collections)
4. [Routing](#routing)
5. [SSR & Adapters](#ssr--adapters)
6. [Images](#images)
7. [TypeScript](#typescript)

---

## Astro Components

**Applies to:** `**/*.astro`

### Component Structure

Always use the frontmatter pattern with proper separation:

```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Destructure props with defaults
const { title, description = 'Default' } = Astro.props;

// 4. Data fetching and logic
const posts = await getCollection('blog');
---

<!-- 5. Template -->
<Layout title={title}>
  <h1>{title}</h1>
</Layout>

<!-- 6. Scoped styles -->
<style>
  h1 { color: navy; }
</style>
```

### Rules

**MUST DO:**
- Define `interface Props` for type safety
- Use destructuring with defaults for optional props
- Keep frontmatter logic minimal and focused
- Use slots for composable content
- Use `class:list` for conditional classes
- Import components and assets at the top

**MUST NOT DO:**
- Access browser APIs (window, document) in frontmatter - runs on server
- Use side effects in frontmatter - runs on every render
- Mix UI framework components without client directives
- Forget alt text on images
- Use inline styles when scoped styles work
- Skip TypeScript interfaces for Props

### Slots Pattern

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
const hasFooter = Astro.slots.has('footer');
---

<article>
  <header><h1>{title}</h1></header>
  <main><slot /></main>
  {hasFooter && <footer><slot name="footer" /></footer>}
</article>
```

### Dynamic Attributes

```astro
---
const id = "main";
const isActive = true;
---

<div
  id={id}
  class:list={['base', { active: isActive }]}
  data-active={isActive}
>
  Content
</div>
```

---

## Client Hydration

**Applies to:** `**/*.astro`, `**/components/**/*.tsx`, `**/components/**/*.jsx`, `**/components/**/*.vue`, `**/components/**/*.svelte`

### Islands Architecture Principle

Ship zero JavaScript by default. Only hydrate components that need interactivity.

### Decision Tree

```
Does the component need interactivity?
├── No → No directive (static HTML)
└── Yes → Is it above the fold?
    ├── Yes → Is it critical?
    │   ├── Yes → client:load
    │   └── No → client:idle
    └── No → Is it viewport dependent?
        ├── Yes → client:visible
        └── No → Is it device dependent?
            ├── Yes → client:media
            └── No → client:visible
```

### Rules

**MUST DO:**
- Default to no hydration - question every `client:` directive
- Use `client:visible` for below-the-fold interactive content
- Use `client:idle` for non-critical above-the-fold interactions
- Use `client:media` for device-specific components
- Always specify framework for `client:only="react"` (required)
- Test that pages work without JavaScript

**MUST NOT DO:**
- Use `client:load` on everything - defeats islands purpose
- Hydrate static content (navbars, footers without interactions)
- Use `client:only` without the framework string
- Forget that `client:only` skips SSR entirely
- Hydrate large components that only need minor interactivity

### Example

```astro
---
import Header from './Header.astro';        // Static - no JS
import SearchBox from './SearchBox.jsx';    // Needs hydration
import Comments from './Comments.jsx';       // Below fold
import MobileMenu from './MobileMenu.jsx';  // Mobile only
import Chart from './Chart.jsx';            // Browser APIs only
---

<!-- Static, no JavaScript -->
<Header />

<!-- Critical above-fold interactivity -->
<SearchBox client:load />

<!-- Hydrate when visible (below fold) -->
<Comments client:visible />

<!-- Hydrate only on mobile -->
<MobileMenu client:media="(max-width: 768px)" />

<!-- Client-only (uses browser APIs) -->
<Chart client:only="react" />
```

### Props Serialization

```astro
---
import Counter from './Counter.jsx';
const initialCount = 10;
---

<!-- Props are serialized to the client -->
<Counter client:load initialCount={initialCount} />
```

**Note:** Props must be serializable (no functions, no class instances).

---

## Content Collections

**Applies to:** `src/content/**/*`, `src/content/config.ts`

### Collection Configuration

Always define schemas in `src/content/config.ts`:

```typescript
import { defineCollection, z, reference } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    cover: image(),
    coverAlt: z.string(),
    author: reference('authors'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

### Rules

**MUST DO:**
- Use `z.coerce.date()` for date fields - handles string dates from frontmatter
- Use `image()` helper for optimized images
- Use `reference()` for cross-collection relationships
- Set sensible defaults with `.default()`
- Add `.optional()` for non-required fields
- Filter drafts in production: `getCollection('blog', ({ data }) => !data.draft)`
- Export all collections from the config

**MUST NOT DO:**
- Use plain `z.date()` - won't parse frontmatter strings
- Skip schema validation
- Store sensitive data in content collections
- Use arbitrary image paths - use the image() schema helper
- Forget to handle the case when `getEntry` returns undefined

### Querying Collections

```typescript
// Get all published posts, sorted by date
const posts = (await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? !data.draft : true;
})).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// Get single entry
const post = await getEntry('blog', 'my-post-slug');
if (!post) return Astro.redirect('/404');

// Resolve references
const author = await getEntry(post.data.author);
```

### Rendering Content

```astro
---
const { Content, headings } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <nav>
    {headings.map(h => (
      <a href={`#${h.slug}`}>{h.text}</a>
    ))}
  </nav>
  <Content />
</article>
```

### File Organization

```
src/content/
├── config.ts           # Required: collection schemas
├── blog/
│   ├── post-1.md
│   └── post-2.mdx
└── authors/
    └── john.json
```

---

## Routing

**Applies to:** `src/pages/**/*`

### File-Based Routing

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── blog/
│   ├── index.astro      → /blog
│   └── [slug].astro     → /blog/:slug
├── [...path].astro      → /* (catch-all)
└── api/
    └── posts.json.ts    → /api/posts.json
```

### Rules

**MUST DO:**
- Use `getStaticPaths()` for dynamic routes in static mode
- Return proper status codes from API endpoints
- Validate params in SSR routes
- Use content collections for dynamic content pages
- Handle 404 cases explicitly

**MUST NOT DO:**
- Access `Astro.request` in prerendered pages
- Forget `getStaticPaths()` in static output mode
- Return sensitive data in API responses without auth

### Dynamic Routes Pattern

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### Rest Parameters (Catch-All)

```astro
---
// src/pages/docs/[...path].astro
export function getStaticPaths() {
  return [
    { params: { path: undefined } },      // /docs
    { params: { path: 'intro' } },        // /docs/intro
    { params: { path: 'guides/start' } }, // /docs/guides/start
  ];
}

const { path } = Astro.params;
---
```

### API Endpoints

```typescript
// src/pages/api/posts.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  const data = await fetchPosts();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.title) {
    return new Response(JSON.stringify({ error: 'Title required' }), {
      status: 400,
    });
  }

  const post = await createPost(body);
  return new Response(JSON.stringify(post), { status: 201 });
};
```

### Pagination

```astro
---
// src/pages/blog/[...page].astro
export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  return paginate(posts.sort((a, b) =>
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  ), { pageSize: 10 });
}

const { page } = Astro.props;
---

<ul>
  {page.data.map(post => <li>{post.data.title}</li>)}
</ul>

{page.url.prev && <a href={page.url.prev}>Previous</a>}
{page.url.next && <a href={page.url.next}>Next</a>}
```

### Redirects

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/old': '/new',
    '/blog/[...slug]': '/posts/[...slug]',
  },
});
```

---

## SSR & Adapters

**Applies to:** `astro.config.mjs`, `src/pages/**/*`, `src/middleware.ts`

### Output Modes

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',  // Default - all prerendered
  output: 'server',  // All server-rendered
  output: 'hybrid',  // Static default, opt-in SSR
  adapter: vercel(), // Required for server/hybrid
});
```

### Rules

**MUST DO:**
- Use `hybrid` mode when only some pages need SSR
- Install appropriate adapter for deployment target
- Use `export const prerender = false` to opt into SSR (hybrid mode)
- Use `export const prerender = true` to opt out of SSR (server mode)
- Handle errors and return proper HTTP status codes
- Validate and sanitize all user input

**MUST NOT DO:**
- Forget to install an adapter for server/hybrid output
- Access request/cookies in prerendered pages
- Trust user input without validation
- Expose sensitive data in responses
- Use SSR when static would work

### Opting In/Out of Prerendering

```astro
---
// In hybrid mode (default: prerendered)
export const prerender = false; // Make this page SSR

// In server mode (default: SSR)
export const prerender = true; // Prerender this page
---
```

### Request Handling

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

### Middleware

```typescript
// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';

const auth = defineMiddleware(async ({ cookies, locals, redirect, url }, next) => {
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

### Type Locals

```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    user: { id: string; name: string } | null;
  }
}
```

### Adapters

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

---

## Images

**Applies to:** `**/*.astro`, `**/*.mdx`, `src/content/**/*`

### Image Component

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.jpg';
---

<Image
  src={heroImage}
  alt="Descriptive alt text"
  width={800}
  height={600}
  format="webp"
  quality={80}
/>
```

### Rules

**MUST DO:**
- Import local images - enables optimization
- Always provide meaningful alt text
- Use `<Image>` component for local images
- Use `<Picture>` for responsive hero images
- Specify width/height to prevent layout shift
- Configure allowed domains for remote images
- Use the image() schema helper in content collections

**MUST NOT DO:**
- Use string paths for local images: `src="/images/hero.jpg"`
- Skip alt text (accessibility requirement)
- Use `<img>` tags for local images (misses optimization)
- Forget width/height for remote images
- Allow arbitrary remote domains

### Local vs Remote Images

```astro
---
import { Image } from 'astro:assets';
import localImage from '../images/photo.jpg';
---

<!-- Local: import required, auto-optimized -->
<Image src={localImage} alt="Local photo" />

<!-- Remote: dimensions required -->
<Image
  src="https://example.com/photo.jpg"
  alt="Remote photo"
  width={400}
  height={300}
/>

<!-- Remote with inferred size (fetches image) -->
<Image
  src="https://example.com/photo.jpg"
  alt="Remote photo"
  inferSize
/>
```

### Picture for Responsive Images

```astro
---
import { Picture } from 'astro:assets';
import hero from '../images/hero.jpg';
---

<Picture
  src={hero}
  alt="Hero image"
  formats={['avif', 'webp', 'jpg']}
  widths={[400, 800, 1200]}
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
/>
```

### Content Collections with Images

```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(),           // Validates and optimizes
    coverAlt: z.string(),
  }),
});
```

```markdown
---
title: My Post
cover: ./images/cover.jpg
coverAlt: Post cover showing...
---
```

### Background Images

```astro
---
import { getImage } from 'astro:assets';
import bg from '../images/background.jpg';

const optimizedBg = await getImage({
  src: bg,
  format: 'webp',
  width: 1920,
});
---

<section style={`background-image: url(${optimizedBg.src})`}>
  Content
</section>
```

### Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['cdn.example.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
});
```

---

## TypeScript

**Applies to:** `tsconfig.json`, `src/env.d.ts`, `**/*.ts`, `**/*.astro`

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@content/*": ["src/content/*"]
    }
  }
}
```

### Rules

**MUST DO:**
- Use `astro/tsconfigs/strict` or `strictest` preset
- Define path aliases for cleaner imports
- Type Props interface in all components
- Type locals in `src/env.d.ts`
- Type environment variables

**MUST NOT DO:**
- Use `any` type - use `unknown` and narrow
- Skip typing Props interface
- Ignore TypeScript errors
- Use `astro/tsconfigs/base` in production projects

### Component Props

```astro
---
interface Props {
  title: string;
  description?: string;
  tags: string[];
  variant?: 'primary' | 'secondary';
}

const {
  title,
  description = 'Default description',
  tags,
  variant = 'primary',
} = Astro.props;
---
```

### Environment Variables

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly DATABASE_URL: string;
  readonly SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Locals Typing

```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    user: {
      id: string;
      email: string;
      name: string;
    } | null;
    theme: 'light' | 'dark';
    requestId: string;
  }
}
```

### Content Collection Types

```typescript
// src/content/config.ts
import { defineCollection, z, reference } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: reference('authors'),
  }),
});

// Types are auto-generated:
// import type { CollectionEntry } from 'astro:content';
// type BlogPost = CollectionEntry<'blog'>;
```

### API Route Types

```typescript
// src/pages/api/example.ts
import type { APIRoute, APIContext } from 'astro';

export const GET: APIRoute = async (context: APIContext) => {
  const { params, request, cookies, locals, url } = context;

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Path Aliases Usage

```astro
---
// With aliases
import Layout from '@layouts/Layout.astro';
import Card from '@components/Card.astro';
import { getCollection } from 'astro:content';

// Instead of
import Layout from '../../../layouts/Layout.astro';
---
```

---

## Quick Reference Card

| Category | Key Rule |
|----------|----------|
| **Components** | Always define `interface Props` |
| **Hydration** | Default to no directive; question every `client:` |
| **Collections** | Use `z.coerce.date()` for dates |
| **Routing** | Use `getStaticPaths()` for dynamic routes |
| **SSR** | Use `hybrid` mode when only some pages need SSR |
| **Images** | Import local images; use `<Image>` component |
| **TypeScript** | Extend `astro/tsconfigs/strict` |

---

*Generated from rules in the `rules/` directory. For individual rule files, see the `rules/` folder.*
