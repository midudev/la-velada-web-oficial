import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'media', 'source', 'presentacion.mp4')
const outputDir = join(root, 'public', 'videos', 'presentacion')
const tempDir = join(tmpdir(), `velada-video-preview-${Date.now()}`)

const posterName = 'poster.webp'
const previewVideoName = 'preview.mp4'
const sheetName = 'preview-sheet.webp'
const manifestName = 'preview.json'
const previewFps = 8
const previewVideoFps = 30
const previewSeconds = Number.parseFloat(process.env.VIDEO_PREVIEW_SECONDS ?? '12')
const safePreviewSeconds = Number.isFinite(previewSeconds)
  ? Math.min(Math.max(previewSeconds, 6), 24)
  : 12
const sceneSeconds = 1.5
const sceneCount = Math.ceil(safePreviewSeconds / sceneSeconds)
const frameCount = Math.round(safePreviewSeconds * previewFps)
const columns = frameCount <= 96 ? 12 : 16
const rows = Math.ceil(frameCount / columns)

const preview = {
  source: 'media/source/presentacion.mp4',
  poster: `/videos/presentacion/${posterName}`,
  previewVideo: `/videos/presentacion/${previewVideoName}`,
  previewSheet: `/videos/presentacion/${sheetName}`,
  fallbackPoster: '/videos/thumbnails/presentacion.webp',
  durationSeconds: safePreviewSeconds,
  frameCount,
  columns,
  rows,
  fps: previewFps,
  width: 512,
  height: 288,
  sceneSeconds,
  scenes: [],
}

if (!existsSync(source)) {
  console.error(`Missing local source video: ${source}`)
  console.error('Add the file locally and rerun: pnpm video:preview')
  process.exit(1)
}

mkdirSync(tempDir, { recursive: true })

try {
  const duration = getVideoDuration(source)
  const scenes = getPreviewScenes(duration, sceneCount, sceneSeconds)
  const posterStart = getPosterStart(scenes, duration, sceneSeconds)
  const clipFiles = scenes.map((_, index) => join(tempDir, `clip-${index}.mp4`))
  preview.scenes = scenes.map((start) => ({
    start: Number(start.toFixed(2)),
    duration: sceneSeconds,
  }))

  run('ffmpeg', [
    '-y',
    '-ss',
    String(posterStart),
    '-i',
    source,
    '-frames:v',
    '1',
    '-vf',
    'scale=1280:-2',
    '-q:v',
    '82',
    join(tempDir, posterName),
  ])

  scenes.forEach((start, index) => {
    run('ffmpeg', [
      '-y',
      '-ss',
      String(start),
      '-i',
      source,
      '-t',
      String(sceneSeconds),
      '-an',
      '-vf',
      getPreviewVideoFilter(preview),
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '28',
      '-movflags',
      '+faststart',
      clipFiles[index],
    ])
  })

  writeFileSync(join(tempDir, 'clips.txt'), getConcatList(clipFiles))

  run('ffmpeg', [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    join(tempDir, 'clips.txt'),
    '-c',
    'copy',
    join(tempDir, previewVideoName),
  ])

  run('ffmpeg', [
    '-y',
    '-i',
    join(tempDir, previewVideoName),
    '-vf',
    getSheetFilter(preview),
    '-frames:v',
    '1',
    '-q:v',
    '75',
    join(tempDir, sheetName),
  ])

  writeFileSync(join(tempDir, manifestName), `${JSON.stringify(preview, null, 2)}\n`)

  mkdirSync(outputDir, { recursive: true })
  copyFileSync(join(tempDir, posterName), join(outputDir, posterName))
  copyFileSync(join(tempDir, previewVideoName), join(outputDir, previewVideoName))
  copyFileSync(join(tempDir, sheetName), join(outputDir, sheetName))
  copyFileSync(join(tempDir, manifestName), join(outputDir, manifestName))

  console.log(`Generated video preview assets in ${outputDir}`)
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.status === 0) return

  if (result.stdout) console.error(result.stdout)
  if (result.stderr) console.error(result.stderr)
  throw new Error(`${command} failed with exit code ${result.status}`)
}

function getVideoDuration(file) {
  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file],
    {
      cwd: root,
      encoding: 'utf8',
      stdio: 'pipe',
    },
  )

  if (result.status !== 0) {
    if (result.stderr) console.error(result.stderr)
    throw new Error(`ffprobe failed with exit code ${result.status}`)
  }

  const duration = Number.parseFloat(result.stdout.trim())
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not read video duration from ${file}`)
  }

  return duration
}

function getPreviewScenes(duration, count, seconds) {
  const safeCount = Math.max(1, count)
  const latestStart = Math.max(0, duration - seconds - 1)
  const middleStart = Math.min(latestStart, duration * 0.22)
  const middleEnd = Math.max(middleStart, Math.min(latestStart, duration * 0.88))
  const range = Math.max(1, middleEnd - middleStart)
  const spacing = range / safeCount

  return Array.from({ length: safeCount }, (_, index) => {
    const randomOffset = seededRandom(index + Math.floor(duration)) * spacing * 0.86
    const start = middleStart + spacing * index + randomOffset
    return clamp(start, 0, latestStart)
  })
}

function getPosterStart(scenes, duration, seconds) {
  if (scenes.length === 0) return Math.max(1, duration * 0.5)

  const posterIndex = Math.min(scenes.length - 1, Math.max(0, Math.floor(scenes.length * 0.62)))
  return clamp(scenes[posterIndex] + seconds * 0.45, 0, Math.max(0, duration - 1))
}

function getPreviewVideoFilter(options) {
  return [
    `fps=${previewVideoFps}`,
    `scale=${options.width}:${options.height}:force_original_aspect_ratio=increase`,
    `crop=${options.width}:${options.height}`,
    'format=yuv420p',
  ].join(',')
}

function getSheetFilter(options) {
  return [
    `fps=${options.fps}`,
    `scale=${options.width}:${options.height}:force_original_aspect_ratio=increase`,
    `crop=${options.width}:${options.height}`,
    `trim=end_frame=${options.frameCount}`,
    `tile=${options.columns}x${options.rows}`,
  ].join(',')
}

function getConcatList(files) {
  return files
    .map((file) => `file '${file.replaceAll('\\', '/').replaceAll("'", "'\\''")}'`)
    .join('\n')
    .concat('\n')
}

function seededRandom(seed) {
  const value = Math.sin(seed * 9301 + 49297) * 233280
  return value - Math.floor(value)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
