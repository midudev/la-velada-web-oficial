import { describe, expect, it } from 'vitest'

import {
  formatPredictionPercent,
  formatPredictionSupport,
  formatPredictionVotes,
} from '@/lib/format-votes'

describe('formatPredictionVotes', () => {
  it('formatea cifras hasta 100.000 con separador de miles español', () => {
    expect(formatPredictionVotes(0)).toBe('0')
    expect(formatPredictionVotes(1)).toBe('1')
    expect(formatPredictionVotes(10_000)).toBe('10.000')
    expect(formatPredictionVotes(100_000)).toBe('100.000')
  })

  it('usa notación compacta por encima de 100.000', () => {
    const compact = formatPredictionVotes(2_000_000)
    expect(compact).toMatch(/M/)
    // La forma compacta debe ser más corta que la exacta "2.000.000".
    expect(compact.length).toBeLessThan('2.000.000'.length)
  })

  it('siempre devuelve una cadena no vacía', () => {
    for (const votes of [0, 99, 100_000, 100_001, 5_900_000]) {
      expect(typeof formatPredictionVotes(votes)).toBe('string')
      expect(formatPredictionVotes(votes).length).toBeGreaterThan(0)
    }
  })
})

describe('formatPredictionPercent', () => {
  it('añade el símbolo de porcentaje', () => {
    expect(formatPredictionPercent(50)).toBe('50%')
    expect(formatPredictionPercent(0)).toBe('0%')
    expect(formatPredictionPercent(100)).toBe('100%')
  })

  it('redondea a un decimal con coma decimal española', () => {
    expect(formatPredictionPercent(33.33)).toBe('33,3%')
  })
})

describe('formatPredictionSupport', () => {
  it('usa el singular "voto" únicamente para un voto', () => {
    expect(formatPredictionSupport(1)).toBe('1 voto')
  })

  it('usa el plural "votos" para cualquier otra cantidad', () => {
    expect(formatPredictionSupport(0)).toBe('0 votos')
    expect(formatPredictionSupport(2)).toBe('2 votos')
    expect(formatPredictionSupport(10_000)).toBe('10.000 votos')
  })
})
