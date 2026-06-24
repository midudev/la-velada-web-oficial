import { auth } from '@/lib/auth'
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
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return session?.user?.id ?? null
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    if (url.searchParams.get('mine') === '1') {
      const userId = await getUserId(request)

      if (!userId) {
        return json({ error: 'Usuario no autenticado' }, 401)
      }

      return json({ votes: await getUserVotes(userId) })
    }

    const combatId = url.searchParams.get('combat_id')

    if (combatId) {
      const prediction = await getPredictionsByCombat(combatId)

      if (!prediction) {
        return json({ error: 'Combate no encontrado' }, 404)
      }

      return json(prediction)
    }

    return json({ predictions: await getAllPredictions() })
  } catch (error) {
    console.error('Error en GET /api/predictions:', error)
    return json({ error: 'Error al obtener predicciones' }, 500)
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
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

    if (!combatId || !fighterId) {
      return json({ error: 'combat_id y fighter_id son obligatorios' }, 400)
    }

    const vote = await registerVote(combatId, fighterId, userId)
    const prediction = await getPredictionsByCombat(combatId)

    return json({ vote, prediction })
  } catch (error) {
    if (error instanceof PredictionDataError) {
      return json({ error: error.message }, error.status)
    }

    console.error('Error en POST /api/predictions:', error)
    return json({ error: 'Error al registrar voto' }, 500)
  }
}
