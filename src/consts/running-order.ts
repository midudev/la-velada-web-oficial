import { battles } from '@/consts/battles'
import { BOXERS_BY_ID } from '@/consts/boxers'

// Orden real de la retransmisión (de apertura a Main Event), tal y como se
// anunció para el evento. Es independiente del id interno de cada combate
// en `battles.ts` (que numera por orden de alta en `battle-pairs.ts`) — aquí
// solo importa en qué momento de la velada sube cada pareja al ring.
const RUNNING_ORDER_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['fabiana-sevillano', 'la-parce'],
  ['clersss', 'natalia-mx'],
  ['edu-aguirre', 'gaston-edul'],
  ['marta-diaz', 'tatiana-kaer'],
  ['viruzz', 'gero-arias'],
  ['alondrissa', 'angie-velasco'],
  ['lit-killah', 'kidd-keo'],
  ['samy-rivers', 'roro'],
  ['plex', 'fernanfloo'],
  ['illojuan', 'thegrefg'],
]

// Los dos últimos combates de la noche son el cartel estelar (igual que en
// /combates, donde MAIN_EVENT_COUNT también vale 2).
const MAIN_EVENT_COUNT = 2

export interface TimetableFighter {
  id: string
  name: string
  country: string
}

export interface TimetableEntry {
  order: number
  url: `/combate/${string}`
  featured: boolean
  a: TimetableFighter
  b: TimetableFighter
}

function toFighter(id: string): TimetableFighter {
  const boxer = BOXERS_BY_ID[id]
  if (!boxer) throw new Error(`No existe el boxeador con id "${id}"`)
  return { id: boxer.id, name: boxer.name, country: boxer.country }
}

function findBattleUrl(aId: string, bId: string): `/combate/${string}` {
  const battle = battles.find((b) => b.boxerIds.includes(aId) && b.boxerIds.includes(bId))
  if (!battle) throw new Error(`No existe combate para "${aId}" vs "${bId}"`)
  return battle.url
}

export const TIMETABLE: TimetableEntry[] = RUNNING_ORDER_PAIRS.map(([aId, bId], index) => ({
  order: index + 1,
  url: findBattleUrl(aId, bId),
  featured: index >= RUNNING_ORDER_PAIRS.length - MAIN_EVENT_COUNT,
  a: toFighter(aId),
  b: toFighter(bId),
}))
