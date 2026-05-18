import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('motion', () => ({
  animate: vi.fn(() => ({ finished: Promise.resolve() })),
}))

vi.mock('@/lib/dom-selector', () => ({
  $: vi.fn((sel: string, ctx: Element | Document = document) => ctx.querySelector(sel)),
  $$: vi.fn((sel: string, ctx: Element | Document = document) =>
    ctx.querySelectorAll(sel),
  ),
}))

vi.mock('@/consts/event', () => ({
  EVENT_VENUE_LAT: 40.4168,
  EVENT_VENUE_LNG: -3.7038,
  EVENT_VENUE_MAP_URL: 'https://maps.example.com',
  EVENT_VENUE_NAME: 'Test Venue',
  FAQ_PANEL_TOGGLE: 'faq:panel-toggle',
}))

import { animate } from 'motion'
import {
  type FaqParts,
  applyIconInstant,
  applyIconTurn,
  closeOnce,
  isAchieved,
  openOnce,
  prefersReducedMotion,
  readIconDeg,
  setPanelShellOpen,
} from './faq-accordion'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildDetails(open = false) {
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  summary.className = 'faq-summary'
  const shell = document.createElement('div')
  shell.className = 'faq-answer-shell'
  const panel = document.createElement('div')
  panel.className = 'faq-answer-panel'
  shell.appendChild(panel)
  details.className = 'faq-item'
  details.append(summary, shell)
  if (open) details.setAttribute('open', '')
  document.body.appendChild(details)
  return { details, shell, summary }
}

function buildParts(open = false): FaqParts {
  return buildDetails(open)
}

function buildIcon() {
  const icon = document.createElement('span')
  icon.className = 'faq-icon__inner'
  return icon
}

// ---------------------------------------------------------------------------
// prefersReducedMotion
// ---------------------------------------------------------------------------

describe('prefersReducedMotion()', () => {
  it('returns true when matchMedia reports reduce', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: true })),
    })
    expect(prefersReducedMotion()).toBe(true)
  })

  it('returns false when matchMedia reports no-preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: false })),
    })
    expect(prefersReducedMotion()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// readIconDeg / applyIconInstant / applyIconTurn
// ---------------------------------------------------------------------------

describe('readIconDeg()', () => {
  it('returns 0 when dataset is absent', () => {
    const icon = buildIcon()
    expect(readIconDeg(icon)).toBe(0)
  })

  it('returns stored numeric value', () => {
    const icon = buildIcon()
    icon.dataset.faqIconDeg = '405'
    expect(readIconDeg(icon)).toBe(405)
  })

  it('returns 0 for NaN values', () => {
    const icon = buildIcon()
    icon.dataset.faqIconDeg = 'nope'
    expect(readIconDeg(icon)).toBe(0)
  })
})

describe('applyIconInstant()', () => {
  it('sets 45deg and dataset when expanded', () => {
    const icon = buildIcon()
    applyIconInstant(icon, true)
    expect(icon.dataset.faqIconDeg).toBe('45')
    expect(icon.style.getPropertyValue('--faq-icon-turn')).toBe('45deg')
  })

  it('sets 0deg and dataset when collapsed', () => {
    const icon = buildIcon()
    icon.dataset.faqIconDeg = '45'
    applyIconInstant(icon, false)
    expect(icon.dataset.faqIconDeg).toBe('0')
    expect(icon.style.getPropertyValue('--faq-icon-turn')).toBe('0deg')
  })
})

describe('applyIconTurn()', () => {
  it('accumulates +405 on open', () => {
    const icon = buildIcon()
    icon.dataset.faqIconDeg = '45'
    applyIconTurn(icon, true)
    expect(icon.dataset.faqIconDeg).toBe('450')
    expect(icon.style.getPropertyValue('--faq-icon-turn')).toBe('450deg')
  })

  it('accumulates +315 on close', () => {
    const icon = buildIcon()
    icon.dataset.faqIconDeg = '450'
    applyIconTurn(icon, false)
    expect(icon.dataset.faqIconDeg).toBe('765')
  })
})

// ---------------------------------------------------------------------------
// setPanelShellOpen / isAchieved
// ---------------------------------------------------------------------------

describe('setPanelShellOpen()', () => {
  it('adds --open class when true', () => {
    const { shell } = buildDetails()
    setPanelShellOpen(shell, true)
    expect(shell.classList.contains('faq-answer-shell--open')).toBe(true)
  })

  it('removes --open class when false', () => {
    const { shell } = buildDetails()
    shell.classList.add('faq-answer-shell--open')
    setPanelShellOpen(shell, false)
    expect(shell.classList.contains('faq-answer-shell--open')).toBe(false)
  })
})

describe('isAchieved()', () => {
  it('returns true when target=open and state is open+class', () => {
    const { details, shell } = buildDetails(true)
    details.dataset.faqTargetOpen = '1'
    shell.classList.add('faq-answer-shell--open')
    expect(isAchieved(details, shell)).toBe(true)
  })

  it('returns false when target=open but class missing', () => {
    const { details, shell } = buildDetails(true)
    details.dataset.faqTargetOpen = '1'
    expect(isAchieved(details, shell)).toBe(false)
  })

  it('returns true when target=closed and state is closed', () => {
    const { details, shell } = buildDetails(false)
    details.dataset.faqTargetOpen = '0'
    expect(isAchieved(details, shell)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// openOnce
// ---------------------------------------------------------------------------

describe('openOnce()', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.mocked(animate).mockClear()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: false })),
    })
  })

  it('sets [open] synchronously before awaiting animation', async () => {
    const parts = buildParts()
    const p = openOnce(parts)
    expect(parts.details.hasAttribute('open')).toBe(true)
    await p
  })

  it('adds faq-answer-shell--open class synchronously', async () => {
    const parts = buildParts()
    const p = openOnce(parts)
    expect(parts.shell.classList.contains('faq-answer-shell--open')).toBe(true)
    await p
  })

  it('animates gridTemplateRows from 0fr to 1fr', async () => {
    const parts = buildParts()
    await openOnce(parts)
    expect(animate).toHaveBeenCalledWith(
      parts.shell,
      { gridTemplateRows: ['0fr', '1fr'] },
      expect.objectContaining({ duration: expect.any(Number) }),
    )
  })

  it('reduced motion: skips animate, toggles instantly', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: true })),
    })
    const parts = buildParts()
    await openOnce(parts)
    expect(parts.details.hasAttribute('open')).toBe(true)
    expect(animate).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// closeOnce
// ---------------------------------------------------------------------------

describe('closeOnce()', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.mocked(animate).mockClear()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: false })),
    })
  })

  it('removes [open] only after animation finishes', async () => {
    let resolveFn!: () => void
    vi.mocked(animate).mockReturnValueOnce({
      finished: new Promise<void>((r) => {
        resolveFn = r
      }),
    } as ReturnType<typeof animate>)

    const parts = buildParts(true)
    parts.shell.classList.add('faq-answer-shell--open')
    const p = closeOnce(parts)
    expect(parts.details.hasAttribute('open')).toBe(true) // still open during animation
    resolveFn()
    await p
    expect(parts.details.hasAttribute('open')).toBe(false)
  })

  it('removes faq-answer-shell--open class immediately (body fades with grid)', async () => {
    const parts = buildParts(true)
    parts.shell.classList.add('faq-answer-shell--open')
    const p = closeOnce(parts)
    // class removed before animation
    expect(parts.shell.classList.contains('faq-answer-shell--open')).toBe(false)
    await p
  })

  it('animates gridTemplateRows from 1fr to 0fr', async () => {
    const parts = buildParts(true)
    parts.shell.classList.add('faq-answer-shell--open')
    await closeOnce(parts)
    expect(animate).toHaveBeenCalledWith(
      parts.shell,
      { gridTemplateRows: ['1fr', '0fr'] },
      expect.objectContaining({ duration: expect.any(Number) }),
    )
  })

  it('reduced motion: removes [open] instantly, no animate called', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: true })),
    })
    const parts = buildParts(true)
    parts.shell.classList.add('faq-answer-shell--open')
    await closeOnce(parts)
    expect(parts.details.hasAttribute('open')).toBe(false)
    expect(animate).not.toHaveBeenCalled()
  })

  it('no-ops when already closed and not closing', async () => {
    const parts = buildParts(false) // already closed
    await closeOnce(parts)
    expect(animate).not.toHaveBeenCalled()
  })
})
