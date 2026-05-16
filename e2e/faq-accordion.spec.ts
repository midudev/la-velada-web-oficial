import { expect, test, type Page } from '@playwright/test'

const PANEL_MS = 280

async function prepareLastFaqClosed(page: Page) {
  const first = page.locator('#faq .faq-item').first()
  if (await first.getAttribute('open')) {
    await first.locator('.faq-summary').click()
    await expect(first).not.toHaveAttribute('open', { timeout: 2_000 })
  }
}

async function waitForFaqBound(page: Page) {
  await page.waitForFunction(
    () => document.querySelector('.faq-item[data-faq-bound="true"]') != null,
  )
}

test.describe('FAQ accordion (reduced motion)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#faq')
    await page.locator('#faq').scrollIntoViewIfNeeded()
  })

  test('first item starts open', async ({ page }) => {
    const items = page.locator('#faq .faq-item')
    await expect(items.first()).toHaveAttribute('open', '')
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(1)
  })

  test('opens another item and closes the previous one', async ({ page }) => {
    const items = page.locator('#faq .faq-item')
    const first = items.first()
    const second = items.nth(1)

    await second.locator('.faq-summary').click()

    await expect(second).toHaveAttribute('open', '')
    await expect(first).not.toHaveAttribute('open')
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(1)
  })

  test('closes the open item when clicked again', async ({ page }) => {
    const first = page.locator('#faq .faq-item').first()

    await first.locator('.faq-summary').click()

    await expect(first).not.toHaveAttribute('open')
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(0)
  })

  test('switches across several items', async ({ page }) => {
    const items = page.locator('#faq .faq-item')
    const count = await items.count()

    for (let index = 1; index < Math.min(count, 4); index += 1) {
      const item = items.nth(index)
      await item.locator('.faq-summary').click()
      await expect(item).toHaveAttribute('open', '')
      await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(1)
    }
  })
})

test.describe('FAQ accordion (animated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/#faq')
    await page.locator('#faq').scrollIntoViewIfNeeded()
    await waitForFaqBound(page)
  })

  test('opens and closes with custom click handler', async ({ page }) => {
    const items = page.locator('#faq .faq-item')
    const first = items.first()
    const second = items.nth(1)

    await second.locator('.faq-summary').click()
    await expect(second).toHaveAttribute('open', '', { timeout: 2_000 })
    await expect(first).not.toHaveAttribute('open', { timeout: 2_000 })
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(1, { timeout: 2_000 })

    await second.locator('.faq-summary').click()
    await expect(second).not.toHaveAttribute('open', { timeout: 2_000 })
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(0, { timeout: 2_000 })
  })

  test('rapid switching keeps a single open item', async ({ page }) => {
    const items = page.locator('#faq .faq-item')

    await items.nth(1).locator('.faq-summary').click()
    await items.nth(2).locator('.faq-summary').click()
    await items.nth(3).locator('.faq-summary').click()

    await expect(page.locator('#faq .faq-item[open]')).toHaveCount(1, { timeout: 3_000 })
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(1, { timeout: 3_000 })
  })

  test('icon always turns clockwise on toggle', async ({ page }) => {
    const icon = page.locator('#faq .faq-item').first().locator('.faq-icon')
    const readDeg = () => icon.evaluate((el) => Number((el as HTMLElement).dataset.faqIconDeg ?? 0))

    const openDeg = await readDeg()
    expect(openDeg).toBeGreaterThan(0)

    await page.locator('#faq .faq-item').first().locator('.faq-summary').click()
    await expect(page.locator('#faq .faq-item').first()).not.toHaveAttribute('open', {
      timeout: 2_000,
    })

    const afterCloseDeg = await readDeg()
    expect(afterCloseDeg).toBeGreaterThan(openDeg)

    await page.locator('#faq .faq-item').first().locator('.faq-summary').click()
    await expect(page.locator('#faq .faq-item').first()).toHaveAttribute('open', {
      timeout: 2_000,
    })

    const afterReopenDeg = await readDeg()
    expect(afterReopenDeg).toBeGreaterThan(afterCloseDeg)
  })

  test('each item has a top divider and the list has no bottom border', async ({ page }) => {
    const wraps = page.locator('#faq .faq-item-wrap')
    const count = await wraps.count()

    for (let index = 0; index < count; index += 1) {
      await expect(wraps.nth(index).locator('.faq-divider')).toHaveCount(1)
    }

    const borderBottomWidth = await page.locator('.faq-list').evaluate(
      (el) => getComputedStyle(el).borderBottomWidth,
    )
    expect(borderBottomWidth).toBe('0px')
  })

  test('last item uses the same grid panel animation as other items', async ({ page }) => {
    await prepareLastFaqClosed(page)

    const shell = page.locator('.faq-item-wrap--last .faq-answer-shell')

    await expect(shell).toHaveCSS('display', 'grid')
    await expect(shell).not.toHaveClass(/faq-answer-shell--open/)

    await page.locator('.faq-item-wrap--last .faq-summary').click()
    await expect(page.locator('.faq-item-wrap--last .faq-item')).toHaveAttribute('open', '', {
      timeout: 2_000,
    })
    await expect(shell).toHaveClass(/faq-answer-shell--open/)
    await page.waitForTimeout(PANEL_MS + 80)

    const openRows = await shell.evaluate((el) => getComputedStyle(el).gridTemplateRows)
    expect(Number.parseFloat(openRows)).toBeGreaterThan(10)
  })
})
