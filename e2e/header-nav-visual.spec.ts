import { expect, test, type Locator, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const phase = process.env.CAPTURE_PHASE === 'before' ? 'before' : 'after'
const isAfter = phase === 'after'
const root = path.join('docs', 'pr', 'nav-patch', phase)
const screenshotDir = path.join(root, 'screenshots')
const videoDir = path.join(root, 'videos')
const shot = (name: string) => path.join(screenshotDir, name)

const DESKTOP = { width: 2560, height: 1440 }
const MOBILE = { width: 390, height: 844 }
const HOLD_MS = 2500
const MOBILE_MENU_LOGO_MS = 700

async function goHome(page: Page) {
  await page.setViewportSize(DESKTOP)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function resetCaptureZoom(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('[data-capture-zoom]').forEach((node) => {
      const el = node as HTMLElement
      el.removeAttribute('data-capture-zoom')
      el.style.transform = ''
      el.style.transformOrigin = ''
    })
    document.documentElement.style.overflow = ''
  })
}

type ClipBox = { x: number; y: number; width: number; height: number }

function clipScaledElement(
  box: ClipBox,
  scale: number,
  origin: 'left center' | 'top center',
  viewport: { width: number; height: number },
  pad = 32,
): ClipBox {
  let x: number
  let y: number
  let width: number
  let height: number

  if (origin === 'left center') {
    width = box.width * scale + pad * 2
    height = box.height * scale + pad * 2
    x = box.x - pad
    y = box.y + box.height / 2 - (box.height * scale) / 2 - pad
  } else {
    width = box.width * scale + pad * 2
    height = box.height * scale + pad * 2
    x = box.x + box.width / 2 - (box.width * scale) / 2 - pad
    y = box.y - pad
  }

  x = Math.max(0, Math.floor(x))
  y = Math.max(0, Math.floor(y))
  width = Math.min(Math.ceil(width), viewport.width - x)
  height = Math.min(Math.ceil(height), viewport.height - y)
  return { x, y, width, height }
}

async function screenshotScaledHover(
  page: Page,
  target: Locator,
  path: string,
  scale: number,
  origin: 'left center' | 'top center',
) {
  const box = await target.boundingBox()
  expect(box).not.toBeNull()
  const viewport = page.viewportSize() ?? DESKTOP
  await page.screenshot({
    path,
    clip: clipScaledElement(box!, scale, origin, viewport),
  })
}

async function zoomCaptureTarget(page: Page, selector: string, scale: number, origin: string) {
  await page.evaluate(
    ({ sel, s, o }) => {
      const el = document.querySelector(sel) as HTMLElement | null
      if (!el) return
      el.setAttribute('data-capture-zoom', 'true')
      el.style.transform = `scale(${s})`
      el.style.transformOrigin = o
      document.documentElement.style.overflow = 'hidden'
    },
    { sel: selector, s: scale, o: origin },
  )
}

test.describe(`header visuals (${phase})`, () => {
  test.beforeAll(() => {
    fs.mkdirSync(screenshotDir, { recursive: true })
    fs.mkdirSync(videoDir, { recursive: true })
  })

  test.afterEach(async ({ context }, testInfo) => {
    const videoPath = testInfo.video?.path
    if (videoPath) {
      const slug = testInfo.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      fs.copyFileSync(videoPath, path.join(videoDir, `${slug}-playwright.webm`))
    }
    await context.close()
  })

  test('overview', async ({ page }) => {
    test.setTimeout(60_000)
    await goHome(page)

    const header = page.locator('[data-header]')
    await expect(header).toBeVisible()
    await header.screenshot({ path: shot('01-header-default.png') })
    await page.screenshot({
      path: shot('01-header-context.png'),
      clip: { x: 0, y: 0, width: DESKTOP.width, height: 160 },
    })

    await page.evaluate(() => window.scrollTo(0, 80))
    await page.waitForTimeout(400)
    await header.screenshot({ path: shot('02-header-scrolled.png') })

    if (!isAfter) return

    await page.setViewportSize(MOBILE)
    await page.goto('/')
    await page.getByRole('button', { name: /abrir menú/i }).click()
    await expect(page.locator('[data-mobile-menu][data-open="true"]')).toBeVisible()
    await page.waitForTimeout(MOBILE_MENU_LOGO_MS)

    await page.screenshot({ path: shot('05-mobile-menu-open.png') })
    await page.locator('[data-header] > div.mx-auto').screenshot({ path: shot('06-mobile-header-logo.png') })
  })

  test('logo hover', async ({ page }) => {
    test.setTimeout(60_000)
    await goHome(page)

    const logoLink = page.getByRole('link', { name: /la velada del año vi/i })
    await expect(logoLink).toBeVisible()

    const logoScale = isAfter ? 5 : 3
    await zoomCaptureTarget(
      page,
      'a[aria-label*="La Velada del Año"]',
      logoScale,
      'left center',
    )
    await page.waitForTimeout(150)
    await logoLink.hover({ force: true })
    await page.waitForTimeout(isAfter ? 750 : 400)

    await screenshotScaledHover(page, logoLink, shot('03-logo-hover-framed.png'), logoScale, 'left center')
    if (isAfter) {
      await logoLink.locator('svg').screenshot({ path: shot('03-svg-logo-hover.png') })
    } else {
      await logoLink.locator('img').screenshot({ path: shot('03-logo-hover.png') })
    }

    await page.waitForTimeout(HOLD_MS)
    await resetCaptureZoom(page)
  })

  test('nav underline hover', async ({ page }) => {
    test.setTimeout(60_000)
    await goHome(page)

    const boxeadores = page.getByRole('link', { name: /boxeadores/i }).first()
    await expect(boxeadores).toBeVisible()

    const navScale = isAfter ? 4 : 3
    const nav = page.locator(
      isAfter ? '[data-testid="header-nav"]' : 'nav[aria-label="Navegación principal"]',
    )
    await zoomCaptureTarget(page, isAfter ? '[data-testid="header-nav"]' : 'nav[aria-label="Navegación principal"]', navScale, 'top center')
    await page.waitForTimeout(150)
    await boxeadores.hover({ force: true })
    await page.waitForTimeout(isAfter ? 400 : 250)

    await screenshotScaledHover(page, nav, shot('04-header-nav-hover.png'), navScale, 'top center')

    const navCell = isAfter
      ? page.locator('[data-nav-item="boxeadores"]')
      : boxeadores
    await navCell.screenshot({
      path: shot(isAfter ? '04-nav-underline-hover.png' : '04-nav-hover.png'),
    })

    await page.waitForTimeout(HOLD_MS)
    await resetCaptureZoom(page)
  })
})
