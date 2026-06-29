import { expect, test } from '@playwright/test'

test.describe('Ficha de boxeador', () => {
  test('muestra el nombre del boxeador en el título', async ({ page }) => {
    await page.goto('/boxeadores/plex')
    await expect(page).toHaveTitle(/plex/i)
  })

  test('expone un encabezado principal', async ({ page }) => {
    await page.goto('/boxeadores/plex')
    await expect(page.locator('main h1')).toHaveCount(1)
  })

  test('una ruta de boxeador inexistente responde 404', async ({ page }) => {
    const response = await page.goto('/boxeadores/boxeador-que-no-existe')
    expect(response?.status()).toBe(404)
  })
})
