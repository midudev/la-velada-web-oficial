import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CHANNEL_ID = 'UC20NE0K97l6AsBeGKsAYtaA'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const FEED_CACHE_FILE = path.join(__dirname, '.cache/podcast-feed.json')
const FEED_CACHE_TTL_MS = 5 * 60 * 1000
const MAX_AGE_DAYS = 60

/**
 * @typedef {object} PodcastFeedEntry
 * @property {string} videoId
 * @property {string} title
 * @property {string} published
 */

/**
 * @typedef {object} PodcastFeedSnapshot
 * @property {number} fetchedAt
 * @property {PodcastFeedEntry[]} entries
 */

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/** @returns {PodcastFeedEntry[]} */
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

    entries.push({
      videoId,
      title: decodeHtmlEntities(rawTitle),
      published,
    })
  }

  return entries
}

/** @returns {Promise<PodcastFeedSnapshot | null>} */
async function readSnapshot() {
  try {
    const snapshot = JSON.parse(await fs.readFile(FEED_CACHE_FILE, 'utf8'))
    if (!Number.isFinite(snapshot?.fetchedAt) || !Array.isArray(snapshot?.entries)) return null

    return snapshot
  } catch {
    return null
  }
}

/** @param {PodcastFeedSnapshot} snapshot */
async function writeSnapshot(snapshot) {
  await fs.mkdir(path.dirname(FEED_CACHE_FILE), { recursive: true })
  await fs.writeFile(FEED_CACHE_FILE, JSON.stringify(snapshot, null, 2))
}

/** @param {PodcastFeedEntry[]} entries */
function getRecentEntries(entries) {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000
  return entries.filter((entry) => new Date(entry.published).getTime() >= cutoff)
}

/**
 * Obtiene una única instantánea compartida por el generador de miniaturas y
 * Astro. Durante un build completo, el primer consumidor consulta YouTube y el
 * segundo reutiliza el archivo de caché generado unos segundos antes.
 *
 * @returns {Promise<PodcastFeedEntry[]>}
 */
export async function getRecentPodcastEpisodes() {
  const cachedSnapshot = await readSnapshot()
  const cacheIsFresh =
    cachedSnapshot && Date.now() - cachedSnapshot.fetchedAt < FEED_CACHE_TTL_MS

  if (cacheIsFresh) return getRecentEntries(cachedSnapshot.entries)

  try {
    const response = await fetch(FEED_URL)
    if (!response.ok) {
      throw new Error(`El feed respondió con ${response.status} ${response.statusText}`)
    }

    const snapshot = {
      fetchedAt: Date.now(),
      entries: parseFeed(await response.text()),
    }
    await writeSnapshot(snapshot)

    return getRecentEntries(snapshot.entries)
  } catch (error) {
    if (cachedSnapshot) return getRecentEntries(cachedSnapshot.entries)

    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`No se pudo obtener el feed del podcast: ${message}`)
  }
}
