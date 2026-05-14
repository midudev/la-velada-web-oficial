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

async function convertOne(inputPath, format, quality) {
  const outputPath = inputPath.replace(/\.png$/, `.${format}`)
  const pipeline = sharp(inputPath)
  if (format === 'webp') {
    await pipeline.webp({ quality, effort: 6 }).toFile(outputPath)
  } else if (format === 'avif') {
    await pipeline.avif({ quality, effort: 6 }).toFile(outputPath)
  }
  const { size: inputSize } = await fs.stat(inputPath)
  const { size: outputSize } = await fs.stat(outputPath)
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1)
  return { outputPath, inputSize, outputSize, reduction }
}

async function processDir(dirName) {
  const dirPath = path.join(PUBLIC_DIR, dirName)
  const files = await fs.readdir(dirPath)
  const pngs = files.filter((f) => f.endsWith('.png')).sort()

  console.log(`\n→ ${dirName}: ${pngs.length} PNG`)

  for (const file of pngs) {
    const inputPath = path.join(dirPath, file)
    const id = file.replace(/\.png$/, '')

    const [webp, avif] = await Promise.all([
      convertOne(inputPath, 'webp', QUALITY[dirName].webp),
      convertOne(inputPath, 'avif', QUALITY[dirName].avif),
    ])

    const fmt = (n) => `${(n / 1024).toFixed(1)} KB`
    console.log(
      `  ${id.padEnd(20)}  png ${fmt(webp.inputSize).padStart(8)}  →  webp ${fmt(
        webp.outputSize,
      ).padStart(8)} (-${webp.reduction}%)  ·  avif ${fmt(avif.outputSize).padStart(
        8,
      )} (-${avif.reduction}%)`,
    )
  }
}

for (const dir of DIRS) {
  await processDir(dir)
}

console.log('\n✔ Listo')
