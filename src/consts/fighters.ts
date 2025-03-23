import type { Fighters } from '@/types/fighters'

export const FIGHTERS: Fighters[] = [
  {
    id: 'peereira',
    name: 'Peereira',
    versus: 'rivaldios',
  },
  {
    id: 'perxitaa',
    name: 'Perxitaa',
    versus: 'gaspi',
  },
  {
    id: 'abby',
    name: 'Abby',
    versus: 'roro',
  },
  {
    id: 'rivaldios',
    name: 'Rivaldios',
    versus: 'peereira',
  },
  {
    id: 'gaspi',
    name: 'Gaspi',
    versus: 'perxitaa',
  },
  {
    id: 'roro',
    name: 'Roro',
    versus: 'abby',
  },  
  {
    id: 'andoni',
    name: 'Andoni',
    versus: 'carlos',
  },
  {
    id: 'viruzz',
    name: 'Viruzz',
    versus: 'tomas',
  },
  {
    id: 'alana',
    name: 'Alana',
    versus: 'arigeli',
  },
  {
    id: 'grefg',
    name: 'Grefg',
    versus: 'westcol',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    versus: 'andoni',
  },
  {
    id: 'tomas',
    name: 'Tomas',
    versus: 'viruzz',
  },
  {
    id: 'arigeli',
    name: 'Arigeli',
    versus: 'alana',
  },
  {
    id: 'westcol',
    name: 'Westcol',
    versus: 'grefg',
  },
] as const
