const CHANNEL_ID = 'UC20NE0K97l6AsBeGKsAYtaA'
const RSS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const HTML_CHANNEL_URL = `https://www.youtube.com/@PodcastdeLuzu/videos`

export interface PodcastEpisode {
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

function parseRelativeDate(text: string): string {
  const now = new Date()
  const match = text.match(/(\d+)\s+(minute|hour|day|week|month|year|minuto|hora|día|dia|semana|mes|año)s?/i)
  if (match) {
    const value = parseInt(match[1])
    const unit = match[2].toLowerCase()
    if (unit.startsWith('min')) now.setMinutes(now.getMinutes() - value)
    else if (unit.startsWith('hour') || unit.startsWith('hora')) now.setHours(now.getHours() - value)
    else if (unit.startsWith('day') || unit.startsWith('día') || unit.startsWith('dia')) now.setDate(now.getDate() - value)
    else if (unit.startsWith('week') || unit.startsWith('semana')) now.setDate(now.getDate() - value * 7)
    else if (unit.startsWith('month') || unit.startsWith('mes')) now.setMonth(now.getMonth() - value)
    else if (unit.startsWith('year') || unit.startsWith('año')) now.setFullYear(now.getFullYear() - value)
  }
  return now.toISOString()
}

function extractFromHtml(html: string): Array<{ videoId: string; title: string; publishedText: string }> {
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/)
  if (!match) return []
  try {
    const json = JSON.parse(match[1])
    const tabs = json.contents?.twoColumnBrowseResultsRenderer?.tabs || []
    const videosTab = tabs.find((t: any) => t.tabRenderer?.title === 'Videos' || t.tabRenderer?.title === 'Vídeos')
    if (!videosTab) return []

    const contents = videosTab.tabRenderer?.content?.richGridRenderer?.contents || []
    return contents
      .map((item: any) => {
        const lockup = item.richItemRenderer?.content?.lockupViewModel
        if (!lockup) return null
        const videoId = lockup.contentId
        const title = lockup.metadata?.lockupMetadataViewModel?.title?.content
        
        // El texto tipo "hace 2 meses" está anidado en metadataRows
        const parts = lockup.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts || []
        const publishedText = parts.length > 1 ? parts[1].text?.content : ''
        
        if (!videoId || !title) return null
        return { videoId, title, publishedText }
      })
      .filter((v: any) => v !== null)
  } catch (error) {
    console.error('[podcast-fetcher] Error parsing HTML JSON:', error)
    return []
  }
}

export async function fetchPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const rssEpisodes: Record<string, PodcastEpisode> = {}

  // 1. Fetch RSS para obtener fechas exactas de los últimos 15 vídeos
  try {
    const rssRes = await fetch(RSS_FEED_URL)
    if (rssRes.ok) {
      const xml = await rssRes.text()
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
      let match: RegExpExecArray | null
      while ((match = entryRegex.exec(xml)) !== null) {
        const entry = match[1]
        const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
        const rawTitle = entry.match(/<title>([^<]+)<\/title>/)?.[1]
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
        if (videoId && rawTitle && published) {
          rssEpisodes[videoId] = {
            videoId,
            title: decodeHtmlEntities(rawTitle),
            published,
          }
        }
      }
    }
  } catch (error) {
    console.error('[podcast-fetcher] Error fetching RSS:', error)
  }

  let finalEpisodes: PodcastEpisode[] = []

  // 2. Fetch HTML para obtener TODOS los vídeos de la primera página (aprox 30, suficiente para 1 año)
  try {
    const htmlRes = await fetch(HTML_CHANNEL_URL, {
      headers: { 'Accept-Language': 'en-US,en;q=0.9' } // Pedimos inglés para poder parsear "2 weeks ago"
    })
    
    if (htmlRes.ok) {
      const html = await htmlRes.text()
      const htmlExtracted = extractFromHtml(html)
      
      if (htmlExtracted.length > 0) {
        finalEpisodes = htmlExtracted.map((ep) => {
          // Si lo tenemos en RSS, usamos la fecha exacta y título original
          if (rssEpisodes[ep.videoId]) {
            return rssEpisodes[ep.videoId]
          }
          // Si no, extrapolamos la fecha desde el texto (ej. "2 months ago")
          return {
            videoId: ep.videoId,
            title: ep.title, // El título del HTML ya viene decodificado y correcto
            published: parseRelativeDate(ep.publishedText || '1 year ago'),
          }
        })
      }
    }
  } catch (error) {
    console.error('[podcast-fetcher] Error fetching HTML:', error)
  }

  // 3. Fallback en caso de que falle el scraping HTML pero funcione RSS
  if (finalEpisodes.length === 0 && Object.keys(rssEpisodes).length > 0) {
    finalEpisodes = Object.values(rssEpisodes)
  }

  // 4. Filtrar por el año 2026 y ordenar
  return finalEpisodes
    .filter((ep) => new Date(ep.published).getFullYear() === 2026)
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
}
