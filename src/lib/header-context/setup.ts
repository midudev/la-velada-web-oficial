import { $ } from '@/lib/dom-selector'

interface HeaderContextOptions {
  targetSelector: string
  title: string
  rootMargin?: string
}

const HEADER_SELECTOR = '[data-header]'
const TITLE_SELECTOR = '[data-header-context-title]'
const ACTIVE_ATTR = 'data-context-active'
const DEFAULT_ROOT_MARGIN = '-72px 0px 0px 0px'

let activeObserver: IntersectionObserver | null = null

function setActive(header: HTMLElement, active: boolean): void {
  if (active) {
    header.setAttribute(ACTIVE_ATTR, 'true')
  } else {
    header.removeAttribute(ACTIVE_ATTR)
  }
}

export function setupHeaderContext(options: HeaderContextOptions): void {
  const { targetSelector, title, rootMargin = DEFAULT_ROOT_MARGIN } = options
  const header = $<HTMLElement>(HEADER_SELECTOR)
  const target = $<HTMLElement>(targetSelector)
  if (!header || !target) return

  const titleNode = $<HTMLElement>(TITLE_SELECTOR, header)
  if (titleNode) titleNode.textContent = title

  activeObserver?.disconnect()
  setActive(header, false)

  activeObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      setActive(header, !entry.isIntersecting)
    },
    { threshold: 0, rootMargin },
  )
  activeObserver.observe(target)
}

export function resetHeaderContext(): void {
  activeObserver?.disconnect()
  activeObserver = null
  const header = $<HTMLElement>(HEADER_SELECTOR)
  if (header) setActive(header, false)
}
