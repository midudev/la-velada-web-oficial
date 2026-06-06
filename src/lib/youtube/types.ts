export interface YoutubeVideo {
  id: string
  title: string
  url: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
}

export interface VideoFilter {
  pattern: RegExp
  sinceDays: number
  limit: number
}
