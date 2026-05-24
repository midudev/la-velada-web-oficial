import fs from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '../public')
const DATA_FILE = path.join(__dirname, '../src/data/podcast-episodes.json')
const PODCAST_THUMBNAILS_DIR = path.join(PUBLIC_DIR, 'podcast/thumbnails')

const STATIC_THUMBNAILS = ['videos/thumbnails/presentacion.webp']

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

function readEpisodesFromJson() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    console.warn('  No se pudo leer el histórico de episodios, se omiten las miniaturas del podcast')
    return []
  }
}

async function generatePodcastThumbnails() {
  console.log('\n→ Miniaturas del podcast')

  await fs.mkdir(PODCAST_THUMBNAILS_DIR, { recursive: true })

  const episodes = readEpisodesFromJson()
  if (episodes.length === 0) {
    console.log('  No hay episodios en el histórico')
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
