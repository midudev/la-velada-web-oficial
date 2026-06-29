import { expect, test } from '@playwright/test'

test.describe('Página 404', () => {
  test('una ruta desconocida responde con estado 404', async ({ page }) => {
    const response = await page.goto('/esta-ruta-no-existe-12345')
    expect(response?.status()).toBe(404)
  })

  test('muestra contenido de error y permite volver al inicio', async ({ page }) => {
    await page.goto('/esta-ruta-no-existe-12345')
    await expect(page.getByText('404').first()).toBeVisible()
    await expect(page.locator('a[href="/"]').first()).toBeVisible()
  })
})
