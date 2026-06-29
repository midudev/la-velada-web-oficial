import { describe, expect, it } from 'vitest'

import { BOXERS } from '@/consts/boxers'

describe('BOXERS · redes sociales', () => {
  it('cada boxeador tiene al menos una red social', () => {
    for (const boxer of BOXERS) {
      expect(boxer.socials.length, `sin socials: "${boxer.id}"`).toBeGreaterThan(0)
    }
  })

  it('cada red social tiene plataforma y usuario no vacíos', () => {
    for (const boxer of BOXERS) {
      for (const social of boxer.socials) {
        expect(social.platform.trim(), `platform vacía en "${boxer.id}"`).not.toBe('')
        expect(social.username.trim(), `username vacío en "${boxer.id}"`).not.toBe('')
      }
    }
  })

  it('no repite una entrada de red social completamente idéntica en un boxeador', () => {
    // Una misma cuenta puede aparecer dos veces con métricas distintas (p. ej.
    // Spotify con `monthlyListeners` y con `followers`), así que la clave incluye
    // la métrica para que solo se marque como error un duplicado exacto.
    for (const boxer of BOXERS) {
      const keys = boxer.socials.map(
        (social) =>
          `${social.platform}:${social.username}:${social.followers ?? ''}:${social.monthlyListeners ?? ''}`,
      )
      expect(new Set(keys).size, `entrada de red social duplicada en "${boxer.id}"`).toBe(
        keys.length,
      )
    }
  })

  it('los contadores de seguidores y oyentes, si existen, son enteros positivos', () => {
    for (const boxer of BOXERS) {
      for (const social of boxer.socials) {
        if (social.followers !== undefined) {
          expect(Number.isInteger(social.followers)).toBe(true)
          expect(social.followers).toBeGreaterThan(0)
        }
        if (social.monthlyListeners !== undefined) {
          expect(Number.isInteger(social.monthlyListeners)).toBe(true)
          expect(social.monthlyListeners).toBeGreaterThan(0)
        }
      }
    }
  })
})
