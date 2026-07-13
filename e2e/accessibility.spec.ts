import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/boxeadores', '/combates', '/artistas']

test.describe('Accesibilidad básica', () => {
  for (const route of ROUTES) {
    test.describe(`ruta ${route}`, () => {
      test('expone un único <h1> y las regiones landmark', async ({ page }) => {
        await page.goto(route)
        // Acotado a `main` para ignorar los <h1> que la barra de herramientas de
        // `astro dev` inyecta en shadow DOM (no existen en producción).
        await expect(page.locator('main h1')).toHaveCount(1)
        await expect(page.locator('main')).toBeVisible()
        await expect(page.locator('footer')).toBeVisible()
      })

      test('todas las imágenes tienen atributo alt', async ({ page }) => {
        await page.goto(route)
        // `alt=""` es válido para imágenes decorativas; solo marcamos las que
        // carecen por completo del atributo.
        await expect(page.locator('img:not([alt])')).toHaveCount(0)
      })
    })
  }
})
