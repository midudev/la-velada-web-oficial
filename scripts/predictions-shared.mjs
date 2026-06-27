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

  // Índice de cobertura para el recálculo de votos: permite resolver
  // `COUNT(*) WHERE combat_id = ? AND fighter_id = ?` directamente sobre el
  // índice, sin escanear la tabla (ver recalculateBattleStatement).
  await turso.execute(`
    CREATE INDEX IF NOT EXISTS user_votes_combat_fighter_idx
      ON user_votes(combat_id, fighter_id)
  `)

  await ensurePredictionTriggers()
}

// Triggers que mantienen el contador `predictions.votes` de forma incremental
// (+1/-1) a partir de los cambios en `user_votes`. Sustituyen al recálculo con
// `COUNT(*)` en cada voto, que era O(N) en lecturas por voto y disparaba el
// total de "rows read" de Turso de forma cuadrática. Cada voto pasa a tocar
// solo la fila de `predictions` afectada, resuelta por `UNIQUE(combat_id,
// fighter_id)`. Las sentencias deben mantenerse idénticas a las de migrate.mjs.
export async function ensurePredictionTriggers() {
  await turso.execute(`
    CREATE TRIGGER IF NOT EXISTS user_votes_after_insert
    AFTER INSERT ON user_votes
    BEGIN
      UPDATE predictions
      SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP
      WHERE combat_id = NEW.combat_id AND fighter_id = NEW.fighter_id;
    END
  `)

  // Cambiar el voto (mismo usuario, otro luchador) resta al anterior y suma al
  // nuevo. El guard `WHEN` evita tocar el contador cuando se revota lo mismo
  // (el upsert siempre reescribe fighter_id/created_at y dispararía el trigger).
  await turso.execute(`
    CREATE TRIGGER IF NOT EXISTS user_votes_after_update
    AFTER UPDATE OF fighter_id ON user_votes
    WHEN OLD.fighter_id <> NEW.fighter_id
    BEGIN
      UPDATE predictions
      SET votes = votes - 1, updated_at = CURRENT_TIMESTAMP
      WHERE combat_id = OLD.combat_id AND fighter_id = OLD.fighter_id;
      UPDATE predictions
      SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP
      WHERE combat_id = NEW.combat_id AND fighter_id = NEW.fighter_id;
    END
  `)

  // Mantiene el contador correcto si algún día se borran votos (p. ej. limpieza
  // de inactivos documentada en DATABASE_PREDICTIONS.md).
  await turso.execute(`
    CREATE TRIGGER IF NOT EXISTS user_votes_after_delete
    AFTER DELETE ON user_votes
    BEGIN
      UPDATE predictions
      SET votes = votes - 1, updated_at = CURRENT_TIMESTAMP
      WHERE combat_id = OLD.combat_id AND fighter_id = OLD.fighter_id;
    END
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
