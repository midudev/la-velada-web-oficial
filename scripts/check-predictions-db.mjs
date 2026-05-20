import { createClient } from '@libsql/client'
import { COMBATS } from '../src/consts/combats.js'
import { getBoxerById } from '../src/lib/boxers.js'

// Configuración de la base de datos
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function checkPredictionsDatabase() {
  try {
    console.log('🔍 Verificando estado de la base de datos de predicciones...\n')

    // Verificar si las tablas existen
    console.log('📊 Verificando existencia de tablas...')

    try {
      const tablesResult = await turso.execute({
        sql: "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('predictions', 'user_votes')",
      })

      const existingTables = tablesResult.rows.map((row) => row.name)
      console.log(`✅ Tablas existentes: ${existingTables.join(', ')}`)

      if (!existingTables.includes('predictions')) {
        console.log('❌ Tabla predictions no existe')
        return
      }

      if (!existingTables.includes('user_votes')) {
        console.log('❌ Tabla user_votes no existe')
        return
      }
    } catch (error) {
      console.error('❌ Error al verificar tablas:', error.message)
      return
    }

    // Obtener estadísticas de predictions
    console.log('\n📈 Estadísticas de la tabla predictions:')

    const predictionsCount = await turso.execute({
      sql: 'SELECT COUNT(*) as total FROM predictions',
    })
    console.log(`  - Total de registros: ${predictionsCount.rows[0].total}`)

    const predictionsWithVotes = await turso.execute({
      sql: 'SELECT COUNT(*) as total FROM predictions WHERE votes > 0',
    })
    console.log(`  - Registros con votos: ${predictionsWithVotes.rows[0].total}`)

    const totalVotes = await turso.execute({
      sql: 'SELECT SUM(votes) as total FROM predictions',
    })
    console.log(`  - Total de votos: ${totalVotes.rows[0].total || 0}`)

    // Obtener estadísticas de user_votes
    console.log('\n👥 Estadísticas de la tabla user_votes:')

    const userVotesCount = await turso.execute({
      sql: 'SELECT COUNT(*) as total FROM user_votes',
    })
    console.log(`  - Total de votos de usuarios: ${userVotesCount.rows[0].total}`)

    const uniqueUsers = await turso.execute({
      sql: 'SELECT COUNT(DISTINCT user_id) as total FROM user_votes',
    })
    console.log(`  - Usuarios únicos que han votado: ${uniqueUsers.rows[0].total}`)

    // Mostrar predicciones por combate
    console.log('\n🥊 Predicciones por combate:')

    for (const combat of COMBATS) {
      console.log(`\n  ${combat.title} (${combat.id}):`)

      const combatPredictions = await turso.execute({
        sql: 'SELECT fighter_id, votes FROM predictions WHERE combat_id = ? ORDER BY votes DESC',
        args: [combat.id],
      })

      if (combatPredictions.rows.length === 0) {
        console.log('    ❌ No hay predicciones registradas')
        continue
      }

      let totalCombatVotes = 0
      for (const row of combatPredictions.rows) {
        const fighterId = row.fighter_id
        const votes = row.votes
        const fighter = getBoxerById(fighterId)

        totalCombatVotes += votes
        console.log(`    - ${fighter?.name || fighterId}: ${votes} votos`)
      }

      // Calcular porcentajes
      if (totalCombatVotes > 0) {
        console.log(`    📊 Total: ${totalCombatVotes} votos`)
        for (const row of combatPredictions.rows) {
          const fighterId = row.fighter_id
          const votes = row.votes
          const fighter = getBoxerById(fighterId)
          const percentage = Math.round((votes / totalCombatVotes) * 100)
          console.log(`      ${fighter?.name || fighterId}: ${percentage}%`)
        }
      }
    }

    // Mostrar los combates más votados
    console.log('\n🏆 Top 5 combates por total de votos:')
    const topCombats = await turso.execute({
      sql: `
        SELECT 
          combat_id,
          SUM(votes) as total_votes
        FROM predictions 
        GROUP BY combat_id 
        ORDER BY total_votes DESC 
        LIMIT 5
      `,
    })

    for (let i = 0; i < topCombats.rows.length; i++) {
      const row = topCombats.rows[i]
      const combatId = row.combat_id
      const totalVotes = row.total_votes
      const combat = COMBATS.find((c) => c.id === combatId)

      console.log(`  ${i + 1}. ${combat?.title || combatId}: ${totalVotes} votos`)
    }

    // Mostrar los luchadores más votados
    console.log('\n👑 Top 10 luchadores por votos:')
    const topFighters = await turso.execute({
      sql: `
        SELECT 
          fighter_id,
          SUM(votes) as total_votes
        FROM predictions 
        GROUP BY fighter_id 
        ORDER BY total_votes DESC 
        LIMIT 10
      `,
    })

    for (let i = 0; i < topFighters.rows.length; i++) {
      const row = topFighters.rows[i]
      const fighterId = row.fighter_id
      const totalVotes = row.total_votes
      const fighter = getBoxerById(fighterId)

      console.log(`  ${i + 1}. ${fighter?.name || fighterId}: ${totalVotes} votos`)
    }

    console.log('\n✅ Verificación completada!')
  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error)
    process.exit(1)
  }
}

// Ejecutar el script
checkPredictionsDatabase()
