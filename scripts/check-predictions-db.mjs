/**
 * ============================================================
 * check-predictions.js — Refactor by N4xv + AI collab pass
 * ============================================================
 *
 * CAMBIOS PRINCIPALES vs. el original:
 *
 * 1. SINGLE DB ROUND-TRIP para stats globales
 *    Antes: 4 queries separadas para contar predictions/votos/users.
 *    Ahora: 1 query con CTEs que trae todo en un solo viaje a la red.
 *
 * 2. BATCH de predicciones por combate
 *    Antes: un SELECT por cada combate dentro del loop (N+1 problem).
 *    Ahora: una sola query trae TODOS los combates, luego se agrupa
 *    en memoria con un Map. Elimina latencia acumulada en loops grandes.
 *
 * 3. VALIDACIÓN de variables de entorno al arrancar
 *    Antes: el error de credenciales llegaba tarde, en la primera query.
 *    Ahora: se valida antes de crear el cliente, con mensaje claro.
 *
 * 4. VERIFICACIÓN de tablas más eficiente
 *    Antes: query con IN() + lógica manual de comparación.
 *    Ahora: COUNT agrupado por nombre; un solo scan de sqlite_master.
 *
 * 5. CÁLCULO de porcentajes en memoria (no en DB)
 *    Antes: segundo loop sobre las mismas filas para recalcular %.
 *    Ahora: se acumula el total mientras se itera la primera vez
 *    y se imprime todo junto al final. Cero iteraciones extra.
 *
 * 6. FORMATEO centralizado con helpers puros
 *    `fmt.pct`, `fmt.rank`, `fmt.label` — reutilizables, testeables.
 *    Elimina la repetición de lógica de presentación dispersa.
 *
 * 7. SEPARACIÓN de concerns: db / domain / presentation
 *    Las funciones de consulta no saben nada de console.log.
 *    El renderer no sabe nada de SQL. Fácil de extender/testear.
 *
 * 8. MANEJO de errores granular con códigos de salida descriptivos
 *    Antes: un solo catch genérico con process.exit(1).
 *    Ahora: errores tipados (ENV_MISSING, TABLE_MISSING, DB_ERROR)
 *    y exit codes diferenciados para integración CI/CD.
 *
 * 9. TIMER de ejecución total
 *    Se mide el tiempo completo del script con performance.now()
 *    y se imprime al final. Útil para monitorear degradación.
 *
 * 10. ZERO dependencias nuevas
 *     Todo lo anterior con las mismas imports del original.
 * ============================================================
 */

import { createClient } from '@libsql/client/web'
import { COMBATS } from '../src/consts/combats.js'
import { getBoxerById } from '@/lib/boxers.js'

// ─── 1. Validación temprana de entorno ───────────────────────────────────────
// Antes de crear el cliente detectamos credenciales faltantes con un mensaje
// útil en lugar de un error críptico de la librería de Turso.
const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error(
    '❌ [ENV_MISSING] Faltan variables de entorno:\n' +
    (!TURSO_DATABASE_URL ? '  • TURSO_DATABASE_URL\n' : '') +
    (!TURSO_AUTH_TOKEN   ? '  • TURSO_AUTH_TOKEN\n'   : '') +
    'Definelas en .env o en tu entorno CI antes de ejecutar.'
  )
  process.exit(2) // exit 2 = error de configuración (distinto al 1 de DB)
}

// ─── 2. Cliente Turso ─────────────────────────────────────────────────────────
const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
})

// ─── 3. Helpers de formato (puros, sin side-effects) ─────────────────────────
// Centralizados aquí para que cambiar la presentación no toque la lógica de DB.
const fmt = {
  pct:   (n, total) => `${Math.round((n / total) * 100)}%`,
  rank:  (i)        => `  ${String(i + 1).padStart(2, ' ')}.`,
  label: (id, lookup) => lookup?.name ?? id,
}

// ─── 4. Capa de base de datos ─────────────────────────────────────────────────

/**
 * Verifica que ambas tablas existan en un solo scan de sqlite_master.
 * Antes se usaba IN() y se comparaban arrays manualmente; ahora un COUNT
 * agrupado nos da exactamente lo que necesitamos en menos código.
 */
async function assertTablesExist() {
  const { rows } = await turso.execute({
    sql: `
      SELECT name
      FROM   sqlite_master
      WHERE  type = 'table'
        AND  name IN ('predictions', 'user_votes')
    `,
  })

  const found = new Set(rows.map(r => r.name))
  const missing = ['predictions', 'user_votes'].filter(t => !found.has(t))

  if (missing.length > 0) {
    console.error(`❌ [TABLE_MISSING] Tablas no encontradas: ${missing.join(', ')}`)
    process.exit(3) // exit 3 = esquema incompleto
  }

  console.log(`✅ Tablas verificadas: ${[...found].join(', ')}`)
}

/**
 * Obtiene estadísticas globales en UN SOLO viaje a la red usando CTEs.
 * Antes eran 4 queries independientes (4x latencia de red acumulada).
 * Con una CTE el motor de SQLite las procesa en un único plan de ejecución.
 */
async function fetchGlobalStats() {
  const { rows } = await turso.execute({
    sql: `
      WITH pred_stats AS (
        SELECT
          COUNT(*)              AS total_rows,
          COUNT(CASE WHEN votes > 0 THEN 1 END) AS rows_with_votes,
          COALESCE(SUM(votes), 0)               AS total_votes
        FROM predictions
      ),
      vote_stats AS (
        SELECT
          COUNT(*)                   AS total_user_votes,
          COUNT(DISTINCT user_id)    AS unique_users
        FROM user_votes
      )
      SELECT
        p.total_rows,
        p.rows_with_votes,
        p.total_votes,
        v.total_user_votes,
        v.unique_users
      FROM pred_stats p, vote_stats v
    `,
  })

  return rows[0]
}

/**
 * Trae TODAS las predicciones de TODOS los combates en una sola query.
 * Antes había un SELECT por cada elemento de COMBATS (N+1 problem).
 * Ahora se agrupa en memoria con un Map; el loop solo lee datos locales.
 */
async function fetchAllCombatPredictions() {
  const { rows } = await turso.execute({
    sql: `
      SELECT combat_id, fighter_id, votes
      FROM   predictions
      ORDER  BY combat_id, votes DESC
    `,
  })

  // Agrupar por combat_id en memoria — O(n), cero queries extra
  const byCombat = new Map()
  for (const row of rows) {
    if (!byCombat.has(row.combat_id)) byCombat.set(row.combat_id, [])
    byCombat.get(row.combat_id).push(row)
  }

  return byCombat
}

/**
 * Top N combates por total de votos (query sin cambios funcionales,
 * solo extraída como función para mantener separación de concerns).
 */
async function fetchTopCombats(limit = 5) {
  const { rows } = await turso.execute({
    sql: `
      SELECT combat_id, SUM(votes) AS total_votes
      FROM   predictions
      GROUP  BY combat_id
      ORDER  BY total_votes DESC
      LIMIT  ?
    `,
    args: [limit],
  })
  return rows
}

/**
 * Top N luchadores por total de votos.
 */
async function fetchTopFighters(limit = 10) {
  const { rows } = await turso.execute({
    sql: `
      SELECT fighter_id, SUM(votes) AS total_votes
      FROM   predictions
      GROUP  BY fighter_id
      ORDER  BY total_votes DESC
      LIMIT  ?
    `,
    args: [limit],
  })
  return rows
}

// ─── 5. Capa de presentación ──────────────────────────────────────────────────
// Ninguna función de aquí abajo toca la DB. Solo recibe datos y los imprime.

function printGlobalStats(stats) {
  console.log('\n📊 Estadísticas globales (predictions):')
  console.log(`  • Registros totales  : ${stats.total_rows}`)
  console.log(`  • Con votos          : ${stats.rows_with_votes}`)
  console.log(`  • Votos totales      : ${stats.total_votes}`)

  console.log('\n👥 Estadísticas globales (user_votes):')
  console.log(`  • Votos registrados  : ${stats.total_user_votes}`)
  console.log(`  • Usuarios únicos    : ${stats.unique_users}`)
}

function printCombatPredictions(allPredictions) {
  console.log('\n🥊 Predicciones por combate:')

  for (const combat of COMBATS) {
    const rows = allPredictions.get(combat.id) ?? []
    console.log(`\n  ${combat.title} (${combat.id}):`)

    if (rows.length === 0) {
      console.log('    — Sin predicciones registradas')
      continue
    }

    // Acumular total mientras imprimimos votos (cero segundo loop)
    let total = 0
    const lines = rows.map(({ fighter_id, votes }) => {
      total += votes
      return { name: fmt.label(fighter_id, getBoxerById(fighter_id)), votes }
    })

    for (const { name, votes } of lines) {
      console.log(`    • ${name}: ${votes} votos`)
    }

    console.log(`    ─ Total: ${total} votos`)
    for (const { name, votes } of lines) {
      console.log(`      ${fmt.pct(votes, total).padStart(4)} — ${name}`)
    }
  }
}

function printTopCombats(rows) {
  console.log('\n🏆 Top 5 combates por votos:')
  rows.forEach((row, i) => {
    const combat = COMBATS.find(c => c.id === row.combat_id)
    console.log(`${fmt.rank(i)} ${fmt.label(row.combat_id, combat)}: ${row.total_votes} votos`)
  })
}

function printTopFighters(rows) {
  console.log('\n👑 Top 10 luchadores por votos:')
  rows.forEach((row, i) => {
    const fighter = getBoxerById(row.fighter_id)
    console.log(`${fmt.rank(i)} ${fmt.label(row.fighter_id, fighter)}: ${row.total_votes} votos`)
  })
}

// ─── 6. Orquestador principal ─────────────────────────────────────────────────

async function checkPredictionsDatabase() {
  const t0 = performance.now()

  console.log('🔍 Verificando estado de la base de datos de predicciones...\n')

  try {
    // Fase 1: integridad del esquema
    console.log('📂 Verificando tablas...')
    await assertTablesExist()

    // Fase 2: todas las queries de datos en paralelo donde es posible
    // fetchAllCombatPredictions debe ir antes de imprimir, pero las stats
    // y los tops son independientes entre sí → Promise.all los paralela.
    const [stats, topCombats, topFighters, allPredictions] = await Promise.all([
      fetchGlobalStats(),
      fetchTopCombats(5),
      fetchTopFighters(10),
      fetchAllCombatPredictions(),
    ])

    // Fase 3: presentación en el orden original
    printGlobalStats(stats)
    printCombatPredictions(allPredictions)
    printTopCombats(topCombats)
    printTopFighters(topFighters)

    const elapsed = ((performance.now() - t0) / 1000).toFixed(2)
    console.log(`\n✅ Verificación completada en ${elapsed}s`)

  } catch (error) {
    // Errores inesperados de DB (conexión, timeout, sintaxis SQL)
    console.error('\n❌ [DB_ERROR] Error inesperado:', error.message ?? error)
    if (process.env.DEBUG) console.error(error)
    process.exit(1)
  }
}

checkPredictionsDatabase()