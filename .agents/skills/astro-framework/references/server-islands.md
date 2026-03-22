# Server Islands

Server islands allow you to defer rendering of specific Astro components to the server, loading them independently from the rest of the page. This keeps your main content fast while dynamic/personalized sections load separately.

## How It Works

1. The page renders immediately with fallback content as placeholder
2. Each `server:defer` component is fetched via a separate request
3. The component's HTML replaces the fallback when ready
4. Each island loads independently — a slow island won't block others

## Basic Usage

Add `server:defer` to any Astro component to turn it into a server island:

```astro
---
import Avatar from '../components/Avatar.astro';
import ProductReviews from '../components/ProductReviews.astro';
---

<!-- Static content renders immediately -->
<h1>Product Page</h1>
<p>This content is fast and cacheable.</p>

<!-- Server island: deferred rendering -->
<Avatar server:defer />

<!-- Server island with fallback -->
<ProductReviews server:defer>
  <div slot="fallback">
    <p>Loading reviews...</p>
  </div>
</ProductReviews>
```

## Fallback Content

Use the named `"fallback"` slot to show placeholder content while the island loads:

```astro
<Avatar server:defer>
  <!-- Generic placeholder shown until real avatar loads -->
  <img slot="fallback" src="/generic-avatar.svg" alt="Loading..." />
</Avatar>
```

Good fallback patterns:
- Generic placeholder (e.g., generic avatar instead of user's avatar)
- Loading skeleton/spinner
- Placeholder UI with approximate dimensions (prevents layout shift)

## Server Island Components

Inside a server island component, you can do anything a normal SSR component can:

```astro
---
// src/components/Avatar.astro
// This runs on the server when the island is requested
const userSession = Astro.cookies.get('session');
const avatarURL = await getUserAvatar(userSession);
---

<img alt="User avatar" src={avatarURL} />
```

## Props

Props passed to server islands must be **serializable** — they're encoded in the request URL.

**Supported types:** plain objects, `number`, `string`, `Array`, `Map`, `Set`, `RegExp`, `Date`, `BigInt`, `URL`, `Uint8Array`, `Uint16Array`, `Uint32Array`, `Infinity`

**NOT supported:** functions, class instances, circular references

```astro
<!-- OK: serializable props -->
<ProductCard server:defer productId="abc-123" />
<UserBadge server:defer userId={42} showAvatar={true} />

<!-- NOT OK: functions can't be serialized -->
<Component server:defer onClick={handleClick} />
```

**Keep props small.** Props are encoded in the URL query string. If the URL exceeds ~2048 bytes, Astro switches to a POST request which browsers don't cache. Pass IDs rather than full data objects.

## Accessing the Page URL

Server islands run in their own isolated context. `Astro.url` returns the island's internal URL (e.g., `/_server-islands/Avatar`), not the page URL.

To access the page URL, check the `Referer` header:

```astro
---
const referer = Astro.request.headers.get('Referer');
const url = new URL(referer);
const productId = url.searchParams.get('product');
---
```

## Caching

Server island data is fetched via GET requests, so standard `Cache-Control` headers work:

```astro
---
// Cache this island for 1 hour
Astro.response.headers.set('Cache-Control', 'max-age=3600');
---
```

## Requirements

- An adapter must be installed (Node, Vercel, Netlify, Cloudflare, etc.)
- Server islands work in both `server` and `hybrid` output modes
- The page containing the island can be prerendered — only the island itself needs server rendering

## Use Cases

Server islands are ideal for:
- **Personalized content** on otherwise static pages (user avatars, greeting bars)
- **Dynamic data** that changes frequently (product prices, stock status, reviews)
- **Authenticated sections** (user dashboards widgets on a public page)
- **Slow data sources** that would delay the whole page if rendered inline

## Expert Patterns

### The E-Commerce Page Pattern

The most common server island pattern — three rendering strategies on one page:

```astro
---
import PriceStock from '../components/PriceStock.astro';
import AddToCart from '../components/AddToCart.jsx';
---

<!-- Static: title, images, description (cached at CDN) -->
<h1>{product.title}</h1>
<img src={product.image} alt={product.title} />
<p>{product.description}</p>

<!-- Server island: price/stock changes often, needs server data -->
<PriceStock server:defer productId={product.id}>
  <div slot="fallback" class="price-skeleton" />
</PriceStock>

<!-- Client island: add-to-cart needs onClick/state -->
<AddToCart client:load productId={product.id} />
```

### Common Mistakes

**Passing large objects as props:**
```astro
<!-- BAD: entire product object gets URL-encoded -->
<PriceStock server:defer product={fullProductObject} />

<!-- GOOD: pass only the ID, fetch inside the island -->
<PriceStock server:defer productId={product.id} />
```

If serialized props exceed ~2048 bytes, Astro switches from GET to POST — losing browser/CDN caching entirely.

**Forgetting the fallback slot:**
Without `slot="fallback"`, users see nothing until the island loads. Always provide a placeholder that matches the island's dimensions to prevent layout shift.

**Using `Astro.url` instead of `Referer`:**
`Astro.url` inside a server island returns `/_server-islands/ComponentName`, not the page URL. This is a frequent bug source. Always use the `Referer` header:

```astro
---
// WRONG: returns /_server-islands/PriceStock
const url = Astro.url;

// RIGHT: returns the actual page URL
const pageUrl = new URL(Astro.request.headers.get('Referer'));
---
```

### When NOT to Use Server Islands

- **Data that doesn't change per-request** → Use static rendering with rebuild triggers instead
- **Components needing fast interactivity** (clicks, hover effects) → Use `client:*` directives
- **Nested server islands** → Not supported; flatten your component hierarchy
- **Components depending on page layout context** → Server islands render in isolation; they can't access parent component state

## Encryption Key for Deployments

Props are encrypted. In rolling deployments or multi-region setups where frontend/backend may use different keys:

```bash
astro create-key
```

Set the result as `ASTRO_KEY` environment variable in your build environment to keep encryption in sync.
