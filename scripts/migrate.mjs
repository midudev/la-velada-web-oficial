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
  {
    name: 'user_votes_combat_fighter_idx',
    sql: `CREATE INDEX IF NOT EXISTS user_votes_combat_fighter_idx ON user_votes(combat_id, fighter_id)`,
  },
  // Triggers que mantienen `predictions.votes` de forma incremental (+1/-1) a
  // partir de los cambios en `user_votes`. Sustituyen al recálculo con COUNT(*)
  // en cada voto, que leía todas las filas del combate por voto y disparaba el
  // total de "rows read" de Turso de forma cuadrática. Deben mantenerse
  // idénticos a los de scripts/predictions-shared.mjs (ensurePredictionTriggers).
  {
    name: 'user_votes_after_insert',
    sql: `
      CREATE TRIGGER IF NOT EXISTS user_votes_after_insert
      AFTER INSERT ON user_votes
      BEGIN
        UPDATE predictions
        SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP
        WHERE combat_id = NEW.combat_id AND fighter_id = NEW.fighter_id;
      END
    `,
  },
  {
    name: 'user_votes_after_update',
    sql: `
      CREATE TRIGGER IF NOT EXISTS user_votes_after_update
      AFTER UPDATE OF fighter_id ON user_votes
      WHEN OLD.fighter_id <> NEW.fighter_id
      BEGIN
        UPDATE predictions
        SET votes = votes - 1, updated_at = CURRENT_TIMESTAMP
        WHERE combat_id = OLD.combat_id AND fighter_id = OLD.fighter_id;
        UPDATE predictions
        SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP
        WHERE combat_id = NEW.combat_id AND fighter_id = NEW.fighter_id;
      END
    `,
  },
  {
    name: 'user_votes_after_delete',
    sql: `
      CREATE TRIGGER IF NOT EXISTS user_votes_after_delete
      AFTER DELETE ON user_votes
      BEGIN
        UPDATE predictions
        SET votes = votes - 1, updated_at = CURRENT_TIMESTAMP
        WHERE combat_id = OLD.combat_id AND fighter_id = OLD.fighter_id;
      END
    `,
  },
  // Tablas de better-auth. El esquema (nombres de columna camelCase y tipos)
  // replica el que genera el adaptador Kysely de better-auth para SQLite, para
  // que su introspección las reconozca sin intentar alterarlas. Persistirlas
  // mantiene `user.id` estable entre sesiones (ver src/lib/auth.ts).
  {
    name: 'user',
    sql: `
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "emailVerified" INTEGER NOT NULL,
        "image" TEXT,
        "createdAt" DATE NOT NULL,
        "updatedAt" DATE NOT NULL
      )
    `,
  },
  {
    name: 'session',
    sql: `
      CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "expiresAt" DATE NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "createdAt" DATE NOT NULL,
        "updatedAt" DATE NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
      )
    `,
  },
  {
    name: 'account',
    sql: `
      CREATE TABLE IF NOT EXISTS "account" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" DATE,
        "refreshTokenExpiresAt" DATE,
        "scope" TEXT,
        "password" TEXT,
        "createdAt" DATE NOT NULL,
        "updatedAt" DATE NOT NULL
      )
    `,
  },
  {
    name: 'verification',
    sql: `
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "identifier" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "expiresAt" DATE NOT NULL,
        "createdAt" DATE NOT NULL,
        "updatedAt" DATE NOT NULL
      )
    `,
  },
  {
    name: 'session_userId_idx',
    sql: `CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId")`,
  },
  {
    name: 'account_userId_idx',
    sql: `CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId")`,
  },
  // En cada inicio de sesión OAuth, better-auth localiza la cuenta vinculada con
  // `WHERE accountId = ? AND providerId = ?`. Sin este índice esa búsqueda hacía
  // un SCAN completo de `account` (decenas de miles de filas por login), lo que
  // disparaba la latencia del login y las "rows read" de Turso. El índice
  // compuesto la resuelve con un seek directo.
  {
    name: 'account_provider_account_idx',
    sql: `CREATE INDEX IF NOT EXISTS "account_provider_account_idx" ON "account" ("providerId", "accountId")`,
  },
  {
    name: 'verification_identifier_idx',
    sql: `CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier")`,
  },
]

const EXPECTED_TABLES = ['predictions', 'user_votes', 'user', 'session', 'account', 'verification']

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
