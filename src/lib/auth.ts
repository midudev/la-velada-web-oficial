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

/**
 * Lee la sesión sin que una cookie corrupta o incompatible tumbe la página.
 *
 * Una cookie `better-auth.session_data` de un despliegue anterior puede tener
 * un formato que el decodificador "compact" de better-auth no sabe leer y, a
 * diferencia de las estrategias `jwe`/`jwt`, esa rama no captura el error: lanza
 * un INTERNAL_SERVER_ERROR. Como el middleware consulta la sesión en cada página
 * dinámica, eso provocaba un 500 (p. ej. en /pronosticos). Aquí lo tratamos como
 * "sin sesión" y devolvemos `failed: true` para que quien llama pueda limpiar
 * las cookies y permitir que el usuario vuelva a iniciar sesión limpiamente.
 */
type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>

// Caché en memoria de sesiones por token. El middleware resuelve la sesión en
// CADA página dinámica no prerenderizada; con el tráfico del evento eso son
// muchas lecturas pequeñas (session + user) a Turso por usuario logueado.
// Cacheamos el resultado durante unos segundos por valor de la cookie de sesión.
//
// Limitaciones asumidas (igual que el rate-limiter en memoria): el estado vive
// por instancia serverless y una revocación de sesión puede tardar hasta
// SESSION_CACHE_TTL_MS en reflejarse. Asumible para una web de votaciones.
const SESSION_CACHE_TTL_MS = 5_000
const MAX_SESSION_CACHE_ENTRIES = 10_000

const sessionCache = new Map<string, { session: SessionResult; expiresAt: number }>()

// La clave es la(s) cookie(s) `session_token` que identifican la credencial:
// usuarios distintos tienen tokens distintos (claves distintas) y al cerrar
// sesión el navegador deja de enviarla, así que nunca se sirve un estado caduco.
function getSessionCacheKey(headers: Headers): string | null {
  const cookieHeader = headers.get('cookie')
  if (!cookieHeader) return null

  const tokenParts = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.includes('session_token'))
    .sort()

  return tokenParts.length > 0 ? tokenParts.join(';') : null
}

function pruneExpiredSessions(now: number) {
  for (const [key, entry] of sessionCache) {
    if (entry.expiresAt <= now) sessionCache.delete(key)
  }
  // Si tras limpiar las caducadas sigue lleno, vaciamos para no crecer sin
  // control (preferimos perder caché a acumular memoria sin límite).
  if (sessionCache.size >= MAX_SESSION_CACHE_ENTRIES) {
    sessionCache.clear()
  }
}

export async function getSessionFromHeaders(
  headers: Headers,
): Promise<{ session: SessionResult; failed: boolean }> {
  const cacheKey = getSessionCacheKey(headers)
  const now = Date.now()

  if (cacheKey) {
    const cached = sessionCache.get(cacheKey)
    if (cached && cached.expiresAt > now) {
      return { session: cached.session, failed: false }
    }
  }

  try {
    const session = await auth.api.getSession({ headers })

    // Solo cacheamos lecturas correctas (nunca el caso `failed`, que debe seguir
    // limpiando cookies en cada request) y solo cuando hay token de sesión.
    if (cacheKey) {
      if (sessionCache.size >= MAX_SESSION_CACHE_ENTRIES) pruneExpiredSessions(now)
      sessionCache.set(cacheKey, { session, expiresAt: now + SESSION_CACHE_TTL_MS })
    }

    return { session, failed: false }
  } catch (error) {
    console.error('No se pudo leer la sesión de better-auth (cookie inválida):', error)
    return { session: null, failed: true }
  }
}
