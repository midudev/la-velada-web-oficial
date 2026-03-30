import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('combates overview → combat detail', async ({ page }) => {
    await page.goto('/combates')
    await page.locator('a[href*="10-grefg-vs-illojuan"]').first().click()
    await expect(page).toHaveURL(/combates\/10-grefg-vs-illojuan/)
  })

  test('404 page for invalid route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})

test.describe('Responsive', () => {
  test('landing page renders on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.locator('time', { hasText: '25 DE JULIO' })).toBeVisible()
    await expect(page.locator('span', { hasText: 'ENTRADAS AGOTADAS' })).toBeVisible()
  })

  test('combates page renders on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/combates')
    await expect(page.getByText('LOS COMBATES')).toBeVisible()
  })
})

test.describe('API', () => {
  test('predictions endpoint responds', async ({ request }) => {
    const response = await request.get('/api/predictions')
    // 500 expected without real DB, but not 404 (route is active)
    expect([200, 500]).toContain(response.status())
  })

  test('predictions API is reachable (not 404)', async ({ request }) => {
    const response = await request.get('/api/predictions')
    // Route exists: 200 with DB, 500 without DB, never 404
    expect(response.status()).not.toBe(404)
  })
})
