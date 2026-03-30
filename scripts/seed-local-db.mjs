import { createClient } from '@libsql/client'

const db = createClient({ url: 'file:local.db' })

const COMBATS = [
  { id: '1-edu-aguirre-vs-gaston-edul', fighters: ['edu-aguirre', 'gaston-edul'], title: 'Edu Aguirre vs Gastón Edul' },
  { id: '2-fabiana-sevillano-vs-la-parce', fighters: ['fabiana-sevillano', 'la-parce'], title: 'Fabiana Sevillano vs La Parce' },
  { id: '3-clersss-vs-natalia-mx', fighters: ['clersss', 'natalia-mx'], title: 'Clersss vs Natalia MX' },
  { id: '4-kidd-keo-vs-lit-killah', fighters: ['kidd-keo', 'lit-killah'], title: 'Kidd Keo vs Lit Killah' },
  { id: '5-alondrissa-vs-angie-velasco', fighters: ['alondrissa', 'angie-velasco'], title: 'Alondrissa vs Angie Velasco' },
  { id: '6-viruzz-vs-gero-arias', fighters: ['viruzz', 'gero-arias'], title: 'Viruzz vs Gero Arias' },
  { id: '7-samy-rivers-vs-roro', fighters: ['samy-rivers', 'roro'], title: 'Samy Rivers vs Roro' },
  { id: '8-marta-diaz-vs-tatiana-kaer', fighters: ['marta-diaz', 'tatiana-kaer'], title: 'Marta Díaz vs Tatiana Kaer' },
  { id: '9-yosoyplex-vs-fernanfloo', fighters: ['yosoyplex', 'fernanfloo'], title: 'YoSoyPlex vs Fernanfloo' },
  { id: '10-grefg-vs-illojuan', fighters: ['grefg', 'illojuan'], title: 'The Grefg vs IlloJuan' },
]

async function seed() {
  console.log('Creating tables...')

  await db.execute(`
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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      combat_id TEXT NOT NULL,
      fighter_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(combat_id, user_id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0,
      reset_time INTEGER NOT NULL
    )
  `)

  console.log('Seeding predictions with random votes...')

  for (const combat of COMBATS) {
    const [f1, f2] = combat.fighters
    const votes1 = Math.floor(Math.random() * 900) + 100
    const votes2 = Math.floor(Math.random() * 900) + 100

    await db.execute({
      sql: 'INSERT OR REPLACE INTO predictions (combat_id, fighter_id, votes) VALUES (?, ?, ?)',
      args: [combat.id, f1, votes1],
    })
    await db.execute({
      sql: 'INSERT OR REPLACE INTO predictions (combat_id, fighter_id, votes) VALUES (?, ?, ?)',
      args: [combat.id, f2, votes2],
    })

    const total = votes1 + votes2
    const pct1 = Math.round((votes1 / total) * 100)
    const pct2 = 100 - pct1
    console.log(`  ${combat.title}: ${f1} ${pct1}% (${votes1}) vs ${f2} ${pct2}% (${votes2})`)
  }

  const result = await db.execute('SELECT COUNT(*) as count FROM predictions')
  console.log(`\nTotal predictions: ${result.rows[0].count}`)
  console.log('Local database ready at local.db')
}

seed().catch(console.error)
