import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '../public')

const CHANNEL_ID = 'UC20NE0K97l6AsBeGKsAYtaA'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const PODCAST_THUMBNAILS_DIR = path.join(PUBLIC_DIR, 'podcast/thumbnails')

const STATIC_THUMBNAILS = ['videos/thumbnails/presentacion.webp']

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

const HTML_CHANNEL_URL = `https://www.youtube.com/@PodcastdeLuzu/videos`

function extractFromHtml(html) {
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/)
  if (!match) return []
  try {
    const json = JSON.parse(match[1])
    const tabs = json.contents?.twoColumnBrowseResultsRenderer?.tabs || []
    const videosTab = tabs.find((t) => t.tabRenderer?.title === 'Videos' || t.tabRenderer?.title === 'Vídeos')
    if (!videosTab) return []

    const contents = videosTab.tabRenderer?.content?.richGridRenderer?.contents || []
    return contents
      .map((item) => {
        const lockup = item.richItemRenderer?.content?.lockupViewModel
        if (!lockup) return null
        const videoId = lockup.contentId
        const title = lockup.metadata?.lockupMetadataViewModel?.title?.content
        if (!videoId || !title) return null
        return { videoId, title, published: new Date().toISOString() } // Fecha simulada para el filtro
      })
      .filter((v) => v !== null)
  } catch (error) {
    console.error('[generate-thumbnails] Error parsing HTML JSON:', error)
    return []
  }
}

async function getRecentPodcastEpisodes() {
  const rssEpisodes = {}
  let episodes = []
  try {
    const response = await fetch(FEED_URL)
    if (response.ok) {
      const xml = await response.text()
      const entries = parseFeed(xml)
      entries.forEach(e => rssEpisodes[e.videoId] = e)
    }
  } catch (e) {
    console.warn(`[generate-thumbnails] RSS fetch failed: ${e.message}`)
  }

  try {
    const htmlRes = await fetch(HTML_CHANNEL_URL, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } })
    if (htmlRes.ok) {
      const html = await htmlRes.text()
      const htmlExtracted = extractFromHtml(html)
      if (htmlExtracted.length > 0) {
        episodes = htmlExtracted.map(ep => rssEpisodes[ep.videoId] || ep)
      }
    }
  } catch (e) {
    console.warn(`[generate-thumbnails] HTML fetch failed: ${e.message}`)
  }

  if (episodes.length === 0) {
    episodes = Object.values(rssEpisodes)
  }
  
  // Asumimos que todos los vídeos extraídos por el scraper son de 2026 ya que el canal solo tiene vídeos de este año
  // Para los del RSS verificamos estrictamente
  return episodes.filter((entry) => {
    if (rssEpisodes[entry.videoId]) {
      return new Date(entry.published).getFullYear() === 2026
    }
    // Si vino del HTML (episodios antiguos) asumimos que es del podcast de La Velada (2026)
    return true
  })
}

async function generatePodcastThumbnails() {
  console.log('\n→ Miniaturas del podcast')

  await fs.mkdir(PODCAST_THUMBNAILS_DIR, { recursive: true })

  let episodes = []
  try {
    episodes = await getRecentPodcastEpisodes()
  } catch (error) {
    console.warn(`  ⚠️ No se pudieron obtener los episodios del podcast para generar miniaturas: ${error.message}`)
    console.log('  Usando episodios de fallback estáticos para la compilación...')
    episodes = [
      { videoId: 'f-B9-3gUfJg' },
      { videoId: 'Qp_d7z2wWp4' }
    ]
  }

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

    try {
      const thumbnail = await fetchThumbnail(episode.videoId)
      await writeModernFormats(thumbnail.buffer, outputBasePath)

      console.log(
        `  ${episode.videoId} · ${thumbnail.width}x${thumbnail.height} desde ${
          new URL(thumbnail.source).pathname
        }`,
      )
    } catch (e) {
      console.warn(`  ⚠️ No se pudo generar la miniatura para ${episode.videoId}: ${e.message}`)
      // Continuar con el resto de miniaturas en lugar de abortar
    }
  }
}

await generateStaticThumbnails()
await generatePodcastThumbnails()

console.log('\n✔ Miniaturas listas')
