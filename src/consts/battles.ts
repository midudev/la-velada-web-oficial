import { battlePairs } from '@/consts/battle-pairs'
import { BOXERS_BY_ID } from '@/consts/boxers'

export interface Battle {
  id: string
  number: number
  boxerIds: readonly [string, string]
  title: string
  url: `/combate/${string}`
}

function getBoxerName(id: string): string {
  const boxer = BOXERS_BY_ID[id]
  if (!boxer) throw new Error(`No existe el boxeador con id "${id}"`)
  return boxer.name
}

export const battles: Battle[] = battlePairs.map(([boxer1Id, boxer2Id], index) => {
  const id = `${boxer1Id}-vs-${boxer2Id}`

  return {
    id,
    number: index + 1,
    boxerIds: [boxer1Id, boxer2Id],
    title: `${getBoxerName(boxer1Id)} vs ${getBoxerName(boxer2Id)}`,
    url: `/combate/${id}`,
  }
})

export const battlesById: Record<string, Battle> = Object.fromEntries(
  battles.map((battle) => [battle.id, battle]),
)
