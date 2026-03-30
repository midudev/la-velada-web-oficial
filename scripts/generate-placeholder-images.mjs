import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '../public')

const FIGHTERS = [
  'edu-aguirre', 'gaston-edul', 'fabiana-sevillano', 'la-parce',
  'clersss', 'natalia-mx', 'kidd-keo', 'lit-killah',
  'alondrissa', 'angie-velasco', 'viruzz', 'gero-arias',
  'samy-rivers', 'roro', 'marta-diaz', 'tatiana-kaer',
  'yosoyplex', 'fernanfloo', 'grefg', 'illojuan',
]

const COMBATS = [
  { id: '1-edu-aguirre-vs-gaston-edul', fighters: ['edu-aguirre', 'gaston-edul'] },
  { id: '2-fabiana-sevillano-vs-la-parce', fighters: ['fabiana-sevillano', 'la-parce'] },
  { id: '3-clersss-vs-natalia-mx', fighters: ['clersss', 'natalia-mx'] },
  { id: '4-kidd-keo-vs-lit-killah', fighters: ['kidd-keo', 'lit-killah'] },
  { id: '5-alondrissa-vs-angie-velasco', fighters: ['alondrissa', 'angie-velasco'] },
  { id: '6-viruzz-vs-gero-arias', fighters: ['viruzz', 'gero-arias'] },
  { id: '7-samy-rivers-vs-roro', fighters: ['samy-rivers', 'roro'] },
  { id: '8-marta-diaz-vs-tatiana-kaer', fighters: ['marta-diaz', 'tatiana-kaer'] },
  { id: '9-yosoyplex-vs-fernanfloo', fighters: ['yosoyplex', 'fernanfloo'] },
  { id: '10-grefg-vs-illojuan', fighters: ['grefg', 'illojuan'] },
]

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function createPlaceholder(filePath, width, height, label) {
  if (fs.existsSync(filePath)) return

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a2e"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.min(width, height) * 0.08}"
      fill="#c7a86b" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`

  await sharp(Buffer.from(svg)).webp({ quality: 60 }).toFile(filePath)
}

async function main() {
  let count = 0

  // Fighter card images (400x600)
  const cardsDir = path.join(PUBLIC_DIR, 'images/fighters/cards')
  ensureDir(cardsDir)
  for (const id of FIGHTERS) {
    await createPlaceholder(path.join(cardsDir, `${id}.webp`), 400, 600, id)
    count++
  }

  // Fighter combat pose images (600x800)
  const combatDir = path.join(PUBLIC_DIR, 'images/fighters/combat')
  ensureDir(combatDir)
  for (const id of FIGHTERS) {
    await createPlaceholder(path.join(combatDir, `${id}.webp`), 600, 800, id)
    count++
  }

  // Fighter VS images (400x400)
  for (const combat of COMBATS) {
    const [f1, f2] = combat.fighters
    await createPlaceholder(path.join(combatDir, `${f1}-vs-${f2}.webp`), 400, 400, `${f1} vs ${f2}`)
    count++
  }

  // Fighter big portrait images (500x700)
  const bigDir = path.join(PUBLIC_DIR, 'images/fighters/big')
  ensureDir(bigDir)
  for (const id of FIGHTERS) {
    await createPlaceholder(path.join(bigDir, `${id}.webp`), 500, 700, id)
    count++
  }

  // Fighter text overlay images (300x60)
  const textDir = path.join(PUBLIC_DIR, 'images/fighters/text')
  ensureDir(textDir)
  for (const id of FIGHTERS) {
    await createPlaceholder(path.join(textDir, `${id}.webp`), 300, 60, id)
    count++
  }

  // Combat video thumbnails (800x450)
  const combatesDir = path.join(PUBLIC_DIR, 'images/combates')
  ensureDir(combatesDir)
  for (const combat of COMBATS) {
    await createPlaceholder(path.join(combatesDir, `${combat.id}.webp`), 800, 450, combat.id)
    count++
  }

  // Versus icon (100x100)
  await createPlaceholder(path.join(PUBLIC_DIR, 'images/versus.webp'), 100, 100, 'VS')
  count++

  // Missing flag images
  const flagsDir = path.join(PUBLIC_DIR, 'images/flags')
  ensureDir(flagsDir)
  await createPlaceholder(path.join(flagsDir, 'pr.webp'), 80, 60, 'PR')
  count++
  await createPlaceholder(path.join(flagsDir, 'sv.webp'), 80, 60, 'SV')
  count++

  console.log(`🖼️  Generated ${count} placeholder images`)
}

main().catch(console.error)
