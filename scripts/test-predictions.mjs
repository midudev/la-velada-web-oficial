import { createClient } from '@libsql/client/web'
import { COMBATS } from '../src/consts/combats.js'
import { FIGHTERS } from '../src/consts/fighters.js'

// Configuración de la base de datos
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Función para simular votos
async function simulateVotes() {
  try {
    console.log('🧪 Simulando votos de prueba...\n')

    // Usuarios de prueba
    const testUsers = [
      'user1@test.com',
      'user2@test.com',
      'user3@test.com',
      'user4@test.com',
      'user5@test.com',
    ]

    // Simular votos para diferentes combates
    const testVotes = [
      { combatId: '1-peereira-vs-rivaldios', fighterId: 'peereira', userId: 'user1@test.com' },
      { combatId: '1-peereira-vs-rivaldios', fighterId: 'rivaldios', userId: 'user2@test.com' },
      { combatId: '1-peereira-vs-rivaldios', fighterId: 'peereira', userId: 'user3@test.com' },
      { combatId: '2-perxitaa-vs-gaspi', fighterId: 'perxitaa', userId: 'user1@test.com' },
      { combatId: '2-perxitaa-vs-gaspi', fighterId: 'gaspi', userId: 'user2@test.com' },
      { combatId: '3-abby-vs-roro', fighterId: 'abby', userId: 'user1@test.com' },
      { combatId: '3-abby-vs-roro', fighterId: 'roro', userId: 'user4@test.com' },
      { combatId: '7-grefg-vs-westcol', fighterId: 'grefg', userId: 'user1@test.com' },
      { combatId: '7-grefg-vs-westcol', fighterId: 'westcol', userId: 'user5@test.com' },
      { combatId: '7-grefg-vs-westcol', fighterId: 'grefg', userId: 'user2@test.com' },
    ]

    console.log('📝 Registrando votos de prueba...')

    for (const vote of testVotes) {
      try {
        // Verificar que el combate existe
        const combatExists = COMBATS.find((combat) => combat.id === vote.combatId)
        if (!combatExists) {
          console.log(`❌ Combate no encontrado: ${vote.combatId}`)
          continue
        }

        // Verificar que el luchador existe
        const fighterExists = FIGHTERS.find((fighter) => fighter.id === vote.fighterId)
        if (!fighterExists) {
          console.log(`❌ Luchador no encontrado: ${vote.fighterId}`)
          continue
        }

        // Verificar si el usuario ya ha votado en este combate
        const existingUserVote = await turso.execute({
          sql: 'SELECT fighter_id FROM user_votes WHERE combat_id = ? AND user_id = ?',
          args: [vote.combatId, vote.userId],
        })

        if (existingUserVote.rows.length > 0) {
          const previousFighterId = existingUserVote.rows[0]?.fighter_id

          // Si vota por el mismo luchador, no hacer nada
          if (previousFighterId === vote.fighterId) {
            console.log(
              `  ⚠️  ${vote.userId} ya votó por ${fighterExists.name} en ${combatExists.title}`,
            )
            continue
          }

          // Cambiar el voto: decrementar el luchador anterior e incrementar el nuevo
          await turso.execute({
            sql: 'UPDATE predictions SET votes = votes - 1, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
            args: [vote.combatId, previousFighterId],
          })

          await turso.execute({
            sql: 'UPDATE predictions SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
            args: [vote.combatId, vote.fighterId],
          })

          // Actualizar el voto del usuario
          await turso.execute({
            sql: 'UPDATE user_votes SET fighter_id = ?, created_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND user_id = ?',
            args: [vote.fighterId, vote.combatId, vote.userId],
          })

          console.log(
            `  🔄 ${vote.userId} cambió su voto a ${fighterExists.name} en ${combatExists.title}`,
          )
        } else {
          // Primer voto del usuario en este combate
          // Incrementar el contador del luchador
          await turso.execute({
            sql: 'UPDATE predictions SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP WHERE combat_id = ? AND fighter_id = ?',
            args: [vote.combatId, vote.fighterId],
          })

          // Registrar el voto del usuario
          await turso.execute({
            sql: 'INSERT INTO user_votes (combat_id, fighter_id, user_id, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            args: [vote.combatId, vote.fighterId, vote.userId],
          })

          console.log(`  ✅ ${vote.userId} votó por ${fighterExists.name} en ${combatExists.title}`)
        }
      } catch (error) {
        console.error(`  ❌ Error al procesar voto de ${vote.userId}:`, error.message)
      }
    }

    console.log('\n📊 Resultados de la simulación:')

    // Mostrar estadísticas finales
    for (const combat of COMBATS) {
      console.log(`\n  ${combat.title}:`)

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
        const fighter = FIGHTERS.find((f) => f.id === fighterId)

        totalCombatVotes += votes
        console.log(`    - ${fighter?.name || fighterId}: ${votes} votos`)
      }

      // Calcular porcentajes
      if (totalCombatVotes > 0) {
        console.log(`    📊 Total: ${totalCombatVotes} votos`)
        for (const row of combatPredictions.rows) {
          const fighterId = row.fighter_id
          const votes = row.votes
          const fighter = FIGHTERS.find((f) => f.id === fighterId)
          const percentage = Math.round((votes / totalCombatVotes) * 100)
          console.log(`      ${fighter?.name || fighterId}: ${percentage}%`)
        }
      }
    }

    // Mostrar votos por usuario
    console.log('\n👥 Votos por usuario:')
    for (const userId of testUsers) {
      const userVotes = await turso.execute({
        sql: 'SELECT combat_id, fighter_id FROM user_votes WHERE user_id = ? ORDER BY created_at',
        args: [userId],
      })

      if (userVotes.rows.length > 0) {
        console.log(`\n  ${userId}:`)
        for (const row of userVotes.rows) {
          const combatId = row.combat_id
          const fighterId = row.fighter_id
          const combat = COMBATS.find((c) => c.id === combatId)
          const fighter = FIGHTERS.find((f) => f.id === fighterId)

          console.log(`    - ${combat?.title || combatId}: ${fighter?.name || fighterId}`)
        }
      } else {
        console.log(`\n  ${userId}: No ha votado`)
      }
    }

    console.log('\n✅ Simulación completada!')
  } catch (error) {
    console.error('❌ Error en la simulación:', error)
    process.exit(1)
  }
}

// Ejecutar la simulación
simulateVotes()
