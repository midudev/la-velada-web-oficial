import { FIGHTERS } from '@/consts/fighters'

export function getBoxerById(boxerId: string) {
  return FIGHTERS.find((b) => b.id === boxerId) ?? FIGHTERS[0]
}

export function getBoxerVersusById(boxerId: string) {
  const boxer = FIGHTERS.find((b) => b.id === boxerId)
  if (!boxer) return FIGHTERS[0]
  return boxer
}
