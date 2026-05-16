import { $, $$ } from '@/lib/dom-selector'
import { resetFaqIconTurn, syncFaqIconTurn } from '@/lib/faq-icon-turn'
import { getVenueMapUrl, openVenueInMaps } from '@/lib/open-venue-map'
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

function setExpanded(
  details: HTMLDetailsElement,
  expanded: boolean,
  options: { instantIcon?: boolean; reduceMotion?: boolean } = {},
) {
  const wrap = details.closest('.faq-item-wrap')
  wrap?.classList.toggle('faq-item-wrap--active', expanded)
  $('.faq-answer-shell', details)?.classList.toggle('faq-answer-shell--open', expanded)

  const icon = $('.faq-icon', details)
  if (!(icon instanceof HTMLElement)) return

  if (options.reduceMotion) {
    resetFaqIconTurn(icon, expanded)
    return
  }

  syncFaqIconTurn(icon, expanded, { instant: options.instantIcon })
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
    details.classList.add('faq-item--closing')
    stripInitialOpen(details)
    summary.setAttribute('aria-expanded', 'false')
    syncVenueMap(details, false)
    setExpanded(details, false, { reduceMotion: prefersReducedMotion() })

    await afterTransition(shell, PANEL_MS, 'grid-template-rows')

    details.classList.remove('faq-item--closing')
    details.removeAttribute('open')
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
}

async function openItem(parts: FaqParts) {
  const { details, shell, summary } = parts

  await closeAllExcept(details)
  if (details.open) return

  await runExclusive(details, async () => {
    stripInitialOpen(details)
    details.classList.remove('faq-item--closing')

    details.setAttribute('open', '')
    summary.setAttribute('aria-expanded', 'true')
    setExpanded(details, true, { reduceMotion: prefersReducedMotion() })
    syncVenueMap(details, true)

    await afterTransition(shell, PANEL_MS, 'grid-template-rows')
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
          setExpanded(details, false, { reduceMotion: true })
          parts.summary.setAttribute('aria-expanded', 'false')
          return
        }

        stripInitialOpen(details)
        await closeAllExcept(details)
        setExpanded(details, true, { reduceMotion: true })
        parts.summary.setAttribute('aria-expanded', 'true')
        syncVenueMap(details, true)
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

    if (details.open) {
      setExpanded(details, true, {
        instantIcon: details.classList.contains('faq-item--initial-open'),
        reduceMotion,
      })
    }

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

  if (reduceMotion) {
    bindReducedMotion(items, signal)
    return
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape') return

      const openItemEl = $<HTMLDetailsElement>('.faq-item[open]')
      if (!openItemEl) return

      const parts = getParts(openItemEl)
      if (parts) void schedule(() => closeItem(parts))
    },
    { signal },
  )
}

export function resetFaqAccordionQueue() {
  actionQueue = Promise.resolve()
}
