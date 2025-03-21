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
    id: 'roro',
    name: 'Roro',
    versus: 'abby',
  },
  {
    id: 'gaspi',
    name: 'Gaspi',
    versus: 'perxitaa',
  },
  {
    id: 'rivaldios',
    name: 'Rivaldios',
    versus: 'peereira',
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
    id: 'westcol',
    name: 'Westcol',
    versus: 'grefg',
  },
  {
    id: 'arigeli',
    name: 'Arigeli',
    versus: 'alana',
  },
  {
    id: 'tomas',
    name: 'Tomas',
    versus: 'viruzz',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    versus: 'andoni',
  },
] as const
