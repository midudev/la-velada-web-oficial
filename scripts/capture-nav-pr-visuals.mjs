import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const worktreePath = path.resolve(root, '..', 'la-velada-nav-before')
const beforeCommit = '30adca4e'

function ffmpegBin() {
  try {
    return require('@ffmpeg-installer/ffmpeg').path
  } catch {
    return 'ffmpeg'
  }
}

function run(command, args, options = {}) {
  const useShell = options.shell ?? process.platform === 'win32'
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      stdio: 'inherit',
      shell: useShell,
      ...options,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    })
  })
}

function waitForUrl(url, timeoutMs = 120_000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url)
        if (res.ok) return resolve()
      } catch {
        // retry
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`))
        return
      }
      setTimeout(tick, 500)
    }
    tick()
  })
}

async function ensureBeforeWorktree() {
  if (!fs.existsSync(path.join(worktreePath, '.git'))) {
    console.log(`Creating worktree at ${beforeCommit} → ${worktreePath}`)
    await run('git', ['worktree', 'add', worktreePath, beforeCommit])
  }

  if (!fs.existsSync(path.join(worktreePath, 'node_modules', 'astro'))) {
    console.log('Installing dependencies in before worktree…')
    await run('pnpm', ['install'], { cwd: worktreePath, shell: true })
  }
}

const captureResultsDir = path.join(root, 'test-results', 'capture')

function clearCaptureResults() {
  fs.rmSync(captureResultsDir, { recursive: true, force: true })
}

function collectVideosFromResults(phase) {
  const destDir = path.join(root, 'docs', 'pr', 'nav-patch', phase, 'videos')
  fs.mkdirSync(destDir, { recursive: true })

  if (!fs.existsSync(captureResultsDir)) return []

  const copied = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name === 'video.webm') {
        const folder = path.basename(path.dirname(full)).toLowerCase()
        let slug = null
        if (folder.includes('logo-hover')) slug = 'logo-hover'
        else if (folder.includes('nav-underline')) slug = 'nav-underline-hover'
        else if (folder.includes('overview')) slug = 'overview'

        if (slug) {
          const dest = path.join(destDir, `${slug}-playwright.webm`)
          fs.copyFileSync(full, dest)
          copied.push(slug)
        }
      }
    }
  }
  walk(captureResultsDir)
  return copied
}

async function encodeVideo(inputPath, outputPath, codecArgs) {
  await run(ffmpegBin(), ['-y', '-i', inputPath, ...codecArgs, outputPath], {
    shell: false,
  })
}

async function encodeHighQuality(rawPath, outDir, baseName) {
  const webmOut = path.join(outDir, `${baseName}.webm`)
  const mp4Out = path.join(outDir, `${baseName}.mp4`)

  try {
    await encodeVideo(rawPath, webmOut, [
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '48M',
      '-crf',
      '10',
      '-pix_fmt',
      'yuv420p',
      '-an',
    ])
    await encodeVideo(rawPath, mp4Out, [
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '12',
      '-b:v',
      '40M',
      '-maxrate',
      '52M',
      '-bufsize',
      '64M',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
    ])
    return true
  } catch (error) {
    console.warn(`ffmpeg encode failed for ${baseName}:`, error.message)
    fs.copyFileSync(rawPath, webmOut)
    return false
  }
}

async function encodeAllVideos(phase) {
  const dir = path.join(root, 'docs', 'pr', 'nav-patch', phase, 'videos')
  if (!fs.existsSync(dir)) return

  const raws = fs.readdirSync(dir).filter((f) => f.endsWith('-playwright.webm'))

  for (const file of raws) {
    const base = file.replace(/-playwright\.webm$/, '')
    await encodeHighQuality(path.join(dir, file), dir, base)
  }
}

async function capture(phase, baseURL) {
  console.log(`\n▶ Capturing "${phase}" at ${baseURL}`)
  clearCaptureResults()

  await run(
    'pnpm',
    ['exec', 'playwright', 'test', '--config=playwright.capture.config.ts'],
    {
      env: {
        ...process.env,
        CAPTURE_PHASE: phase,
        PLAYWRIGHT_BASE_URL: baseURL,
        CI: '1',
      },
    },
  )

  let raws = collectVideosFromResults(phase)
  const videoDir = path.join(root, 'docs', 'pr', 'nav-patch', phase, 'videos')

  if (!raws.length && fs.existsSync(videoDir)) {
    raws = fs
      .readdirSync(videoDir)
      .filter((f) => f.endsWith('-playwright.webm'))
      .map((f) => f.replace('-playwright.webm', ''))
  }

  if (!raws.length) {
    throw new Error(`No videos recorded for "${phase}"`)
  }

  console.log(`Recorded: ${raws.map((f) => f.replace('-playwright.webm', '')).join(', ')}`)
  await encodeAllVideos(phase)
}

async function main() {
  fs.mkdirSync(path.join(root, 'docs', 'pr', 'nav-patch'), { recursive: true })

  await ensureBeforeWorktree()

  const beforeProc = spawn(
    'pnpm',
    ['exec', 'astro', 'dev', '--port', '4334', '--host'],
    { cwd: worktreePath, stdio: 'ignore', detached: true, shell: true },
  )
  beforeProc.unref()

  const afterProc = spawn('pnpm', ['run', 'dev:nav'], {
    cwd: root,
    stdio: 'ignore',
    detached: true,
    shell: true,
  })
  afterProc.unref()

  try {
    console.log('Starting dev servers (before :4334, after :4333)…')
    await new Promise((resolve) => setTimeout(resolve, 12_000))
    await waitForUrl('http://localhost:4334/')
    await waitForUrl('http://localhost:4333/')

    try {
      await capture('before', 'http://localhost:4334')
    } catch (error) {
      console.warn('Before capture failed:', error.message)
    }

    await capture('after', 'http://localhost:4333')
  } finally {
    if (beforeProc.pid) spawn('taskkill', ['/pid', String(beforeProc.pid), '/t', '/f'])
    if (afterProc.pid) spawn('taskkill', ['/pid', String(afterProc.pid), '/t', '/f'])
  }

  console.log('\nDone. Assets in docs/pr/nav-patch/{before,after}/')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
