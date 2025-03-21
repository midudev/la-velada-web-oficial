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

export interface Fighters {
  id: fighterId
  name: fighterName
  versus: fighterId,
  age: number,
  weight: number,
  nationality: string,
  socialLinks: {
    instagram: string,
    twitter: string,
  },
  bio: string
}
