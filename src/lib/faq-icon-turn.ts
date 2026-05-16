const OPEN_TURN_DEG = 405
const CLOSE_TURN_DEG = 315

function readTurnDeg(icon: HTMLElement) {
  const value = Number(icon.dataset.faqIconDeg ?? 0)
  return Number.isFinite(value) ? value : 0
}

export function syncFaqIconTurn(
  icon: HTMLElement,
  expanded: boolean,
  options: { instant?: boolean } = {},
) {
  const current = readTurnDeg(icon)
  const next = expanded ? current + OPEN_TURN_DEG : current + CLOSE_TURN_DEG

  icon.dataset.faqIconDeg = String(next)

  if (options.instant) {
    icon.style.transition = 'none'
    icon.style.setProperty('--faq-icon-turn', `${next}deg`)
    void icon.offsetHeight
    icon.style.transition = ''
    return
  }

  icon.style.setProperty('--faq-icon-turn', `${next}deg`)
}

export function resetFaqIconTurn(icon: HTMLElement, expanded: boolean) {
  const next = expanded ? 45 : 0
  icon.dataset.faqIconDeg = String(next)
  icon.style.setProperty('--faq-icon-turn', expanded ? '45deg' : '0deg')
}
