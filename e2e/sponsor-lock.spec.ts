import { test, expect } from '@playwright/test'

test.describe('Sponsor cards hover lock effect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#sponsors')
  })

  test('sponsor cards exist and are visible', async ({ page }) => {
    const cards = page.locator('.sponsor-card')
    await expect(cards).toHaveCount(11)
    await expect(cards.first()).toBeVisible()
  })

  test('logo scales down on hover', async ({ page }) => {
    const firstCard = page.locator('.sponsor-card').first()
    const logo = firstCard.locator('svg[aria-hidden="true"]')

    const initialTransform = await logo.evaluate((el) =>
      window.getComputedStyle(el).transform
    )

    await firstCard.hover()
    await page.waitForTimeout(400)

    const hoverTransform = await logo.evaluate((el) =>
      window.getComputedStyle(el).transform
    )

    const parseScale = (matrix: string) => {
      const values = matrix.match(/matrix.*\((.+)\)/)?.[1].split(',').map(Number)
      return values ? values[0] : 1
    }

    const initialScale = parseScale(initialTransform)
    const hoverScale = parseScale(hoverTransform)

    expect(hoverScale).toBeLessThan(initialScale)
    expect(hoverScale).toBeLessThan(1)
  })

  test('corner clips appear on hover', async ({ page }) => {
    const firstCard = page.locator('.sponsor-card').first()

    const corners = firstCard.locator('[class*="corner-"]')
    await expect(corners).toHaveCount(4)

    const initialOpacities = await corners.evaluateAll((els) =>
      els.map((el) => parseFloat(window.getComputedStyle(el).opacity))
    )

    await firstCard.hover()
    await page.waitForTimeout(400)

    const hoverOpacities = await corners.evaluateAll((els) =>
      els.map((el) => parseFloat(window.getComputedStyle(el).opacity))
    )

    for (let i = 0; i < 4; i++) {
      expect(hoverOpacities[i]).toBeGreaterThan(initialOpacities[i])
    }
  })

  test('effects reverse on mouse leave', async ({ page }) => {
    const firstCard = page.locator('.sponsor-card').first()
    const logo = firstCard.locator('svg[aria-hidden="true"]')

    await firstCard.hover()
    await page.waitForTimeout(400)

    const box = await firstCard.boundingBox()
    if (box) {
      await page.mouse.move(box.x - 10, box.y - 10)
    }
    await page.waitForTimeout(300)

    const logoScale = await logo.evaluate((el) => {
      const matrix = window.getComputedStyle(el).transform
      const values = matrix.match(/matrix.*\((.+)\)/)?.[1].split(',').map(Number)
      return values ? values[0] : 1
    })

    expect(logoScale).toBeCloseTo(1, 1)
  })
})
