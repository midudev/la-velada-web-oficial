import { expect, test } from '@playwright/test'

const NAV_ROUTES = [
  { label: 'Boxeadores', path: '/boxeadores' },
  { label: 'Combates', path: '/combates' },
  { label: 'Artistas', path: '/artistas' },
] as const

test.describe('Navegación principal', () => {
  for (const { label, path } of NAV_ROUTES) {
    test(`navega a ${path} desde la cabecera`, async ({ page }) => {
      await page.goto('/')
      const nav = page.getByRole('navigation', { name: 'Navegación principal' })
      await nav.locator(`a[href="${path}"]`).first().click()
      await expect(page).toHaveURL(new RegExp(`${path}/?$`))
    })
  }

  test('el logo devuelve al inicio', async ({ page }) => {
    await page.goto('/combates')
    await page.getByRole('link', { name: 'La Velada del Año VI - Inicio' }).click()
    // El logo debe llevar exactamente a la raíz, no a cualquier ruta que acabe
    // en "/". `toHaveURL('/')` la resuelve contra baseURL y exige coincidencia
    // exacta, manteniendo además la espera automática de Playwright.
    await expect(page).toHaveURL('/')
  })
})
