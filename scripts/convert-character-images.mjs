import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '../public')

// Directorios que contienen los PNG originales de los boxeadores. Para
// cada PNG generamos un .webp y un .avif en el mismo directorio para
// que el browser pueda elegir el mejor formato vía <picture>.
const DIRS = ['character-select', 'character-hero']

// Parámetros de calidad por directorio. character-hero es la imagen
// grande del hero y necesita más calidad que la miniatura.
const QUALITY = {
  'character-select': { webp: 80, avif: 55 },
  'character-hero': { webp: 85, avif: 60 },
}

// Anchos responsive a generar por directorio (además del tamaño completo, que
// se emite siempre sin sufijo). `character-hero` se muestra en la grid de
// /boxeadores en tarjetas pequeñas (~165-330px CSS): con estas variantes el
// navegador elige el tamaño adecuado vía `srcset` en lugar de descargar el
// recorte completo (1066px) siempre. Deben coincidir con
// `BOXER_HERO_VARIANT_WIDTHS` en `src/consts/boxers.ts`.
// `character-select` ya es una miniatura, no necesita variantes.
const VARIANT_WIDTHS = {
  'character-select': [],
  'character-hero': [320, 480, 640, 960],
}

// Emite una imagen (opcionalmente redimensionada a `width`) en un formato.
async function emit(inputPath, outputPath, { format, quality, width }) {
  let pipeline = sharp(inputPath)
  if (width) pipeline = pipeline.resize({ width })
  pipeline = format === 'avif' ? pipeline.avif({ quality, effort: 6 }) : pipeline.webp({ quality, effort: 6 })
  await pipeline.toFile(outputPath)
  return (await fs.stat(outputPath)).size
}

async function processDir(dirName) {
  const dirPath = path.join(PUBLIC_DIR, dirName)
  const files = await fs.readdir(dirPath)
  const pngs = files.filter((f) => f.endsWith('.png')).sort()
  const quality = QUALITY[dirName]
  const widths = VARIANT_WIDTHS[dirName] ?? []

  console.log(`\n→ ${dirName}: ${pngs.length} PNG (+${widths.length} variantes c/u)`)

  for (const file of pngs) {
    const inputPath = path.join(dirPath, file)
    const id = file.replace(/\.png$/, '')
    const { width: originalWidth = Infinity } = await sharp(inputPath).metadata()

    // Tamaño completo, sin sufijo (fallback y contextos que muestran el hero
    // a gran tamaño: ficha de combate, detalle de boxeador, selector, etc.).
    const [webp, avif] = await Promise.all([
      emit(inputPath, path.join(dirPath, `${id}.webp`), { format: 'webp', quality: quality.webp }),
      emit(inputPath, path.join(dirPath, `${id}.avif`), { format: 'avif', quality: quality.avif }),
    ])

    // Variantes de ancho, solo las que reducen respecto al original (sin upscale).
    let variantNote = ''
    for (const width of widths) {
      if (width >= originalWidth) continue
      await Promise.all([
        emit(inputPath, path.join(dirPath, `${id}-${width}.webp`), {
          format: 'webp',
          quality: quality.webp,
          width,
        }),
        emit(inputPath, path.join(dirPath, `${id}-${width}.avif`), {
          format: 'avif',
          quality: quality.avif,
          width,
        }),
      ])
      variantNote += ` ${width}`
    }

    const kb = (n) => `${(n / 1024).toFixed(1)} KB`
    console.log(
      `  ${id.padEnd(20)}  webp ${kb(webp).padStart(8)}  ·  avif ${kb(avif).padStart(8)}` +
        (variantNote ? `  ·  variantes:${variantNote}` : ''),
    )
  }
}

for (const dir of DIRS) {
  await processDir(dir)
}

console.log('\n✔ Listo')
