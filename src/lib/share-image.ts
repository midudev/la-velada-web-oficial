export interface FightBox {
  x: number
  y: number
  w: number
  h: number
}

export interface FightConfig {
  combatId: string
  leftBoxerId: string
  rightBoxerId: string
  left: FightBox
  right: FightBox
}

export const DESIGN_WIDTH = 718
export const DESIGN_HEIGHT = 828
export const EXPORT_SCALE = 3 // <- Esto es por la exportación en Figma, lo exportamos en 3x para mayor calidad

export const IMAGE_WIDTH = DESIGN_WIDTH * EXPORT_SCALE
export const IMAGE_HEIGHT = DESIGN_HEIGHT * EXPORT_SCALE
export const BACKGROUND_SRC = 'https://cdn.infolavelada.com/porra.png'

export const HIGHLIGHT_COLOR = '#EBDDB8'
export const BOX_INSET = 6

const BOX_SIZE = 39

// Basado de la imagen en Figma
const COL_PAIRS: [number, number][] = [
  [131.5, 186.5],
  [509.84, 564.84],
]

// Basado de la imagen en Figma
const ROWS_Y = [201.41, 323.94, 439.25, 554, 669.06]

interface PosterFight {
  combatId: string
  leftBoxerId: string
  rightBoxerId: string
}

const POSTER_FIGHTS: PosterFight[] = [
  { combatId: 'illojuan-vs-thegrefg', leftBoxerId: 'thegrefg', rightBoxerId: 'illojuan' },
  { combatId: 'plex-vs-fernanfloo', leftBoxerId: 'fernanfloo', rightBoxerId: 'plex' },
  {
    combatId: 'marta-diaz-vs-tatiana-kaer',
    leftBoxerId: 'marta-diaz',
    rightBoxerId: 'tatiana-kaer',
  },
  { combatId: 'samy-rivers-vs-roro', leftBoxerId: 'samy-rivers', rightBoxerId: 'roro' },
  { combatId: 'viruzz-vs-gero-arias', leftBoxerId: 'viruzz', rightBoxerId: 'gero-arias' },
  {
    combatId: 'alondrissa-vs-angie-velasco',
    leftBoxerId: 'angie-velasco',
    rightBoxerId: 'alondrissa',
  },
  { combatId: 'lit-killah-vs-kidd-keo', leftBoxerId: 'lit-killah', rightBoxerId: 'kidd-keo' },
  { combatId: 'clersss-vs-natalia-mx', leftBoxerId: 'natalia-mx', rightBoxerId: 'clersss' },
  {
    combatId: 'la-parce-vs-fabiana-sevillano',
    leftBoxerId: 'fabiana-sevillano',
    rightBoxerId: 'la-parce',
  },
  {
    combatId: 'edu-aguirre-vs-gaston-edul',
    leftBoxerId: 'edu-aguirre',
    rightBoxerId: 'gaston-edul',
  },
]

export const FIGHTS: FightConfig[] = POSTER_FIGHTS.map((fight, i) => {
  const rowIndex = Math.floor(i / 2)
  const [leftX, rightX] = COL_PAIRS[i % 2]
  const y = ROWS_Y[rowIndex]
  return {
    combatId: fight.combatId,
    leftBoxerId: fight.leftBoxerId,
    rightBoxerId: fight.rightBoxerId,
    left: { x: leftX, y, w: BOX_SIZE, h: BOX_SIZE },
    right: { x: rightX, y, w: BOX_SIZE, h: BOX_SIZE },
  }
})

export const TOTAL_FIGHTS = FIGHTS.length

let backgroundImage: HTMLImageElement | null = null

function loadBackground(): Promise<HTMLImageElement> {
  if (backgroundImage) return Promise.resolve(backgroundImage)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      backgroundImage = img
      resolve(img)
    }
    img.onerror = reject
    img.src = BACKGROUND_SRC
  })
}

export async function buildPredictionCanvas(
  userVotes: Record<string, string>,
): Promise<HTMLCanvasElement> {
  const img = await loadBackground()

  const canvas = document.createElement('canvas')
  canvas.width = IMAGE_WIDTH
  canvas.height = IMAGE_HEIGHT
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)

  ctx.fillStyle = HIGHLIGHT_COLOR
  for (const fight of FIGHTS) {
    const votedFighterId = userVotes[fight.combatId]
    if (!votedFighterId) continue

    const isLeft = votedFighterId === fight.leftBoxerId
    const isRight = votedFighterId === fight.rightBoxerId
    if (!isLeft && !isRight) continue

    const box = isLeft ? fight.left : fight.right
    const x = (box.x + BOX_INSET) * EXPORT_SCALE
    const y = (box.y + BOX_INSET) * EXPORT_SCALE
    const size = (box.w - BOX_INSET * 2) * EXPORT_SCALE
    ctx.fillRect(x, y, size, size)
  }

  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo generar el blob'))),
      'image/png',
    )
  })
}

export function openXIntent(shareText: string): void {
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  window.open(intentUrl, '_blank', 'noopener,noreferrer')
}

export async function buildPredictionBlob(userVotes: Record<string, string>): Promise<Blob> {
  const canvas = await buildPredictionCanvas(userVotes)
  return canvasToBlob(canvas)
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function downloadPredictionImage(userVotes: Record<string, string>): Promise<Blob> {
  const blob = await buildPredictionBlob(userVotes)
  downloadBlob(blob, 'mis-predicciones-velada.png')
  return blob
}
