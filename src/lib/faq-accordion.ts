import { animate } from 'motion'
import { $, $$ } from '@/lib/dom-selector'
import {
  EVENT_VENUE_LAT,
  EVENT_VENUE_LNG,
  EVENT_VENUE_MAP_URL,
  EVENT_VENUE_NAME,
  FAQ_PANEL_TOGGLE,
} from '@/consts/event'

const PANEL_MS = 280
const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]
const ICON_OPEN_DELTA_DEG = 405
const ICON_CLOSE_DELTA_DEG = 315
const MAX_SYNC_LOOPS = 4

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isAppleDevice() {
  return /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(navigator.userAgent)
}

function isAndroidDevice() {
  return /Android/.test(navigator.userAgent)
}

function getVenueMapUrl(): string {
  const label = encodeURIComponent(EVENT_VENUE_NAME)
  const coords = `${EVENT_VENUE_LAT},${EVENT_VENUE_LNG}`

  if (isAppleDevice()) {
    return `https://maps.apple.com/?ll=${coords}&q=${label}`
  }

  if (isAndroidDevice()) {
    return `geo:${coords}?q=${coords}(${label})`
  }

  return `https://www.google.com/maps/search/?api=1&query=${coords}`
}

function openVenueInMaps() {
  const url = getVenueMapUrl()

  try {
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch {
    window.location.assign(EVENT_VENUE_MAP_URL)
  }
}

export type FaqParts = {
  details: HTMLDetailsElement
  shell: HTMLElement
  summary: HTMLElement
}

let actionQueue: Promise<void> = Promise.resolve()

function schedule(action: () => Promise<void>) {
  actionQueue = actionQueue.then(action).catch((error) => {
    console.error('[FAQ]', error)
  })
}

export function getParts(details: HTMLDetailsElement): FaqParts | null {
  const shell = $('.faq-answer-shell', details)
  const summary = $('.faq-summary', details)
  if (!shell || !summary) return null
  return { details, shell, summary }
}

export function isAchieved(details: HTMLDetailsElement, shell: HTMLElement): boolean {
  const wantOpen = details.dataset.faqTargetOpen === '1'
  const isOpen =
    details.hasAttribute('open') &&
    shell.classList.contains('faq-answer-shell--open') &&
    !details.classList.contains('faq-item--closing')
  return wantOpen === isOpen
}

export function readIconDeg(icon: HTMLElement): number {
  const value = Number(icon.dataset.faqIconDeg ?? 0)
  return Number.isFinite(value) ? value : 0
}

export function applyIconTurn(icon: HTMLElement, opening: boolean, instant = false) {
  const current = readIconDeg(icon)
  const next = current + (opening ? ICON_OPEN_DELTA_DEG : ICON_CLOSE_DELTA_DEG)
  icon.dataset.faqIconDeg = String(next)

  if (instant) {
    icon.style.transition = 'none'
    icon.style.setProperty('--faq-icon-turn', `${next}deg`)
    void icon.offsetHeight
    icon.style.transition = ''
    return
  }

  icon.style.setProperty('--faq-icon-turn', `${next}deg`)
}

export function applyIconInstant(icon: HTMLElement, expanded: boolean) {
  const next = expanded ? 45 : 0
  icon.dataset.faqIconDeg = String(next)
  icon.style.setProperty('--faq-icon-turn', expanded ? '45deg' : '0deg')
}

function notifyVenueMapPanel(details: HTMLDetailsElement, open: boolean) {
  if (!$('[data-venue-map]', details)) return
  details.dispatchEvent(
    new CustomEvent(FAQ_PANEL_TOGGLE, { bubbles: true, detail: { open } }),
  )
}

function stripInitialOpen(details: HTMLDetailsElement) {
  details.classList.remove('faq-item--initial-open')
}

export function setPanelShellOpen(shell: HTMLElement, open: boolean) {
  shell.classList.toggle('faq-answer-shell--open', open)
}

function isLastFaqItem(details: HTMLDetailsElement): boolean {
  return details.closest('.faq-item-wrap--last') != null
}

function isViewportNearBottom(): boolean {
  return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 72
}

/**
 * Tracks the actual DOM height shrinkage each frame and scrolls by the same
 * delta so the footer stays pinned at its current viewport Y while the panel
 * collapses. Returns a cleanup function that stops the loop and does a final sync.
 *
 * Motion drives the animation; we just observe `scrollHeight` changes — the
 * compensation automatically follows any easing curve without duplicating it.
 */
function startScrollCompensation(): () => void {
  const startDocHeight = document.documentElement.scrollHeight
  const startScrollY = window.scrollY
  let frame = 0

  const sync = () => {
    const shrunk = startDocHeight - document.documentElement.scrollHeight
    const target = Math.max(0, startScrollY - shrunk)
    if (Math.abs(window.scrollY - target) > 0.5) window.scrollTo(0, target)
    frame = requestAnimationFrame(sync)
  }

  sync()
  frame = requestAnimationFrame(sync)

  return () => {
    cancelAnimationFrame(frame)
    const shrunk = startDocHeight - document.documentElement.scrollHeight
    window.scrollTo(0, Math.max(0, startScrollY - shrunk))
  }
}

function forceSync(parts: FaqParts) {
  const { details, shell, summary } = parts
  const wantOpen = details.dataset.faqTargetOpen === '1'
  const rm = prefersReducedMotion()

  details.classList.remove('faq-item--closing')

  if (wantOpen) {
    details.setAttribute('open', '')
    summary.setAttribute('aria-expanded', 'true')
    setPanelShellOpen(shell, true)
    const icon = getIconInner(details)
    if (icon) {
      if (rm) applyIconInstant(icon, true)
      else applyIconTurn(icon, true, true)
    }
    notifyVenueMapPanel(details, true)
    return
  }

  summary.setAttribute('aria-expanded', 'false')
  setPanelShellOpen(shell, false)
  const icon = getIconInner(details)
  if (icon) {
    if (rm) applyIconInstant(icon, false)
    else applyIconTurn(icon, false, true)
  }
  notifyVenueMapPanel(details, false)
  details.removeAttribute('open')
}

export async function openOnce(parts: FaqParts): Promise<void> {
  const { details, shell, summary } = parts
  const rm = prefersReducedMotion()

  stripInitialOpen(details)
  details.classList.remove('faq-item--closing')

  if (!details.hasAttribute('open')) {
    details.setAttribute('open', '')
  }

  summary.setAttribute('aria-expanded', 'true')
  setPanelShellOpen(shell, true)

  const icon = getIconInner(details)
  if (icon) {
    if (rm) applyIconInstant(icon, true)
    else applyIconTurn(icon, true)
  }

  notifyVenueMapPanel(details, true)

  if (rm) return
  await animate(
    shell,
    { gridTemplateRows: ['0fr', '1fr'] },
    { duration: PANEL_MS / 1000, ease: EASE },
  )
}

export async function closeOnce(parts: FaqParts): Promise<void> {
  const { details, shell, summary } = parts
  const rm = prefersReducedMotion()

  if (!details.open && !details.classList.contains('faq-item--closing')) return

  details.classList.add('faq-item--closing')
  stripInitialOpen(details)
  summary.setAttribute('aria-expanded', 'false')
  setPanelShellOpen(shell, false)

  const icon = getIconInner(details)
  if (icon) {
    if (rm) applyIconInstant(icon, false)
    else applyIconTurn(icon, false)
  }

  notifyVenueMapPanel(details, false)

  if (rm) {
    details.classList.remove('faq-item--closing')
    details.removeAttribute('open')
    return
  }

  // When closing the last item with the viewport near the bottom, the document
  // shrinks as the panel collapses and the footer moves up — compensate by
  // tracking scrollHeight delta each frame. Motion owns the animation lifecycle;
  // we cancel the RAF loop in finally so it always stops, even on rapid clicks.
  const stopScrollSync =
    isLastFaqItem(details) && isViewportNearBottom()
      ? (summary.blur(), startScrollCompensation())
      : undefined

  try {
    await animate(
      shell,
      { gridTemplateRows: ['1fr', '0fr'] },
      { duration: PANEL_MS / 1000, ease: EASE },
    )
  } finally {
    stopScrollSync?.()
  }

  details.classList.remove('faq-item--closing')
  details.removeAttribute('open')
}

async function syncToTarget(parts: FaqParts, loop = 0): Promise<void> {
  const { details, shell } = parts

  if (isAchieved(details, shell)) return
  if (loop >= MAX_SYNC_LOOPS) {
    forceSync(parts)
    return
  }

  const wantOpen = details.dataset.faqTargetOpen === '1'
  if (wantOpen) await openOnce(parts)
  else await closeOnce(parts)

  if (!isAchieved(details, shell)) {
    await syncToTarget(parts, loop + 1)
  }
}

async function closeAllExcept(keep: HTMLDetailsElement) {
  const jobs: Promise<void>[] = []

  for (const other of $$<HTMLDetailsElement>('.faq-item')) {
    if (other === keep) continue
    other.dataset.faqTargetOpen = '0'

    const otherParts = getParts(other)
    if (!otherParts) continue
    if (isAchieved(other, otherParts.shell)) continue

    jobs.push(syncToTarget(otherParts))
  }

  await Promise.all(jobs)
}

function mountInitialState(parts: FaqParts) {
  const { details, shell, summary } = parts
  const open = details.open

  details.dataset.faqTargetOpen = open ? '1' : '0'
  summary.setAttribute('aria-expanded', open ? 'true' : 'false')

  if (!open) return

  setPanelShellOpen(shell, true)

  const icon = $('.faq-icon__inner', details)
  if (!(icon instanceof HTMLElement)) return

  const instant = details.classList.contains('faq-item--initial-open')
  if (prefersReducedMotion() || instant) {
    applyIconInstant(icon, true)
    return
  }

  applyIconTurn(icon, true, instant)
}

function getIconInner(details: HTMLDetailsElement): HTMLElement | null {
  const icon = $('.faq-icon__inner', details)
  return icon instanceof HTMLElement ? icon : null
}

export function setupFaqAccordion(signal: AbortSignal) {
  const items = $$<HTMLDetailsElement>('.faq-item')

  for (const details of items) {
    delete details.dataset.faqBound
  }

  for (const link of $$<HTMLAnchorElement>('[data-venue-map-link]')) {
    link.href = getVenueMapUrl()
    link.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        openVenueInMaps()
      },
      { signal },
    )
  }

  for (const details of items) {
    if (details.dataset.faqBound === 'true') continue

    const parts = getParts(details)
    if (!parts) continue

    details.dataset.faqBound = 'true'
    mountInitialState(parts)

    parts.summary.addEventListener(
      'click',
      (event) => {
        event.preventDefault()

        const nextOpen = details.dataset.faqTargetOpen !== '1'
        details.dataset.faqTargetOpen = nextOpen ? '1' : '0'

        void schedule(async () => {
          stripInitialOpen(details)
          if (nextOpen) await closeAllExcept(details)
          await syncToTarget(parts)
        })
      },
      { signal },
    )
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape') return

      const openItems = $$<HTMLDetailsElement>('.faq-item[open]')
      if (openItems.length === 0) return

      void schedule(async () => {
        for (const details of openItems) {
          details.dataset.faqTargetOpen = '0'
          const parts = getParts(details)
          if (parts) await syncToTarget(parts)
        }
      })
    },
    { signal },
  )
}

export function resetFaqAccordionQueue() {
  actionQueue = Promise.resolve()
}
