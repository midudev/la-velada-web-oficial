export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Resolves after `element` finishes a transition, or after `ms` as a fallback. */
export function afterTransition(
  element: HTMLElement,
  ms: number,
  property?: string,
): Promise<void> {
  if (prefersReducedMotion()) return Promise.resolve()

  return new Promise((resolve) => {
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      element.removeEventListener('transitionend', onEnd)
      window.clearTimeout(timer)
      resolve()
    }

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== element) return
      if (property && event.propertyName !== property) return
      finish()
    }

    element.addEventListener('transitionend', onEnd)
    const timer = window.setTimeout(finish, ms + 40)
  })
}
