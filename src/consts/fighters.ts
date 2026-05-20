import { BOXERS } from './boxers'

export interface Fighter {
  id: string
  name: string
}

export const FIGHTERS: Fighter[] = BOXERS.map((b) => ({
  id: b.id,
  name: b.name,
}))
