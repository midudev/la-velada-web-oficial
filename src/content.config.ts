import { defineCollection, z } from 'astro:content'
import { fetchPodcastEpisodes } from './lib/podcast-fetcher'

const podcast = defineCollection({
  loader: async () => {
    try {
      const episodes = await fetchPodcastEpisodes()
      return episodes.map((entry) => ({
        id: entry.videoId,
        videoId: entry.videoId,
        title: entry.title,
        published: entry.published,
      }))
    } catch (error) {
      console.error('[podcast loader] No se pudo cargar el feed:', error)
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

