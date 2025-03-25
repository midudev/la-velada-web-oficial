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
  | 'Tomas'
  | 'Carlos'

interface Socials {
  instagram?: string
  tiktok?: string
  twitch?: string
  x?: string
  youtube?: string
}

interface Clips {
  text: string
  url: string
}

export interface Fighters {
  id: fighterId
  name: fighterName
  realName: string
  gender: 'masculino' | 'femenino' | 'otro'
  birthDate: Date
  height: number
  age: number
  weight: number
  country: string
  versus: fighterId
  socials: Socials
  clips: Clips[]
}
