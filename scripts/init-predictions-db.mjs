import {
  battles,
  ensurePredictionsSchema,
  ensurePredictionRowsForBattle,
  getBoxerName,
  getSeedChoice,
  recalculateBattleStatement,
  turso,
  upsertVoteStatement,
} from './predictions-shared.mjs'

const seedUserCount = Number(process.env.PREDICTION_SEED_USERS ?? 36)

async function initPredictionsDatabase() {
  console.log('Initializing predictions database...')

  await ensurePredictionsSchema()

  for (const battle of battles) {
    await ensurePredictionRowsForBattle(battle)
  }

  console.log(`Seeding ${seedUserCount} test users across ${battles.length} battles...`)

  for (const [battleIndex, battle] of battles.entries()) {
    const statements = []

    for (let userIndex = 0; userIndex < seedUserCount; userIndex++) {
      const userId = `seed-user-${String(userIndex + 1).padStart(3, '0')}`
      const fighterId = getSeedChoice(battle, battleIndex, userIndex)

      statements.push(upsertVoteStatement(battle.id, fighterId, userId))
    }

    statements.push(recalculateBattleStatement(battle.id))
    await turso.batch(statements)
  }

  const result = await turso.execute({
    sql: `
      SELECT combat_id, fighter_id, votes
      FROM predictions
      ORDER BY combat_id, fighter_id
    `,
  })

  console.log(`Prediction rows: ${result.rows.length}`)

  for (const battle of battles) {
    const battleRows = result.rows.filter((row) => row.combat_id === battle.id)
    const summary = battleRows
      .map((row) => `${getBoxerName(row.fighter_id)}: ${row.votes}`)
      .join(' | ')

    console.log(`${battle.number}. ${battle.title} -> ${summary}`)
  }

  console.log('Predictions database initialized.')
}

initPredictionsDatabase().catch((error) => {
  console.error('Error initializing predictions database:', error)
  process.exit(1)
})
