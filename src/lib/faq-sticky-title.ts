import { $ } from '@/lib/dom-selector'

const LG_QUERY = '(min-width: 1024px)'

function readStickyTopPx(section: HTMLElement) {
  const top = getComputedStyle(section).getPropertyValue('--faq-sticky-top').trim()
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  if (top.endsWith('rem')) return parseFloat(top) * rootSize
  if (top.endsWith('px')) return parseFloat(top)
  return 5.5 * rootSize
}

export function setupFaqStickyTitle(signal: AbortSignal) {
  const section = $('.faq-section')
  const copy = $('.faq-title-row__copy')
  const trigger = $('.faq-sticky-trigger')
  if (!(section instanceof HTMLElement)) return
  if (!(copy instanceof HTMLElement)) return
  if (!(trigger instanceof HTMLElement)) return

  const lgMq = window.matchMedia(LG_QUERY)
  let pinned = false
  let placeholder: HTMLElement | null = null

  const unpin = () => {
    copy.classList.remove('faq-title-row__copy--pinned')
    copy.style.left = ''
    copy.style.width = ''
    placeholder?.remove()
    placeholder = null
    pinned = false
  }

  const pin = () => {
    const rect = copy.getBoundingClientRect()
    placeholder = document.createElement('div')
    placeholder.className = 'faq-title-row__placeholder'
    placeholder.setAttribute('aria-hidden', 'true')
    placeholder.style.height = `${rect.height}px`
    copy.parentElement?.insertBefore(placeholder, copy)
    copy.classList.add('faq-title-row__copy--pinned')
    copy.style.left = `${rect.left}px`
    copy.style.width = `${rect.width}px`
    pinned = true
  }

  const syncPinnedGeometry = () => {
    if (!pinned || !placeholder) return
    const rect = placeholder.getBoundingClientRect()
    copy.style.left = `${rect.left}px`
    copy.style.width = `${rect.width}px`
  }

  const sync = () => {
    if (!lgMq.matches) {
      unpin()
      return
    }

    const threshold = readStickyTopPx(section)
    const shouldPin = trigger.getBoundingClientRect().top <= threshold

    if (shouldPin && !pinned) pin()
    else if (!shouldPin && pinned) unpin()
    else if (pinned) syncPinnedGeometry()
  }

  const onScroll = () => sync()

  window.addEventListener('scroll', onScroll, { passive: true, signal })
  window.addEventListener('resize', onScroll, { passive: true, signal })
  lgMq.addEventListener('change', sync, { signal })
  signal.addEventListener('abort', unpin, { once: true })

  sync()
}
