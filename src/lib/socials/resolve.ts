import type { Boxer } from '@/consts/boxers'
import type { FollowerMetric, ResolvedSocial, SocialPlatform } from '@/lib/socials/types'

type SocialEntry = Boxer['socials'][number]

function metricOf(entry: SocialEntry): FollowerMetric {
  return !entry.followers && typeof entry.monthlyListeners === 'number'
    ? 'monthlyListeners'
    : 'followers'
}

function countOf(entry: SocialEntry): number {
  if (entry.followers) return entry.followers
  if (typeof entry.monthlyListeners === 'number') return entry.monthlyListeners
  return 0
}

export function resolveSocials(boxer: Boxer): ResolvedSocial[] {
  return boxer.socials
    .map((entry) => ({
      platform: entry.platform as SocialPlatform,
      username: entry.username,
      metric: metricOf(entry),
      count: countOf(entry),
    }))
    .sort((a, b) => b.count - a.count)
}

export function totalFollowers(entries: ResolvedSocial[]): number {
  return entries
    .filter((entry) => entry.metric === 'followers')
    .reduce((acc, entry) => acc + entry.count, 0)
}
