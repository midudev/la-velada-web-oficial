import { defineCollection, z } from 'astro:content'

const CHANNEL_ID = 'UC20NE0K97l6AsBeGKsAYtaA'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

interface ParsedEntry {
  videoId: string
  title: string
  published: string
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function parseFeed(xml: string): ParsedEntry[] {
  const entries: ParsedEntry[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match: RegExpExecArray | null
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const rawTitle = entry.match(/<title>([^<]+)<\/title>/)?.[1]
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
    if (!videoId || !rawTitle || !published) continue
    entries.push({
      videoId,
      title: decodeHtmlEntities(rawTitle),
      published,
    })
  }
  return entries
}

const podcast = defineCollection({
  loader: async () => {
    try {
      const response = await fetch(FEED_URL)
      if (!response.ok) {
        console.warn(
          `[podcast loader] Feed responded with ${response.status} ${response.statusText}`,
        )
        return []
      }
      const xml = await response.text()
      return parseFeed(xml)
        .filter((entry) => new Date(entry.published).getFullYear() === 2026)
        .map((entry) => ({
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
