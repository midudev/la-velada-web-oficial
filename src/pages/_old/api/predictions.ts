import type { APIRoute } from 'astro'
import { getSession } from 'auth-astro/server'
import {
  getPredictionsByCombat,
  getAllPredictions,
  registerVote,
  getUserVotes,
} from '@/lib/predictions'

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const combatId = url.searchParams.get('combat_id')
    const userPredictions = url.searchParams.get('user_predictions')

    // Si se solicita las predicciones del usuario autenticado
    if (userPredictions === 'true') {
      const session = await getSession(request)
      const user = session?.user

      if (!user || !user.email) {
        return new Response(
          JSON.stringify({
            error: 'No se ha iniciado sesión',
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // Obtener las predicciones del usuario usando la función del lib
      const userPredictionsData = await getUserVotes(user.email)

      return new Response(
        JSON.stringify({
          predictions: userPredictionsData,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Si se proporciona un combat_id específico, devolver solo esa predicción
    if (combatId) {
      const predictions = await getPredictionsByCombat(combatId)

      if (!predictions) {
        return new Response(
          JSON.stringify({
            error: 'No se encontraron predicciones para este combate',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(JSON.stringify(predictions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Si no se proporciona combat_id, devolver todas las predicciones
    const allPredictions = await getAllPredictions()

    return new Response(
      JSON.stringify({
        predictions: allPredictions,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error al obtener predicciones:', error)

    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor al obtener las predicciones',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request)
  const user = session?.user

  if (!user || !user.email) {
    return new Response(
      JSON.stringify({
        error: 'No se ha iniciado sesión',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  try {
    const body = await request.json()
    const { combat_id, fighter_id } = body

    // Validar que se proporcionen los campos requeridos
    if (!combat_id || !fighter_id) {
      return new Response(
        JSON.stringify({
          error: 'Se requieren combat_id y fighter_id',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Registrar el voto usando el servicio
    const voteResult = await registerVote(combat_id, fighter_id, user.email)

    return new Response(
      JSON.stringify({
        message: 'Voto registrado correctamente',
        ...voteResult,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error al registrar voto:', error)

    // Manejar errores específicos del servicio
    if (error instanceof Error) {
      if (error.message === 'El combate especificado no existe') {
        return new Response(
          JSON.stringify({
            error: 'El combate especificado no existe',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    }

    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor al registrar el voto',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
