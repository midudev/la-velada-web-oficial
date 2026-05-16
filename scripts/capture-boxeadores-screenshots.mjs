/**
 * Before/after captures for /boxeadores alignment PR (mobile + desktop only).
 * Usage: SCREENSHOT_DIR=pr-assets/screenshots/before node scripts/capture-boxeadores-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321'
const OUT_DIR = path.resolve(
  process.cwd(),
  process.env.SCREENSHOT_DIR ?? 'pr-assets/screenshots',
)

const BOXERS_CLIP_MAX_DESKTOP = Number(process.env.BOXERS_CLIP_HEIGHT ?? 2100)
const BOXERS_CLIP_MAX_MOBILE = Number(process.env.BOXERS_CLIP_HEIGHT_MOBILE ?? 2800)
const BOXERS_VIEWPORT_HEIGHT = Number(process.env.BOXERS_VIEWPORT_HEIGHT ?? 1920)

const CAPTURES = [
  {
    file: 'boxeadores-mobile.png',
    viewport: { width: 390, height: BOXERS_VIEWPORT_HEIGHT },
    maxHeight: BOXERS_CLIP_MAX_MOBILE,
  },
  {
    file: 'boxeadores-desktop.png',
    viewport: { width: 1440, height: BOXERS_VIEWPORT_HEIGHT },
    maxHeight: BOXERS_CLIP_MAX_DESKTOP,
  },
]

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

async function capture() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    locale: 'es-ES',
  })

  for (const shot of CAPTURES) {
    const page = await context.newPage()
    await page.setViewportSize(shot.viewport)
    await page.goto(new URL('/boxeadores', BASE_URL).href, {
      waitUntil: 'networkidle',
    })
    await page.waitForTimeout(800)
    await page.waitForSelector('.boxers-page')
    await page.waitForSelector('[data-boxers-grid]')

    const clip = await getBoxersContentClip(page, shot.maxHeight)
    if (!clip) {
      throw new Error(`Could not compute boxers clip for ${shot.file}`)
    }

    await page.screenshot({
      path: path.join(OUT_DIR, shot.file),
      clip,
    })
    console.log(
      `saved ${path.join(OUT_DIR, shot.file)} (${clip.width}x${clip.height})`,
    )
    await page.close()
  }

  await browser.close()
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
