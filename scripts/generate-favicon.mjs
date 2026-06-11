import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const SOURCE = path.join(ROOT, 'public', 'logo.svg')
const OUTPUT_ICO = path.join(ROOT, 'public', 'favicon.ico')

// Tamaños recomendados que cabe meter en un .ico clásico. Los navegadores
// modernos cogerán el SVG; el .ico se queda para casos legacy (pestañas
// antiguas, atajos de Windows, etc.).
const SIZES = [16, 32, 48]

const buffers = await Promise.all(
  SIZES.map((size) =>
    sharp(SOURCE)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer(),
  ),
)

const ico = await pngToIco(buffers)
await writeFile(OUTPUT_ICO, ico)

console.log(`Generado ${path.relative(ROOT, OUTPUT_ICO)} con tamaños: ${SIZES.join(', ')} px`)
