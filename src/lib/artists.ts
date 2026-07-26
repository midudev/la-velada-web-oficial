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

/** Convierte una marca de tiempo `m:ss` o `h:mm:ss` a segundos totales. */
export function parseTimestampToSeconds(timestamp: string): number {
  return timestamp
    .split(':')
    .map(Number)
    .reduce((totalSeconds, part) => totalSeconds * 60 + part, 0)
}

/** Construye la URL del vídeo de YouTube de la actuación en el instante indicado. */
export function getSetlistSongVideoUrl(videoId: string, timestamp: string): string {
  return `https://www.youtube.com/watch?v=${videoId}&t=${parseTimestampToSeconds(timestamp)}s`
}

/** Construye la URL de Spotify de una canción a partir de su id. */
export function getTrackSpotifyUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`
}
