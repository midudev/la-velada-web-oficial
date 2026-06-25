import { LibsqlDialect } from '@libsql/kysely-libsql'
import { betterAuth } from 'better-auth'

const secret =
  import.meta.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || 'astro-local-dev-secret'
const baseURL =
  import.meta.env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000'

// Persistimos usuarios, cuentas y sesiones en Turso. Sin una base de datos,
// better-auth usa un adaptador en memoria: en serverless la memoria es efímera
// y cada nuevo login OAuth genera un `user.id` distinto, lo que rompía el
// antiduplicado de votos `UNIQUE(combat_id, user_id)` de /pronosticos.
const dialect = new LibsqlDialect({
  url: import.meta.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || '',
  authToken: import.meta.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || '',
})

export const auth = betterAuth({
  database: { dialect, type: 'sqlite' },
  secret,
  baseURL,
  socialProviders: {
    twitch: {
      clientId: import.meta.env.TWITCH_CLIENT_ID,
      clientSecret: import.meta.env.TWITCH_CLIENT_SECRET,
    },
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    },
  },
})
