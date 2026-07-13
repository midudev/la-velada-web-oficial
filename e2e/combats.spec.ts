import { expect, test } from '@playwright/test'

test.describe('Listado de combates', () => {
  test('muestra enlaces a las páginas de combate', async ({ page }) => {
    await page.goto('/combates')
    const combatLinks = page.locator('a[href^="/combate/"]')
    expect(await combatLinks.count()).toBeGreaterThan(0)
  })

  test('al abrir un combate navega a su detalle', async ({ page }) => {
    await page.goto('/combates')
    await page.locator('a[href^="/combate/"]').first().click()
    await expect(page).toHaveURL(/\/combate\/[a-z0-9-]+-vs-[a-z0-9-]+$/)
  })
})
