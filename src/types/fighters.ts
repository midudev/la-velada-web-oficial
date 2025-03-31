import type { Social } from "@/types/social";
import type { Attribute } from "@/types/g_attribute";
import type { Skill } from "@/types/g_skill";

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
  versus: fighterId
  socials: Social[]
  clips: Clips[]
  attributes: Attribute[]
  skills:Skill[]
}
