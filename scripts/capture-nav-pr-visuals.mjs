import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const worktreePath = path.resolve(root, '..', 'la-velada-nav-before')
const beforeCommit = '30adca4e'

function run(command, args, options = {}) {
  const useShell = options.shell ?? process.platform === 'win32'
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
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

function findLatestVideo() {
  const base = path.join(root, 'test-results', 'capture')
  if (!fs.existsSync(base)) return null

  const videos = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name === 'video.webm') videos.push(full)
    }
  }
  walk(base)
  if (!videos.length) return null
  return videos.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]
}

async function convertToMp4(webmPath, mp4Path) {
  try {
    await run('ffmpeg', [
      '-y',
      '-i',
      webmPath,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      mp4Path,
    ])
    return true
  } catch {
    console.warn('ffmpeg not available — keeping .webm only')
    fs.copyFileSync(webmPath, mp4Path.replace(/\.mp4$/, '.webm'))
    return false
  }
}

async function capture(phase, baseURL) {
  console.log(`\n▶ Capturing "${phase}" at ${baseURL}`)
  await run('pnpm', [
    'exec',
    'playwright',
    'test',
    '--config=playwright.capture.config.ts',
  ], {
    env: {
      ...process.env,
      CAPTURE_PHASE: phase,
      PLAYWRIGHT_BASE_URL: baseURL,
      CI: '1',
    },
  })

  const video = findLatestVideo()
  const outDir = path.join(root, 'docs', 'pr', 'nav-patch', phase, 'videos')
  fs.mkdirSync(outDir, { recursive: true })

  if (video) {
    const mp4 = path.join(outDir, 'header-demo.mp4')
    await convertToMp4(video, mp4)
    console.log(`Video saved under docs/pr/nav-patch/${phase}/videos/`)
  }
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
    if (beforeProc.pid) {
      spawn('taskkill', ['/pid', String(beforeProc.pid), '/t', '/f'])
    }
    if (afterProc.pid) {
      spawn('taskkill', ['/pid', String(afterProc.pid), '/t', '/f'])
    }
  }

  console.log('\nDone. Assets in docs/pr/nav-patch/{before,after}/')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
