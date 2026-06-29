import { describe, expect, it } from 'vitest'

import { serializeJsonLd } from '@/utils/serialize-json-ld'

describe('serializeJsonLd', () => {
  it('serializa objetos simples como JSON', () => {
    expect(serializeJsonLd({ a: 1, b: 'texto' })).toBe('{"a":1,"b":"texto"}')
  })

  it('escapa "<" como \\u003c para no poder cerrar el <script>', () => {
    const result = serializeJsonLd('</script>')
    expect(result).not.toContain('<')
    expect(result).toContain('\\u003c')
    expect(result).toBe('"\\u003c/script>"')
  })

  it('escapa todas las apariciones de "<", incluso anidadas', () => {
    const result = serializeJsonLd({ name: '<b>Velada</b>', tags: ['<x>', '<y>'] })
    expect(result).not.toContain('<')
    expect(result.match(/\\u003c/g)).toHaveLength(4)
  })

  it('produce JSON que vuelve a parsear al valor original', () => {
    const data = {
      '@context': 'https://schema.org',
      name: 'La Velada del Año <VI>',
      performers: [{ name: 'IlloJuan' }, { name: 'TheGrefg' }],
    }
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data)
  })
})
