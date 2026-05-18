import { expect, test, type Locator, type Page } from '@playwright/test'

const PANEL_MS = 280

async function prepareLastFaqClosed(page: Page) {
  const first = page.locator('#faq .faq-item').first()
  if (await first.getAttribute('open')) {
    await first.locator('.faq-summary').click()
    await expect(first).not.toHaveAttribute('open', { timeout: 2_000 })
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(0, { timeout: 2_000 })
    await page.waitForTimeout(PANEL_MS + 80)
  }
}

async function readWrapFooterGap(page: Page) {
  return page.evaluate(() => {
    const wrap = document.querySelector('.faq-item-wrap--last')
    const footer = document.querySelector('footer')
    if (!wrap || !footer) return 0
    const wrapRect = wrap.getBoundingClientRect()
    const footerRect = footer.getBoundingClientRect()
    return footerRect.top - wrapRect.bottom
  })
}

async function scrollToDocumentBottom(page: Page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
  })
  await page.waitForTimeout(80)
}

async function sampleFooterViewportTops(page: Page, count: number, intervalMs: number) {
  const tops: number[] = []
  for (let index = 0; index < count; index += 1) {
    tops.push(
      await page.locator('footer').evaluate((el) => el.getBoundingClientRect().top),
    )
    if (index < count - 1) await page.waitForTimeout(intervalMs)
  }
  return tops
}

function maxStepDelta(values: number[]) {
  let max = 0
  for (let index = 1; index < values.length; index += 1) {
    max = Math.max(max, Math.abs(values[index]! - values[index - 1]!))
  }
  return max
}

async function waitForFaqBound(page: Page) {
  await page.waitForFunction(
    () => document.querySelector('.faq-item[data-faq-bound="true"]') != null,
  )
}

async function readIconBox(icon: Locator) {
  return icon.boundingBox()
}

async function expectIconBoxStable(icon: Locator, baseline: { width: number; height: number }) {
  const box = await readIconBox(icon)
  expect(box).not.toBeNull()
  expect(Math.abs(box!.width - baseline.width)).toBeLessThanOrEqual(1)
  expect(Math.abs(box!.height - baseline.height)).toBeLessThanOrEqual(1)
}

test.describe('FAQ accordion (reduced motion)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#faq')
    await page.locator('#faq').scrollIntoViewIfNeeded()
    await waitForFaqBound(page)
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

  test('icon bounding box stays stable on first item toggle', async ({ page }) => {
    const item = page.locator('#faq .faq-item').first()
    const icon = item.locator('.faq-icon')
    const baseline = await readIconBox(icon)
    expect(baseline).not.toBeNull()

    await item.locator('.faq-summary').click()
    await expect(item).not.toHaveAttribute('open', { timeout: 2_000 })
    await expectIconBoxStable(icon, baseline!)

    await item.locator('.faq-summary').click()
    await expect(item).toHaveAttribute('open', { timeout: 2_000 })
    await expectIconBoxStable(icon, baseline!)
  })

  test('icon bounding box stays stable on last item toggle', async ({ page }) => {
    await prepareLastFaqClosed(page)

    const item = page.locator('.faq-item-wrap--last .faq-item')
    const icon = item.locator('.faq-icon')
    const baseline = await readIconBox(icon)
    expect(baseline).not.toBeNull()

    await item.locator('.faq-summary').click()
    await expect(item).toHaveAttribute('open', { timeout: 2_000 })
    await expectIconBoxStable(icon, baseline!)

    await item.locator('.faq-summary').click()
    await expect(item).not.toHaveAttribute('open', { timeout: 2_000 })
    await expectIconBoxStable(icon, baseline!)
  })

  test('icon degrees strictly increase on close and reopen', async ({ page }) => {
    const icon = page.locator('#faq .faq-item').first().locator('.faq-icon__inner')
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

  test('last item keeps footer position and wrap height stable after close', async ({
    page,
  }) => {
    await prepareLastFaqClosed(page)

    const wrap = page.locator('.faq-item-wrap--last')
    const item = wrap.locator('.faq-item')

    const gapBefore = await readWrapFooterGap(page)
    const wrapHeightBefore = await wrap.evaluate((el) => el.getBoundingClientRect().height)

    await item.locator('.faq-summary').click()
    await expect(item).toHaveAttribute('open', { timeout: 2_000 })
    await page.waitForTimeout(PANEL_MS + 80)

    await item.locator('.faq-summary').click()
    await expect(item).not.toHaveAttribute('open', { timeout: 2_000 })
    await page.waitForTimeout(PANEL_MS + 80)

    const gapAfter = await readWrapFooterGap(page)
    const wrapHeightAfter = await wrap.evaluate((el) => el.getBoundingClientRect().height)

    expect(Math.abs(gapAfter - gapBefore)).toBeLessThanOrEqual(2)
    expect(Math.abs(wrapHeightAfter - wrapHeightBefore)).toBeLessThanOrEqual(2)
  })

  test('last item at page bottom (first open): stable gap and smooth footer during close', async ({
    page,
  }) => {
    await expect(page.locator('#faq .faq-item').first()).toHaveAttribute('open', '')
    await scrollToDocumentBottom(page)

    const wrap = page.locator('.faq-item-wrap--last')
    const item = wrap.locator('.faq-item')
    const summary = item.locator('.faq-summary')

    const gapBefore = await readWrapFooterGap(page)

    await summary.click()
    await expect(item).toHaveAttribute('open', { timeout: 2_000 })
    await page.waitForTimeout(PANEL_MS + 80)

    await summary.click()

    await page.waitForFunction(() => {
      const shell = document.querySelector('.faq-item-wrap--last .faq-answer-shell')
      return shell != null && !shell.classList.contains('faq-answer-shell--open')
    })

    const topsDuringClose = await sampleFooterViewportTops(page, 8, 40)
    await expect(item).not.toHaveAttribute('open', { timeout: 2_000 })
    await page.waitForTimeout(80)

    expect(maxStepDelta(topsDuringClose)).toBeLessThanOrEqual(20)

    const gapAfter = await readWrapFooterGap(page)
    expect(Math.abs(gapAfter - gapBefore)).toBeLessThanOrEqual(2)
  })

  test('last item close does not leave [open] stuck after grid finishes', async ({ page }) => {
    await prepareLastFaqClosed(page)
    await scrollToDocumentBottom(page)

    const item = page.locator('.faq-item-wrap--last .faq-item')
    await item.locator('.faq-summary').click()
    await expect(item).toHaveAttribute('open', { timeout: 2_000 })
    await page.waitForTimeout(PANEL_MS + 80)

    await item.locator('.faq-summary').click()
    await expect(item).not.toHaveAttribute('open', { timeout: 2_000 })
    await expect(page.locator('.faq-item-wrap--last .faq-answer-shell--open')).toHaveCount(0)

    await page.waitForFunction(
      () => {
        const shell = document.querySelector('.faq-item-wrap--last .faq-answer-shell')
        if (!shell) return false
        const rows = getComputedStyle(shell).gridTemplateRows
        return Number.parseFloat(rows) < 2
      },
      undefined,
      { timeout: 2_000 },
    )
  })

  test('quick open then close leaves a clean closed state', async ({ page }) => {
    await prepareLastFaqClosed(page)

    const item = page.locator('.faq-item-wrap--last .faq-item')
    await item.locator('.faq-summary').click()
    await page.waitForTimeout(100)
    await item.locator('.faq-summary').click()

    await expect(item).not.toHaveAttribute('open', { timeout: 2_000 })
    await expect(page.locator('#faq .faq-answer-shell--open')).toHaveCount(0, {
      timeout: 2_000,
    })
    await expect(item).not.toHaveClass(/faq-item--closing/)
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
