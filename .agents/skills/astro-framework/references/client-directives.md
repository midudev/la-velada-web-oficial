# Client Directives

Client directives control how UI framework components (React, Vue, Svelte, etc.) are hydrated on the client.

## Overview

By default, UI framework components are **not hydrated** - they render to static HTML. Client directives tell Astro when and how to hydrate them.

```astro
<!-- Static - no JavaScript shipped -->
<ReactComponent />

<!-- Hydrated - JavaScript loaded -->
<ReactComponent client:load />
```

## Available Directives

### client:load

Hydrate immediately when the page loads. Use for above-the-fold interactive content.

```astro
<InteractiveCounter client:load />
<NavigationMenu client:load />
```

**Use when:**
- Component is immediately visible
- User interaction expected right away
- Critical interactive functionality

### client:idle

Hydrate when the browser is idle (using `requestIdleCallback`). Good for lower-priority interactivity.

```astro
<SidebarWidget client:idle />
<FeedbackForm client:idle />
```

**Use when:**
- Component is visible but not immediately needed
- User likely to interact after initial page load
- Want to prioritize above-the-fold content

### client:visible

Hydrate when the component enters the viewport. Uses Intersection Observer.

```astro
<CommentsSection client:visible />
<ImageCarousel client:visible />
<FooterNewsletter client:visible />
```

**Use when:**
- Component is below the fold
- Heavy components that shouldn't block initial load
- Lazy-loaded features

**With options:**

```astro
<!-- Hydrate when 50% visible with 200px margin -->
<HeavyComponent client:visible={{
  rootMargin: "200px",
  threshold: 0.5
}} />
```

### client:media

Hydrate only when a media query matches. Perfect for responsive components.

```astro
<!-- Only hydrate on desktop -->
<DesktopOnlyChart client:media="(min-width: 768px)" />

<!-- Only hydrate on mobile -->
<MobileMenu client:media="(max-width: 767px)" />

<!-- Only hydrate if reduced motion not preferred -->
<AnimatedHero client:media="(prefers-reduced-motion: no-preference)" />
```

**Use when:**
- Component only needed at certain viewport sizes
- Device-specific functionality
- Accessibility considerations

### client:only

Skip server rendering entirely. Component only renders on the client.

```astro
<!-- Must specify the framework -->
<ReactOnlyComponent client:only="react" />
<VueOnlyComponent client:only="vue" />
<SvelteOnlyComponent client:only="svelte" />
<SolidOnlyComponent client:only="solid-js" />
<PreactOnlyComponent client:only="preact" />
```

**Use when:**
- Component uses browser-only APIs (window, document, localStorage)
- Component has SSR incompatibilities
- Third-party component doesn't support SSR

**Important:** Always specify the framework name!

## Mixing Multiple Frameworks

Astro supports multiple UI frameworks in the same project:

```astro
---
import ReactCounter from './ReactCounter.jsx';
import VueCard from './VueCard.vue';
import SvelteButton from './SvelteButton.svelte';
---

<ReactCounter client:load />
<VueCard client:visible />
<SvelteButton client:idle />
```

## Directive Priority Guide

Choose the right directive based on priority:

| Priority | Directive | JavaScript Load | Use Case |
|----------|-----------|-----------------|----------|
| 1 (Highest) | `client:load` | Immediate | Critical interactivity |
| 2 | `client:idle` | When idle | Important but not urgent |
| 3 | `client:visible` | When visible | Below-the-fold content |
| 4 | `client:media` | When matches | Responsive components |
| Special | `client:only` | Client only | Browser-only APIs |

## Common Patterns

### Navigation with Mobile Menu

```astro
---
import DesktopNav from './DesktopNav.astro'; // Static
import MobileMenu from './MobileMenu.jsx';
---

<DesktopNav />
<MobileMenu client:media="(max-width: 768px)" />
```

### Progressive Enhancement

```astro
---
import StaticContent from './StaticContent.astro';
import EnhancedFeatures from './EnhancedFeatures.jsx';
---

<!-- Always visible -->
<StaticContent />

<!-- Enhanced when visible -->
<EnhancedFeatures client:visible />
```

### Heavy Component Optimization

```astro
---
import DataVisualization from './DataVisualization.jsx';
---

<!-- Only load when visible and browser is ready -->
<div class="chart-container">
  <DataVisualization
    client:visible={{ rootMargin: "100px" }}
    data={chartData}
  />
</div>
```

## Best Practices

1. **Default to no directive** - Only hydrate what needs interactivity
2. **Use `client:visible` for below-fold content** - Reduce initial bundle
3. **Avoid `client:load` for everything** - Defeats the purpose of islands
4. **Use `client:media` for responsive components** - Don't load unused code
5. **Always specify framework for `client:only`** - Required parameter
6. **Test without JavaScript** - Ensure graceful degradation
7. **Monitor bundle sizes** - Each hydrated component adds JavaScript

## Debugging

Check which components are hydrated:

```javascript
// In browser console
document.querySelectorAll('[data-astro-cid]').forEach(el => {
  console.log(el, el.dataset);
});
```

## Performance Impact

| Directive | Initial Load | TTI Impact | Bundle Size |
|-----------|--------------|------------|-------------|
| None | Fastest | None | 0 KB |
| `client:visible` | Fast | Low | Deferred |
| `client:idle` | Fast | Low | Deferred |
| `client:media` | Fast | Conditional | Conditional |
| `client:load` | Slower | High | Immediate |
| `client:only` | Slowest | High | Immediate + no SSR |
