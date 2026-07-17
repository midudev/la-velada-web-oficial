export interface PodcastFeedEntry {
  videoId: string
  title: string
  published: string
}

export function getRecentPodcastEpisodes(): Promise<PodcastFeedEntry[]>
