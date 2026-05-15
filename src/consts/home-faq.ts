import { battles } from '@/consts/battles'

export interface HomeFaqItem {
  question: string
  answer: string
}

const mainEvent = battles[battles.length - 1]
if (!mainEvent) {
  throw new Error('No hay combates definidos para el FAQ de la home')
}

const confirmedBattles = battles.map(({ title }) => title).join('; ')

export const HOME_FAQS = [
  {
    question: '¿Cuándo es La Velada del Año VI?',
    answer:
      'La Velada del Año VI se celebra el sábado 25 de julio de 2026 a partir de las 20:00h (horario de España peninsular).',
  },
  {
    question: '¿Dónde se celebra?',
    answer: 'Se celebra en el Estadio de La Cartuja, en Sevilla (España).',
  },
  {
    question: '¿Dónde se puede ver online?',
    answer:
      'Se podrá ver online, en directo y gratis, en el canal oficial de Ibai Llanos en Twitch: twitch.tv/ibai.',
  },
  {
    question: '¿Cuáles son los combates confirmados?',
    answer: `Los combates confirmados de La Velada del Año VI son: ${confirmedBattles}.`,
  },
  {
    question: '¿Cuál es el main event?',
    answer: `El main event confirmado es ${mainEvent.title}.`,
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
