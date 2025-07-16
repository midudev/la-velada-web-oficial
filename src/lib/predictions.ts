import { turso } from '@/lib/database'
import { FIGHTERS } from '@/consts/fighters'
import { COMBATS } from '@/consts/combats'

// Caché en memoria con timestamp de 30 segundos
interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface MemoryCache {
  predictionsByCombat: Record<string, CacheEntry<PredictionResponse>>
  allPredictions: CacheEntry<CombatPrediction[]> | null
}

const CACHE_DURATION = 30 * 1000 // 30 segundos en milisegundos
let memoryCache: MemoryCache = {
  predictionsByCombat: {},
  allPredictions: null,
}

// Función auxiliar para verificar si la caché ha expirado
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION
}

// Función auxiliar para limpiar caché expirada
const cleanExpiredCache = () => {
  const now = Date.now()

  // Limpiar caché de predicciones por combate
  Object.keys(memoryCache.predictionsByCombat).forEach((key) => {
    if (!isCacheValid(memoryCache.predictionsByCombat[key].timestamp)) {
      delete memoryCache.predictionsByCombat[key]
    }
  })

  // Limpiar caché de todas las predicciones
  if (memoryCache.allPredictions && !isCacheValid(memoryCache.allPredictions.timestamp)) {
    memoryCache.allPredictions = null
  }
}

// Función auxiliar para invalidar caché después de un voto
const invalidateCache = (combatId?: string) => {
  if (combatId) {
    // Invalidar caché específica del combate
    delete memoryCache.predictionsByCombat[combatId]
  } else {
    // Invalidar toda la caché
    memoryCache.predictionsByCombat = {}
    memoryCache.allPredictions = null
  }
}

export interface Prediction {
  id: string
  combat_id: string
  fighter_id: string
  votes: number
  created_at: string
  updated_at: string
}

export interface CombatPrediction {
  combat_id: string
  predictions: Array<{
    fighter_id: string
    votes: number
    percentage: number
  }>
  total_votes: number
}

export interface PredictionVote {
  combat_id: string
  fighter_id: string
  votes: number
}

export interface PredictionResponse {
  combat_id: string
  predictions: Array<{
    fighter_id: string
    votes: number
    percentage: number
  }>
  total_votes: number
}

/**
 * Obtiene las predicciones para un combate específico
 */
export async function getPredictionsByCombat(combatId: string): Promise<PredictionResponse | null> {
  // Verificar si hay datos en caché válidos
  const cachedData = memoryCache.predictionsByCombat[combatId]
  if (cachedData && isCacheValid(cachedData.timestamp)) {
    console.log(`Usando caché en memoria para predicciones del combate ${combatId}`)
    return cachedData.data
  }

  try {
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
      return null
    }

    // Calcular porcentajes para el combate específico
    const totalVotes = result.rows.reduce((sum, row) => sum + (row.votes as number), 0)
    const predictions = result.rows.map((row) => ({
      fighter_id: row.fighter_id as string,
      votes: row.votes as number,
      percentage: totalVotes > 0 ? Math.round(((row.votes as number) / totalVotes) * 100) : 0,
    }))

    const predictionData = {
      combat_id: combatId,
      predictions,
      total_votes: totalVotes,
    }

    // Guardar en caché
    memoryCache.predictionsByCombat[combatId] = {
      data: predictionData,
      timestamp: Date.now(),
    }

    return predictionData
  } catch (error) {
    console.error('Error al obtener predicciones por combate:', error)
    throw new Error('Error al obtener predicciones por combate')
  }
}

/**
 * Obtiene todas las predicciones agrupadas por combate
 */
export async function getAllPredictions(): Promise<CombatPrediction[]> {
  // Verificar si hay datos en caché válidos
  if (memoryCache.allPredictions && isCacheValid(memoryCache.allPredictions.timestamp)) {
    console.log('Usando caché en memoria para todas las predicciones')
    return memoryCache.allPredictions.data
  }

  try {
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
          predictions: [
            {
              fighter_id: '',
              votes,
              percentage: 0,
            },
            {
              fighter_id: '',
              votes,
              percentage: 0,
            },
          ],
          total_votes: 0,
        }
      }

      // Asignar los luchadores
      const fighterIndex = combatPredictions[combatId].predictions.findIndex(
        (p) => p.fighter_id === '',
      )
      combatPredictions[combatId].predictions[fighterIndex] = {
        fighter_id: fighterId,
        votes,
        percentage: 0,
      }

      combatPredictions[combatId].total_votes += votes
    })

    // Calcular porcentajes para cada combate
    Object.values(combatPredictions).forEach((combat) => {
      combat.predictions.forEach((prediction) => {
        prediction.percentage = Math.round((prediction.votes / combat.total_votes) * 100)
      })
    })

    const allPredictionsData = Object.values(combatPredictions)

    // Guardar en caché
    memoryCache.allPredictions = {
      data: allPredictionsData,
      timestamp: Date.now(),
    }

    return allPredictionsData
  } catch (error) {
    console.error('Error al obtener todas las predicciones:', error)
    throw new Error('Error al obtener todas las predicciones')
  }
}

/**
 * Registra o actualiza un voto para un combate y luchador específicos
 */
export async function registerVote(
  combatId: string,
  fighterId: string,
  userId: string,
): Promise<PredictionVote> {
  try {
    // Verificar que el combate existe
    const combatExists = COMBATS.find((combat) => combat.id === combatId)
    if (!combatExists) {
      throw new Error('El combate especificado no existe')
    }

    // Verificar que el luchador existe
    const fighterExists = FIGHTERS.find((fighter) => fighter.id === fighterId)
    if (!fighterExists) {
      throw new Error('El luchador especificado no existe')
    }

    // Verificar si el usuario ya ha votado en este combate
    const existingUserVote = await turso.execute({
      sql: 'SELECT fighter_id FROM user_votes WHERE combat_id = ? AND user_id = ?',
      args: [combatId, userId],
    })

    if (existingUserVote.rows.length > 0) {
      const previousFighterId = existingUserVote.rows[0]?.fighter_id as string

      // Si vota por el mismo luchador, no hacer nada
      if (previousFighterId === fighterId) {
        // Obtener el conteo actual
        const currentPrediction = await turso.execute({
          sql: 'SELECT votes FROM predictions WHERE combat_id = ? AND fighter_id = ?',
          args: [combatId, fighterId],
        })

        const currentVotes = (currentPrediction.rows[0]?.votes as number) || 0

        return {
          combat_id: combatId,
          fighter_id: fighterId,
          votes: currentVotes,
        }
      }

      // Cambiar el voto: usar transacción para garantizar atomicidad
      await turso.batch([
        {
          sql: 'UPDATE predictions SET votes = votes - 1, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
          args: [combatId, previousFighterId],
        },
        {
          sql: 'UPDATE predictions SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
          args: [combatId, fighterId],
        },
        {
          sql: 'UPDATE user_votes SET fighter_id = ?, created_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND user_id = ?',
          args: [fighterId, combatId, userId],
        },
      ])

      // Obtener el nuevo conteo
      const newPrediction = await turso.execute({
        sql: 'SELECT votes FROM predictions WHERE combat_id = ? AND fighter_id = ?',
        args: [combatId, fighterId],
      })

      const newVotes = (newPrediction.rows[0]?.votes as number) || 0

      // Invalidar caché después del voto
      invalidateCache(combatId)

      return {
        combat_id: combatId,
        fighter_id: fighterId,
        votes: newVotes,
      }
    } else {
      // Primer voto del usuario en este combate: usar transacción
      await turso.batch([
        {
          sql: 'UPDATE predictions SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
          args: [combatId, fighterId],
        },
        {
          sql: 'INSERT INTO user_votes (combat_id, fighter_id, user_id, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
          args: [combatId, fighterId, userId],
        },
      ])

      // Obtener el nuevo conteo
      const newPrediction = await turso.execute({
        sql: 'SELECT votes FROM predictions WHERE combat_id = ? AND fighter_id = ?',
        args: [combatId, fighterId],
      })

      const newVotes = (newPrediction.rows[0]?.votes as number) || 0

      // Invalidar caché después del voto
      invalidateCache(combatId)

      return {
        combat_id: combatId,
        fighter_id: fighterId,
        votes: newVotes,
      }
    }
  } catch (error) {
    console.error('Error al registrar voto:', error)
    throw new Error('Error al registrar voto')
  }
}

/**
 * Obtiene las estadísticas de predicciones para un combate específico
 */
export async function getCombatStats(combatId: string): Promise<CombatPrediction | null> {
  try {
    const predictions = await getAllPredictions()
    return predictions.find((prediction) => prediction.combat_id === combatId) || null
  } catch (error) {
    console.error('Error al obtener estadísticas del combate:', error)
    throw new Error('Error al obtener estadísticas del combate')
  }
}

/**
 * Obtiene los votos de un usuario específico
 */
export async function getUserVotes(userId: string): Promise<
  Array<{
    combat_id: string
    fighter_id: string
    created_at: string
  }>
> {
  try {
    const result = await turso.execute({
      sql: `
        SELECT 
          uv.combat_id,
          uv.fighter_id,
          uv.created_at
        FROM user_votes uv
        WHERE uv.user_id = ?
        ORDER BY uv.created_at DESC
      `,
      args: [userId],
    })

    return result.rows.map((row) => ({
      combat_id: row.combat_id as string,
      fighter_id: row.fighter_id as string,
      created_at: row.created_at as string,
    }))
  } catch (error) {
    console.error('Error al obtener votos del usuario:', error)
    throw new Error('Error al obtener votos del usuario')
  }
}
