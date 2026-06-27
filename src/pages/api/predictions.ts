import { getSessionFromHeaders } from '@/lib/auth'
import {
  getAllPredictions,
  getPredictionsByCombat,
  getUserVotes,
  PredictionDataError,
  registerVote,
} from '@/lib/predictions'
import { rateLimit } from '@/lib/rate-limit'
import type { APIRoute } from 'astro'

export const prerender = false

// Un usuario honesto pronostica 10 combates y rara vez cambia de opinión más de
// un par de veces; 20 votos por minuto deja margen de sobra y corta los bucles.
const VOTE_RATE_LIMIT = { limit: 20, windowMs: 60_000 }

// Las predicciones públicas las pollea cada cliente cada 15s: dejamos que el CDN
// de Vercel sirva la respuesta desde el edge durante 10s y revalide en segundo
// plano, de modo que millones de polls se traducen en muy pocos hits a Turso.
// `stale-while-revalidate` evita que ninguna petición espere a la base de datos.
const PUBLIC_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
}

// Las respuestas por-usuario (sus votos) NUNCA deben cachearse en un proxy/CDN
// compartido: marcarlas explícitamente como privadas evita que una mala
// configuración intermedia sirva los votos de un usuario a otro.
const PRIVATE_CACHE_HEADERS = {
  'Cache-Control': 'private, no-store',
}

// El GET de "mis votos" no pasa por el CDN (es privado), así que lo limitamos
// para que un cliente logueado no pueda martillear lecturas a Turso. Ventana
// holgada: el uso normal (una lectura por carga) ni se acerca.
const READ_RATE_LIMIT = { limit: 60, windowMs: 60_000 }

// Los IDs reales (`boxer-a-vs-boxer-b`, slug de boxeador) son cortos. Acotar la
// longitud evita procesar payloads enormes antes de validarlos contra el
// allowlist de combates/boxeadores.
const MAX_ID_LENGTH = 80

// Defensa CSRF en profundidad: la cookie de sesión de better-auth ya es
// SameSite=Lax (no viaja en POST cross-site), pero además rechazamos cualquier
// POST cuyo `Origin` no sea del propio host. Las peticiones legítimas del
// navegador siempre traen un `Origin` del mismo origen; las llamadas sin
// `Origin` (raras) se permiten para no romper clientes válidos.
function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('host')
  const forwardedHost = request.headers.get('x-forwarded-host')

  try {
    const originHost = new URL(origin).host
    return originHost === host || originHost === forwardedHost
  } catch {
    return false
  }
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

async function getUserId(request: Request) {
  const { session } = await getSessionFromHeaders(request.headers)

  return session?.user?.id ?? null
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    if (url.searchParams.get('mine') === '1') {
      const userId = await getUserId(request)

      if (!userId) {
        return json({ error: 'Usuario no autenticado' }, 401)
      }

      const { allowed, retryAfter } = rateLimit(`predictions:read:${userId}`, READ_RATE_LIMIT)

      if (!allowed) {
        return json({ error: 'Demasiadas peticiones. Espera unos segundos.' }, 429, {
          'Retry-After': String(retryAfter),
        })
      }

      return json({ votes: await getUserVotes(userId) }, 200, PRIVATE_CACHE_HEADERS)
    }

    const combatId = url.searchParams.get('combat_id')

    if (combatId) {
      const prediction = await getPredictionsByCombat(combatId)

      if (!prediction) {
        return json({ error: 'Combate no encontrado' }, 404)
      }

      return json(prediction, 200, PUBLIC_CACHE_HEADERS)
    }

    return json({ predictions: await getAllPredictions() }, 200, PUBLIC_CACHE_HEADERS)
  } catch (error) {
    console.error('Error en GET /api/predictions:', error)
    return json({ error: 'Error al obtener predicciones' }, 500)
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isSameOriginRequest(request)) {
      return json({ error: 'Origen no permitido' }, 403)
    }

    const userId = await getUserId(request)

    if (!userId) {
      return json({ error: 'Usuario no autenticado' }, 401)
    }

    const { allowed, retryAfter } = rateLimit(`predictions:${userId}`, VOTE_RATE_LIMIT)

    if (!allowed) {
      return json(
        { error: 'Demasiados votos en poco tiempo. Espera unos segundos e inténtalo de nuevo.' },
        429,
        { 'Retry-After': String(retryAfter) },
      )
    }

    const body = await request.json().catch(() => null)
    const combatId = typeof body?.combat_id === 'string' ? body.combat_id : ''
    const fighterId = typeof body?.fighter_id === 'string' ? body.fighter_id : ''

    if (
      !combatId ||
      !fighterId ||
      combatId.length > MAX_ID_LENGTH ||
      fighterId.length > MAX_ID_LENGTH
    ) {
      return json({ error: 'combat_id y fighter_id son obligatorios' }, 400)
    }

    const { vote, prediction } = await registerVote(combatId, fighterId, userId)

    return json({ vote, prediction }, 200, PRIVATE_CACHE_HEADERS)
  } catch (error) {
    if (error instanceof PredictionDataError) {
      return json({ error: error.message }, error.status)
    }

    console.error('Error en POST /api/predictions:', error)
    return json({ error: 'Error al registrar voto' }, 500)
  }
}
