import fs from 'node:fs'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fighterGallery } from '@/utils/get-image-count'

const FIXTURE_ID = '__vitest_gallery_fixture__'
const fixtureDir = path.join(process.cwd(), 'public', 'images', 'fighters', 'gallery', FIXTURE_ID)

describe('fighterGallery', () => {
  beforeAll(() => {
    fs.mkdirSync(fixtureDir, { recursive: true })
    // 3 imágenes .webp válidas + 2 archivos que deben ignorarse.
    for (const file of ['01.webp', '02.webp', '03.webp', '04.png', 'notas.txt']) {
      fs.writeFileSync(path.join(fixtureDir, file), '')
    }
  })

  afterAll(() => {
    fs.rmSync(fixtureDir, { recursive: true, force: true })
  })

  it('cuenta solo los archivos .webp del directorio del boxeador', () => {
    expect(fighterGallery(FIXTURE_ID)).toBe(3)
  })

  it('devuelve 0 cuando el directorio no existe', () => {
    expect(fighterGallery('___no_existe_este_boxeador___')).toBe(0)
  })

  it('siempre devuelve un entero no negativo', () => {
    const count = fighterGallery(FIXTURE_ID)
    expect(Number.isInteger(count)).toBe(true)
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
