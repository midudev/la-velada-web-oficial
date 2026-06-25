// Formato de votos y porcentajes de los pronósticos. Vive aislado y sin
// dependencias pesadas (no importa `battles`/`boxers`) para poder compartirse
// entre el render del servidor y el script de cliente del controlador de voto
// sin arrastrar todo `@/consts/predictions` al bundle del navegador.

const compactFormatter = new Intl.NumberFormat('es-ES', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const exactVotesFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
})

export function formatPredictionVotes(votes: number) {
  return votes > 100_000 ? compactFormatter.format(votes) : exactVotesFormatter.format(votes)
}

export function formatPredictionPercent(percentage: number) {
  return `${percentFormatter.format(percentage)}%`
}

export function formatPredictionSupport(votes: number) {
  return `${formatPredictionVotes(votes)} ${votes === 1 ? 'voto' : 'votos'}`
}
