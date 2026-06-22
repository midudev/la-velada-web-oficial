import { createClient } from '@libsql/client'

process.loadEnvFile?.('.env')

const requiredEnv = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN']
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (missingEnv.length > 0) {
  throw new Error(`Missing required env vars: ${missingEnv.join(', ')}`)
}

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const STATEMENTS = [
  {
    name: 'predictions',
    sql: `
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        combat_id TEXT NOT NULL,
        fighter_id TEXT NOT NULL,
        votes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(combat_id, fighter_id)
      )
    `,
  },
  {
    name: 'user_votes',
    sql: `
      CREATE TABLE IF NOT EXISTS user_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        combat_id TEXT NOT NULL,
        fighter_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(combat_id, user_id)
      )
    `,
  },
  {
    name: 'user_votes_user_id_idx',
    sql: `CREATE INDEX IF NOT EXISTS user_votes_user_id_idx ON user_votes(user_id)`,
  },
]

const EXPECTED_TABLES = ['predictions', 'user_votes']

async function runMigrations() {
  console.log('Running Turso migrations...')

  await turso.batch(
    STATEMENTS.map((statement) => ({ sql: statement.sql })),
    'write',
  )

  console.log(`Applied ${STATEMENTS.length} statements.`)

  const result = await turso.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  })

  const existing = new Set(result.rows.map((row) => row.name))
  const missing = EXPECTED_TABLES.filter((table) => !existing.has(table))

  console.log('Tables present:')
  for (const table of EXPECTED_TABLES) {
    console.log(`  - ${table}: ${existing.has(table) ? 'ok' : 'MISSING'}`)
  }

  if (missing.length > 0) {
    throw new Error(`Missing tables after migration: ${missing.join(', ')}`)
  }

  console.log('Migrations completed successfully.')
}

runMigrations().catch((error) => {
  console.error('Error running migrations:', error)
  process.exit(1)
})
