import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/boxeadores', '/combates', '/artistas']

test.describe('Metadatos SEO', () => {
  for (const route of ROUTES) {
    test.describe(`ruta ${route}`, () => {
      test('declara el idioma español en <html>', async ({ page }) => {
        await page.goto(route)
        await expect(page.locator('html')).toHaveAttribute('lang', 'es')
      })

      test('tiene título y meta descripción no vacíos', async ({ page }) => {
        await page.goto(route)
        expect((await page.title()).trim().length).toBeGreaterThan(0)
        const description = await page.locator('meta[name="description"]').getAttribute('content')
        expect(description?.trim().length ?? 0).toBeGreaterThan(0)
      })

      test('define canonical y open graph', async ({ page }) => {
        await page.goto(route)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//)
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/)
      })
    })
  }
})
