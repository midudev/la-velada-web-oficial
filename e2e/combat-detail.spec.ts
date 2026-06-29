import { expect, test } from '@playwright/test'

test.describe('Detalle de combate', () => {
  test('el título refleja el enfrentamiento', async ({ page }) => {
    await page.goto('/combate/plex-vs-fernanfloo')
    await expect(page).toHaveTitle(/plex/i)
  })

  test('muestra a los dos contendientes', async ({ page }) => {
    await page.goto('/combate/plex-vs-fernanfloo')
    await expect(page.getByText('Plex', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Fernanfloo', { exact: false }).first()).toBeVisible()
  })

  test('un combate inexistente responde 404', async ({ page }) => {
    const response = await page.goto('/combate/nadie-vs-nadie')
    expect(response?.status()).toBe(404)
  })
})
