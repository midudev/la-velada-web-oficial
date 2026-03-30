import { createClient } from '@libsql/client'

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
})
