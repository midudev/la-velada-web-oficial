import {
  battles,
  ensurePredictionRowsForBattle,
  ensurePredictionsSchema,
  getBoxerName,
  recalculateBattleStatement,
  turso,
} from './predictions-shared.mjs'

// Recalcula `predictions.votes` desde `user_votes` una sola vez por combate.
// A partir de aquí, los triggers `user_votes_after_*` mantienen el contador de
// forma incremental, así que esto NO debe ejecutarse por voto: úsalo solo tras
// desplegar los triggers o como corrección puntual si detectas desviaciones
// (pnpm db:check lista los mismatches).
async function recountPredictions() {
  console.log('Recounting predictions from user_votes...')

  await ensurePredictionsSchema()

  for (const battle of battles) {
    await ensurePredictionRowsForBattle(battle)
    await turso.execute(recalculateBattleStatement(battle.id))

    const result = await turso.execute({
      sql: `
        SELECT fighter_id, votes
        FROM predictions
        WHERE combat_id = ?
        ORDER BY fighter_id
      `,
      args: [battle.id],
    })

    const summary = result.rows
      .map((row) => `${getBoxerName(row.fighter_id)}: ${row.votes}`)
      .join(' | ')

    console.log(`${battle.number}. ${battle.title} -> ${summary}`)
  }

  console.log('Recount completed.')
}

recountPredictions().catch((error) => {
  console.error('Error recounting predictions:', error)
  process.exit(1)
})
