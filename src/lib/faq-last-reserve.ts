import { $ } from '@/lib/dom-selector'

export function isLastFaqDetails(details: HTMLDetailsElement) {
  return details.closest('.faq-item-wrap--last') != null
}

function getLastFaqWrap(): HTMLElement | null {
  const wrap = $('.faq-item-wrap--last')
  return wrap instanceof HTMLElement ? wrap : null
}

function getLastFaqDetails(): HTMLDetailsElement | null {
  const wrap = getLastFaqWrap()
  if (!wrap) return null
  const details = $('.faq-item', wrap)
  return details instanceof HTMLDetailsElement ? details : null
}

export function setLastFaqReserveCollapsed(collapsed: boolean) {
  const wrap = getLastFaqWrap()
  if (!wrap) return

  wrap.style.removeProperty('padding-bottom')
  wrap.classList.toggle('faq-item-wrap--last-collapsed', collapsed)
}

export function syncLastFaqReserveState() {
  const details = getLastFaqDetails()
  if (!details) return

  const collapsed =
    !details.open && !details.classList.contains('faq-item--closing')

  setLastFaqReserveCollapsed(collapsed)
}

export function measureLastFaqReserve() {
  if ($('.faq-item--closing')) return

  const wrap = getLastFaqWrap()
  const details = getLastFaqDetails()
  const shell = wrap ? $('.faq-answer-shell', wrap) : null
  const body = wrap ? $('.faq-answer-body', wrap) : null

  if (!wrap || !details || !shell || !body) return

  const wasOpen = details.open

  wrap.classList.add('faq-item-wrap--measuring')
  details.classList.add('faq-item--expanded')
  shell.classList.add('faq-answer-shell--open')
  if (!wasOpen) details.setAttribute('open', '')

  body.style.opacity = '1'
  body.style.transform = 'none'
  shell.style.maxHeight = 'none'

  void body.offsetHeight

  const height = Math.ceil(
    Math.max(shell.scrollHeight, shell.getBoundingClientRect().height, body.scrollHeight),
  )
  const reserve = `${Math.max(height, 1)}px`

  shell.style.maxHeight = ''

  wrap.style.setProperty('--faq-last-reserve', reserve)

  body.style.opacity = ''
  body.style.transform = ''
  shell.classList.remove('faq-answer-shell--open')
  details.classList.remove('faq-item--expanded')
  wrap.classList.remove('faq-item-wrap--measuring')

  if (!wasOpen) details.removeAttribute('open')

  syncLastFaqReserveState()
}
