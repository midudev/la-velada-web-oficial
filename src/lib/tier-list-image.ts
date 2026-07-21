/**
 * Genera la imagen compartible del Tier List con branding de La Velada VI.
 * Formatos:
 *  - `instagram`: 1080×1350 (4:5, feed / reels cover)
 *  - `x`: 1200×675 (16:9, timeline)
 *  - `square`: 1080×1080 (versátil)
 */

import type { TierDefinition } from '@/consts/tier-list'
import { POOL_ID } from '@/consts/tier-list'

export type ShareFormat = 'instagram' | 'x' | 'square'

export interface TierListImageBoxer {
  id: string
  name: string
  imageUrl: string
}

export interface TierListImageInput {
  title: string
  tiers: TierDefinition[]
  /** tierId → boxerIds (sin pool). */
  placement: Record<string, string[]>
  boxers: TierListImageBoxer[]
  format?: ShareFormat
}

const FORMATS: Record<ShareFormat, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1350 },
  x: { width: 1200, height: 675 },
  square: { width: 1080, height: 1080 },
}

const LOGO_SRC = 'https://cdn.infolavelada.com/logo/logo.avif'
const SITE_URL = 'infolavelada.com'
const BRAND_LINE = 'Hecho en la web de La Velada VI'

const COLORS = {
  bg: '#0a1024',
  navy: '#142346',
  gold: '#c7a86b',
  cream: '#f4e4c9',
  creamMuted: 'rgba(244, 228, 201, 0.55)',
  rowBg: 'rgba(20, 35, 70, 0.92)',
  rowBorder: 'rgba(199, 168, 107, 0.22)',
}

const imageCache = new Map<string, HTMLImageElement>()

/** Candidatos same-origin primero (canvas + CORS fiable); CDN como respaldo. */
function portraitSources(boxer: TierListImageBoxer): string[] {
  return [
    `/character-select/${boxer.id}.png`,
    `/character-select/${boxer.id}.webp`,
    boxer.imageUrl,
  ]
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached?.complete && cached.naturalWidth > 0) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const img = new Image()
    // Solo pedimos CORS en orígenes externos; en same-origin no hace falta
    // y evita fallos si el recurso se sirve sin headers CORS.
    if (/^https?:\/\//i.test(src) && !src.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => {
      if (img.naturalWidth === 0) {
        reject(new Error(`Imagen vacía: ${src}`))
        return
      }
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = () => reject(new Error(`No se pudo cargar: ${src}`))
    img.src = src
  })
}

async function loadFirstAvailable(sources: string[]): Promise<HTMLImageElement | null> {
  for (const src of sources) {
    try {
      return await loadImage(src)
    } catch {
      // probar siguiente
    }
  }
  return null
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (iw <= 0 || ih <= 0) return
  const scale = Math.max(size / iw, size / ih)
  const sw = size / scale
  const sh = size / scale
  const sx = (iw - sw) / 2
  const sy = (ih - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, x, y, size, size)
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    font: string
    color: string
    align?: CanvasTextAlign
    baseline?: CanvasTextBaseline
    /** Si se pasa, reduce el font-size hasta que quepa (sin estirar con maxWidth). */
    fitWidth?: number
  },
) {
  ctx.textAlign = options.align ?? 'left'
  ctx.textBaseline = options.baseline ?? 'alphabetic'
  ctx.fillStyle = options.color

  let font = options.font
  if (options.fitWidth && options.fitWidth > 0) {
    // Extrae tamaño del font "… 24px …" y lo reduce si el texto no cabe.
    const match = font.match(/(\d+(?:\.\d+)?)px/)
    if (match) {
      let size = Number(match[1])
      const minSize = 9
      while (size > minSize) {
        ctx.font = font.replace(/(\d+(?:\.\d+)?)px/, `${size}px`)
        if (ctx.measureText(text).width <= options.fitWidth) break
        size -= 1
      }
      font = font.replace(/(\d+(?:\.\d+)?)px/, `${size}px`)
    }
  }

  ctx.font = font
  ctx.fillText(text, x, y)
}

/** Parte un texto en hasta 2 líneas sin partir a mitad de palabra si se puede. */
function splitTwoLines(text: string, ctx: CanvasRenderingContext2D, maxWidth: number): [string, string?] {
  if (ctx.measureText(text).width <= maxWidth) return [text]

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length > 1) {
    let best = 1
    for (let i = 1; i < words.length; i++) {
      const left = words.slice(0, i).join(' ')
      const right = words.slice(i).join(' ')
      if (ctx.measureText(left).width <= maxWidth) best = i
      if (ctx.measureText(right).width > maxWidth && i === best) break
    }
    return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
  }

  // Una sola palabra larga: partir por la mitad
  const mid = Math.ceil(text.length / 2)
  return [text.slice(0, mid), text.slice(mid)]
}

function drawCenteredLabelBlock(
  ctx: CanvasRenderingContext2D,
  opts: {
    x: number
    y: number
    w: number
    h: number
    letter: string
    hint?: string
    color: string
  },
) {
  const { x, y, w, h, letter, hint, color } = opts
  const cx = x + w / 2
  const cy = y + h / 2
  const fitW = w - 12
  const isLongPrimary = letter.length > 2

  if (!hint) {
    // Solo etiqueta (letra o texto personalizado)
    if (isLongPrimary) {
      ctx.font = `900 16px Cinzel, Georgia, serif`
      const [l1, l2] = splitTwoLines(letter, ctx, fitW)
      if (l2) {
        drawText(ctx, l1, cx, cy - 9, {
          font: '900 15px Cinzel, Georgia, serif',
          color,
          align: 'center',
          baseline: 'middle',
          fitWidth: fitW,
        })
        drawText(ctx, l2, cx, cy + 9, {
          font: '900 15px Cinzel, Georgia, serif',
          color,
          align: 'center',
          baseline: 'middle',
          fitWidth: fitW,
        })
      } else {
        drawText(ctx, l1, cx, cy, {
          font: '900 16px Cinzel, Georgia, serif',
          color,
          align: 'center',
          baseline: 'middle',
          fitWidth: fitW,
        })
      }
    } else {
      drawText(ctx, letter, cx, cy, {
        font: `900 ${Math.min(36, Math.round(h * 0.42))}px Cinzel, Georgia, serif`,
        color,
        align: 'center',
        baseline: 'middle',
        fitWidth: fitW,
      })
    }
    return
  }

  // Letra + hint (siempre centrados como bloque)
  const letterSize = Math.min(28, Math.round(h * 0.32))
  const hintSize = Math.min(13, Math.max(10, Math.round(h * 0.12)))

  ctx.font = `700 ${hintSize}px system-ui, sans-serif`
  const [h1, h2] = splitTwoLines(hint, ctx, fitW)
  const hintLines = h2 ? 2 : 1
  const blockH = letterSize + 4 + hintLines * (hintSize + 2)
  let ty = cy - blockH / 2 + letterSize / 2

  drawText(ctx, letter, cx, ty, {
    font: `900 ${letterSize}px Cinzel, Georgia, serif`,
    color,
    align: 'center',
    baseline: 'middle',
    fitWidth: fitW,
  })

  ty += letterSize / 2 + 4 + hintSize / 2
  drawText(ctx, h1, cx, ty, {
    font: `700 ${hintSize}px system-ui, sans-serif`,
    color: 'rgba(26, 18, 8, 0.78)',
    align: 'center',
    baseline: 'middle',
    fitWidth: fitW,
  })
  if (h2) {
    ty += hintSize + 2
    drawText(ctx, h2, cx, ty, {
      font: `700 ${hintSize}px system-ui, sans-serif`,
      color: 'rgba(26, 18, 8, 0.78)',
      align: 'center',
      baseline: 'middle',
      fitWidth: fitW,
    })
  }
}

export async function buildTierListCanvas(input: TierListImageInput): Promise<HTMLCanvasElement> {
  const format = input.format ?? 'instagram'
  const { width, height } = FORMATS[format]
  const boxersById = Object.fromEntries(input.boxers.map((b) => [b.id, b]))

  // Siempre todas las filas del tier list (vacías incluidas).
  const tiersToDraw = input.tiers.length > 0 ? input.tiers : []

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Fondo
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, COLORS.navy)
  bgGrad.addColorStop(0.35, COLORS.bg)
  bgGrad.addColorStop(1, '#050812')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  const vignette = ctx.createRadialGradient(
    width / 2,
    height * 0.35,
    width * 0.1,
    width / 2,
    height * 0.5,
    width * 0.85,
  )
  vignette.addColorStop(0, 'rgba(199, 168, 107, 0.06)')
  vignette.addColorStop(1, 'transparent')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  const padX = Math.round(width * 0.045)
  const isWide = format === 'x'
  const isInstagram = format === 'instagram'
  let cursorY = isWide ? 24 : 32

  // Logo oficial (CDN). "Hecho en la web…" solo va en el footer.
  const logo = await loadFirstAvailable([LOGO_SRC, 'https://cdn.infolavelada.com/logo/logo.webp'])

  const logoSize = isWide ? 56 : 76
  if (logo) {
    ctx.save()
    ctx.globalAlpha = 0.98
    try {
      ctx.drawImage(logo, padX, cursorY, logoSize, logoSize)
    } catch {
      // ignore draw errors
    }
    ctx.restore()
  }

  // Header en una sola banda: logo + marca a la izquierda, título del tier a la derecha.
  // (sin infolavelada.com arriba; la atribución queda solo en el footer)
  const brandX = padX + (logo ? logoSize + 16 : 0)
  const brandY = cursorY + logoSize * 0.5
  const titleText = input.title.toUpperCase()
  const brandFontSize = isWide ? 17 : 20
  const titleFontSize = isWide ? 18 : 24

  ctx.font = `800 ${brandFontSize}px Cinzel, Georgia, serif`
  const brandW = ctx.measureText('LA VELADA DEL AÑO VI').width
  drawText(ctx, 'LA VELADA DEL AÑO VI', brandX, brandY, {
    font: `800 ${brandFontSize}px Cinzel, Georgia, serif`,
    color: COLORS.gold,
    baseline: 'middle',
  })

  // Separador · entre marca y título del ranking
  const sepX = brandX + brandW + (isWide ? 14 : 18)
  drawText(ctx, '·', sepX, brandY, {
    font: `700 ${brandFontSize}px Cinzel, Georgia, serif`,
    color: 'rgba(199, 168, 107, 0.55)',
    align: 'left',
    baseline: 'middle',
  })

  const titleX = sepX + (isWide ? 14 : 18)
  const titleMaxW = width - padX - titleX
  drawText(ctx, titleText, titleX, brandY, {
    font: `900 ${titleFontSize}px Cinzel, Georgia, serif`,
    color: COLORS.cream,
    align: 'left',
    baseline: 'middle',
    fitWidth: titleMaxW,
  })

  cursorY += logoSize + (isWide ? 12 : 16)

  const lineGrad = ctx.createLinearGradient(padX, 0, width - padX, 0)
  lineGrad.addColorStop(0, 'transparent')
  lineGrad.addColorStop(0.5, COLORS.gold)
  lineGrad.addColorStop(1, 'transparent')
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, cursorY)
  ctx.lineTo(width - padX, cursorY)
  ctx.stroke()
  cursorY += isWide ? 12 : 16

  const footerH = isWide ? 34 : 48
  const n = Math.max(tiersToDraw.length, 1)
  const availableH = height - cursorY - footerH - 8
  const rowGap = isWide ? 5 : 8
  const portraitPad = isWide ? 6 : isInstagram ? 10 : 8
  const portraitGap = isInstagram ? 8 : 6
  const labelW = isWide ? 72 : isInstagram ? 104 : 96

  // Cuántas “subfilas” de retratos necesita cada tier (sin +N).
  const counts = tiersToDraw.map((t) => (input.placement[t.id] ?? []).length)

  /**
   * Dado un tamaño de retrato, calcula columnas por fila, subfilas por tier
   * y la altura de cada tier. Si el bloque no cabe en availableH, se reduce
   * el tamaño de retrato hasta que entre todo (o al mínimo).
   */
  function layoutForPortraitSize(size: number) {
    const contentW = width - padX * 2 - labelW - portraitPad * 2
    const cols = Math.max(1, Math.floor((contentW + portraitGap) / (size + portraitGap)))
    const subRows = counts.map((c) => Math.max(1, Math.ceil(Math.max(c, 1) / cols)))
    // Tiers vacíos: una sola subfila (altura mínima de una miniatura).
    const heights = subRows.map((sr) => sr * size + (sr - 1) * portraitGap + portraitPad * 2)
    const blockH = heights.reduce((a, b) => a + b, 0) + rowGap * (n - 1)
    return { cols, subRows, heights, blockH, size }
  }

  // Partimos grandes y crecemos hasta llenar el alto disponible en cada formato.
  let portraitSize = isWide ? 64 : isInstagram ? 110 : 100
  let layout = layoutForPortraitSize(portraitSize)
  const minPortrait = isWide ? 32 : 40
  const maxPortrait = isWide ? 92 : isInstagram ? 160 : 140

  while (layout.blockH > availableH && portraitSize > minPortrait) {
    portraitSize -= 2
    layout = layoutForPortraitSize(portraitSize)
  }
  // Si sobra espacio vertical (X 16:9, cuadrado e Instagram), agrandar avatares.
  while (portraitSize < maxPortrait) {
    const nextSize = portraitSize + 2
    const next = layoutForPortraitSize(nextSize)
    if (next.blockH > availableH) break
    portraitSize = nextSize
    layout = next
  }

  const { cols: portraitsPerRow, heights: tierHeights } = layout

  // Precargar retratos (same-origin primero)
  const neededIds = new Set<string>()
  for (const tier of tiersToDraw) {
    for (const id of input.placement[tier.id] ?? []) neededIds.add(id)
  }
  const portraits = new Map<string, HTMLImageElement>()
  await Promise.all(
    [...neededIds].map(async (id) => {
      const boxer = boxersById[id]
      if (!boxer) return
      const img = await loadFirstAvailable(portraitSources(boxer))
      if (img) portraits.set(id, img)
    }),
  )

  // Centrar verticalmente el bloque de filas si sobra espacio
  if (layout.blockH < availableH) {
    cursorY += Math.floor((availableH - layout.blockH) / 2)
  }

  for (let ti = 0; ti < tiersToDraw.length; ti++) {
    const tier = tiersToDraw[ti]!
    const ids = input.placement[tier.id] ?? []
    const rowH = tierHeights[ti]!
    const y = cursorY

    // Fondo de fila
    ctx.fillStyle = COLORS.rowBg
    roundRect(ctx, padX, y, width - padX * 2, rowH, 6)
    ctx.fill()
    ctx.strokeStyle = COLORS.rowBorder
    ctx.lineWidth = 1
    roundRect(ctx, padX, y, width - padX * 2, rowH, 6)
    ctx.stroke()

    // Etiqueta de tier (altura = fila completa, también si hay 2 subfilas)
    ctx.fillStyle = tier.color
    roundRect(ctx, padX, y, labelW, rowH, 6)
    ctx.fill()
    ctx.fillRect(padX + labelW - 8, y, 8, rowH)

    drawCenteredLabelBlock(ctx, {
      x: padX,
      y,
      w: labelW,
      h: rowH,
      letter: tier.label,
      hint: tier.hint,
      color: tier.textColor ?? '#1a1208',
    })

    // Retratos en grid: si no caben en una fila, crece el tier (2.ª fila, etc.)
    const startX = padX + labelW + portraitPad
    const startY = y + portraitPad

    ids.forEach((id, i) => {
      const col = i % portraitsPerRow
      const row = Math.floor(i / portraitsPerRow)
      const px = startX + col * (portraitSize + portraitGap)
      const py = startY + row * (portraitSize + portraitGap)
      const img = portraits.get(id)

      ctx.save()
      roundRect(ctx, px, py, portraitSize, portraitSize, 4)
      ctx.clip()
      if (img) {
        drawCover(ctx, img, px, py, portraitSize)
      } else {
        ctx.fillStyle = COLORS.navy
        ctx.fillRect(px, py, portraitSize, portraitSize)
        const name = boxersById[id]?.name ?? id
        drawText(ctx, name.slice(0, 2).toUpperCase(), px + portraitSize / 2, py + portraitSize / 2, {
          font: `800 ${Math.round(portraitSize * 0.28)}px Cinzel, Georgia, serif`,
          color: COLORS.cream,
          align: 'center',
          baseline: 'middle',
        })
      }
      ctx.restore()

      ctx.strokeStyle = 'rgba(199, 168, 107, 0.45)'
      ctx.lineWidth = 1.5
      roundRect(ctx, px, py, portraitSize, portraitSize, 4)
      ctx.stroke()
    })

    cursorY += rowH + rowGap
  }

  // Footer
  drawText(ctx, `${BRAND_LINE}  ·  ${SITE_URL}`, width / 2, height - footerH / 2, {
    font: `700 ${isWide ? 12 : 14}px Cinzel, Georgia, serif`,
    color: COLORS.gold,
    align: 'center',
    baseline: 'middle',
  })

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

export async function buildTierListBlob(input: TierListImageInput): Promise<Blob> {
  const canvas = await buildTierListCanvas(input)
  return canvasToBlob(canvas)
}

/** Filtra el pool del placement para la imagen. */
export function placementForImage(placement: Record<string, string[]>): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const [key, ids] of Object.entries(placement)) {
    if (key === POOL_ID) continue
    out[key] = ids
  }
  return out
}
