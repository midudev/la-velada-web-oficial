import { battles, type Battle } from '@/consts/battles'
import {
  BOXERS_BY_ID,
  COUNTRY_NAMES,
  getBoxerHeroImages,
  type Boxer,
  type BoxerImageVariants,
} from '@/consts/boxers'

const compactFormatter = new Intl.NumberFormat('es-ES', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const percentFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
})

export type PredictionSide = 'a' | 'b'

export interface PredictionOption {
  boxer: Boxer
  countryName: string
  heroImages: BoxerImageVariants
  percentage: number
  votes: number
  side: PredictionSide
  color: string
  delay: number
}

export interface PredictionBattle {
  battle: Battle
  options: readonly [PredictionOption, PredictionOption]
  totalVotes: number
  leader: PredictionOption
  favorite: PredictionOption | null
  isClose: boolean
}

export interface PredictionVotesInput {
  combat_id: string
  predictions: Array<{
    fighter_id: string
    votes: number
  }>
}

export function formatPredictionVotes(votes: number) {
  return compactFormatter.format(votes)
}

export function formatPredictionPercent(percentage: number) {
  return `${percentFormatter.format(percentage)}%`
}

export function formatPredictionSupport(votes: number) {
  return `${formatPredictionVotes(votes)} ${votes === 1 ? 'voto' : 'votos'}`
}

const sideStyles: Record<PredictionSide, { color: string }> = {
  a: {
    color: '#c63030',
  },
  b: {
    color: 'var(--color-theme-gold)',
  },
}

function createVotesByBattle(predictions: PredictionVotesInput[]) {
  const votesByBattle = new Map<string, Map<string, number>>()

  predictions.forEach((combatPrediction) => {
    votesByBattle.set(
      combatPrediction.combat_id,
      new Map(
        combatPrediction.predictions.map((prediction) => [
          prediction.fighter_id,
          prediction.votes,
        ]),
      ),
    )
  })

  return votesByBattle
}

export function createPredictionBattles(predictions: PredictionVotesInput[] = []) {
  const votesByBattle = createVotesByBattle(predictions)

  return battles.map((battle, battleIndex) => {
    const [boxerAId, boxerBId] = battle.boxerIds
    const boxers = [BOXERS_BY_ID[boxerAId], BOXERS_BY_ID[boxerBId]] as const
    const battleVotes = votesByBattle.get(battle.id)
    const voteCounts = boxers.map((boxer) => battleVotes?.get(boxer.id) ?? 0)
    const totalVotes = voteCounts.reduce((total, votes) => total + votes, 0)

    const options = boxers.map((boxer, sideIndex) => {
      const side = sideIndex === 0 ? 'a' : 'b'
      const style = sideStyles[side]
      const votes = voteCounts[sideIndex]

      return {
        boxer,
        countryName: COUNTRY_NAMES[boxer.country] ?? boxer.country,
        heroImages: getBoxerHeroImages(boxer),
        percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
        votes,
        side,
        color: style.color,
        delay: battleIndex * 70 + sideIndex * 90,
      } satisfies PredictionOption
    }) as [PredictionOption, PredictionOption]

    const leader = options[0].percentage >= options[1].percentage ? options[0] : options[1]
    const favorite = totalVotes > 0 && leader.percentage > 60 ? leader : null
    const difference = Math.abs(options[0].percentage - options[1].percentage)

    return {
      battle,
      options,
      totalVotes,
      leader,
      favorite,
      isClose: totalVotes === 0 || difference <= 8,
    }
  })
}

export const predictionBattles = createPredictionBattles()

export const totalPredictionVotes = predictionBattles.reduce(
  (total, prediction) => total + prediction.totalVotes,
  0,
)

export const closeBattles = predictionBattles.filter(({ isClose }) => isClose).length
