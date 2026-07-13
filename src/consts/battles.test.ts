import { describe, expect, it } from 'vitest'

import { battlePairs } from '@/consts/battle-pairs'
import { battles, battlesById } from '@/consts/battles'
import { BOXERS_BY_ID } from '@/consts/boxers'

describe('battlePairs · integridad', () => {
  it('cada par referencia a dos boxeadores existentes', () => {
    for (const [boxerAId, boxerBId] of battlePairs) {
      expect(BOXERS_BY_ID[boxerAId], `no existe el boxeador "${boxerAId}"`).toBeDefined()
      expect(BOXERS_BY_ID[boxerBId], `no existe el boxeador "${boxerBId}"`).toBeDefined()
    }
  })

  it('cada combate enfrenta a dos boxeadores distintos', () => {
    for (const [boxerAId, boxerBId] of battlePairs) {
      expect(boxerAId).not.toBe(boxerBId)
    }
  })

  it('ningún boxeador aparece en más de un combate', () => {
    const allIds = battlePairs.flat()
    expect(new Set(allIds).size, 'hay un boxeador repetido entre combates').toBe(allIds.length)
  })
})

describe('battles · derivados', () => {
  it('hay un combate por cada par definido', () => {
    expect(battles).toHaveLength(battlePairs.length)
  })

  it('numera los combates de forma secuencial empezando en 1', () => {
    battles.forEach((battle, index) => {
      expect(battle.number).toBe(index + 1)
    })
  })

  it('construye id y url de forma coherente con los boxeadores del par', () => {
    battles.forEach((battle) => {
      const [boxerAId, boxerBId] = battle.boxerIds
      expect(battle.id).toBe(`${boxerAId}-vs-${boxerBId}`)
      expect(battle.url).toBe(`/combate/${battle.id}`)
      expect(battle.title).toContain(' vs ')
    })
  })

  it('battlesById indexa todos los combates por su id', () => {
    expect(Object.keys(battlesById)).toHaveLength(battles.length)
    for (const battle of battles) {
      expect(battlesById[battle.id]).toBe(battle)
    }
  })
})
