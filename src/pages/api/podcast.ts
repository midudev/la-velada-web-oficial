export const prerender = false

import type { APIRoute } from 'astro'
import { fetchPodcastEpisodes } from '@/lib/podcast-fetcher'

export const GET: APIRoute = async () => {
  try {
    const episodes = await fetchPodcastEpisodes()

    return new Response(JSON.stringify(episodes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache in Vercel CDN/Edge for 30 minutes, allow stale-while-revalidate for 5 minutes
        'Cache-Control': 'public, max-age=0, s-maxage=1800, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[api/podcast] Error fetching podcast feed:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to load podcast episodes' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
