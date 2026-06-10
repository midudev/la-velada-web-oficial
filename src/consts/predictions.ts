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
  isClose: boolean
}

export function formatPredictionVotes(votes: number) {
  return compactFormatter.format(votes)
}

export function formatPredictionPercent(percentage: number) {
  return `${percentFormatter.format(percentage)}%`
}

function getAudienceScore(boxer: Boxer) {
  return boxer.socials.reduce(
    (total, social) => total + (social.followers ?? 0) + (social.monthlyListeners ?? 0),
    0,
  )
}

function getSeedScore(value: string) {
  return Array.from(value).reduce((total, char, index) => {
    return total + char.charCodeAt(0) * (index + 3)
  }, 0)
}

function getPreviewVotes(boxer: Boxer, battle: Battle, sideIndex: number) {
  const audience = Math.max(getAudienceScore(boxer), 180_000)
  const socialWeight = Math.sqrt(audience) * 12
  const legacyWeight = boxer.previousVeladaWins.length * 2_400
  const seedWeight = (getSeedScore(`${battle.id}-${boxer.id}`) % 19) * 210
  const sidePush = sideIndex === 0 ? 950 : 1_250

  return Math.round(socialWeight + legacyWeight + seedWeight + sidePush)
}

const sideStyles: Record<PredictionSide, { color: string }> = {
  a: {
    color: '#c63030',
  },
  b: {
    color: 'var(--color-theme-gold)',
  },
}

export const predictionBattles: PredictionBattle[] = battles.map((battle, battleIndex) => {
  const [boxerAId, boxerBId] = battle.boxerIds
  const boxers = [BOXERS_BY_ID[boxerAId], BOXERS_BY_ID[boxerBId]] as const
  const voteCounts = boxers.map((boxer, sideIndex) => getPreviewVotes(boxer, battle, sideIndex))
  const totalVotes = voteCounts.reduce((total, votes) => total + votes, 0)

  const options = boxers.map((boxer, sideIndex) => {
    const side = sideIndex === 0 ? 'a' : 'b'
    const style = sideStyles[side]

    return {
      boxer,
      countryName: COUNTRY_NAMES[boxer.country] ?? boxer.country,
      heroImages: getBoxerHeroImages(boxer),
      percentage: (voteCounts[sideIndex] / totalVotes) * 100,
      votes: voteCounts[sideIndex],
      side,
      color: style.color,
      delay: battleIndex * 70 + sideIndex * 90,
    } satisfies PredictionOption
  }) as [PredictionOption, PredictionOption]

  const leader = options[0].percentage >= options[1].percentage ? options[0] : options[1]
  const difference = Math.abs(options[0].percentage - options[1].percentage)

  return {
    battle,
    options,
    totalVotes,
    leader,
    isClose: difference <= 8,
  }
})

export const totalPreviewVotes = predictionBattles.reduce(
  (total, prediction) => total + prediction.totalVotes,
  0,
)

export const closeBattles = predictionBattles.filter(({ isClose }) => isClose).length
