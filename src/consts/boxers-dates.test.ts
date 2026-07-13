import { describe, expect, it } from 'vitest'

import { BOXERS } from '@/consts/boxers'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Comprueba el formato `YYYY-MM-DD` y que represente una fecha real. */
function isValidISODate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

describe('BOXERS · fechas', () => {
  it('followersUpdatedAt es una fecha ISO válida', () => {
    for (const boxer of BOXERS) {
      expect(
        isValidISODate(boxer.followersUpdatedAt),
        `followersUpdatedAt inválida en "${boxer.id}": ${boxer.followersUpdatedAt}`,
      ).toBe(true)
    }
  })

  it('birthDate, si está presente, es una fecha ISO válida en el pasado', () => {
    for (const boxer of BOXERS) {
      if (boxer.birthDate === null) continue
      expect(
        isValidISODate(boxer.birthDate),
        `birthDate inválida en "${boxer.id}": ${boxer.birthDate}`,
      ).toBe(true)
      expect(new Date(boxer.birthDate).getTime()).toBeLessThan(Date.now())
    }
  })

  it('age, si está presente, es un entero plausible', () => {
    for (const boxer of BOXERS) {
      if (boxer.age === null) continue
      expect(Number.isInteger(boxer.age), `age no entero en "${boxer.id}"`).toBe(true)
      expect(boxer.age).toBeGreaterThanOrEqual(10)
      expect(boxer.age).toBeLessThanOrEqual(99)
    }
  })
})
