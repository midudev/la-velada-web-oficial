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

export const auth = betterAuth({
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
