import { BOXERS_BY_ID } from '@/consts/boxers'

export function getBoxerById(id: string) {
  return BOXERS_BY_ID[id] || null
}
