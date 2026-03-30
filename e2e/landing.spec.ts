import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads with 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('displays event date and venue', async ({ page }) => {
    await expect(page.locator('time', { hasText: '25 DE JULIO' })).toBeVisible()
    await expect(page.locator('time', { hasText: '20:00H CET' })).toBeVisible()
    await expect(page.locator('span', { hasText: 'ESTADIO DE LA CARTUJA, SEVILLA' })).toBeVisible()
  })

  test('displays countdown timer', async ({ page }) => {
    await expect(page.locator('[data-days]')).toBeVisible()
    await expect(page.locator('[data-hours]')).toBeVisible()
    await expect(page.locator('[data-minutes]')).toBeVisible()
    await expect(page.locator('[data-seconds]')).toBeVisible()
  })

  test('shows sold out button', async ({ page }) => {
    await expect(page.getByText('ENTRADAS AGOTADAS')).toBeVisible()
  })

  test('displays social links', async ({ page }) => {
    await expect(page.getByLabel('Seguir a Ibai en Twitch')).toBeVisible()
    await expect(page.getByLabel('Seguir a Ibai Llanos en TikTok')).toBeVisible()
    await expect(page.getByLabel('Seguir a Ibai Llanos en YouTube')).toBeVisible()
  })

  test('displays InfoJobs sponsor', async ({ page }) => {
    await expect(page.getByText('Web patrocinada por')).toBeVisible()
    await expect(page.getByLabel('Ir a la página web de InfoJobs')).toBeVisible()
  })

  test('has correct JSON-LD structured data', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(jsonLd || '{}')

    expect(data['@type']).toBe('Event')
    expect(data.name).toBe('La Velada del Año VI')
    expect(data.startDate).toBe('2026-07-25T20:00:00+02:00')
    expect(data.location.name).toBe('Estadio La Cartuja de Sevilla')
    expect(data.offers.availability).toBe('https://schema.org/SoldOut')
  })

  test('has correct meta tags', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain('La Velada del Año VI')

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('La Velada del Año VI')
  })
})
