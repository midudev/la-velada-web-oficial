import { getSessionFromHeaders } from '@/lib/auth'
import { getAllPredictions, getPredictionsByCombat, getUserVotes } from '@/lib/predictions'
import { rateLimit } from '@/lib/rate-limit'
import type { APIRoute } from 'astro'

export const prerender = false

// Las predicciones públicas pueden usarse desde overlays/herramientas. El CDN
// de Vercel sirve la respuesta desde el edge durante 10s y revalida en segundo
// plano para evitar martillar Turso.
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
// para que un cliente logueado no pueda martillear lecturas a Turso.
const READ_RATE_LIMIT = { limit: 60, windowMs: 60_000 }

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

export const POST: APIRoute = async () => {
  // La votación se cerró al empezar el evento: los totales viven en el HTML
  // estático generado en build. Mantenemos GET para overlays/herramientas.
  return json({ error: 'La votación de pronósticos está cerrada' }, 410)
}
