/**
 * Formatea un número compacto con sufijo `B`/`M`/`K` (p. ej. 1_401_157_191 →
 * "1,4B"). Usado tanto para seguidores de artista como para reproducciones
 * de canciones.
 */
function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0'

  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000
    const rounded = Math.round(billions * 10) / 10
    const text = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1).replace('.', ',')
    return `${text}B`
  }

  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    const rounded = Math.round(millions * 10) / 10
    const text = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1).replace('.', ',')
    return `${text}M`
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`
  }

  return value.toString()
}

/**
 * Formatea un número de seguidores con sufijo `M`/`K`, igual que
 * `formatFollowers` de `src/lib/socials.ts` (duplicado a propósito para no
 * acoplar el módulo de artistas al de boxeadores).
 */
export function formatArtistFollowers(value: number): string {
  return formatCompactNumber(value)
}

/** Formatea reproducciones totales de una canción (p. ej. 807_526_554 → "807M"). */
export function formatTrackStreams(value: number): string {
  return formatCompactNumber(value)
}

/** Construye la URL de Spotify de una canción a partir de su id. */
export function getTrackSpotifyUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`
}

/** Convierte una duración en milisegundos a `m:ss` (p. ej. 216706 → "3:37"). */
export function formatTrackDuration(durationMs: number): string {
  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
