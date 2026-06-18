import { $, $$ } from '@/lib/dom-selector'

export interface UserVotes {
  [combatId: string]: string
}

export function getUserVotesFromDOM(): UserVotes {
  const votes: UserVotes = {}
  const fights = $$<HTMLElement>('[data-prediction-fight]')

  fights.forEach((fight) => {
    const battleId = fight.dataset.battleId
    if (!battleId) return

    const selected = $<HTMLButtonElement>(
      '[data-prediction-option][data-selected="true"]',
      fight,
    )
    const boxerId = selected?.dataset.boxerId
    if (boxerId) {
      votes[battleId] = boxerId
    }
  })

  return votes
}

export function areAllPredictionsComplete(): boolean {
  const fights = Array.from($$<HTMLElement>('[data-prediction-fight]'))
  if (fights.length === 0) return false

  return fights.every(
    (fight) => $('[data-prediction-option][data-selected="true"]', fight) !== null,
  )
}

export const PREDICTION_COMPLETE_EVENT = 'predictions:complete'
export const PREDICTION_SHARE_OPEN_EVENT = 'prediction-share:open'

export function dispatchPredictionsComplete(): void {
  document.dispatchEvent(new CustomEvent(PREDICTION_COMPLETE_EVENT))
}

export function openPredictionShare(): void {
  document.dispatchEvent(new CustomEvent(PREDICTION_SHARE_OPEN_EVENT))
}
