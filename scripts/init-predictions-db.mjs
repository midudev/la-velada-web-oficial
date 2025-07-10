import { createClient } from '@libsql/client/web'
import { COMBATS } from '../src/consts/combats.js'
import { FIGHTERS } from '../src/consts/fighters.js'

// Configuración de la base de datos
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function initPredictionsDatabase() {
  try {
    console.log('🚀 Inicializando base de datos de predicciones...')

    // Crear tabla predictions (ignora si ya existe)
    console.log('📊 Verificando tabla predictions...')
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

    // Crear tabla user_votes (ignora si ya existe)
    console.log('👥 Verificando tabla user_votes...')
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

    // Insertar registros iniciales para todos los combates
    console.log('🥊 Insertando registros iniciales para todos los combates...')

    for (const combat of COMBATS) {
      console.log(`  - Procesando combate: ${combat.title}`)

      for (const fighterId of combat.fighters) {
        // Verificar que el luchador existe en FIGHTERS
        const fighter = FIGHTERS.find((f) => f.id === fighterId)
        if (!fighter) {
          console.warn(`⚠️  Luchador no encontrado: ${fighterId}`)
          continue
        }

        try {
          // Insertar registro inicial con 1 voto
          await turso.execute({
            sql: `
              INSERT OR IGNORE INTO predictions 
              (combat_id, fighter_id, votes, created_at, updated_at) 
              VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `,
            args: [combat.id, fighterId],
          })

          // Generar user_id aleatorio
          const randomUserId = crypto.randomUUID()

          // Usar transacción para garantizar atomicidad
          await turso.batch([
            {
              sql: `
                INSERT OR IGNORE INTO user_votes 
                (combat_id, fighter_id, user_id, created_at) 
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
              `,
              args: [combat.id, fighterId, randomUserId],
            },
            {
              sql: `
                UPDATE predictions 
                SET votes = (
                  SELECT COUNT(*) 
                  FROM user_votes 
                  WHERE combat_id = ? AND fighter_id = ?
                ),
                updated_at = CURRENT_TIMESTAMP
                WHERE combat_id = ? AND fighter_id = ?
              `,
              args: [combat.id, fighterId, combat.id, fighterId],
            },
          ])

          console.log(`    ✅ ${fighter.name} (${fighterId}) - 1 voto - User: ${randomUserId}`)
        } catch (error) {
          console.error(`    ❌ Error al insertar ${fighterId}:`, error.message)
        }
      }
    }

    // Verificar que todos los registros se crearon correctamente
    console.log('\n🔍 Verificando registros creados...')
    const result = await turso.execute({
      sql: 'SELECT combat_id, fighter_id, votes FROM predictions ORDER BY combat_id, fighter_id',
    })

    console.log(`\n📈 Total de registros en predictions: ${result.rows.length}`)

    // Mostrar resumen por combate
    const combatSummary = {}
    for (const row of result.rows) {
      const combatId = row.combat_id
      const fighterId = row.fighter_id
      const votes = row.votes

      if (!combatSummary[combatId]) {
        combatSummary[combatId] = []
      }

      const fighter = FIGHTERS.find((f) => f.id === fighterId)
      combatSummary[combatId].push({
        fighter: fighter?.name || fighterId,
        votes,
      })
    }

    console.log('\n📋 Resumen por combate:')
    for (const [combatId, fighters] of Object.entries(combatSummary)) {
      const combat = COMBATS.find((c) => c.id === combatId)
      console.log(`\n  ${combat?.title || combatId}:`)
      for (const { fighter, votes } of fighters) {
        console.log(`    - ${fighter}: ${votes} votos`)
      }
    }

    console.log('\n✅ Base de datos de predicciones inicializada correctamente!')
    console.log('\n🎯 Combates disponibles:')
    COMBATS.forEach((combat) => {
      console.log(`  - ${combat.id}: ${combat.title}`)
    })
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error)
    process.exit(1)
  }
}

// Ejecutar el script
initPredictionsDatabase()
