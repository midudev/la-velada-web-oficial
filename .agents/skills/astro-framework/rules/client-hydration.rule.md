---
description: Rules for client-side hydration and islands architecture
globs:
  - "**/*.astro"
  - "**/components/**/*.tsx"
  - "**/components/**/*.jsx"
  - "**/components/**/*.vue"
  - "**/components/**/*.svelte"
---

# Client Hydration Rules

## Islands Architecture Principle

Ship zero JavaScript by default. Only hydrate components that need interactivity.

## Client Directive Decision Tree

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

## MUST DO

- Default to no hydration - question every `client:` directive
- Use `client:visible` for below-the-fold interactive content
- Use `client:idle` for non-critical above-the-fold interactions
- Use `client:media` for device-specific components
- Always specify framework for `client:only="react"` (required)
- Test that pages work without JavaScript

## MUST NOT DO

- Use `client:load` on everything - defeats islands purpose
- Hydrate static content (navbars, footers without interactions)
- Use `client:only` without the framework string
- Forget that `client:only` skips SSR entirely
- Hydrate large components that only need minor interactivity

## Examples

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

## Measuring Impact

Use browser DevTools to verify:
1. Network tab: Check JS bundle sizes
2. Performance tab: Measure TTI (Time to Interactive)
3. Lighthouse: Verify Core Web Vitals

## Passing Props to Hydrated Components

```astro
---
import Counter from './Counter.jsx';
const initialCount = 10;
---

<!-- Props are serialized to the client -->
<Counter client:load initialCount={initialCount} />
```

Note: Props must be serializable (no functions, no class instances).
