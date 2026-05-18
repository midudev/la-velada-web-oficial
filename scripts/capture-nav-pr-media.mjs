/**
 * PR nav captures without Playwright tests or CSS zoom (avoids layout shift).
 * Screenshots: viewport / padded clips only. Videos: PNG frame sequences + ffmpeg.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const DESKTOP = { width: 2560, height: 1440 }
const MOBILE = { width: 390, height: 844 }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function ffmpegBin() {
  try {
    return require('@ffmpeg-installer/ffmpeg').path
  } catch {
    return 'ffmpeg'
  }
}

function shotDir(phase) {
  return path.join(root, 'docs', 'pr', 'nav-patch', phase, 'screenshots')
}

function videoDir(phase) {
  return path.join(root, 'docs', 'pr', 'nav-patch', phase, 'videos')
}

function framesDir(phase, slug) {
  return path.join(root, 'docs', 'pr', 'nav-patch', phase, '.frames', slug)
}

function even(n) {
  const v = Math.max(2, Math.ceil(n))
  return v % 2 === 0 ? v : v + 1
}

function clampClip(clip, viewport) {
  const x = Math.max(0, Math.floor(clip.x))
  const y = Math.max(0, Math.floor(clip.y))
  const width = even(Math.min(Math.ceil(clip.width), viewport.width - x))
  const height = even(Math.min(Math.ceil(clip.height), viewport.height - y))
  return { x, y, width, height }
}

function clipAroundBox(box, viewport, { padX = 48, padY = 40, scale = 2.2, origin = 'left-center' } = {}) {
  if (!box) throw new Error('Missing element box for clip')
  let width = box.width * scale + padX * 2
  let height = box.height * scale + padY * 2
  let x = box.x - padX
  let y =
    origin === 'left-center'
      ? box.y + box.height / 2 - height / 2
      : box.y - padY
  return clampClip({ x, y, width, height }, viewport)
}

async function runFfmpeg(args) {
  const { spawn } = await import('node:child_process')
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegBin(), args, { stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
  })
}

async function encodeFrames(framesPath, outDir, baseName) {
  const pattern = path.join(framesPath, 'frame-%04d.png')
  const webm = path.join(outDir, `${baseName}.webm`)
  const mp4 = path.join(outDir, `${baseName}.mp4`)

  await runFfmpeg([
    '-y',
    '-framerate',
    '30',
    '-i',
    pattern,
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '24M',
    '-crf',
    '14',
    '-pix_fmt',
    'yuv420p',
    '-an',
    webm,
  ])

  try {
    await runFfmpeg([
      '-y',
      '-framerate',
      '30',
      '-i',
      pattern,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '16',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
      mp4,
    ])
  } catch {
    // mp4 optional
  }
}

async function recordFrames(page, dir, clip, frameCount, onFrame) {
  fs.mkdirSync(dir, { recursive: true })
  fs.readdirSync(dir).forEach((f) => fs.unlinkSync(path.join(dir, f)))

  for (let i = 0; i < frameCount; i++) {
    if (onFrame) await onFrame(i)
    await page.screenshot({
      path: path.join(dir, `frame-${String(i).padStart(4, '0')}.png`),
      clip,
    })
    await sleep(1000 / 30)
  }
}

async function gotoHome(page, baseURL) {
  await page.setViewport(DESKTOP)
  await page.goto(baseURL, { waitUntil: 'networkidle2', timeout: 120_000 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(400)
}

async function box(page, selector) {
  const el = await page.$(selector)
  if (!el) throw new Error(`Missing selector: ${selector}`)
  const box = await el.boundingBox()
  if (!box) throw new Error(`No bounding box: ${selector}`)
  return { el, box }
}

async function captureDesktop(page, phase, baseURL, isAfter) {
  const screenshots = shotDir(phase)
  const videos = videoDir(phase)
  fs.mkdirSync(screenshots, { recursive: true })
  fs.mkdirSync(videos, { recursive: true })

  await gotoHome(page, baseURL)

  await page.screenshot({
    path: path.join(screenshots, '01-header-context.png'),
    clip: clampClip({ x: 0, y: 0, width: DESKTOP.width, height: 160 }, DESKTOP),
  })

  const header = await page.$('[data-header]')
  if (header) {
    await header.screenshot({ path: path.join(screenshots, '01-header-default.png') })
  }

  await page.evaluate(() => window.scrollTo(0, 80))
  await sleep(400)
  if (header) {
    await header.screenshot({ path: path.join(screenshots, '02-header-scrolled.png') })
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(200)

  const logoSel = 'a[aria-label*="La Velada del Año"]'
  const { el: logo, box: logoBox } = await box(page, logoSel)
  const logoClip = clipAroundBox(logoBox, DESKTOP, { scale: isAfter ? 2.8 : 2.4 })

  await logo.hover()
  await sleep(isAfter ? 800 : 450)
  await page.screenshot({ path: path.join(screenshots, '03-logo-hover-framed.png'), clip: logoClip })

  const logoFrames = framesDir(phase, 'logo-hover')
  await recordFrames(page, logoFrames, logoClip, 45, async (i) => {
    if (i === 0) {
      await page.mouse.move(logoBox.x - 20, logoBox.y + logoBox.height / 2)
      await sleep(80)
    }
    await logo.hover()
  })
  await encodeFrames(logoFrames, videos, 'logo-hover')
  fs.rmSync(logoFrames, { recursive: true, force: true })

  const boxeadoresSel = isAfter
    ? '[data-nav-item="boxeadores"] a'
    : 'nav[aria-label="Navegación principal"] a[href*="boxeadores"]'

  const navClip = clampClip({ x: 0, y: 0, width: DESKTOP.width, height: 120 }, DESKTOP)
  const { el: navLink, box: navBox } = await box(page, boxeadoresSel)

  await navLink.hover()
  await sleep(isAfter ? 450 : 300)
  await page.screenshot({ path: path.join(screenshots, '04-header-nav-hover.png'), clip: navClip })

  const navFrames = framesDir(phase, 'nav-underline-hover')
  await recordFrames(page, navFrames, navClip, 40, async (i) => {
    if (i === 0) await page.mouse.move(navBox.x - 30, navBox.y + navBox.height / 2)
    await navLink.hover()
  })
  await encodeFrames(navFrames, videos, 'nav-underline-hover')
  fs.rmSync(navFrames, { recursive: true, force: true })

  if (!isAfter) return

  await page.setViewport(MOBILE)
  await page.goto(baseURL, { waitUntil: 'networkidle2', timeout: 120_000 })
  await sleep(300)

  const menuBtn = await page.$('[data-mobile-menu-button]')
  if (!menuBtn) throw new Error('Missing mobile menu button')
  await menuBtn.click()
  await sleep(700)

  await page.screenshot({ path: path.join(screenshots, '05-mobile-menu-open.png') })

  const headerRow = await page.$('[data-header] > div.mx-auto')
  if (headerRow) {
    await headerRow.screenshot({ path: path.join(screenshots, '06-mobile-header-logo.png') })
  }
}

export async function capturePhase(phase, baseURL) {
  const isAfter = phase === 'after'
  console.log(`\n▶ Media capture "${phase}" at ${baseURL}`)

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: DESKTOP,
    args: ['--disable-dev-shm-usage', '--no-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await captureDesktop(page, phase, baseURL, isAfter)
    console.log(`   Screenshots → docs/pr/nav-patch/${phase}/screenshots/`)
    console.log(`   Videos     → docs/pr/nav-patch/${phase}/videos/`)
  } finally {
    await browser.close()
  }
}
