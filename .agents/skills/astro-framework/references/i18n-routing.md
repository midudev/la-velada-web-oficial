# Internationalization (i18n) Routing

Astro's built-in i18n routing helps you build multilingual sites with URL-based locale management, fallback content, and helper functions.

## Setup

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
  },
});
```

### Folder Structure

Create locale-specific folders inside `src/pages/`:

```
src/pages/
├── index.astro          → / (English, default)
├── about.astro          → /about
├── es/
│   ├── index.astro      → /es
│   └── about.astro      → /es/about
└── fr/
    ├── index.astro      → /fr
    └── about.astro      → /fr/about
```

## Routing Options

### `prefixDefaultLocale`

By default, the default locale has no prefix. Set to `true` to add it:

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
  routing: {
    prefixDefaultLocale: true, // /en/about instead of /about
  },
}
```

### Fallback Languages

Serve content from another locale when a page doesn't exist:

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
  fallback: {
    fr: 'es', // French pages fall back to Spanish
  },
  routing: {
    fallbackType: 'rewrite', // Show fallback content at the original URL
    // fallbackType: 'redirect', // (default) Redirect to fallback locale URL
  },
}
```

### Manual Routing

For full control, disable Astro's i18n middleware:

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
  routing: 'manual',
}
```

Then implement your own middleware using helpers from `astro:i18n`:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { redirectToDefaultLocale } from 'astro:i18n';

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.url.startsWith('/about')) {
    return next();
  }
  return redirectToDefaultLocale(302);
});
```

### Custom Locale Paths

Map multiple language codes to a single URL path:

```javascript
i18n: {
  locales: ['es', 'en', {
    path: 'french',
    codes: ['fr', 'fr-BR', 'fr-CA'],
  }],
  defaultLocale: 'en',
}
```

This maps `fr`, `fr-BR`, and `fr-CA` to `/french/` URLs.

### Domain-Based Routing

For server-rendered sites, map locales to different domains:

```javascript
i18n: {
  locales: ['es', 'en', 'fr'],
  defaultLocale: 'en',
  domains: {
    fr: 'https://fr.example.com',
    es: 'https://example.es',
  },
}
```

Requires `output: 'server'` and a `site` configuration.

## Helper Functions

Import from `astro:i18n`:

```astro
---
import {
  getRelativeLocaleUrl,
  getAbsoluteLocaleUrl,
  getRelativeLocaleUrlList,
  getAbsoluteLocaleUrlList,
  getPathByLocale,
  getLocaleByPath,
} from 'astro:i18n';

// Generate localized URLs
const aboutES = getRelativeLocaleUrl('es', 'about');
// → /es/about

// Get all locale variants of a page
const allAboutUrls = getRelativeLocaleUrlList('about');
// → ['/about', '/es/about', '/fr/about']
---

<!-- Language switcher -->
<nav>
  <a href={getRelativeLocaleUrl('en', 'about')}>English</a>
  <a href={getRelativeLocaleUrl('es', 'about')}>Español</a>
  <a href={getRelativeLocaleUrl('fr', 'about')}>Français</a>
</nav>
```

## Content Collections with i18n

Organize translated content in subdirectories:

```
src/content/blog/
├── en/
│   └── post-1.md
└── es/
    └── post-1.md
```

```astro
---
// src/pages/[lang]/blog/[...slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const pages = await getCollection('blog');
  return pages.map(page => {
    const [lang, ...slug] = page.id.split('/');
    return { params: { lang, slug: slug.join('/') || undefined }, props: page };
  });
}

const page = Astro.props;
const { Content } = await render(page);
---

<Content />
```

## Best Practices

1. **Use `getRelativeLocaleUrl()`** for generating links — don't hardcode locale prefixes
2. **Set up fallbacks** to avoid 404s for untranslated content
3. **Use `rewrite` fallback type** for better UX (shows content at original URL)
4. **Consider `prefixDefaultLocale: true`** for consistency across all locales
5. **Type locale params** to catch typos at build time
