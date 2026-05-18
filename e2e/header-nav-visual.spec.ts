import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const phase = process.env.CAPTURE_PHASE === 'before' ? 'before' : 'after'
const isAfter = phase === 'after'
const root = path.join('docs', 'pr', 'nav-patch', phase)
const screenshotDir = path.join(root, 'screenshots')
const videoDir = path.join(root, 'videos')
const shot = (name: string) => path.join(screenshotDir, name)

const DESKTOP = { width: 2560, height: 1440 }
const HOLD_MS = 2500

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

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: /abrir menú/i }).click()
    await expect(page.locator('[data-mobile-menu][data-open="true"]')).toBeVisible()
    await page.waitForTimeout(350)
    await page.locator('[data-mobile-menu]').screenshot({ path: shot('05-mobile-menu.png') })
    await page.locator('[data-header]').screenshot({ path: shot('06-header-menu-open.png') })
  })

  test('logo hover', async ({ page }) => {
    test.setTimeout(60_000)
    await goHome(page)

    const logoLink = page.getByRole('link', { name: /la velada del año vi/i })
    await expect(logoLink).toBeVisible()

    await zoomCaptureTarget(
      page,
      'a[aria-label*="La Velada del Año"]',
      isAfter ? 9 : 5,
      'left center',
    )
    await page.waitForTimeout(150)
    await logoLink.hover({ force: true })
    await page.waitForTimeout(isAfter ? 750 : 400)

    await logoLink.screenshot({ path: shot('03-logo-hover-framed.png') })
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

    await zoomCaptureTarget(
      page,
      isAfter ? '[data-testid="header-nav"]' : 'nav[aria-label="Navegación principal"]',
      isAfter ? 6 : 4,
      'top center',
    )
    await page.waitForTimeout(150)
    await boxeadores.hover({ force: true })
    await page.waitForTimeout(isAfter ? 400 : 250)

    await page.locator('[data-header]').screenshot({ path: shot('04-header-nav-hover.png') })

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
