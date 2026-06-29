import { expect, test } from '@playwright/test'

test.describe('Listado de boxeadores', () => {
  test('muestra el título de la página', async ({ page }) => {
    await page.goto('/boxeadores')
    await expect(page.locator('main h1')).toBeVisible()
  })

  test('ofrece enlaces a las fichas de los boxeadores', async ({ page }) => {
    await page.goto('/boxeadores')
    const profileLinks = page.locator('a[href^="/boxeadores/"]')
    expect(await profileLinks.count()).toBeGreaterThan(0)
  })

  test('al abrir una ficha navega a su perfil', async ({ page }) => {
    await page.goto('/boxeadores')
    await page.locator('a[href^="/boxeadores/"]').first().click()
    await expect(page).toHaveURL(/\/boxeadores\/[a-z0-9-]+$/)
  })
})
