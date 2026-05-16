import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const phase = process.env.CAPTURE_PHASE === 'before' ? 'before' : 'after'
const artifactRoot = path.join('docs', 'pr', 'nav-patch', phase)
const screenshotDir = path.join(artifactRoot, 'screenshots')

const DESKTOP = { width: 1280, height: 720 }

test.describe.configure({ mode: 'serial' })

test.describe(`header visuals (${phase})`, () => {
  test.beforeAll(() => {
    fs.mkdirSync(screenshotDir, { recursive: true })
  })

  test('capture header states', async ({ page }) => {
    test.setTimeout(60_000)

    await page.setViewportSize(DESKTOP)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const header = page.locator('[data-header]')
    await expect(header).toBeVisible()

    const desktopNav =
      phase === 'after'
        ? page.getByTestId('header-nav')
        : page.getByRole('navigation', { name: 'Navegación principal' })

    await expect(desktopNav).toBeVisible()

    await header.screenshot({ path: path.join(screenshotDir, '01-header-default.png') })

    await page.evaluate(() => window.scrollTo(0, 80))
    await page.waitForTimeout(400)
    await header.screenshot({ path: path.join(screenshotDir, '02-header-scrolled.png') })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)

    const logo = page.getByRole('link', { name: /la velada del año vi/i })
    await logo.hover()
    await page.waitForTimeout(phase === 'after' ? 650 : 400)
    await header.screenshot({ path: path.join(screenshotDir, '03-logo-hover.png') })

    const boxeadores = page.getByRole('link', { name: /boxeadores/i }).first()
    await boxeadores.hover()
    await page.waitForTimeout(phase === 'after' ? 300 : 200)
    await header.screenshot({ path: path.join(screenshotDir, '04-boxeadores-hover.png') })

    if (phase === 'after') {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      await page.getByRole('button', { name: /abrir menú/i }).click()
      await expect(page.locator('[data-mobile-menu][data-open="true"]')).toBeVisible()
      await page.waitForTimeout(350)
      await page.locator('[data-mobile-menu]').screenshot({
        path: path.join(screenshotDir, '05-mobile-menu.png'),
      })
    }

    await page.waitForTimeout(300)
  })
})
