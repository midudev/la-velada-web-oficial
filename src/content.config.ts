import { defineCollection, z } from 'astro:content'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data/podcast-episodes.json')

interface PodcastEpisode {
  videoId: string
  title: string
  published: string
}

const podcast = defineCollection({
  loader: () => {
    try {
      const raw = readFileSync(DATA_FILE, 'utf-8')
      const episodes: PodcastEpisode[] = JSON.parse(raw)
      return episodes.map((entry) => ({
        id: entry.videoId,
        videoId: entry.videoId,
        title: entry.title,
        published: entry.published,
      }))
    } catch (error) {
      console.error('[podcast loader] No se pudo leer el histórico de episodios:', error)
      return []
    }
  },
  schema: z.object({
    videoId: z.string(),
    title: z.string(),
    published: z.string(),
  }),
})

export const collections = { podcast }
