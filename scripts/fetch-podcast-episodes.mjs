import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../src/data/podcast-episodes.json')

const CHANNEL_ID = 'UC20NE0K97l6AsBeGKsAYtaA'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function parseFeed(xml) {
  const entries = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const rawTitle = entry.match(/<title>([^<]+)<\/title>/)?.[1]
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
    if (!videoId || !rawTitle || !published) continue
    entries.push({ videoId, title: decodeHtmlEntities(rawTitle), published })
  }
  return entries
}

async function readExistingEpisodes() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

console.log('→ Obteniendo feed RSS del podcast...')

const response = await fetch(FEED_URL)
if (!response.ok) {
  console.error(`[fetch-podcast] El feed respondió con ${response.status} ${response.statusText}`)
  process.exit(1)
}

const xml = await response.text()
const feedEntries = parseFeed(xml)
console.log(`  ${feedEntries.length} episodio(s) encontrados en el feed`)

const existing = await readExistingEpisodes()
const existingIds = new Set(existing.map((e) => e.videoId))
const newEntries = feedEntries.filter((e) => !existingIds.has(e.videoId))

if (newEntries.length === 0) {
  console.log('✔ Sin episodios nuevos, el histórico está al día')
  process.exit(0)
}

const merged = [...existing, ...newEntries].sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
)

await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
await fs.writeFile(DATA_FILE, JSON.stringify(merged, null, 2) + '\n')

console.log(`✔ ${newEntries.length} episodio(s) nuevo(s) añadidos → ${merged.length} en total`)
