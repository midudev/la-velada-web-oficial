import { $ } from '@/lib/dom-selector'

function getFaqMain(): HTMLElement | null {
  const main = $('.faq-main')
  return main instanceof HTMLElement ? main : null
}

export function lockFaqMainHeight() {
  const main = getFaqMain()
  if (!main) return

  main.style.minHeight = `${Math.ceil(main.getBoundingClientRect().height)}px`
  main.classList.add('faq-main--height-lock')
}

export function releaseFaqMainHeight() {
  const main = getFaqMain()
  if (!main) return

  main.style.minHeight = ''
  main.classList.remove('faq-main--height-lock')
}
