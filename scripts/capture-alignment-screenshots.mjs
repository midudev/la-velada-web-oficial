/**
 * Visual capture for boxing-alignment PR.
 * Usage: SCREENSHOT_DIR=pr-assets/screenshots/after node scripts/capture-alignment-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321'
const OUT_DIR = path.resolve(
  process.cwd(),
  process.env.SCREENSHOT_DIR ?? 'pr-assets/screenshots',
)

/** Alto máximo del recorte en /boxeadores (título + filtros + grid, sin footer). */
const BOXERS_CLIP_MAX_DESKTOP = Number(process.env.BOXERS_CLIP_HEIGHT ?? 2100)
const BOXERS_CLIP_MAX_MOBILE = Number(process.env.BOXERS_CLIP_HEIGHT_MOBILE ?? 2800)

/** Viewport alto al cargar /boxeadores para que pinte cards antes del clip. */
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
    await page.goto(new URL(shot.url, BASE_URL).href, {
      waitUntil: 'networkidle',
    })
    await page.waitForTimeout(800)

    if (shot.boxersClip) {
      await page.waitForSelector('.boxers-page')
      await page.waitForSelector('[data-boxers-grid]')
      const clip = await getBoxersContentClip(page, shot.boxersClip.maxHeight)
      if (!clip) {
        throw new Error(`Could not compute boxers clip for ${shot.file}`)
      }
      await page.screenshot({
        path: path.join(OUT_DIR, shot.file),
        clip,
      })
      console.log(
        `saved ${path.join(OUT_DIR, shot.file)} (${clip.width}x${clip.height} clip)`,
      )
    } else {
      await page.screenshot({
        path: path.join(OUT_DIR, shot.file),
      })
      console.log(`saved ${path.join(OUT_DIR, shot.file)}`)
    }

    await page.close()
  }

  await browser.close()
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
