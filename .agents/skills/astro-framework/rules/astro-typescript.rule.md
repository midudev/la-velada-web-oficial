---
description: Rules for TypeScript configuration in Astro projects
globs:
  - "tsconfig.json"
  - "src/env.d.ts"
  - "**/*.ts"
  - "**/*.astro"
---

# Astro TypeScript Rules

## tsconfig.json

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

## MUST DO

- Use `astro/tsconfigs/strict` or `strictest` preset
- Define path aliases for cleaner imports
- Type Props interface in all components
- Type locals in `src/env.d.ts`
- Type environment variables

## MUST NOT DO

- Use `any` type - use `unknown` and narrow
- Skip typing Props interface
- Ignore TypeScript errors
- Use `astro/tsconfigs/base` in production projects

## Component Props

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

## Environment Variables

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

## Locals Typing

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

## Content Collection Types

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

## API Route Types

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

## Path Aliases Usage

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
