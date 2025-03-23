import type { fighterId } from './fighters'

export interface Combat {
  id: string
  number: number
  fighters: fighterId[]
  titleSize: [number, number]
  title: string
  video: string
}
