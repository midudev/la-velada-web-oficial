import { createClient } from '@libsql/client'

const url = import.meta.env.TURSO_DATABASE_URL || 'file:local.db'
const authToken = import.meta.env.TURSO_AUTH_TOKEN

export const turso = createClient({
  url,
  authToken,
})

