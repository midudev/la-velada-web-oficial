import { LibsqlDialect } from '@libsql/kysely-libsql'
import { betterAuth } from 'better-auth'

const isProduction = import.meta.env.PROD

// El secreto firma/cifra las cookies de sesión: en producción NUNCA debe caer a
// un valor por defecto (sería público y permitiría forjar sesiones). Solo en
// desarrollo se permite un fallback para no bloquear el arranque local.
const secret = import.meta.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET
if (!secret && isProduction) {
  throw new Error('BETTER_AUTH_SECRET es obligatorio en producción')
}

const baseURL = import.meta.env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL
if (!baseURL && isProduction) {
  throw new Error('BETTER_AUTH_URL es obligatorio en producción')
}

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
  // En este punto, en producción `secret`/`baseURL` están garantizados; los
  // fallbacks solo se usan en desarrollo local.
  secret: secret || 'astro-local-dev-secret',
  baseURL: baseURL || 'http://localhost:3000',
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
