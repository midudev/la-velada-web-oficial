import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '../public')

const CHANNEL_ID = 'UC20NE0K97l6AsBeGKsAYtaA'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const MAX_AGE_DAYS = 60
const PODCAST_THUMBNAILS_DIR = path.join(__dirname, '.cache/podcast-thumbs')

const STATIC_THUMBNAILS = []

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
    entries.push({
      videoId,
      title: decodeHtmlEntities(rawTitle),
      published,
    })
  }
  return entries
}

async function fileExists(filePath) {
  return fs.access(filePath).then(
    () => true,
    () => false,
  )
}

async function writeModernFormats(inputBuffer, outputBasePath) {
  await Promise.all([
    sharp(inputBuffer).webp({ quality: 82, effort: 6 }).toFile(`${outputBasePath}.webp`),
    sharp(inputBuffer).avif({ quality: 55, effort: 6 }).toFile(`${outputBasePath}.avif`),
  ])
}

async function generateStaticThumbnails() {
  console.log('\n→ Miniaturas locales')

  for (const relativePath of STATIC_THUMBNAILS) {
    const inputPath = path.join(PUBLIC_DIR, relativePath)
    const outputPath = inputPath.replace(/\.webp$/, '.avif')

    if (await fileExists(outputPath)) {
      console.log(`  ${relativePath} · avif ya existe`)
      continue
    }

    await sharp(inputPath).avif({ quality: 55, effort: 6 }).toFile(outputPath)
    console.log(`  ${relativePath} · avif generado`)
  }
}

function getThumbnailCandidates(videoId) {
  return [
    `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
    `https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp`,
    `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`,
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ]
}

async function fetchThumbnail(videoId) {
  for (const url of getThumbnailCandidates(videoId)) {
    try {
      const response = await fetch(url)
      if (!response.ok) continue

      const buffer = Buffer.from(await response.arrayBuffer())
      const metadata = await sharp(buffer).metadata()

      // YouTube serves a tiny placeholder when maxresdefault does not exist.
      if (metadata.width === 120 && metadata.height === 90) continue

      return { buffer, source: url, width: metadata.width, height: metadata.height }
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error(`No se pudo descargar una miniatura válida para ${videoId}`)
}

async function getRecentPodcastEpisodes() {
  const response = await fetch(FEED_URL)
  if (!response.ok) {
    throw new Error(`El feed respondió con ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000

  return parseFeed(xml).filter((entry) => new Date(entry.published).getTime() >= cutoff)
}

async function generatePodcastThumbnails() {
  console.log('\n→ Miniaturas del podcast')

  await fs.mkdir(PODCAST_THUMBNAILS_DIR, { recursive: true })

  const episodes = await getRecentPodcastEpisodes()
  if (episodes.length === 0) {
    console.log('  No hay episodios recientes')
    return
  }

  for (const episode of episodes) {
    const outputBasePath = path.join(PODCAST_THUMBNAILS_DIR, episode.videoId)
    const webpPath = `${outputBasePath}.webp`
    const avifPath = `${outputBasePath}.avif`

    if ((await fileExists(webpPath)) && (await fileExists(avifPath))) {
      console.log(`  ${episode.videoId} · ya existe`)
      continue
    }

    const thumbnail = await fetchThumbnail(episode.videoId)
    await writeModernFormats(thumbnail.buffer, outputBasePath)

    console.log(
      `  ${episode.videoId} · ${thumbnail.width}x${thumbnail.height} desde ${
        new URL(thumbnail.source).pathname
      }`,
    )
  }
}

await generateStaticThumbnails()
await generatePodcastThumbnails()

console.log('\n✔ Miniaturas listas')
