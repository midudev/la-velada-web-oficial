import { expect, test } from '@playwright/test'

test.describe('Página de inicio', () => {
  test('carga con el título del evento', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/velada/i)
  })

  test('muestra la cabecera con la navegación principal', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Navegación principal' })
    await expect(nav).toBeVisible()
    await expect(page.getByRole('link', { name: 'La Velada del Año VI - Inicio' })).toBeVisible()
  })

  test('tiene exactamente un encabezado de nivel 1', async ({ page }) => {
    await page.goto('/')
    // Acotado a `main`: en `astro dev` la barra de herramientas inyecta sus
    // propios <h1> en shadow DOM (Audit, Settings…) que Playwright atraviesa.
    await expect(page.locator('main h1')).toHaveCount(1)
  })

  test('renderiza las regiones semánticas principales', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
