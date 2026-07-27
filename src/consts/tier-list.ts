/**
 * Plantillas y configuración del Tier List de La Velada VI.
 * Las filas usan la paleta clásica de Tiermaker (S → F).
 */

export interface TierDefinition {
  id: string
  label: string
  /** Color de fondo de la etiqueta de fila. */
  color: string
  /** Color del texto de la etiqueta (por defecto oscuro). */
  textColor?: string
  /** Subtítulo opcional bajo la letra (p. ej. “Me encantan”). */
  hint?: string
}

export interface TierTemplate {
  id: string
  title: string
  shortLabel: string
  description: string
  emoji: string
  tiers: TierDefinition[]
  /**
   * Ranking de ejemplo opcional: `tierId → boxerIds`.
   * Si existe, al elegir la plantilla se rellenan esas filas.
   */
  preset?: Record<string, string[]>
}

export const DEFAULT_TIER_COLORS = {
  s: '#ff7f7f',
  a: '#ffbf7f',
  b: '#ffdf7f',
  c: '#ffff7f',
  d: '#bfff7f',
  f: '#7fbfff',
} as const

function classicTiers(
  hints: Partial<Record<keyof typeof DEFAULT_TIER_COLORS, string>> = {},
): TierDefinition[] {
  return [
    { id: 's', label: 'S', color: DEFAULT_TIER_COLORS.s, hint: hints.s },
    { id: 'a', label: 'A', color: DEFAULT_TIER_COLORS.a, hint: hints.a },
    { id: 'b', label: 'B', color: DEFAULT_TIER_COLORS.b, hint: hints.b },
    { id: 'c', label: 'C', color: DEFAULT_TIER_COLORS.c, hint: hints.c },
    { id: 'd', label: 'D', color: DEFAULT_TIER_COLORS.d, hint: hints.d },
    { id: 'f', label: 'F', color: DEFAULT_TIER_COLORS.f, hint: hints.f },
  ]
}

export const TIER_TEMPLATES: TierTemplate[] = [
  {
    id: 'custom',
    title: 'Mi Tier List',
    shortLabel: 'Personalizado',
    description:
      'Empieza de cero y ordena a los luchadores como quieras. Haz clic en cada letra para poner el texto que quieras.',
    emoji: '✏️',
    tiers: classicTiers(),
  },
  {
    id: 'como-me-caen',
    title: 'Cómo me caen',
    shortLabel: 'Cómo me caen',
    description: 'De “me caen de maravilla” a “mejor ni hablar”. Sin filtros.',
    emoji: '💬',
    tiers: classicTiers({
      s: 'Besties',
      a: 'Muy bien',
      b: 'Bien',
      c: 'Neutro',
      d: 'Meh',
      f: 'Pass',
    }),
  },
  {
    id: 'miticos',
    title: 'Qué tan míticos son',
    shortLabel: 'Míticos',
    description: 'Aura, legado y lore. ¿Quién es ya una leyenda de La Velada?',
    emoji: '✨',
    tiers: classicTiers({
      s: 'Leyenda',
      a: 'Mítico',
      b: 'Grande',
      c: 'Promesa',
      d: 'Novato',
      f: 'Mortal',
    }),
  },
  {
    id: 'hype',
    title: 'Nivel de hype',
    shortLabel: 'Hype',
    description: '¿A quién quieres ver pelear sí o sí el 25 de julio?',
    emoji: '🔥',
    tiers: classicTiers({
      s: 'Imperdible',
      a: 'Muy hype',
      b: 'Interesa',
      c: 'Curioso',
      d: 'Regular',
      f: 'Skip',
    }),
  },
  {
    id: 'favoritos',
    title: 'Favoritos a ganar',
    shortLabel: 'Favoritos',
    description: 'Tu cartelera de favoritos: del campeón al outsider total.',
    emoji: '🏆',
    tiers: classicTiers({
      s: 'Campeón',
      a: 'Favorito',
      b: 'Contiende',
      c: '50/50',
      d: 'Underdog',
      f: 'Miracle',
    }),
  },
  {
    id: 'aura',
    title: 'Aura y presencia',
    shortLabel: 'Aura',
    description: 'Carisma, pose y “main character energy” dentro y fuera del ring.',
    emoji: '💫',
    tiers: classicTiers({
      s: 'Aura ∞',
      a: 'Presencia',
      b: 'Estilo',
      c: 'Normal',
      d: 'Bajo perfil',
      f: 'Invisible',
    }),
  },
  {
    id: 'entretenimiento',
    title: 'Entretenimiento puro',
    shortLabel: 'Entretenidos',
    description: '¿Quién genera más clips, memes y momentos épicos?',
    emoji: '😂',
    tiers: classicTiers({
      s: 'Clip farm',
      a: 'Muy divertido',
      b: 'Divertido',
      c: 'Ok',
      d: 'Flojo',
      f: 'Snooze',
    }),
  },
  {
    id: 'potencia',
    title: 'Nivel de potencia',
    shortLabel: 'Potencia',
    description: 'Puños de acero o de algodón: ¿quién pega más fuerte?',
    emoji: '💥',
    tiers: classicTiers({
      s: 'KO artist',
      a: 'Cañonero',
      b: 'Pega bien',
      c: 'Normal',
      d: 'Suave',
      f: 'Algodón',
    }),
  },
  {
    id: 'tecnica',
    title: 'Técnica de boxeo',
    shortLabel: 'Técnica',
    description: 'Guardia, footwork y mano izquierda. ¿Quién se ve más boxeador?',
    emoji: '🥊',
    tiers: classicTiers({
      s: 'Pro',
      a: 'Muy técnico',
      b: 'Solvente',
      c: 'Aprendiz',
      d: 'Torpe',
      f: 'Caos',
    }),
  },
  {
    id: 'cardio',
    title: 'Cardio y resistencia',
    shortLabel: 'Cardio',
    description: '¿Quién aguanta los 6 asaltos sin pedirle la hora al árbitro?',
    emoji: '🫁',
    tiers: classicTiers({
      s: 'Maratón',
      a: 'Tanque',
      b: 'Aguanta',
      c: 'Justo',
      d: 'Se cansa',
      f: 'Me muero',
    }),
  },
  {
    id: 'looks',
    title: 'Look de pelea',
    shortLabel: 'Looks',
    description: 'Entrada, ropa, vibe visual. ¿Quién llega más estilazo al ring?',
    emoji: '😎',
    tiers: classicTiers({
      s: 'Icono',
      a: 'Fire',
      b: 'Estilo',
      c: 'Correcto',
      d: 'Meh',
      f: '¿Eso?',
    }),
  },
  {
    id: 'entrenamiento',
    title: 'Más entregados al gym',
    shortLabel: 'Gym rats',
    description: 'Sparrings, dietas y madrugones: ¿quién se lo ha tomado en serio?',
    emoji: '🏋️',
    tiers: classicTiers({
      s: 'Beast mode',
      a: 'Muy serio',
      b: 'Constante',
      c: 'Regular',
      d: 'Vago',
      f: '¿Gym?',
    }),
  },
]

export const TIER_TEMPLATES_BY_ID: Record<string, TierTemplate> = Object.fromEntries(
  TIER_TEMPLATES.map((t) => [t.id, t]),
)

export const DEFAULT_TEMPLATE_ID = 'como-me-caen'

export const POOL_ID = 'pool' as const

export type TierPlacement = Record<string, string[]>

/** Estado vacío: todos los boxeadores en el pool. */
export function createEmptyPlacement(boxerIds: string[], tierIds: string[]): TierPlacement {
  const placement: TierPlacement = { [POOL_ID]: [...boxerIds] }
  for (const tierId of tierIds) {
    placement[tierId] = []
  }
  return placement
}

/** Aplica un preset opcional; el resto de boxeadores queda en el pool. */
export function createPlacementFromPreset(
  boxerIds: string[],
  tierIds: string[],
  preset?: Record<string, string[]>,
): TierPlacement {
  const placement = createEmptyPlacement(boxerIds, tierIds)
  if (!preset) return placement

  const assigned = new Set<string>()
  for (const tierId of tierIds) {
    const ids = preset[tierId] ?? []
    placement[tierId] = ids.filter((id) => boxerIds.includes(id) && !assigned.has(id))
    for (const id of placement[tierId]) assigned.add(id)
  }
  placement[POOL_ID] = boxerIds.filter((id) => !assigned.has(id))
  return placement
}
