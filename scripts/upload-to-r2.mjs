import { AwsClient } from 'aws4fetch'
import { createHash } from 'node:crypto'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const THUMBNAILS_DIR = path.join(__dirname, '.cache/podcast-thumbs')
const CACHE_FILE = path.join(ROOT, '.r2-cache.json')
const REQUIRED_ENV = ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']

// Local only. On Vercel, process.env already has Project Settings vars.
for (const name of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(path.join(ROOT, name))
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

function readEnv(key) {
  const value = process.env[key]?.trim()
  return value || undefined
}

const missingEnv = REQUIRED_ENV.filter((key) => !readEnv(key))
if (missingEnv.length > 0) {
  console.warn(`\n⚠ Saltando subida a R2: faltan ${missingEnv.join(', ')}`)
  console.warn(
    '  En Vercel deben estar en Project Settings → Environment Variables para Production y Preview (no solo Development), y disponibles en el Build Step.',
  )
  process.exit(0)
}

const R2_ACCOUNT_ID = readEnv('R2_ACCOUNT_ID')
const R2_BUCKET = readEnv('R2_BUCKET')
const R2_ACCESS_KEY_ID = readEnv('R2_ACCESS_KEY_ID')
const R2_SECRET_ACCESS_KEY = readEnv('R2_SECRET_ACCESS_KEY')

const ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
const CONTENT_TYPE = { '.webp': 'image/webp', '.avif': 'image/avif' }

const r2 = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: 's3',
  region: 'auto',
})

async function loadCache() {
  try {
    return JSON.parse(await readFile(CACHE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

async function uploadFile(localPath, key) {
  const body = await readFile(localPath)
  const contentType = CONTENT_TYPE[path.extname(localPath)]
  const sha256 = createHash('sha256').update(body).digest('hex')
  const url = `${ENDPOINT}/${R2_BUCKET}/${key}`

  const response = await r2.fetch(url, {
    method: 'PUT',
    body,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
      'x-amz-content-sha256': sha256,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`PUT ${key} → ${response.status} ${response.statusText}\n${detail}`)
  }
}

async function main() {
  console.log('\n→ Subiendo miniaturas a R2')

  const cache = await loadCache()
  const files = (await readdir(THUMBNAILS_DIR)).filter((name) => /\.(webp|avif)$/.test(name))

  let uploaded = 0
  let skipped = 0

  for (const name of files) {
    const key = `podcast/thumbnails/${name}`
    const localPath = path.join(THUMBNAILS_DIR, name)
    const { size, mtimeMs } = await stat(localPath)
    const cached = cache[key]

    if (cached && cached.size === size && cached.mtimeMs === mtimeMs) {
      skipped++
      continue
    }

    await uploadFile(localPath, key)
    cache[key] = { size, mtimeMs, uploadedAt: new Date().toISOString() }
    uploaded++
    console.log(`  ${key} · subido`)
  }

  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2))
  console.log(`\n✔ ${uploaded} subidas, ${skipped} omitidas`)
}

await main()
