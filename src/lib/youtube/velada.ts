import { fetchChannelFeed, filterVideos } from '@/lib/youtube/rss'
import type { YoutubeVideo } from '@/lib/youtube/types'

const VELADA_PATTERN = /\bvelada\b/i
const SINCE_DAYS = 90
const LIMIT = 6

export async function fetchVeladaVideos(channelId: string | undefined): Promise<YoutubeVideo[]> {
  if (!channelId) return []
  const all = await fetchChannelFeed(channelId)
  return filterVideos(all, {
    pattern: VELADA_PATTERN,
    sinceDays: SINCE_DAYS,
    limit: LIMIT,
  })
}
