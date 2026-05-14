export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'twitch'
  | 'youtube'
  | 'x'
  | 'kick'
  | 'spotify'

export type FollowerMetric = 'followers' | 'monthlyListeners'

export interface ResolvedSocial {
  platform: SocialPlatform
  username: string
  metric: FollowerMetric
  count: number
}
