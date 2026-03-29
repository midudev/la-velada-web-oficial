import { describe, it, expect } from 'vitest'
import { removeMirroredPairs } from '../remove-mirrored-pairs'

describe('removeMirroredPairs', () => {
  it('should return unique pairs without duplicates', () => {
    const input = { a: ['b'], c: ['d'] }
    const result = removeMirroredPairs(input)
    expect(result).toEqual({ a: ['b'], c: ['d'] })
  })

  it('should remove mirrored pairs (A→B and B→A)', () => {
    const input = { a: ['b'], b: ['a'] }
    const result = removeMirroredPairs(input)
    const keys = Object.keys(result)
    expect(keys).toHaveLength(1)
  })

  it('should handle an empty object', () => {
    const result = removeMirroredPairs({})
    expect(result).toEqual({})
  })

  it('should handle a single pair', () => {
    const input = { x: ['y'] }
    const result = removeMirroredPairs(input)
    expect(result).toEqual({ x: ['y'] })
  })

  it('should handle multiple mirrored pairs', () => {
    const input = {
      a: ['b'],
      b: ['a'],
      c: ['d'],
      d: ['c'],
      e: ['f'],
    }
    const result = removeMirroredPairs(input)
    const keys = Object.keys(result)
    expect(keys).toHaveLength(3)
  })
})
