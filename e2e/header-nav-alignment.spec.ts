import { expect, test } from '@playwright/test'

const NAV_ITEMS = ['boxeadores', 'combates', 'pronosticos'] as const
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }
const CENTER_TOLERANCE_PX = 4

function centerY(box: { y: number; height: number }) {
  return box.y + box.height / 2
}

test.describe('header desktop nav alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/')
    await expect(page.getByTestId('header-nav')).toBeVisible()
  })

  test('nav columns share the same stretched height', async ({ page }) => {
    const heights = await Promise.all(
      NAV_ITEMS.map(async (id) => {
        const box = await page.locator(`[data-nav-item="${id}"]`).boundingBox()
        expect(box).not.toBeNull()
        return box!.height
      }),
    )

    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1)
  })

  test('nav columns are vertically middle-aligned with each other', async ({ page }) => {
    const columnCenters = await Promise.all(
      NAV_ITEMS.map(async (id) => {
        const box = await page.locator(`[data-nav-item="${id}"]`).boundingBox()
        expect(box).not.toBeNull()
        return centerY(box!)
      }),
    )

    const spread = Math.max(...columnCenters) - Math.min(...columnCenters)
    expect(spread).toBeLessThanOrEqual(CENTER_TOLERANCE_PX)
  })

  test('boxeadores sits in the middle of the combates label+pill block', async ({ page }) => {
    const combates = page.locator('[data-nav-item="combates"]')
    const combatesLabel = combates.getByRole('link', { name: /combates/i })
    const combatesNote = combates.getByText('PRÓXIMAMENTE')

    const labelBox = await combatesLabel.boundingBox()
    const noteBox = await combatesNote.boundingBox()
    const boxeadoresBox = await page
      .locator('[data-nav-item="boxeadores"]')
      .getByRole('link', { name: /boxeadores/i })
      .boundingBox()

    expect(labelBox).not.toBeNull()
    expect(noteBox).not.toBeNull()
    expect(boxeadoresBox).not.toBeNull()

    const combatesBlockCenter =
      (labelBox!.y + noteBox!.y + noteBox!.height) / 2

    expect(Math.abs(centerY(boxeadoresBox!) - combatesBlockCenter)).toBeLessThanOrEqual(
      CENTER_TOLERANCE_PX,
    )
  })

  test('logo row is vertically centered with the full nav block', async ({ page }) => {
    const headerBar = page.locator('[data-header] > div').first()
    const logoLink = page.getByRole('link', { name: /la velada del año vi/i })
    const nav = page.getByTestId('header-nav')

    const barBox = await headerBar.boundingBox()
    const logoBox = await logoLink.boundingBox()
    const navBox = await nav.boundingBox()

    expect(barBox).not.toBeNull()
    expect(logoBox).not.toBeNull()
    expect(navBox).not.toBeNull()

    expect(Math.abs(centerY(logoBox!) - centerY(navBox!))).toBeLessThanOrEqual(
      CENTER_TOLERANCE_PX,
    )
  })
})
