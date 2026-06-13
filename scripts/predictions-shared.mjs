import { createClient } from '@libsql/client'
import { battlePairs } from '../src/consts/battle-pairs.ts'
import { BOXERS_BY_ID } from '../src/consts/boxers.ts'

process.loadEnvFile?.('.env')

const requiredEnv = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN']
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (missingEnv.length > 0) {
  throw new Error(`Missing required env vars: ${missingEnv.join(', ')}`)
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const battles = battlePairs.map(([boxerAId, boxerBId], index) => {
  const boxerA = BOXERS_BY_ID[boxerAId]
  const boxerB = BOXERS_BY_ID[boxerBId]

  if (!boxerA || !boxerB) {
    throw new Error(`Invalid battle pair: ${boxerAId} vs ${boxerBId}`)
  }

  return {
    id: `${boxerAId}-vs-${boxerBId}`,
    number: index + 1,
    boxerIds: [boxerAId, boxerBId],
    title: `${boxerA.name} vs ${boxerB.name}`,
  }
})

export function getBoxerName(boxerId) {
  return BOXERS_BY_ID[boxerId]?.name ?? boxerId
}

export async function ensurePredictionsSchema() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      combat_id TEXT NOT NULL,
      fighter_id TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(combat_id, fighter_id)
    )
  `)

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS user_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      combat_id TEXT NOT NULL,
      fighter_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(combat_id, user_id)
    )
  `)
}

export function predictionRowStatement(combatId, fighterId) {
  return {
    sql: `
      INSERT OR IGNORE INTO predictions
        (combat_id, fighter_id, votes, created_at, updated_at)
      VALUES (?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [combatId, fighterId],
  }
}

export function upsertVoteStatement(combatId, fighterId, userId) {
  return {
    sql: `
      INSERT INTO user_votes (combat_id, fighter_id, user_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(combat_id, user_id)
      DO UPDATE SET
        fighter_id = excluded.fighter_id,
        created_at = CURRENT_TIMESTAMP
    `,
    args: [combatId, fighterId, userId],
  }
}

export function recalculateBattleStatement(combatId) {
  return {
    sql: `
      UPDATE predictions
      SET
        votes = (
          SELECT COUNT(*)
          FROM user_votes
          WHERE user_votes.combat_id = predictions.combat_id
            AND user_votes.fighter_id = predictions.fighter_id
        ),
        updated_at = CURRENT_TIMESTAMP
      WHERE combat_id = ?
    `,
    args: [combatId],
  }
}

export async function ensurePredictionRowsForBattle(battle) {
  await turso.batch(battle.boxerIds.map((boxerId) => predictionRowStatement(battle.id, boxerId)))
}

export function getSeedChoice(battle, battleIndex, userIndex) {
  const skew = (battleIndex * 7 + userIndex * 5) % 11
  const selectedIndex = skew < 5 ? 0 : 1

  return battle.boxerIds[selectedIndex]
}
