import { getSessionFromHeaders } from '@/lib/auth'
import { getUserVotes } from '@/lib/predictions'
import { rateLimit } from '@/lib/rate-limit'
import type { APIRoute } from 'astro'

export const prerender = false

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
    // Tras el evento, los totales de la comunidad viven en HTML estático.
    // La API solo sirve los votos propios del usuario autenticado.
    if (url.searchParams.get('mine') !== '1') {
      return json(
        {
          error:
            'Las predicciones públicas son estáticas. Usa ?mine=1 con sesión para ver tus votos.',
        },
        410,
      )
    }

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
  } catch (error) {
    console.error('Error en GET /api/predictions:', error)
    return json({ error: 'Error al obtener predicciones' }, 500)
  }
}

export const POST: APIRoute = async () => {
  return json({ error: 'La votación de pronósticos está cerrada' }, 410)
}
