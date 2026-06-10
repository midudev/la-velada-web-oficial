import {
  battles,
  ensurePredictionsSchema,
  ensurePredictionRowsForBattle,
  getBoxerName,
  recalculateBattleStatement,
  turso,
  upsertVoteStatement,
} from './predictions-shared.mjs'

const testUserId = process.env.PREDICTION_TEST_USER_ID ?? 'manual-test-user'

async function testPredictions() {
  console.log(`Testing predictions with user_id=${testUserId}...`)

  await ensurePredictionsSchema()

  for (const battle of battles.slice(0, 3)) {
    await ensurePredictionRowsForBattle(battle)

    const firstChoice = battle.boxerIds[0]
    const secondChoice = battle.boxerIds[1]

    await turso.batch([
      upsertVoteStatement(battle.id, firstChoice, testUserId),
      recalculateBattleStatement(battle.id),
    ])

    await turso.batch([
      upsertVoteStatement(battle.id, secondChoice, testUserId),
      recalculateBattleStatement(battle.id),
    ])

    const result = await turso.execute({
      sql: `
        SELECT fighter_id, votes
        FROM predictions
        WHERE combat_id = ?
        ORDER BY fighter_id
      `,
      args: [battle.id],
    })

    const activeVote = await turso.execute({
      sql: `
        SELECT fighter_id
        FROM user_votes
        WHERE combat_id = ? AND user_id = ?
      `,
      args: [battle.id, testUserId],
    })

    const summary = result.rows
      .map((row) => `${getBoxerName(row.fighter_id)}: ${row.votes}`)
      .join(' | ')

    console.log(`${battle.title} -> active=${activeVote.rows[0]?.fighter_id} | ${summary}`)
  }

  console.log('Prediction upsert test completed.')
}

testPredictions().catch((error) => {
  console.error('Error testing predictions:', error)
  process.exit(1)
})
