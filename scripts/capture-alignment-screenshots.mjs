/**
 * Before/after visual captures for the boxing-alignment PR.
 *
 * Uses a sibling git worktree on upstream/main for "before" and the current branch for "after".
 *
 * Usage:
 *   node scripts/capture-alignment-screenshots.mjs
 *   CAPTURE_MODE=before node scripts/capture-alignment-screenshots.mjs
 *   SKIP_SERVERS=1 BEFORE_URL=http://127.0.0.1:4322 AFTER_URL=http://127.0.0.1:4321 node scripts/capture-alignment-screenshots.mjs
 */
import { spawn } from 'node:child_process'
import { access, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
/** Sibling worktree (not inside the repo) so pnpm install is isolated. */
const WORKTREE =
  process.env.ALIGNMENT_WORKTREE ??
  path.join(ROOT, '..', 'la-velada-web-oficial-main')
const BEFORE_PORT = Number(process.env.BEFORE_PORT ?? 4322)
const AFTER_PORT = Number(process.env.AFTER_PORT ?? 4321)
const SCREENSHOTS_ROOT = path.resolve(
  ROOT,
  process.env.SCREENSHOTS_ROOT ?? 'pr-assets/screenshots',
)
const CAPTURE_MODE = process.env.CAPTURE_MODE ?? 'both'
const SKIP_SERVERS = process.env.SKIP_SERVERS === '1'
const WORKTREE_REF = process.env.WORKTREE_REF ?? 'upstream/main'

const BOXERS_CLIP_MAX_DESKTOP = Number(process.env.BOXERS_CLIP_HEIGHT ?? 2100)
const BOXERS_CLIP_MAX_MOBILE = Number(process.env.BOXERS_CLIP_HEIGHT_MOBILE ?? 2800)
const BOXERS_VIEWPORT_HEIGHT = Number(process.env.BOXERS_VIEWPORT_HEIGHT ?? 1920)

const CAPTURES = [
  {
    file: 'home-mobile.png',
    url: '/',
    viewport: { width: 390, height: 844 },
  },
  {
    file: 'home-desktop.png',
    url: '/',
    viewport: { width: 1440, height: 900 },
  },
  {
    file: 'home-desktop-wide.png',
    url: '/',
    viewport: { width: 1920, height: 1080 },
  },
  {
    file: 'boxeadores-mobile.png',
    url: '/boxeadores',
    viewport: { width: 390, height: BOXERS_VIEWPORT_HEIGHT },
    boxersClip: { maxHeight: BOXERS_CLIP_MAX_MOBILE },
  },
  {
    file: 'boxeadores-desktop.png',
    url: '/boxeadores',
    viewport: { width: 1440, height: BOXERS_VIEWPORT_HEIGHT },
    boxersClip: { maxHeight: BOXERS_CLIP_MAX_DESKTOP },
  },
  {
    file: 'boxeadores-desktop-wide.png',
    url: '/boxeadores',
    viewport: { width: 1920, height: BOXERS_VIEWPORT_HEIGHT },
    boxersClip: { maxHeight: BOXERS_CLIP_MAX_DESKTOP },
  },
]

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

async function pathExists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

async function ensureWorktree() {
  if (await pathExists(path.join(WORKTREE, '.git'))) {
    console.log(`worktree: ${WORKTREE}`)
    return
  }

  console.log(`creating worktree at ${WORKTREE} (${WORKTREE_REF})…`)
  await mkdir(path.dirname(WORKTREE), { recursive: true })
  await run('git', ['worktree', 'add', WORKTREE, WORKTREE_REF], { cwd: ROOT })
}

async function ensureWorktreeDeps() {
  if (await pathExists(path.join(WORKTREE, 'node_modules'))) return
  console.log('installing dependencies in worktree (first run)…')
  await run('pnpm', ['install', '--frozen-lockfile'], { cwd: WORKTREE })
}

async function waitForServer(port, timeoutMs = 180_000) {
  const origin = `http://127.0.0.1:${port}`
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(origin, {
        signal: AbortSignal.timeout(3_000),
      })
      if (response.ok || response.status < 500) return origin
    } catch {
      // Astro still booting
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000))
  }

  throw new Error(`dev server on port ${port} did not become ready in time`)
}

function startDev(cwd, port) {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
  return spawn(command, ['dev', '--port', String(port), '--host', '127.0.0.1'], {
    cwd,
    stdio: 'pipe',
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '0' },
  })
}

function stopDev(proc) {
  if (!proc || proc.killed) return

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(proc.pid), '/f', '/t'], {
      shell: true,
      stdio: 'ignore',
    })
    return
  }

  proc.kill('SIGTERM')
}

async function getBoxersContentClip(page, maxHeight) {
  return page.evaluate((limit) => {
    const section = document.querySelector('.boxers-page')
    const grid = document.querySelector('[data-boxers-grid]')
    if (!section || !grid) return null

    const top = section.getBoundingClientRect().top + window.scrollY
    const bottom = grid.getBoundingClientRect().bottom + window.scrollY + 40
    const height = Math.min(limit, Math.ceil(bottom - top))

    return {
      x: 0,
      y: Math.max(0, Math.floor(top)),
      width: Math.ceil(document.documentElement.scrollWidth),
      height: Math.max(1, height),
    }
  }, maxHeight)
}

async function captureScreenshots(baseUrl, outDir) {
  await mkdir(outDir, { recursive: true })
  console.log(`\ncapturing → ${outDir} (${baseUrl})`)

  const browser = await chromium.launch()
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    locale: 'es-ES',
  })

  for (const shot of CAPTURES) {
    const page = await context.newPage()
    await page.setViewportSize(shot.viewport)
    await page.goto(new URL(shot.url, baseUrl).href, {
      waitUntil: 'networkidle',
    })
    await page.waitForTimeout(800)

    const target = path.join(outDir, shot.file)

    if (shot.boxersClip) {
      await page.waitForSelector('.boxers-page')
      await page.waitForSelector('[data-boxers-grid]')
      const clip = await getBoxersContentClip(page, shot.boxersClip.maxHeight)
      if (!clip) {
        throw new Error(`Could not compute boxers clip for ${shot.file}`)
      }
      await page.screenshot({ path: target, clip })
      console.log(`  saved ${target} (${clip.width}x${clip.height} clip)`)
    } else {
      await page.screenshot({ path: target })
      console.log(`  saved ${target}`)
    }

    await page.close()
  }

  await browser.close()
}

async function resolveServerUrl(label, cwd, port, explicitUrl, procHolder) {
  if (explicitUrl) return explicitUrl.replace(/\/$/, '')

  if (SKIP_SERVERS) {
    return `http://127.0.0.1:${port}`
  }

  console.log(`starting ${label} dev server on :${port} (${cwd})…`)
  const proc = startDev(cwd, port)
  procHolder.push(proc)
  return waitForServer(port)
}

async function main() {
  const wantsBefore = CAPTURE_MODE === 'before' || CAPTURE_MODE === 'both'
  const wantsAfter = CAPTURE_MODE === 'after' || CAPTURE_MODE === 'both'

  if (!wantsBefore && !wantsAfter) {
    throw new Error(`invalid CAPTURE_MODE="${CAPTURE_MODE}" (use before|after|both)`)
  }

  if (wantsBefore) await ensureWorktree()
  if (wantsBefore && !SKIP_SERVERS) await ensureWorktreeDeps()

  const servers = []

  try {
    if (wantsBefore) {
      const beforeUrl = await resolveServerUrl(
        'before',
        WORKTREE,
        BEFORE_PORT,
        process.env.BEFORE_URL,
        servers,
      )
      await captureScreenshots(beforeUrl, path.join(SCREENSHOTS_ROOT, 'before'))
    }

    if (wantsAfter) {
      const afterUrl = await resolveServerUrl(
        'after',
        ROOT,
        AFTER_PORT,
        process.env.AFTER_URL,
        servers,
      )
      await captureScreenshots(afterUrl, path.join(SCREENSHOTS_ROOT, 'after'))
    }

    console.log('\ndone.')
  } finally {
    for (const proc of servers) stopDev(proc)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
