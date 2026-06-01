---
description: Rules for content collections and type-safe content
globs:
  - "src/content/**/*"
  - "src/content.config.ts"
  - "src/content/config.ts"
  - "src/live.config.ts"
---

# Content Collections Rules

## Collection Configuration (Astro 5+)

Define schemas in `src/content.config.ts` using loaders:

```typescript
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
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

> **Migration note:** Astro 5+ uses `src/content.config.ts` (not `src/content/config.ts`), `loader` (not `type`), `import { z } from 'astro/zod'` (not `from 'astro:content'`), and `import { render } from 'astro:content'` for rendering.

## MUST DO

- Use `z.coerce.date()` for date fields - handles string dates from frontmatter
- Use `image()` helper for optimized images
- Use `reference()` for cross-collection relationships
- Set sensible defaults with `.default()`
- Add `.optional()` for non-required fields
- Filter drafts in production: `getCollection('blog', ({ data }) => !data.draft)`
- Export all collections from the config

## MUST NOT DO

- Use plain `z.date()` - won't parse frontmatter strings
- Skip schema validation
- Store sensitive data in content collections
- Use arbitrary image paths - use the image() schema helper
- Forget to handle the case when `getEntry` returns undefined

## Querying Collections

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

## Rendering Content

```astro
---
import { getEntry, render } from 'astro:content';

const post = await getEntry('blog', 'my-post');
const { Content, headings } = await render(post);
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

## Dynamic Routes

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
```

## File Organization

```
src/
├── content.config.ts    # Required: collection schemas (Astro 5+)
├── content/
│   ├── blog/
│   │   ├── post-1.md
│   │   └── post-2.mdx
│   └── authors/
│       └── john.json
```
