import { expect, test } from '@playwright/test'

test.describe('Página de artistas', () => {
  test('carga correctamente', async ({ page }) => {
    const response = await page.goto('/artistas')
    expect(response?.status()).toBe(200)
  })

  test('tiene un encabezado principal y las regiones semánticas', async ({ page }) => {
    await page.goto('/artistas')
    await expect(page.locator('main h1')).toHaveCount(1)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
