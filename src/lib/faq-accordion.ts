import { animate } from 'motion'
import { $, $$ } from '@/lib/dom-selector'

const PANEL_ANIMATION = { duration: 0.28, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] }
const OPEN_BODY_ANIMATION = { duration: 0.22, delay: 0.08, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
const CLOSE_BODY_ANIMATION = { duration: 0.14, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
let lastFaqReserveRaf = 0

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

export function applyIconTurn(icon: HTMLElement, instant = false) {
  const current = readIconDeg(icon)
  const next = current + 45
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

function getAnswerBody(shell: HTMLElement): HTMLElement | null {
  return $('.faq-answer-body', shell)
}

export function setPanelShellOpen(shell: HTMLElement, open: boolean) {
  shell.classList.toggle('faq-answer-shell--open', open)
}

function clearPanelShellRows(shell: HTMLElement) {
  shell.style.gridTemplateRows = ''
}

function clearAnswerBodyOpacity(shell: HTMLElement) {
  const body = getAnswerBody(shell)
  if (body) body.style.opacity = ''
}

function setSummaryExpanded(summary: HTMLElement, expanded: boolean) {
  summary.setAttribute('aria-expanded', expanded ? 'true' : 'false')
}

function updateIcon(details: HTMLDetailsElement, expanded: boolean, instant = false) {
  const icon = getIconInner(details)
  if (!icon) return

  if (prefersReducedMotion()) applyIconInstant(icon, expanded)
  else applyIconTurn(icon, instant)
}

function applyOpenState(parts: FaqParts, open: boolean, instantIcon = false) {
  const { details, shell, summary } = parts

  setSummaryExpanded(summary, open)
  setPanelShellOpen(shell, open)
  updateIcon(details, open, instantIcon)
}

function isLastFaqItem(details: HTMLDetailsElement): boolean {
  return details.closest('.faq-item-wrap--last') != null
}

function reserveLastFaqSpace() {
  if (lastFaqReserveRaf) window.cancelAnimationFrame(lastFaqReserveRaf)

  lastFaqReserveRaf = window.requestAnimationFrame(() => {
    lastFaqReserveRaf = 0

    const wrap = $('.faq-item-wrap--last')
    if (!wrap) return

    const summary = $('.faq-summary', wrap)
    const divider = $('.faq-divider', wrap)
    const body = $('.faq-answer-body', wrap)
    if (!summary || !body || !divider) return

    const styles = window.getComputedStyle(wrap)
    const paddingBlock =
      Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
    const reservedHeight =
      summary.getBoundingClientRect().height +
      body.scrollHeight +
      divider.getBoundingClientRect().height +
      paddingBlock

    wrap.style.minHeight = `${Math.ceil(reservedHeight)}px`
  })
}

function forceSync(parts: FaqParts) {
  const { details } = parts
  const wantOpen = details.dataset.faqTargetOpen === '1'

  details.classList.remove('faq-item--closing')

  if (wantOpen) {
    details.setAttribute('open', '')
    applyOpenState(parts, true, true)
    return
  }

  applyOpenState(parts, false, true)
  details.removeAttribute('open')
}

export async function openOnce(parts: FaqParts): Promise<void> {
  const { details, shell } = parts
  const rm = prefersReducedMotion()

  details.classList.remove('faq-item--closing')

  if (!details.hasAttribute('open')) {
    details.setAttribute('open', '')
  }

  if (!rm) {
    shell.style.gridTemplateRows = '0fr'
    const body = getAnswerBody(shell)
    if (body) body.style.opacity = '0'
  }

  applyOpenState(parts, true)

  if (rm) return

  const body = getAnswerBody(shell)

  await Promise.all([
    animate(
      shell,
      { gridTemplateRows: ['0fr', '1fr'] },
      PANEL_ANIMATION,
    ),
    body ? animate(body, { opacity: [0, 1] }, OPEN_BODY_ANIMATION) : Promise.resolve(),
  ])

  clearPanelShellRows(shell)
  clearAnswerBodyOpacity(shell)
}

export async function closeOnce(parts: FaqParts): Promise<void> {
  const { details, shell, summary } = parts
  const rm = prefersReducedMotion()

  if (!details.open && !details.classList.contains('faq-item--closing')) return

  details.classList.add('faq-item--closing')
  if (isLastFaqItem(details)) summary.blur()

  if (!rm) {
    shell.style.gridTemplateRows = '1fr'
    const body = getAnswerBody(shell)
    if (body) body.style.opacity = getComputedStyle(body).opacity
  }

  applyOpenState(parts, false)

  if (rm) {
    details.classList.remove('faq-item--closing')
    details.removeAttribute('open')
    return
  }

  const body = getAnswerBody(shell)

  await Promise.all([
    animate(
      shell,
      { gridTemplateRows: ['1fr', '0fr'] },
      PANEL_ANIMATION,
    ),
    body
      ? animate(
          body,
          { opacity: [Number(getComputedStyle(body).opacity) || 1, 0] },
          CLOSE_BODY_ANIMATION,
        )
      : Promise.resolve(),
  ])

  clearPanelShellRows(shell)
  clearAnswerBodyOpacity(shell)

  details.classList.remove('faq-item--closing')
  details.removeAttribute('open')
}

async function syncToTarget(parts: FaqParts): Promise<void> {
  const { details, shell } = parts

  for (let loop = 0; loop < 4; loop += 1) {
    if (isAchieved(details, shell)) return

    if (details.dataset.faqTargetOpen === '1') await openOnce(parts)
    else await closeOnce(parts)
  }

  if (!isAchieved(details, shell)) forceSync(parts)
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
  setSummaryExpanded(summary, open)

  if (!open) return

  setPanelShellOpen(shell, true)

  updateIcon(details, true, true)
}

function getIconInner(details: HTMLDetailsElement): HTMLElement | null {
  const icon = $('.faq-icon__inner', details)
  return icon instanceof HTMLElement ? icon : null
}

export function setupFaqAccordion(signal: AbortSignal) {
  const items = $$<HTMLDetailsElement>('.faq-item')
  reserveLastFaqSpace()

  for (const details of items) {
    delete details.dataset.faqBound
  }

  window.addEventListener('resize', reserveLastFaqSpace, { signal })

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
