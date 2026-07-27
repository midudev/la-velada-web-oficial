import type { BoxerGender } from '@/consts/boxers'

/** Panel oficial de jueces de La Velada del Año VI (WBC). */
export const JUDGE_COUNTRIES = ['es', 'ar', 'co', 'mx', 'me'] as const
export type JudgeCountry = (typeof JUDGE_COUNTRIES)[number]

export type DecisionKind = 'unanimous' | 'split'

export interface BattleResult {
  winnerId: string
  decision: DecisionKind
  /** Tarjetas a favor del ganador vs en contra, p. ej. [5, 0] o [3, 2]. */
  votes: readonly [number, number]
  /** Voto de cada juez → id del boxeador. */
  judgeVotes: Record<JudgeCountry, string>
}

function unanimous(winnerId: string): BattleResult {
  return {
    winnerId,
    decision: 'unanimous',
    votes: [5, 0],
    judgeVotes: {
      es: winnerId,
      ar: winnerId,
      co: winnerId,
      mx: winnerId,
      me: winnerId,
    },
  }
}

/**
 * Resultados oficiales de los 10 combates.
 * Solo se publicaron conteos de tarjetas (y, en divididas, el país del voto).
 */
export const battleResultsById: Record<string, BattleResult> = {
  'la-parce-vs-fabiana-sevillano': {
    winnerId: 'la-parce',
    decision: 'split',
    votes: [3, 2],
    judgeVotes: {
      ar: 'la-parce',
      co: 'la-parce',
      me: 'la-parce',
      mx: 'fabiana-sevillano',
      es: 'fabiana-sevillano',
    },
  },
  'clersss-vs-natalia-mx': unanimous('natalia-mx'),
  'edu-aguirre-vs-gaston-edul': {
    winnerId: 'edu-aguirre',
    decision: 'split',
    votes: [4, 1],
    judgeVotes: {
      co: 'edu-aguirre',
      es: 'edu-aguirre',
      mx: 'edu-aguirre',
      me: 'edu-aguirre',
      ar: 'gaston-edul',
    },
  },
  'marta-diaz-vs-tatiana-kaer': {
    winnerId: 'marta-diaz',
    decision: 'split',
    votes: [4, 1],
    judgeVotes: {
      es: 'marta-diaz',
      ar: 'marta-diaz',
      co: 'marta-diaz',
      me: 'marta-diaz',
      mx: 'tatiana-kaer',
    },
  },
  'viruzz-vs-gero-arias': unanimous('gero-arias'),
  'alondrissa-vs-angie-velasco': unanimous('angie-velasco'),
  'lit-killah-vs-kidd-keo': unanimous('lit-killah'),
  'samy-rivers-vs-roro': unanimous('roro'),
  'plex-vs-fernanfloo': unanimous('plex'),
  'illojuan-vs-thegrefg': {
    winnerId: 'thegrefg',
    decision: 'split',
    votes: [4, 1],
    judgeVotes: {
      es: 'thegrefg',
      ar: 'thegrefg',
      mx: 'thegrefg',
      me: 'thegrefg',
      co: 'illojuan',
    },
  },
}

export function getBattleResult(battleId: string): BattleResult | null {
  return battleResultsById[battleId] ?? null
}

export function getDecisionLabel(result: BattleResult): string {
  const score = `${result.votes[0]}-${result.votes[1]}`
  return result.decision === 'unanimous'
    ? `Decisión unánime (${score})`
    : `Decisión dividida (${score})`
}

export function getWinnerWord(gender: BoxerGender): string {
  return gender === 'f' ? 'Ganadora' : 'Ganador'
}

/** Países de jueces que votaron por un boxeador, en el orden del panel. */
export function getJudgeCountriesForBoxer(
  result: BattleResult,
  boxerId: string,
): JudgeCountry[] {
  return JUDGE_COUNTRIES.filter((country) => result.judgeVotes[country] === boxerId)
}
