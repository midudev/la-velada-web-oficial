import { battles, getBoxerName, turso } from './predictions-shared.mjs'

async function checkPredictionsDatabase() {
  console.log('Checking predictions database...')

  const tablesResult = await turso.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('predictions', 'user_votes')",
  })
  const existingTables = new Set(tablesResult.rows.map((row) => row.name))

  for (const tableName of ['predictions', 'user_votes']) {
    console.log(`${tableName}: ${existingTables.has(tableName) ? 'exists' : 'missing'}`)
  }

  if (!existingTables.has('predictions') || !existingTables.has('user_votes')) {
    console.log('Run pnpm db:init to create the missing tables.')
    return
  }

  const predictionRows = await turso.execute({
    sql: 'SELECT COUNT(*) AS total FROM predictions',
  })
  const userVoteRows = await turso.execute({
    sql: 'SELECT COUNT(*) AS total FROM user_votes',
  })
  const uniqueUsers = await turso.execute({
    sql: 'SELECT COUNT(DISTINCT user_id) AS total FROM user_votes',
  })

  console.log(`prediction rows: ${predictionRows.rows[0].total}`)
  console.log(`user votes: ${userVoteRows.rows[0].total}`)
  console.log(`unique users: ${uniqueUsers.rows[0].total}`)

  const mismatches = await turso.execute({
    sql: `
      SELECT p.combat_id, p.fighter_id, p.votes, COUNT(uv.id) AS user_vote_count
      FROM predictions p
      LEFT JOIN user_votes uv
        ON uv.combat_id = p.combat_id
        AND uv.fighter_id = p.fighter_id
      GROUP BY p.combat_id, p.fighter_id, p.votes
      HAVING p.votes != COUNT(uv.id)
      ORDER BY p.combat_id, p.fighter_id
    `,
  })

  console.log(`counter mismatches: ${mismatches.rows.length}`)
  for (const row of mismatches.rows) {
    console.log(
      `- ${row.combat_id}/${row.fighter_id}: predictions=${row.votes}, user_votes=${row.user_vote_count}`,
    )
  }

  for (const battle of battles) {
    const result = await turso.execute({
      sql: `
        SELECT fighter_id, votes
        FROM predictions
        WHERE combat_id = ?
        ORDER BY fighter_id
      `,
      args: [battle.id],
    })

    const totalVotes = result.rows.reduce((total, row) => total + Number(row.votes ?? 0), 0)
    const summary = battle.boxerIds
      .map((boxerId) => {
        const row = result.rows.find((prediction) => prediction.fighter_id === boxerId)
        const votes = Number(row?.votes ?? 0)
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0

        return `${getBoxerName(boxerId)}: ${votes} (${percentage}%)`
      })
      .join(' | ')

    console.log(`${battle.number}. ${battle.title} -> ${summary}`)
  }
}

checkPredictionsDatabase().catch((error) => {
  console.error('Error checking predictions database:', error)
  process.exit(1)
})
