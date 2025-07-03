import type { APIRoute } from 'astro'
import { getSession } from 'auth-astro/server'

import { turso } from '@/lib/database'
import { FIGHTERS } from '@/consts/fighters'
import { COMBATS } from '@/consts/combats'

interface Prediction {
  id: string
  combat_id: string
  fighter_id: string
  votes: number
  created_at: string
  updated_at: string
}

interface CombatPrediction {
  combat_id: string
  fighter1: {
    id: string
    name: string
    votes: number
    percentage: number
  }
  fighter2: {
    id: string
    name: string
    votes: number
    percentage: number
  }
  total_votes: number
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const combatId = url.searchParams.get('combat_id')

    // Si se proporciona un combat_id específico, devolver solo esa predicción
    if (combatId) {
      const result = await turso.execute({
        sql: `
          SELECT 
            p.id,
            p.combat_id,
            p.fighter_id,
            p.votes,
            p.created_at,
            p.updated_at
          FROM predictions p
          WHERE p.combat_id = ?
          ORDER BY p.votes DESC
        `,
        args: [combatId],
      })

      if (result.rows.length === 0) {
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

      // Calcular porcentajes para el combate específico
      const totalVotes = result.rows.reduce((sum, row) => sum + (row.votes as number), 0)
      const predictions = result.rows.map((row) => ({
        fighter_id: row.fighter_id as string,
        votes: row.votes as number,
        percentage: totalVotes > 0 ? Math.round(((row.votes as number) / totalVotes) * 100) : 0,
      }))

      return new Response(
        JSON.stringify({
          combat_id: combatId,
          predictions,
          total_votes: totalVotes,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Si no se proporciona combat_id, devolver todas las predicciones
    const result = await turso.execute({
      sql: `
        SELECT 
          p.id,
          p.combat_id,
          p.fighter_id,
          p.votes,
          p.created_at,
          p.updated_at
        FROM predictions p
        ORDER BY p.combat_id, p.votes DESC
      `,
    })

    // Agrupar predicciones por combate
    const combatPredictions: Record<string, CombatPrediction> = {}

    result.rows.forEach((row) => {
      const combatId = row.combat_id as string
      const fighterId = row.fighter_id as string
      const votes = row.votes as number

      if (!combatPredictions[combatId]) {
        combatPredictions[combatId] = {
          combat_id: combatId,
          fighter1: { id: '', name: '', votes: 0, percentage: 0 },
          fighter2: { id: '', name: '', votes: 0, percentage: 0 },
          total_votes: 0,
        }
      }

      // Obtener el nombre real del luchador
      const fighter = FIGHTERS.find((f) => f.id === fighterId)
      const fighterName = fighter?.name || fighterId

      // Asignar el primer luchador como fighter1 y el segundo como fighter2
      if (!combatPredictions[combatId].fighter1.id) {
        combatPredictions[combatId].fighter1 = {
          id: fighterId,
          name: fighterName,
          votes,
          percentage: 0,
        }
      } else if (!combatPredictions[combatId].fighter2.id) {
        combatPredictions[combatId].fighter2 = {
          id: fighterId,
          name: fighterName,
          votes,
          percentage: 0,
        }
      }

      combatPredictions[combatId].total_votes += votes
    })

    // Calcular porcentajes para cada combate
    Object.values(combatPredictions).forEach((combat) => {
      if (combat.total_votes > 0) {
        combat.fighter1.percentage = Math.round((combat.fighter1.votes / combat.total_votes) * 100)
        combat.fighter2.percentage = Math.round((combat.fighter2.votes / combat.total_votes) * 100)
      }
    })

    return new Response(
      JSON.stringify({
        predictions: Object.values(combatPredictions),
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

  if (!user) {
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

    // Verificar que el combate existe
    const combatExists = COMBATS.find((combat) => combat.id === combat_id)

    if (!combatExists) {
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

    // Verificar si ya existe una predicción para este combate y luchador
    const existingPrediction = await turso.execute({
      sql: 'SELECT id, votes FROM predictions WHERE combat_id = ? AND fighter_id = ?',
      args: [combat_id, fighter_id],
    })

    if (existingPrediction.rows.length > 0) {
      // Actualizar el voto existente
      const currentVotes = (existingPrediction.rows[0]?.votes as number) || 0
      const newVotes = currentVotes + 1

      await turso.execute({
        sql: 'UPDATE predictions SET votes = ?, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
        args: [newVotes, combat_id, fighter_id],
      })

      return new Response(
        JSON.stringify({
          message: 'Voto actualizado correctamente',
          combat_id,
          fighter_id,
          votes: newVotes,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    } else {
      // Crear una nueva predicción
      await turso.execute({
        sql: 'INSERT INTO predictions (combat_id, fighter_id, votes, created_at, updated_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        args: [combat_id, fighter_id],
      })

      return new Response(
        JSON.stringify({
          message: 'Voto registrado correctamente',
          combat_id,
          fighter_id,
          votes: 1,
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  } catch (error) {
    console.error('Error al registrar voto:', error)

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
