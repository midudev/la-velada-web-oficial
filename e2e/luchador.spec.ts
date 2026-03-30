import { test, expect } from '@playwright/test'

test.describe('Fighter Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/luchador/grefg')
  })

  test('loads with 200 status', async ({ page }) => {
    const response = await page.goto('/luchador/grefg')
    expect(response?.status()).toBe(200)
  })

  test('displays fighter real name in profile card', async ({ page }) => {
    await expect(page.getByText('David Cánovas Martínez')).toBeVisible()
  })

  test('displays fighter stats', async ({ page }) => {
    const content = await page.content()
    expect(content).toContain('29')
    expect(content).toContain('67')
    expect(content).toContain('1.7')
  })

  test('displays fighter city and country flag', async ({ page }) => {
    const content = await page.content()
    expect(content.toLowerCase()).toContain('murcia')
  })

  test('displays fighter bio', async ({ page }) => {
    await expect(page.locator('p', { hasText: 'Youtuber y streamer murciano' })).toBeVisible()
  })

  test('displays opponent info', async ({ page }) => {
    const content = await page.content()
    expect(content).toContain('illojuan')
  })

  test('has correct meta description', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('Grefg')
    expect(description).toContain('La Velada del Año VI')
    expect(description).not.toContain('La Velada del Año V.')
  })

  test('returns 404 for invalid fighter id', async ({ page }) => {
    const response = await page.goto('/luchador/nonexistent-fighter')
    expect(response?.status()).toBe(404)
  })
})

test.describe('Fighter Profile - Different fighters', () => {
  test('loads Fernanfloo (El Salvador) profile', async ({ page }) => {
    await page.goto('/luchador/fernanfloo')
    await expect(page.getByText('Luis Fernando Flores Alvarado')).toBeVisible()
  })

  test('loads Alondrissa (Puerto Rico) profile', async ({ page }) => {
    const response = await page.goto('/luchador/alondrissa')
    expect(response?.status()).toBe(200)
  })

  test('loads all 20 fighter profiles', async ({ page }) => {
    const fighters = [
      'edu-aguirre', 'gaston-edul', 'fabiana-sevillano', 'la-parce',
      'clersss', 'natalia-mx', 'kidd-keo', 'lit-killah',
      'alondrissa', 'angie-velasco', 'viruzz', 'gero-arias',
      'samy-rivers', 'roro', 'marta-diaz', 'tatiana-kaer',
      'yosoyplex', 'fernanfloo', 'grefg', 'illojuan',
    ]

    for (const id of fighters) {
      const response = await page.goto(`/luchador/${id}`)
      expect(response?.status(), `Fighter ${id} should return 200`).toBe(200)
    }
  })
})
