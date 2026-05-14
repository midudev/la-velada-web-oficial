import { $, $$ } from '@/lib/dom-selector'

type FilterGroup = 'country' | 'gender'

interface FilterState {
  country: string
  gender: string
}

const FILTERS_FORM_SELECTOR = '[data-boxers-filters]'
const GRID_SELECTOR = '[data-boxers-grid]'
const EMPTY_SELECTOR = '[data-boxers-empty]'
const FOOTER_SELECTOR = '[data-boxers-footer]'
const CARD_SELECTOR = '[data-boxer-card]'
const FILTER_BUTTON_SELECTOR = '[data-filter]'
const RESET_BUTTON_SELECTOR = '[data-boxers-reset]'
const TILE_COUNT_SELECTOR = '.boxer-filter-tile-count'
const BUMP_CLASS = 'is-bumping'
const BUMP_DURATION_MS = 260

function bumpCount(node: HTMLElement | null): void {
  if (!node) return
  node.classList.remove(BUMP_CLASS)
  // Forzamos reflow para reiniciar la transición si se está pulsando rápido.
  void node.offsetWidth
  node.classList.add(BUMP_CLASS)
  window.setTimeout(() => node.classList.remove(BUMP_CLASS), BUMP_DURATION_MS)
}

// Cuenta cards que coinciden con un par (country, gender). Pasar '' en
// cualquiera de los dos significa "sin restricción en ese grupo".
function countMatching(cards: HTMLElement[], country: string, gender: string): number {
  let total = 0
  for (const card of cards) {
    if (country !== '' && card.dataset.country !== country) continue
    if (gender !== '' && card.dataset.gender !== gender) continue
    total += 1
  }
  return total
}

function projectedFor(
  group: FilterGroup,
  value: string,
  state: FilterState,
  cards: HTMLElement[],
): number {
  return group === 'country'
    ? countMatching(cards, value, state.gender)
    : countMatching(cards, state.country, value)
}

export function setupBoxersFilters(): void {
  const form = $<HTMLFormElement>(FILTERS_FORM_SELECTOR)
  const grid = $<HTMLElement>(GRID_SELECTOR)
  const empty = $<HTMLElement>(EMPTY_SELECTOR)
  const footer = $<HTMLElement>(FOOTER_SELECTOR)
  if (!form || !grid) return

  const cards = Array.from($$<HTMLElement>(CARD_SELECTOR, grid))
  const filterButtons = Array.from($$<HTMLButtonElement>(FILTER_BUTTON_SELECTOR, form))
  const resetButtons = Array.from($$<HTMLButtonElement>(RESET_BUTTON_SELECTOR))
  // Estado de filtros: '' = "todos". Sólo un valor activo por grupo.
  const state: FilterState = { country: '', gender: '' }

  const apply = (): void => {
    let visible = 0
    for (const card of cards) {
      const cardCountry = card.dataset.country ?? ''
      const cardGender = card.dataset.gender ?? ''
      const matches =
        (state.country === '' || state.country === cardCountry) &&
        (state.gender === '' || state.gender === cardGender)
      card.dataset.hidden = matches ? 'false' : 'true'
      if (matches) visible += 1
    }

    if (empty) {
      empty.classList.toggle('hidden', visible !== 0)
      empty.classList.toggle('flex', visible === 0)
    }

    // Mostramos el footer (con su separador) y los botones de reset
    // sólo cuando hay algún filtro activo.
    const hasActiveFilter = state.country !== '' || state.gender !== ''
    if (footer) footer.hidden = !hasActiveFilter
    for (const btn of resetButtons) btn.hidden = !hasActiveFilter

    // Para cada pill: recalculamos su conteo SIN aplicar el filtro de su
    // propio grupo (así se muestra cuántos quedarían si se activase
    // sobre los filtros actuales del resto). Y sincronizamos aria-pressed.
    for (const btn of filterButtons) {
      const group = btn.dataset.filter as FilterGroup | undefined
      const value = btn.dataset.value ?? ''
      if (!group) continue

      const isActive = state[group] === value
      btn.setAttribute('aria-pressed', String(isActive))

      const next = projectedFor(group, value, state, cards)
      const countNode = $<HTMLElement>(TILE_COUNT_SELECTOR, btn)
      if (countNode) {
        const previous = countNode.textContent
        const nextText = String(next)
        if (previous !== nextText) {
          countNode.textContent = nextText
          bumpCount(countNode)
        }
      }

      // Deshabilitamos las pills que no aportarían resultados, salvo la
      // activa (para que el usuario siempre pueda salir de un filtro
      // que dejó la lista vacía).
      const shouldDisable = next === 0 && !isActive
      btn.disabled = shouldDisable
      btn.dataset.disabled = String(shouldDisable)
    }
  }

  for (const btn of filterButtons) {
    btn.addEventListener('click', () => {
      const group = btn.dataset.filter as FilterGroup | undefined
      if (!group) return
      const value = btn.dataset.value ?? ''
      // Re-pulsar la pill activa no la apaga, salvo que sea distinta de
      // "todos"; mantenemos la UX simple: una activa siempre por grupo.
      if (state[group] === value) return
      state[group] = value
      apply()
    })
  }

  for (const btn of resetButtons) {
    btn.addEventListener('click', () => {
      state.country = ''
      state.gender = ''
      apply()
    })
  }

  apply()
}
