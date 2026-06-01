---
description: Rules for Astro routing and pages
globs:
  - "src/pages/**/*"
---

# Astro Routing Rules

## File-Based Routing

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

## MUST DO

- Use `getStaticPaths()` for dynamic routes in static mode
- Return proper status codes from API endpoints
- Validate params in SSR routes
- Use content collections for dynamic content pages
- Handle 404 cases explicitly

## MUST NOT DO

- Access `Astro.request` in prerendered pages
- Forget `getStaticPaths()` in static output mode
- Return sensitive data in API responses without auth
- Use interactive flags like `git rebase -i` in routes

## Dynamic Routes Pattern

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

## Rest Parameters (Catch-All)

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

## API Endpoints

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

## Pagination

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

## Redirects

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/old': '/new',
    '/blog/[...slug]': '/posts/[...slug]',
  },
});
```
