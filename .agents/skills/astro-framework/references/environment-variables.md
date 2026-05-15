# Type-Safe Environment Variables (`astro:env`)

**Added in:** Astro 5.0+

The `astro:env` API provides a type-safe schema for environment variables with validation, proper context separation, and secret management.

## Setup

### Define Schema

```javascript
// astro.config.mjs
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  env: {
    schema: {
      // Public client variable — available everywhere
      API_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),

      // Public server variable — server bundle only
      PORT: envField.number({
        context: 'server',
        access: 'public',
        default: 4321,
      }),

      // Secret server variable — not in bundle, runtime only
      API_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // Boolean variable
      FEATURE_FLAG: envField.boolean({
        context: 'client',
        access: 'public',
        default: false,
      }),

      // Enum variable
      LOG_LEVEL: envField.enum({
        context: 'server',
        access: 'public',
        values: ['debug', 'info', 'warn', 'error'],
        default: 'info',
      }),
    },
  },
});
```

### Use Variables

Import from the appropriate module:

```astro
---
import { API_URL } from 'astro:env/client';
import { API_SECRET, PORT } from 'astro:env/server';

const data = await fetch(`${API_URL}/users`, {
  headers: {
    'Authorization': `Bearer ${API_SECRET}`,
  },
});
---

<script>
  import { API_URL } from 'astro:env/client';
  fetch(`${API_URL}/ping`);
</script>
```

## Variable Types

There are three kinds, determined by `context` + `access`:

| Kind | Context | Access | Available In | In Bundle? |
|------|---------|--------|-------------|-----------|
| Public client | `client` | `public` | Client + Server | Yes |
| Public server | `server` | `public` | Server only | Yes |
| Secret server | `server` | `secret` | Server only | No |

**Secret client variables are not supported** — there's no safe way to send secrets to the client.

## Data Types

```javascript
envField.string({ context: 'server', access: 'public' })
envField.number({ context: 'server', access: 'public' })
envField.boolean({ context: 'client', access: 'public' })
envField.enum({ context: 'server', access: 'public', values: ['a', 'b'] })
```

Common options: `default`, `optional`, `min`, `max`, `length`, `url`, `includes`, `startsWith`, `endsWith`.

## `getSecret()`

For programmatic access to secrets (e.g., keys that depend on dynamic data):

```typescript
import { getSecret } from 'astro:env/server';

// Returns string | undefined
const apiKey = getSecret('DYNAMIC_API_KEY');
```

Use `getSecret()` instead of `process.env` — its implementation is provided by your adapter, so you won't need to update calls if you switch adapters.

## When to Use `astro:env` vs `import.meta.env`

- **`astro:env`**: Type-safe, validated at build time, proper client/server separation. Use for all new projects.
- **`import.meta.env`**: Vite's built-in support. Still works, but no schema validation. `PUBLIC_` prefix exposes to client.

Both can coexist in the same project.
