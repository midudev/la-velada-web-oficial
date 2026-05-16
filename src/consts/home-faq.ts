import { battles } from '@/consts/battles'
import { EVENT_VENUE_LABEL, EVENT_VENUE_MAP_URL } from '@/consts/event'

export interface HomeFaqStreamChannel {
  platform: string
  href: string
  label: string
}

export interface HomeFaqBattleItem {
  number: number
  title: string
}

export interface HomeFaqItem {
  question: string
  answer: string
  channels?: readonly HomeFaqStreamChannel[]
  battles?: readonly HomeFaqBattleItem[]
  mainEventBattle?: HomeFaqBattleItem
  eventTime?: boolean
  venueMap?: boolean
}

export const HOME_FAQ_BATTLES: readonly HomeFaqBattleItem[] = battles.map((battle) => ({
  number: battle.number,
  title: battle.title,
}))

const mainEventBattle = HOME_FAQ_BATTLES[HOME_FAQ_BATTLES.length - 1]
if (!mainEventBattle) {
  throw new Error('No hay combates definidos para el FAQ de la home')
}

export function getFaqAnswerText({
  answer,
  channels,
  battles: battleItems,
  mainEventBattle: mainEvent,
  eventTime,
  venueMap,
}: HomeFaqItem): string {
  const timeSuffix = eventTime
    ? ' 20:00h (horario de España peninsular).'
    : ''

  if (venueMap) {
    return `${answer} ${EVENT_VENUE_LABEL}. ${EVENT_VENUE_MAP_URL}`
  }

  if (mainEvent) {
    return `${answer} ${mainEvent.title}.`
  }

  if (battleItems?.length) {
    const battleLines = battleItems
      .map(({ number, title }) => `${number}. ${title}`)
      .join('; ')
    return `${answer} ${battleLines}.`
  }

  if (!channels?.length) return `${answer}${timeSuffix}`

  const channelLines = channels.map(({ label, href }) => `${label} (${href})`).join('; ')

  return `${answer}${timeSuffix} ${channelLines}`
}

export const HOME_FAQS = [
  {
    question: '¿Cuándo es La Velada del Año VI?',
    answer:
      'La Velada del Año VI se celebra el sábado 25 de julio de 2026 a partir de las',
    eventTime: true,
  },
  {
    question: '¿Dónde se celebra?',
    answer: 'En el',
    venueMap: true,
  },
  {
    question: '¿Dónde se puede ver online?',
    answer:
      'En directo y de forma gratuita en los canales oficiales de Ibai Llanos, en:',
    channels: [
      {
        platform: 'Twitch',
        href: 'https://twitch.tv/ibai',
        label: 'twitch.tv/ibai',
      },
      {
        platform: 'YouTube',
        href: 'https://youtube.com/@IbaiLlanos',
        label: 'youtube.com/@IbaiLlanos',
      },
      {
        platform: 'TikTok',
        href: 'https://tiktok.com/@ibaillanos',
        label: 'tiktok.com/@ibaillanos',
      },
    ],
  },
  {
    question: '¿Cuáles son los combates confirmados?',
    answer: 'Estos son los combates confirmados de La Velada del Año VI:',
    battles: HOME_FAQ_BATTLES,
  },
  {
    question: '¿Cuál es el main event?',
    answer: 'El combate estelar de la noche es',
    mainEventBattle,
  },
  {
    question: '¿Hay entradas disponibles?',
    answer:
      'No, las entradas están agotadas. Si se abriesen nuevas, lo avisaríamos por nuestros canales oficiales.',
  },
  {
    question: '¿Habrá artistas invitados?',
    answer: 'Sí, muy pronto se anunciarán.',
  },
] as const satisfies readonly HomeFaqItem[]
