# Routing

Astro uses file-based routing in the `src/pages/` directory.

## Basic Routes

```
src/pages/
├── index.astro        → /
├── about.astro        → /about
├── contact.astro      → /contact
└── blog/
    ├── index.astro    → /blog
    └── post-1.astro   → /blog/post-1
```

## Page Files

### Supported Formats

- `.astro` - Astro components
- `.md` - Markdown
- `.mdx` - MDX (with integration)
- `.html` - Static HTML
- `.js/.ts` - Endpoints (API routes)

### Basic Page

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';

const title = "About Us";
---

<Layout title={title}>
  <h1>{title}</h1>
  <p>Welcome to our about page.</p>
</Layout>
```

## Dynamic Routes

### Single Parameter

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<h1>{post.data.title}</h1>
<Content />
```

### Multiple Parameters

```astro
---
// src/pages/[category]/[slug].astro
export function getStaticPaths() {
  return [
    { params: { category: 'tech', slug: 'astro-intro' } },
    { params: { category: 'life', slug: 'travel-tips' } },
  ];
}

const { category, slug } = Astro.params;
---

<p>Category: {category}, Slug: {slug}</p>
```

### Rest Parameters (Catch-all)

```astro
---
// src/pages/docs/[...path].astro
export function getStaticPaths() {
  return [
    { params: { path: undefined } },        // /docs
    { params: { path: 'getting-started' } }, // /docs/getting-started
    { params: { path: 'guides/routing' } },  // /docs/guides/routing
  ];
}

const { path } = Astro.params;
// path can be undefined, "getting-started", or "guides/routing"
---
```

## Server-Side Routes (SSR)

With SSR enabled, you can access params without `getStaticPaths`:

```astro
---
// src/pages/products/[id].astro
// Requires output: 'server' or 'hybrid' with prerender = false

const { id } = Astro.params;

const response = await fetch(`https://api.example.com/products/${id}`);
const product = await response.json();

if (!product) {
  return new Response(null, {
    status: 404,
    statusText: 'Not Found'
  });
}
---

<h1>{product.name}</h1>
```

## Endpoints (API Routes)

### Static Endpoints

```typescript
// src/pages/api/posts.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  return new Response(
    JSON.stringify(posts.map(p => ({
      title: p.data.title,
      slug: p.slug,
    }))),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
```

### Server Endpoints (SSR)

```typescript
// src/pages/api/submit.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');

  // Validate and process
  if (!email) {
    return new Response(
      JSON.stringify({ error: 'Email required' }),
      { status: 400 }
    );
  }

  // Save to database, send email, etc.

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
};
```

### Dynamic Endpoints

```typescript
// src/pages/api/users/[id].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const user = await fetchUser(id);

  if (!user) {
    return new Response(null, { status: 404 });
  }

  return new Response(JSON.stringify(user));
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  await deleteUser(id);
  return new Response(null, { status: 204 });
};
```

## Redirects

### In Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/old-page': '/new-page',
    '/blog/[...slug]': '/articles/[...slug]',
    '/external': 'https://example.com',
  },
});
```

### Programmatic Redirects (SSR)

```astro
---
// In page or middleware
if (!user) {
  return Astro.redirect('/login');
}

// With status code
return Astro.redirect('/dashboard', 307);
---
```

## Rewrites

Serve different content for a URL without redirect:

```astro
---
// src/pages/[lang]/about.astro
const { lang } = Astro.params;

if (lang !== 'en' && lang !== 'es') {
  return Astro.rewrite('/404');
}
---
```

## Route Priority

When multiple routes could match, Astro uses this priority:

1. Static routes (`/about`)
2. Dynamic routes with named params (`/blog/[slug]`)
3. Rest parameters (`/[...path]`)

```
/posts/create      → src/pages/posts/create.astro (static wins)
/posts/hello-world → src/pages/posts/[slug].astro (dynamic)
/posts/2024/01/15  → src/pages/posts/[...slug].astro (rest)
```

## Pagination

```astro
---
// src/pages/blog/[...page].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return paginate(sortedPosts, { pageSize: 10 });
}

const { page } = Astro.props;
---

<ul>
  {page.data.map((post) => (
    <li>{post.data.title}</li>
  ))}
</ul>

<nav>
  {page.url.prev && <a href={page.url.prev}>Previous</a>}
  <span>Page {page.currentPage} of {page.lastPage}</span>
  {page.url.next && <a href={page.url.next}>Next</a>}
</nav>
```

## i18n Routing

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: {
      prefixDefaultLocale: false, // /about vs /en/about
    },
  },
});
```

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── es/
│   ├── index.astro      → /es
│   └── about.astro      → /es/about
└── fr/
    ├── index.astro      → /fr
    └── about.astro      → /fr/about
```

## Best Practices

1. **Use content collections for dynamic content** - Type safety and validation
2. **Keep API endpoints RESTful** - Clear HTTP methods and paths
3. **Use rest params for catch-all** - `[...slug]` for flexible paths
4. **Configure redirects in config** - Better than manual redirects
5. **Test route priority** - Ensure expected routes win
6. **Use pagination for large lists** - Better performance and UX
