import { expect, test, type Page } from '@playwright/test'

const PANEL_MS = 280
const MAX_FOOTER_SHIFT_PX = 4

async function sampleLastFaqWrapHeight(page: Page) {
  return page.evaluate(
    () => document.querySelector('.faq-item-wrap--last')?.getBoundingClientRect().height ?? 0,
  )
}

async function maxLastFaqWrapShiftDuring(page: Page, action: () => Promise<void>) {
  const samples: number[] = []

  const collect = async () => {
    samples.push(await sampleLastFaqWrapHeight(page))
  }

  await collect()
  await action()

  for (let frame = 0; frame < 20; frame += 1) {
    await page.waitForTimeout(16)
    await collect()
  }

  if (samples.length < 2) return 0
  return Math.max(...samples) - Math.min(...samples)
}

async function prepareLastFaqClosed(page: Page) {
  const first = page.locator('#faq .faq-item').first()
  if (await first.getAttribute('open')) {
    await first.locator('.faq-summary').click()
    await expect(first).not.toHaveAttribute('open', { timeout: 2_000 })
  }
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
})

async function waitForLastFaqReserveReady(page: Page) {
  await page.waitForFunction(() => {
    const bound = document.querySelector('.faq-item[data-faq-bound="true"]')
    const wrap = document.querySelector('.faq-item-wrap--last')
    if (!bound || !wrap) return false

    const value = getComputedStyle(wrap).getPropertyValue('--faq-last-reserve').trim()
    const px = Number.parseFloat(value)
    return (
      wrap.classList.contains('faq-item-wrap--last-collapsed') &&
      value.endsWith('px') &&
      px > 24
    )
  })
}

test.describe('FAQ last item layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/#faq')
    await page.locator('#faq').scrollIntoViewIfNeeded()
    await page.waitForFunction(
      () => document.querySelector('.faq-item[data-faq-bound="true"]') != null,
    )
    await prepareLastFaqClosed(page)
    await waitForLastFaqReserveReady(page)
  })

  test('opening last item keeps footer position stable', async ({ page }) => {
    const lastSummary = page.locator('.faq-item-wrap--last .faq-summary')
    const wrapBefore = await sampleLastFaqWrapHeight(page)

    const shift = await maxLastFaqWrapShiftDuring(page, async () => {
      await lastSummary.click()
      await expect(page.locator('.faq-item-wrap--last .faq-item')).toHaveAttribute('open', '', {
        timeout: 2_000,
      })
    })

    const wrapAfter = await sampleLastFaqWrapHeight(page)

    expect(shift).toBeLessThanOrEqual(MAX_FOOTER_SHIFT_PX)
    expect(Math.abs(wrapAfter - wrapBefore)).toBeLessThanOrEqual(MAX_FOOTER_SHIFT_PX)
    await expect(page.locator('.faq-item-wrap--last')).not.toHaveClass(/faq-item-wrap--last-collapsed/)
  })

  test('closing last item keeps footer position stable', async ({ page }) => {
    const lastSummary = page.locator('.faq-item-wrap--last .faq-summary')

    await lastSummary.click()
    await expect(page.locator('.faq-item-wrap--last .faq-item')).toHaveAttribute('open', '', {
      timeout: 2_000,
    })
    await page.waitForTimeout(PANEL_MS + 80)

    const wrapBefore = await sampleLastFaqWrapHeight(page)

    const shift = await maxLastFaqWrapShiftDuring(page, async () => {
      await lastSummary.click()
      await expect(page.locator('.faq-item-wrap--last .faq-item')).not.toHaveAttribute('open', {
        timeout: 2_000,
      })
    })

    const wrapAfter = await sampleLastFaqWrapHeight(page)

    expect(shift).toBeLessThanOrEqual(MAX_FOOTER_SHIFT_PX)
    expect(Math.abs(wrapAfter - wrapBefore)).toBeLessThanOrEqual(MAX_FOOTER_SHIFT_PX)
    await expect(page.locator('.faq-item-wrap--last')).toHaveClass(/faq-item-wrap--last-collapsed/)
  })

})
