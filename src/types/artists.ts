import type { ImageMetadata } from 'astro'

export interface ArtistTrack {
  id: string
  name: string
  album: string
  durationMs: number
  /** Reproducciones totales en Spotify. */
  streams: number
}

/** Enlace a Spotify de uno de los intérpretes (un dúo/grupo tiene varios). */
export interface ArtistSpotifyLink {
  name: string
  url: string
}

export interface Artist {
  id: string
  name: string
  image: ImageMetadata
  /** Seguidores (agregados si es un dúo/grupo). */
  followers: number
  genres: string[]
  /** 0-100. */
  popularity: number
  topTracks?: ArtistTrack[]
  /** Un enlace por intérprete (2 en el caso de un dúo). */
  spotifyLinks: ArtistSpotifyLink[]
}
