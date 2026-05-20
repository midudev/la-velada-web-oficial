import { battles } from './battles'

export interface Combat {
  id: string
  title: string
  fighters: string[]
}

export const COMBATS: Combat[] = battles.map((b) => ({
  id: b.id,
  title: b.title,
  fighters: [...b.boxerIds],
}))
