import { battles, battlesById, type Battle } from '@/consts/battles'
import { BOXERS_BY_ID } from '@/consts/boxers'
import { turso } from '@/lib/database'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface MemoryCache {
  predictionsByCombat: Record<string, CacheEntry<PredictionResponse>>
  allPredictions: CacheEntry<CombatPrediction[]> | null
}

interface PredictionRow {
  combat_id: string
  fighter_id: string
  votes: number
}

const CACHE_DURATION = 30 * 1000

let memoryCache: MemoryCache = {
  predictionsByCombat: {},
  allPredictions: null,
}

export class PredictionDataError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'PredictionDataError'
    this.status = status
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

export interface UserPredictionVote {
  combat_id: string
  fighter_id: string
  created_at: string
}

const isCacheValid = (timestamp: number): boolean => Date.now() - timestamp < CACHE_DURATION

const invalidateCache = (combatId?: string) => {
  if (combatId) {
    delete memoryCache.predictionsByCombat[combatId]
  } else {
    memoryCache.predictionsByCombat = {}
  }

  memoryCache.allPredictions = null
}

function assertValidPredictionTarget(combatId: string, fighterId: string) {
  const battle = battlesById[combatId]
  if (!battle) {
    throw new PredictionDataError('El combate especificado no existe', 404)
  }

  if (!BOXERS_BY_ID[fighterId]) {
    throw new PredictionDataError('El boxeador especificado no existe', 404)
  }

  if (!battle.boxerIds.includes(fighterId)) {
    throw new PredictionDataError('El boxeador no pertenece a este combate', 400)
  }

  return battle
}

function createPredictionResponse(
  combatId: string,
  rows: PredictionRow[],
): PredictionResponse | null {
  const battle = battlesById[combatId]
  if (!battle) return null

  const votesByFighter = new Map(rows.map((row) => [row.fighter_id, row.votes]))
  const totalVotes = battle.boxerIds.reduce(
    (total, fighterId) => total + (votesByFighter.get(fighterId) ?? 0),
    0,
  )

  return {
    combat_id: combatId,
    predictions: battle.boxerIds.map((fighterId) => {
      const votes = votesByFighter.get(fighterId) ?? 0

      return {
        fighter_id: fighterId,
        votes,
        percentage: totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(1)) : 0,
      }
    }),
    total_votes: totalVotes,
  }
}

// Sentencias para garantizar que existen las filas de `predictions` del combate
// (no-op tras la primera vez). Se devuelven como sentencias para poder meterlas
// en la misma transacción que el voto y ahorrar un round-trip a Turso.
function ensurePredictionRowsStatements(battle: Battle) {
  return battle.boxerIds.map((fighterId) => ({
    sql: `
      INSERT OR IGNORE INTO predictions
        (combat_id, fighter_id, votes, created_at, updated_at)
      VALUES (?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [battle.id, fighterId],
  }))
}

/**
 * Obtiene las predicciones para un combate específico.
 */
export async function getPredictionsByCombat(combatId: string): Promise<PredictionResponse | null> {
  const cachedData = memoryCache.predictionsByCombat[combatId]
  if (cachedData && isCacheValid(cachedData.timestamp)) {
    return cachedData.data
  }

  try {
    if (!battlesById[combatId]) return null

    const result = await turso.execute({
      sql: `
        SELECT combat_id, fighter_id, votes
        FROM predictions
        WHERE combat_id = ?
        ORDER BY fighter_id
      `,
      args: [combatId],
    })

    const predictionData = createPredictionResponse(
      combatId,
      result.rows.map((row) => ({
        combat_id: row.combat_id as string,
        fighter_id: row.fighter_id as string,
        votes: Number(row.votes ?? 0),
      })),
    )

    if (!predictionData) return null

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
 * Obtiene todas las predicciones agrupadas por combate.
 */
export async function getAllPredictions(): Promise<CombatPrediction[]> {
  if (memoryCache.allPredictions && isCacheValid(memoryCache.allPredictions.timestamp)) {
    return memoryCache.allPredictions.data
  }

  try {
    const result = await turso.execute({
      sql: `
        SELECT combat_id, fighter_id, votes
        FROM predictions
        ORDER BY combat_id, fighter_id
      `,
    })

    const rowsByCombat = new Map<string, PredictionRow[]>()
    result.rows.forEach((row) => {
      const combatId = row.combat_id as string
      const combatRows = rowsByCombat.get(combatId) ?? []

      combatRows.push({
        combat_id: combatId,
        fighter_id: row.fighter_id as string,
        votes: Number(row.votes ?? 0),
      })

      rowsByCombat.set(combatId, combatRows)
    })

    const allPredictionsData = battles
      .map((battle) => createPredictionResponse(battle.id, rowsByCombat.get(battle.id) ?? []))
      .filter((prediction): prediction is PredictionResponse => prediction !== null)

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
 * Registra o actualiza el voto activo de un usuario para un combate.
 */
export async function registerVote(
  combatId: string,
  fighterId: string,
  userId: string,
): Promise<{ vote: PredictionVote; prediction: PredictionResponse | null }> {
  try {
    const battle = assertValidPredictionTarget(combatId, fighterId)

    // Una sola transacción (un round-trip): garantizamos las filas del combate y
    // registramos el voto. Los totales de `predictions` los mantienen ahora los
    // triggers `user_votes_after_*` de forma incremental (+1/-1), así que ya no
    // recontamos todos los votos del combate en cada voto (lo que disparaba las
    // "rows read" de Turso de forma cuadrática).
    await turso.batch([
      ...ensurePredictionRowsStatements(battle),
      {
        sql: `
          INSERT INTO user_votes (combat_id, fighter_id, user_id, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(combat_id, user_id)
          DO UPDATE SET
            fighter_id = excluded.fighter_id,
            created_at = CURRENT_TIMESTAMP
        `,
        args: [combatId, fighterId, userId],
      },
    ])
    invalidateCache(combatId)

    const prediction = await getPredictionsByCombat(combatId)
    const fighterPrediction = prediction?.predictions.find(
      (entry) => entry.fighter_id === fighterId,
    )

    return {
      vote: {
        combat_id: combatId,
        fighter_id: fighterId,
        votes: fighterPrediction?.votes ?? 0,
      },
      prediction,
    }
  } catch (error) {
    if (error instanceof PredictionDataError) throw error

    console.error('Error al registrar voto:', error)
    throw new Error('Error al registrar voto')
  }
}

/**
 * Obtiene las estadísticas de predicciones para un combate específico.
 */
export async function getCombatStats(combatId: string): Promise<CombatPrediction | null> {
  return getPredictionsByCombat(combatId)
}

/**
 * Obtiene los votos de un usuario específico.
 */
export async function getUserVotes(userId: string): Promise<UserPredictionVote[]> {
  try {
    const result = await turso.execute({
      sql: `
        SELECT combat_id, fighter_id, created_at
        FROM user_votes
        WHERE user_id = ?
        ORDER BY created_at DESC
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
