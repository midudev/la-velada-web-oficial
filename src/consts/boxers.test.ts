import { describe, expect, it } from 'vitest'

import { BOXERS, BOXERS_BY_ID } from '@/consts/boxers'

describe('BOXERS · identidad y campos obligatorios', () => {
  it('contiene boxeadores', () => {
    expect(BOXERS.length).toBeGreaterThan(0)
  })

  it('tiene identificadores únicos', () => {
    const ids = BOXERS.map((boxer) => boxer.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('usa ids en formato kebab-case (coinciden con las rutas de imágenes)', () => {
    for (const boxer of BOXERS) {
      expect(boxer.id, `id inválido: "${boxer.id}"`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  it('rellena los campos de texto obligatorios', () => {
    for (const boxer of BOXERS) {
      expect(boxer.name.trim(), `name vacío en "${boxer.id}"`).not.toBe('')
      expect(boxer.realName.trim(), `realName vacío en "${boxer.id}"`).not.toBe('')
      expect(boxer.country.trim(), `country vacío en "${boxer.id}"`).not.toBe('')
    }
  })

  it('declara un género válido', () => {
    for (const boxer of BOXERS) {
      expect(['f', 'm']).toContain(boxer.gender)
    }
  })

  it('expone previousVeladaWins como lista de números', () => {
    for (const boxer of BOXERS) {
      expect(Array.isArray(boxer.previousVeladaWins)).toBe(true)
      for (const win of boxer.previousVeladaWins) {
        expect(Number.isInteger(win)).toBe(true)
      }
    }
  })
})

describe('BOXERS_BY_ID', () => {
  it('indexa todos los boxeadores por su id', () => {
    expect(Object.keys(BOXERS_BY_ID)).toHaveLength(BOXERS.length)
    for (const boxer of BOXERS) {
      expect(BOXERS_BY_ID[boxer.id]).toBe(boxer)
    }
  })
})
