import { describe, expect, it } from 'vitest'

import { BOXERS, COUNTRY_NAMES, GENDER_LABELS } from '@/consts/boxers'

describe('Cobertura de mapas de referencia', () => {
  it('todo país usado por un boxeador tiene nombre en COUNTRY_NAMES', () => {
    for (const boxer of BOXERS) {
      expect(
        COUNTRY_NAMES[boxer.country],
        `falta COUNTRY_NAMES["${boxer.country}"] (boxeador "${boxer.id}")`,
      ).toBeTruthy()
    }
  })

  it('todo género usado por un boxeador tiene etiqueta en GENDER_LABELS', () => {
    for (const boxer of BOXERS) {
      expect(GENDER_LABELS[boxer.gender]).toBeTruthy()
    }
  })

  it('los valores de COUNTRY_NAMES son cadenas no vacías', () => {
    for (const [code, name] of Object.entries(COUNTRY_NAMES)) {
      expect(code).toMatch(/^[a-z]{2}$/)
      expect(name.trim()).not.toBe('')
    }
  })
})
