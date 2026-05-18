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

  test('all sponsor cards finish their intro animation promptly', async ({ page }) => {
    await page.locator('#sponsors').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)

    const opacities = await page.locator('#sponsors .sponsors-grid li').evaluateAll((els) =>
      els.map((el) => Number(window.getComputedStyle(el).opacity))
    )

    expect(opacities).toHaveLength(11)
    for (const opacity of opacities) {
      expect(opacity).toBeGreaterThan(0.95)
    }
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

    const corners = page.locator('#sponsors .corner-grid svg')
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

  test('corner clips recover after rapid hover changes', async ({ page }) => {
    const cards = page.locator('.sponsor-card')
    const corners = page.locator('#sponsors .corner-grid svg')

    for (let i = 0; i < 8; i++) {
      const box = await cards.nth(i % 4).boundingBox()
      expect(box).not.toBeNull()

      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      }
    }

    await cards.nth(4).hover()
    await page.waitForTimeout(400)

    const opacities = await corners.evaluateAll((els) =>
      els.map((el) => Number(window.getComputedStyle(el).opacity))
    )

    for (const opacity of opacities) {
      expect(opacity).toBeGreaterThan(0.85)
    }
  })

  test('corner clips stay visible while moving between sponsor cards', async ({ page }) => {
    const cards = page.locator('.sponsor-card')
    const corners = page.locator('#sponsors .corner-grid svg')

    await cards.first().hover()
    await page.waitForTimeout(400)
    await cards.nth(1).hover()
    await page.waitForTimeout(40)

    const opacities = await corners.evaluateAll((els) =>
      els.map((el) => Number(window.getComputedStyle(el).opacity))
    )

    for (const opacity of opacities) {
      expect(opacity).toBeGreaterThan(0.85)
    }
  })

  test('corner clips lock again after moving to another sponsor card', async ({ page }) => {
    const cards = page.locator('.sponsor-card')
    const corner = page.locator('#sponsors .corner-grid svg').first()
    const grid = page.locator('#sponsors [data-corner-grid]')

    await cards.first().hover()
    await page.waitForTimeout(400)
    await cards.nth(1).hover()
    await page.waitForTimeout(25)

    const earlyBox = await corner.boundingBox()
    const cardBox = await cards.nth(1).boundingBox()
    const gridBox = await grid.boundingBox()

    expect(earlyBox).not.toBeNull()
    expect(cardBox).not.toBeNull()
    expect(gridBox).not.toBeNull()

    await page.waitForTimeout(300)

    const lockedBox = await corner.boundingBox()
    expect(lockedBox).not.toBeNull()

    if (!earlyBox || !lockedBox || !cardBox || !gridBox) return

    const targetX = cardBox.x - gridBox.x + 6
    const targetY = cardBox.y - gridBox.y + 6
    const earlyDistance = Math.hypot(earlyBox.x - gridBox.x - targetX, earlyBox.y - gridBox.y - targetY)
    const lockedDistance = Math.hypot(lockedBox.x - gridBox.x - targetX, lockedBox.y - gridBox.y - targetY)

    expect(lockedDistance).toBeLessThan(earlyDistance)
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
