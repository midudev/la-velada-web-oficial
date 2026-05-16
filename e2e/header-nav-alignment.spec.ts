import { expect, test, type Page } from '@playwright/test'

const NAV_ITEMS = ['boxeadores', 'combates', 'pronosticos'] as const
const VIEWPORT = { width: 1280, height: 720 }
const TOL = 4

const centerY = (box: { y: number; height: number }) => box.y + box.height / 2

async function navItemBox(page: Page, id: (typeof NAV_ITEMS)[number]) {
  const box = await page.locator(`[data-nav-item="${id}"]`).boundingBox()
  expect(box).not.toBeNull()
  return box!
}

test.describe('header desktop nav alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT)
    await page.goto('/')
    await expect(page.getByTestId('header-nav')).toBeVisible()
  })

  test('nav columns share the same stretched height', async ({ page }) => {
    const heights = await Promise.all(NAV_ITEMS.map((id) => navItemBox(page, id).then((b) => b.height)))
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1)
  })

  test('nav columns are vertically middle-aligned with each other', async ({ page }) => {
    const centers = await Promise.all(NAV_ITEMS.map((id) => navItemBox(page, id).then(centerY)))
    expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(TOL)
  })

  test('boxeadores sits in the middle of the combates label+pill block', async ({ page }) => {
    const combates = page.locator('[data-nav-item="combates"]')
    const labelBox = await combates.getByRole('link', { name: /combates/i }).boundingBox()
    const noteBox = await combates.getByText('PRÓXIMAMENTE').boundingBox()
    const boxeadoresBox = await page
      .locator('[data-nav-item="boxeadores"]')
      .getByRole('link', { name: /boxeadores/i })
      .boundingBox()

    expect(labelBox).not.toBeNull()
    expect(noteBox).not.toBeNull()
    expect(boxeadoresBox).not.toBeNull()

    const blockCenter = (labelBox!.y + noteBox!.y + noteBox!.height) / 2
    expect(Math.abs(centerY(boxeadoresBox!) - blockCenter)).toBeLessThanOrEqual(TOL)
  })

  test('logo row is vertically centered with the full nav block', async ({ page }) => {
    const logoBox = await page.getByRole('link', { name: /la velada del año vi/i }).boundingBox()
    const navBox = await page.getByTestId('header-nav').boundingBox()

    expect(logoBox).not.toBeNull()
    expect(navBox).not.toBeNull()
    expect(Math.abs(centerY(logoBox!) - centerY(navBox!))).toBeLessThanOrEqual(TOL)
  })
})
