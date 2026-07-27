import type { ImageMetadata } from 'astro'

/** Canción del setlist real interpretado en la actuación. */
export interface ArtistSetlistSong {
  name: string
  /** Id de la canción en Spotify (open.spotify.com/track/{id}), si existe. */
  spotifyId?: string
  /** Marca de tiempo en el vídeo de la actuación, formato `m:ss` o `h:mm:ss`. */
  timestamp: string
}

/** Enlace a Spotify de uno de los intérpretes (un dúo/grupo tiene varios). */
export interface ArtistSpotifyLink {
  name: string
  url: string
}

export interface Artist {
  id: string
  /** Slug legible usado en la URL (p. ej. "anuel-aa"), alternativo al id de Spotify. */
  slug: string
  name: string
  image: ImageMetadata
  /** Seguidores (agregados si es un dúo/grupo). */
  followers: number
  genres: string[]
  /** 0-100. */
  popularity: number
  setlist?: ArtistSetlistSong[]
  /** Un enlace por intérprete (2 en el caso de un dúo). */
  spotifyLinks: ArtistSpotifyLink[]
  videoId?: string
}
