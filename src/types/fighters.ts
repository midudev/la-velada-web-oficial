import type { Social } from '@/types/social'

type fighterId =
  | 'edu-aguirre'
  | 'gaston-edul'
  | 'fabiana-sevillano'
  | 'la-parce'
  | 'clersss'
  | 'natalia-mx'
  | 'kidd-keo'
  | 'lit-killah'
  | 'alondrissa'
  | 'angie-velasco'
  | 'viruzz'
  | 'gero-arias'
  | 'samy-rivers'
  | 'roro'
  | 'marta-diaz'
  | 'tatiana-kaer'
  | 'yosoyplex'
  | 'fernanfloo'
  | 'grefg'
  | 'illojuan'

type fighterName =
  | 'Edu Aguirre'
  | 'Gastón Edul'
  | 'Fabiana Sevillano'
  | 'La Parce'
  | 'Clersss'
  | 'Natalia MX'
  | 'Kidd Keo'
  | 'Lit Killah'
  | 'Alondrissa'
  | 'Angie Velasco'
  | 'Viruzz'
  | 'Gero Arias'
  | 'Samy Rivers'
  | 'Roro'
  | 'Marta Díaz'
  | 'Tatiana Kaer'
  | 'YoSoyPlex'
  | 'Fernanfloo'
  | 'Grefg'
  | 'IlloJuan'

interface Clips {
  text: string
  url: string
}

export interface Fighters {
  id: fighterId
  name: fighterName
  fightName?: string
  city?: string
  realName: string
  gender: 'masculino' | 'femenino' | 'otro'
  targetWeight?: number
  targetGloves?: string
  birthDate: Date
  height: number
  age: number
  weight: number
  country: string
  gallery?: boolean
  versus: fighterId
  socials: Social[]
  clips: Clips[]
  workout?: {
    videoID: string
    thumbnail: string
  }
  bio: string
}
