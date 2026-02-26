# Content Collections

Content collections provide type-safe content management with schema validation using Zod.

## Setup

### Directory Structure

```
src/
├── content/
│   ├── config.ts       # Collection schemas
│   ├── blog/           # Blog collection
│   │   ├── post-1.md
│   │   ├── post-2.mdx
│   │   └── drafts/     # Subdirectories supported
│   │       └── draft-1.md
│   └── authors/        # Another collection
│       └── john.json
```

### Configuration File

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content', // Markdown/MDX files
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string(),
  }),
});

const authorsCollection = defineCollection({
  type: 'data', // JSON/YAML files
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    bio: z.string(),
    avatar: z.string().url(),
    social: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
};
```

## Collection Types

### Content Collections (`type: 'content'`)

For Markdown and MDX files with frontmatter:

```markdown
---
title: "My First Post"
pubDate: 2024-01-15
author: "john"
---

# Hello World

This is my first blog post.
```

### Data Collections (`type: 'data'`)

For JSON or YAML data files:

```json
// src/content/authors/john.json
{
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "A passionate writer",
  "avatar": "https://example.com/avatar.jpg"
}
```

## Schema Validation with Zod

### Common Field Types

```typescript
import { z } from 'astro:content';

const schema = z.object({
  // Strings
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),

  // Numbers
  order: z.number().int().positive(),
  rating: z.number().min(0).max(5),

  // Booleans
  featured: z.boolean().default(false),

  // Dates
  pubDate: z.coerce.date(), // Converts strings to Date

  // Arrays
  tags: z.array(z.string()),
  categories: z.array(z.enum(['tech', 'life', 'travel'])),

  // Objects
  author: z.object({
    name: z.string(),
    email: z.string().email(),
  }),

  // Enums
  status: z.enum(['draft', 'published', 'archived']),

  // Optional fields
  description: z.string().optional(),
  image: z.string().url().optional(),

  // Default values
  views: z.number().default(0),

  // Unions
  media: z.union([
    z.object({ type: z.literal('image'), src: z.string() }),
    z.object({ type: z.literal('video'), url: z.string() }),
  ]),
});
```

### Image Schema

```typescript
import { defineCollection, z } from 'astro:content';
import { image } from 'astro:schema';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(), // Validates and optimizes images
    coverAlt: z.string(),
  }),
});
```

### Reference Other Collections

```typescript
import { defineCollection, z, reference } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: reference('authors'), // References authors collection
    relatedPosts: z.array(reference('blog')).optional(),
  }),
});
```

## Querying Collections

### getCollection()

```astro
---
import { getCollection } from 'astro:content';

// Get all entries
const allPosts = await getCollection('blog');

// Filter entries
const publishedPosts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});

// Filter by date
const recentPosts = await getCollection('blog', ({ data }) => {
  return data.pubDate > new Date('2024-01-01');
});

// Sort entries
const sortedPosts = (await getCollection('blog'))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<ul>
  {sortedPosts.map((post) => (
    <li>
      <a href={`/blog/${post.slug}`}>{post.data.title}</a>
      <time>{post.data.pubDate.toLocaleDateString()}</time>
    </li>
  ))}
</ul>
```

### getEntry()

```astro
---
import { getEntry } from 'astro:content';

// Get single entry by collection and slug
const post = await getEntry('blog', 'my-first-post');

// Get single entry by reference
const author = await getEntry(post.data.author);

// Check if entry exists
if (!post) {
  return Astro.redirect('/404');
}
---

<article>
  <h1>{post.data.title}</h1>
  <p>By {author.data.name}</p>
</article>
```

### getEntries()

```astro
---
import { getEntry, getEntries } from 'astro:content';

const post = await getEntry('blog', 'my-post');

// Get multiple referenced entries
const relatedPosts = await getEntries(post.data.relatedPosts);
---
```

## Rendering Content

```astro
---
import { getEntry } from 'astro:content';

const post = await getEntry('blog', 'my-post');
const { Content, headings, remarkPluginFrontmatter } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>

  <!-- Table of contents from headings -->
  <nav>
    {headings.map((h) => (
      <a href={`#${h.slug}`} style={`margin-left: ${h.depth * 10}px`}>
        {h.text}
      </a>
    ))}
  </nav>

  <!-- Rendered content -->
  <Content />
</article>
```

## Dynamic Routes with Collections

```astro
---
// src/pages/blog/[...slug].astro
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

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## Content Loaders (Astro 5+)

### Built-in Loaders

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Glob loader for multiple files
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});

// File loader for single JSON/YAML
const settings = defineCollection({
  loader: file("./src/data/settings.json"),
  schema: z.object({
    siteName: z.string(),
    siteUrl: z.string().url(),
  }),
});

export const collections = { blog, settings };
```

### Custom Loaders

```typescript
// Load from API
const products = defineCollection({
  loader: async () => {
    const response = await fetch('https://api.example.com/products');
    const data = await response.json();
    return data.map((product: any) => ({
      id: product.id,
      ...product,
    }));
  },
  schema: z.object({
    name: z.string(),
    price: z.number(),
  }),
});
```

## Best Practices

1. **Always define schemas** - Type safety and validation
2. **Use `z.coerce.date()`** - Handles string dates from frontmatter
3. **Set sensible defaults** - `.default()` reduces required fields
4. **Filter drafts in production** - Don't expose unpublished content
5. **Use references for relationships** - Type-safe cross-collection links
6. **Keep slugs URL-friendly** - Validate with regex
7. **Use image schema for images** - Enables optimization
