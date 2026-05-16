import { $, $$ } from '@/lib/dom-selector'
import { getVenueMapUrl, openVenueInMaps } from '@/lib/open-venue-map'
import {
  isLastFaqDetails,
  measureLastFaqReserve,
  setLastFaqReserveCollapsed,
  syncLastFaqReserveState,
} from '@/lib/faq-last-reserve'
import { afterTransition, prefersReducedMotion } from '@/lib/transition'
import { setVenueMapOpen } from '@/lib/venue-map-sync'

const PANEL_MS = 280

type FaqParts = {
  details: HTMLDetailsElement
  shell: HTMLElement
  summary: HTMLElement
}

let actionQueue: Promise<void> = Promise.resolve()
const running = new WeakMap<HTMLDetailsElement, Promise<void>>()

function schedule(action: () => Promise<void>) {
  actionQueue = actionQueue.then(action).catch((error) => {
    console.error('[FAQ]', error)
  })
}

function getParts(details: HTMLDetailsElement): FaqParts | null {
  const shell = $('.faq-answer-shell', details)
  const summary = $('.faq-summary', details)
  if (!shell || !summary) return null
  return { details, shell, summary }
}

function setExpanded(details: HTMLDetailsElement, expanded: boolean) {
  const wrap = details.closest('.faq-item-wrap')
  details.classList.toggle('faq-item--expanded', expanded)
  wrap?.classList.toggle('faq-item-wrap--active', expanded)
  $('.faq-answer-shell', details)?.classList.toggle('faq-answer-shell--open', expanded)
}

function syncVenueMap(details: HTMLDetailsElement, open: boolean) {
  const root = $('[data-venue-map]', details)
  if (root) setVenueMapOpen(root, open)
}

function stripInitialOpen(details: HTMLDetailsElement) {
  details.classList.remove('faq-item--initial-open')
}

async function runExclusive(details: HTMLDetailsElement, action: () => Promise<void>) {
  const pending = running.get(details)
  if (pending) await pending

  const promise = action()
  running.set(details, promise)
  await promise.finally(() => {
    if (running.get(details) === promise) running.delete(details)
  })
}

async function closeItem(parts: FaqParts): Promise<void> {
  const { details, shell, summary } = parts

  if (!details.open && !details.classList.contains('faq-item--closing')) return

  await runExclusive(details, async () => {
    const lastItem = isLastFaqDetails(details)

    details.classList.add('faq-item--closing')
    stripInitialOpen(details)
    summary.setAttribute('aria-expanded', 'false')
    syncVenueMap(details, false)

    if (lastItem) setLastFaqReserveCollapsed(true)

    setExpanded(details, false)
    await afterTransition(
      shell,
      PANEL_MS,
      lastItem ? 'max-height' : 'grid-template-rows',
    )

    details.classList.remove('faq-item--closing')
    details.removeAttribute('open')
    syncLastFaqReserveState()
  })
}

async function closeAllExcept(keep: HTMLDetailsElement) {
  const jobs: Promise<void>[] = []

  for (const other of $$<HTMLDetailsElement>('.faq-item')) {
    if (other === keep) continue
    if (!other.open && !other.classList.contains('faq-item--closing')) continue

    const otherParts = getParts(other)
    if (otherParts) jobs.push(closeItem(otherParts))
  }

  await Promise.all(jobs)
  syncLastFaqReserveState()
}

async function openItem(parts: FaqParts) {
  const { details, shell, summary } = parts

  await closeAllExcept(details)
  if (details.open) return

  await runExclusive(details, async () => {
    const lastItem = isLastFaqDetails(details)
    const wrap = lastItem ? details.closest('.faq-item-wrap--last') : null

    stripInitialOpen(details)
    details.classList.remove('faq-item--closing')

    if (lastItem && wrap instanceof HTMLElement) {
      wrap.classList.add('faq-item-wrap--swap-panel')
      setLastFaqReserveCollapsed(false)
      details.setAttribute('open', '')
      summary.setAttribute('aria-expanded', 'true')
      setExpanded(details, true)
      syncVenueMap(details, true)
      void shell.offsetHeight
      wrap.classList.remove('faq-item-wrap--swap-panel')
      syncLastFaqReserveState()
      return
    }

    details.setAttribute('open', '')
    summary.setAttribute('aria-expanded', 'true')
    setExpanded(details, true)
    syncVenueMap(details, true)
    await afterTransition(shell, PANEL_MS, 'grid-template-rows')
    syncLastFaqReserveState()
  })
}

async function toggleItem(parts: FaqParts) {
  if (parts.details.open) {
    await closeItem(parts)
    return
  }

  await openItem(parts)
}

function bindReducedMotion(items: HTMLDetailsElement[], signal: AbortSignal) {
  for (const details of items) {
    const parts = getParts(details)
    if (!parts) continue

    details.addEventListener(
      'toggle',
      async () => {
        if (!details.open) {
          syncVenueMap(details, false)
          setExpanded(details, false)
          parts.summary.setAttribute('aria-expanded', 'false')
          syncLastFaqReserveState()
          return
        }

        stripInitialOpen(details)
        await closeAllExcept(details)
        setExpanded(details, true)
        parts.summary.setAttribute('aria-expanded', 'true')
        syncVenueMap(details, true)
        syncLastFaqReserveState()
      },
      { signal },
    )
  }
}

export function setupFaqAccordion(signal: AbortSignal) {
  const items = $$<HTMLDetailsElement>('.faq-item')

  for (const details of items) {
    delete details.dataset.faqBound
  }

  const reduceMotion = prefersReducedMotion()

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
    parts.summary.setAttribute('aria-expanded', details.open ? 'true' : 'false')

    if (details.open) setExpanded(details, true)

    if (reduceMotion) continue

    parts.summary.addEventListener(
      'click',
      (event) => {
        event.preventDefault()

        void schedule(async () => {
          stripInitialOpen(details)
          await toggleItem(parts)
        })
      },
      { signal },
    )
  }

  measureLastFaqReserve()
  void document.fonts?.ready.then(() => measureLastFaqReserve())
  window.addEventListener('resize', () => measureLastFaqReserve(), { signal })

  if (reduceMotion) {
    bindReducedMotion(items, signal)
    return
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape') return

      const openItem = $<HTMLDetailsElement>('.faq-item[open]')
      if (!openItem) return

      const parts = getParts(openItem)
      if (parts) void schedule(() => closeItem(parts))
    },
    { signal },
  )
}

export function resetFaqAccordionQueue() {
  actionQueue = Promise.resolve()
}
