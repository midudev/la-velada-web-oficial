---
description: Rules for server islands with deferred rendering
globs:
  - "**/*.astro"
  - "astro.config.mjs"
---

# Server Islands Rules

## When to Use `server:defer`

Use server islands when a component needs server-side data (cookies, DB, APIs) but the surrounding page can be static or cached.

```astro
<!-- Personalized component on an otherwise static page -->
<UserGreeting server:defer>
  <p slot="fallback">Welcome!</p>
</UserGreeting>
```

## MUST DO

- Always provide meaningful `slot="fallback"` content to prevent layout shift
- Keep props small and serializable (pass IDs, not full objects)
- Install an adapter — server islands require on-demand rendering
- Use `Referer` header to access the parent page URL inside the island
- Set `Cache-Control` headers on islands that don't change per-user

## MUST NOT DO

- Pass functions or class instances as props — they can't be serialized
- Rely on `Astro.url` for the page URL — it returns the island's internal route
- Use `server:defer` on components that don't need server data — use static rendering instead
- Pass large data objects as props — exceeding ~2048 bytes in URL forces POST (uncacheable)
- Forget to handle the loading state — always provide fallback content

## Decision: Server Island vs Client Island

```
Does the component need dynamic SERVER data (cookies, DB, personalization)?
├── Yes → server:defer (Server Island)
└── No → Does it need browser interactivity (clicks, state)?
    ├── Yes → client:load/idle/visible (Client Island)
    └── No → No directive (Static HTML)
```
