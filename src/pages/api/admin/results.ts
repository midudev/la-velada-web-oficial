export const prerender = false

import type { APIRoute } from 'astro'
import { setCombatResult } from '@/lib/predictions'

const ADMIN_SECRET = process.env.ADMIN_SECRET || import.meta.env.ADMIN_SECRET || 'velada-admin-secret'

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()

    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      // Ignorar si el cuerpo no es JSON
    }

    const { combat_id, winner_id, admin_secret } = body
    const providedSecret = token || admin_secret

    if (!providedSecret || providedSecret !== ADMIN_SECRET) {
      return new Response(
        JSON.stringify({ error: 'Acceso no autorizado. Token de administración incorrecto.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!combat_id || winner_id === undefined) {
      return new Response(
        JSON.stringify({ error: 'Los campos combat_id y winner_id son obligatorios.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    await setCombatResult(combat_id, winner_id)

    return new Response(
      JSON.stringify({
        message: 'Resultado guardado correctamente.',
        combat_id,
        winner_id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Error en POST /api/admin/results:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
