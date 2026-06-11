import type { Boxer } from '@/consts/boxers'

export type BoxerSocial = Boxer['socials'][number]

/**
 * Formatea un número de seguidores con sufijo `M` para millones y `K`
 * para miles, siguiendo la convención habitual en redes sociales.
 *
 * - 50_400_000 → "50,4M"
 * - 1_500_000  → "1,5M"
 * - 234_100    → "234K"
 * - 950        → "950"
 *
 * Usa coma como separador decimal por ser una web en español.
 */
export function formatFollowers(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0'

  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    const rounded = Math.round(millions * 10) / 10
    const text = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1).replace('.', ',')
    return `${text}M`
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`
  }

  return value.toString()
}

const SOCIAL_LABELS: Record<string, string> = {
  twitch: 'Twitch',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  kick: 'Kick',
  spotify: 'Spotify',
  x: 'X',
}

/** Nombre legible de cada plataforma para usar en UI/aria-labels. */
export function getSocialLabel(platform: string): string {
  return (
    SOCIAL_LABELS[platform.toLowerCase()] ?? platform.charAt(0).toUpperCase() + platform.slice(1)
  )
}

/** Devuelve el valor a mostrar (followers o monthlyListeners). */
export function getSocialMetricValue(social: BoxerSocial): number {
  return social.followers ?? social.monthlyListeners ?? 0
}

/** Etiqueta corta de la métrica mostrada. */
export function getSocialMetricLabel(social: BoxerSocial): string {
  if (social.platform === 'spotify' && social.monthlyListeners != null) {
    return 'oyentes/mes'
  }
  return 'seguidores'
}

/**
 * Construye la URL pública del perfil del boxeador en la red social
 * indicada. Para YouTube y siempre que esté disponible, se prefiere el
 * id del canal del boxeador para no depender del handle.
 */
export function getSocialUrl(social: BoxerSocial, boxer: Boxer): string {
  const { platform, username } = social
  const normalizedPlatform = platform.toLowerCase()
  const handle = encodeURIComponent(username)

  if (normalizedPlatform === 'twitch') return `https://www.twitch.tv/${handle}`
  if (normalizedPlatform === 'tiktok') return `https://www.tiktok.com/@${handle}`
  if (normalizedPlatform === 'instagram') return `https://www.instagram.com/${handle}`
  if (normalizedPlatform === 'kick') return `https://kick.com/${handle}`
  if (normalizedPlatform === 'spotify') return `https://open.spotify.com/search/${handle}`
  if (normalizedPlatform === 'x') return `https://x.com/${handle}`

  if (normalizedPlatform === 'youtube') {
    if (boxer.youtubeChannelId && isPrimaryYoutubeChannel(social, boxer)) {
      return `https://www.youtube.com/channel/${boxer.youtubeChannelId}`
    }

    return `https://www.youtube.com/@${handle}`
  }

  return '#'
}

/**
 * Comprueba si la entrada de YouTube es el canal principal del boxeador
 * (el primero que aparece en `socials` con plataforma `youtube`).
 */
function isPrimaryYoutubeChannel(social: BoxerSocial, boxer: Boxer): boolean {
  const firstYoutube = boxer.socials.find((s) => s.platform === 'youtube')
  return firstYoutube === social
}
