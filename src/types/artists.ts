import type { ImageMetadata } from 'astro'

export interface Artist {
  id: string
  name: string
  image: ImageMetadata
}
