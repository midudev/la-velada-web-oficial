import type { VideoFilter, YoutubeVideo } from '@/lib/youtube/types'

const FEED_ENDPOINT = (channelId: string) =>
  `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`

const ENTRY_RE = /<entry>([\s\S]*?)<\/entry>/g
const TAG_RE = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
const VIDEO_ID_RE = /<yt:videoId>([^<]+)<\/yt:videoId>/
const CHANNEL_TITLE_RE = /<author>\s*<name>([^<]+)<\/name>/
const PUBLISHED_RE = /<published>([^<]+)<\/published>/
const THUMBNAIL_RE = /<media:thumbnail\s+url="([^"]+)"/

const FEED_TIMEOUT_MS = 8000

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function parseEntry(raw: string, channelTitle: string): YoutubeVideo | null {
  const idMatch = raw.match(VIDEO_ID_RE)
  const titleMatch = raw.match(TAG_RE('title'))
  const publishedMatch = raw.match(PUBLISHED_RE)
  const thumbnailMatch = raw.match(THUMBNAIL_RE)
  if (!idMatch || !titleMatch || !publishedMatch) return null

  const id = idMatch[1].trim()
  const title = decodeXmlEntities(titleMatch[1].trim())
  const publishedAt = publishedMatch[1].trim()
  const thumbnail = thumbnailMatch?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  return {
    id,
    title,
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail,
    publishedAt,
    channelTitle,
  }
}

export async function fetchChannelFeed(channelId: string): Promise<YoutubeVideo[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS)
  try {
    const response = await fetch(FEED_ENDPOINT(channelId), { signal: controller.signal })
    if (!response.ok) return []
    const xml = await response.text()
    const channelTitleMatch = xml.match(CHANNEL_TITLE_RE)
    const channelTitle = channelTitleMatch ? decodeXmlEntities(channelTitleMatch[1].trim()) : ''
    const videos: YoutubeVideo[] = []
    for (const match of xml.matchAll(ENTRY_RE)) {
      const entry = parseEntry(match[1], channelTitle)
      if (entry) videos.push(entry)
    }
    return videos
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}

export function filterVideos(videos: YoutubeVideo[], filter: VideoFilter): YoutubeVideo[] {
  const sinceMs = Date.now() - filter.sinceDays * 24 * 60 * 60 * 1000
  return videos
    .filter((video) => {
      if (!filter.pattern.test(video.title)) return false
      const time = new Date(video.publishedAt).getTime()
      return Number.isFinite(time) && time >= sinceMs
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, filter.limit)
}
