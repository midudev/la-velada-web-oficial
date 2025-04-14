import type { Social } from "@/types/social";

type fighterId =
  | 'peereira'
  | 'perxitaa'
  | 'abby'
  | 'roro'
  | 'gaspi'
  | 'rivaldios'
  | 'andoni'
  | 'viruzz'
  | 'alana'
  | 'grefg'
  | 'westcol'
  | 'arigeli'
  | 'tomas'
  | 'carlos'

type fighterName =
  | 'Peereira'
  | 'Perxitaa'
  | 'Abby'
  | 'Roro'
  | 'Gaspi'
  | 'Rivaldios'
  | 'Andoni'
  | 'Viruzz'
  | 'Alana'
  | 'Grefg'
  | 'Westcol'
  | 'Arigeli'
  | 'Tomás'
  | 'Carlos'

interface Clips {
  text: string
  url: string
}

interface Versus {
  leftPortrait: string
  rightPortrait: string
}

export interface Fighters {
  id: fighterId
  name: fighterName
  fightName?: string
  city?: string
  realName: string
  description: string
  gender: 'masculino' | 'femenino' | 'otro'
  targetWeight?: number
  targetGloves?: string
  birthDate: Date
  height: number
  age: number
  weight: number
  country: string
  opponent: fighterId
  versus: Versus
  gallery?: boolean
  socials: Social[]
  clips: Clips[]
  workout?: {
    videoID: string
    thumbnail: string
  }
  faceOff: {
    videoID: string
    thumbnail: string
  }
}
