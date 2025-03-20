export interface Fighter {
  id: string;
  name: string;
  opponent: string;
}

export const FIGHTERS = [
  {
    id: 'peereira',
    name: 'Peereira',
    opponent: 'rivaldios'
  },
  {
    id: 'perxitaa',
    name: 'Perxitaa',
    opponent: 'gaspi'
  },
  {
    id: 'abby',
    name: 'Abby',
    opponent: 'roro'
  },
  {
    id: 'roro',
    name: 'Roro',
    opponent: 'abby'
  },
  {
    id: 'gaspi',
    name: 'Gaspi',
    opponent: 'perxitaa'
  },
  {
    id: 'rivaldios',
    name: 'Rivaldios',
    opponent: 'peereira'
  },
  {
    id: 'andoni',
    name: 'Andoni',
    opponent: 'carlos',
  },
  {
    id: 'viruzz',
    name: 'Viruzz',
    opponent: 'tomas',
  },
  {
    id: 'alana',
    name: 'Alana',
    opponent: 'arigeli',
  },
  {
    id: 'grefg',
    name: 'Grefg',
    opponent: 'westcol',
  },
  {
    id: 'westcol',
    name: 'Westcol',
    opponent: 'grefg',
  },
  {
    id: 'arigeli',
    name: 'Arigeli',
    opponent: 'alana',
  },
  {
    id: 'tomas',
    name: 'Tomas',
    opponent: 'viruzz',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    opponent: 'andoni',
  }
]