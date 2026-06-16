import { battles } from '@/consts/battles'

interface HomeFaqStreamChannel {
  platform: string
  href: string
  label: string
}

interface HomeFaqBattleItem {
  number: number
  title: string
}

export interface HomeFaqItem {
  question: string
  answer: string
  channels?: readonly HomeFaqStreamChannel[]
  battles?: readonly HomeFaqBattleItem[]
  mainEventBattle?: HomeFaqBattleItem
}

const lastBattle = battles[battles.length - 1]
if (!lastBattle) {
  throw new Error('No hay combates definidos para el FAQ de la home')
}

const mainEventBattle: HomeFaqBattleItem = {
  number: lastBattle.number,
  title: lastBattle.title,
}

export const HOME_FAQS = [
  {
    question: '¿Cuándo es La Velada del Año VI?',
    answer:
      'La Velada del Año VI se celebra el sábado 25 de julio de 2026 a partir de las 20:00h (horario de España peninsular).',
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
    battles: battles.map((battle) => ({ number: battle.number, title: battle.title })),
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
