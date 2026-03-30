import { test, expect } from '@playwright/test'

test.describe('Combates Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/combates')
  })

  test('loads with 200 status', async ({ page }) => {
    const response = await page.goto('/combates')
    expect(response?.status()).toBe(200)
  })

  test('displays page title', async ({ page }) => {
    await expect(page.getByText('LOS COMBATES')).toBeVisible()
  })

  test('renders all 10 combats', async ({ page }) => {
    const combatLinks = page.locator('a[href^="combates/"]')
    await expect(combatLinks).toHaveCount(10)
  })

  test('each combat has fighter images', async ({ page }) => {
    const fighterImages = page.locator('img[src*="/images/fighters/combat/"]')
    // 10 combats × 2 fighters + 10 VS images = 30
    const count = await fighterImages.count()
    expect(count).toBeGreaterThanOrEqual(20)
  })

  test('no VICTORIA badges shown (no winners yet)', async ({ page }) => {
    await expect(page.getByText('VICTORIA')).toHaveCount(0)
  })

  test('combat links navigate to detail pages', async ({ page }) => {
    const firstLink = page.locator('a[href*="grefg-vs-illojuan"]').first()
    await firstLink.click()
    await expect(page).toHaveURL(/combates\/10-grefg-vs-illojuan/)
  })
})

test.describe('Combat Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/combates/10-grefg-vs-illojuan')
  })

  test('loads with 200 status', async ({ page }) => {
    const response = await page.goto('/combates/10-grefg-vs-illojuan')
    expect(response?.status()).toBe(200)
  })

  test('displays fighter stats', async ({ page }) => {
    await expect(page.getByText('EDAD')).toBeVisible()
    await expect(page.getByText('ALTURA')).toBeVisible()
    await expect(page.getByText('PESO')).toBeVisible()
    await expect(page.getByText('PAÍS')).toBeVisible()
  })

  test('displays country flags', async ({ page }) => {
    const flags = page.locator('img[alt*="Bandera"]')
    await expect(flags.first()).toBeVisible()
  })

  test('has correct meta description', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('Grefg')
    expect(description).toContain('IlloJuan')
    expect(description).toContain('La Velada del Año VI')
  })

  test('does not show video section (no video yet)', async ({ page }) => {
    await expect(page.locator('lite-youtube')).toHaveCount(0)
  })

  test('returns 404 for invalid combat id', async ({ page }) => {
    const response = await page.goto('/combates/nonexistent-combat')
    expect(response?.status()).toBe(404)
  })
})
