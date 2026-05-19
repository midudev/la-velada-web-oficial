export const prerender = false

import type { APIRoute } from 'astro'

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

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(FEED_URL)
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Feed responded with ${response.status} ${response.statusText}` }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const xml = await response.text()
    const episodes = parseFeed(xml)
      .filter((entry) => new Date(entry.published).getFullYear() === 2026)
      .map((entry) => ({
        videoId: entry.videoId,
        title: entry.title,
        published: entry.published,
      }))
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())

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
