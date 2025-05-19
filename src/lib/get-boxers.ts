import { FIGHTERS } from '@/consts/fighters'

const boxers = FIGHTERS

export function getBoxerById(boxerId: string) {
  return boxers.find((b) => b.id === boxerId) ?? boxers[0]
}

export function getBoxerVersusById(boxerId: string) {
  const boxer = boxers.find((b) => b.id === boxerId)
  if (!boxer) return boxers[0]
  return boxer
}
