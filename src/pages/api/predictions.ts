export const prerender = false

import type { APIRoute } from 'astro'
import { getAllPredictions, getPredictionsByCombat, registerVote } from '@/lib/predictions'
import { COMBATS } from '@/consts/combats'
import { getBoxerById } from '@/lib/boxers'
import { getSession } from 'auth-astro/server'

// Límite de votación: 25 de julio de 2026 a las 20:00 CEST
const EVENT_START_DATE = new Date('2026-07-25T20:00:00+02:00')

async function getUserFromRequest(request: Request) {
  try {
    const session = await getSession(request)
    if (session?.user) {
      const email = session.user.email
      const name = session.user.name || 'Twitch User'
      const id = email || `twitch-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      return { id, name }
    }
  } catch (e) {
    console.warn('Error reading session:', e)
  }

  // Verificar cookie de usuario de prueba (Mock User)
  const cookieHeader = request.headers.get('cookie') || ''
  const mockUserMatch = cookieHeader.match(/mock_user=([^;]+)/)
  if (mockUserMatch) {
    const name = decodeURIComponent(mockUserMatch[1]).trim()
    if (name) {
      const id = `mock-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      return { id, name }
    }
  }

  return null
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const combatId = url.searchParams.get('combat_id')

    if (combatId) {
      const prediction = await getPredictionsByCombat(combatId)
      if (!prediction) {
        return new Response(
          JSON.stringify({ error: 'Combate no encontrado' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
      return new Response(JSON.stringify(prediction), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const allPredictions = await getAllPredictions()
    
    // Mapear al formato esperado por el cliente y API_PREDICTIONS.md
    const mappedPredictions = allPredictions.map((cp) => {
      const combat = COMBATS.find((c) => c.id === cp.combat_id)
      const f1_id = combat?.fighters[0] || cp.predictions[0]?.fighter_id || ''
      const f2_id = combat?.fighters[1] || cp.predictions[1]?.fighter_id || ''
      
      const f1_votes = cp.predictions.find(p => p.fighter_id === f1_id)
      const f2_votes = cp.predictions.find(p => p.fighter_id === f2_id)
      
      const f1_boxer = f1_id ? getBoxerById(f1_id) : null
      const f2_boxer = f2_id ? getBoxerById(f2_id) : null
      
      return {
        combat_id: cp.combat_id,
        fighter1: {
          id: f1_id,
          name: f1_boxer?.name || f1_id,
          votes: f1_votes?.votes || 0,
          percentage: f1_votes?.percentage || 0
        },
        fighter2: {
          id: f2_id,
          name: f2_boxer?.name || f2_id,
          votes: f2_votes?.votes || 0,
          percentage: f2_votes?.percentage || 0
        },
        total_votes: cp.total_votes
      }
    })

    return new Response(JSON.stringify({ predictions: mappedPredictions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=5',
      },
    })
  } catch (error) {
    console.error('Error en GET /api/predictions:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar si el evento ya ha comenzado
    if (Date.now() >= EVENT_START_DATE.getTime()) {
      return new Response(
        JSON.stringify({ error: 'Las votaciones están cerradas. El evento ya ha comenzado.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const user = await getUserFromRequest(request)
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Debe iniciar sesión para realizar un pronóstico.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const body = await request.json()
    const { combat_id, fighter_id } = body

    if (!combat_id || !fighter_id) {
      return new Response(
        JSON.stringify({ error: 'Los campos combat_id y fighter_id son obligatorios.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const result = await registerVote(combat_id, fighter_id, user.id)

    return new Response(
      JSON.stringify({
        message: 'Pronóstico registrado correctamente',
        combat_id: result.combat_id,
        fighter_id: result.fighter_id,
        votes: result.votes,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Error en POST /api/predictions:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
