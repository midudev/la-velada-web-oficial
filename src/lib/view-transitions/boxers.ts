interface AstroNavigationEvent extends Event {
  from: URL
  to: URL
}

interface AstroBeforeSwapEvent extends AstroNavigationEvent {
  newDocument: Document
}

const SKIP_BOXERS_ENTER_ATTR = 'data-skip-boxers-enter'
const SKIP_BOXER_DETAIL_ENTER_ATTR = 'data-skip-boxer-detail-enter'
const BOXERS_INDEX_PATH = '/boxeadores'
const BOXER_DETAIL_PATH_RE = /^\/boxeadores\/[^/]+$/

function normalizePathname(url: URL | string): string {
  const pathname = url instanceof URL ? url.pathname : new URL(url, window.location.href).pathname
  return pathname === '/' ? pathname : pathname.replace(/\/$/, '')
}

function isReturningFromBoxerDetail(event: AstroNavigationEvent): boolean {
  const fromPath = normalizePathname(event.from)
  const toPath = normalizePathname(event.to)
  return toPath === BOXERS_INDEX_PATH && BOXER_DETAIL_PATH_RE.test(fromPath)
}

function isEnteringBoxerDetail(event: AstroNavigationEvent): boolean {
  const fromPath = normalizePathname(event.from)
  const toPath = normalizePathname(event.to)
  if (!BOXER_DETAIL_PATH_RE.test(toPath)) return false
  return fromPath === BOXERS_INDEX_PATH || BOXER_DETAIL_PATH_RE.test(fromPath)
}

export function registerBoxersTransitionFlags(): void {
  document.addEventListener('astro:before-swap', (event) => {
    const transitionEvent = event as AstroBeforeSwapEvent
    const root = transitionEvent.newDocument.documentElement
    root.toggleAttribute(SKIP_BOXERS_ENTER_ATTR, isReturningFromBoxerDetail(transitionEvent))
    root.toggleAttribute(SKIP_BOXER_DETAIL_ENTER_ATTR, isEnteringBoxerDetail(transitionEvent))
  })
}
