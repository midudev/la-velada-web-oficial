import type { Artist } from '@/types/artists'

import YandelImage from '@/assets/artists/yandel.webp'
import JuanesImage from '@/assets/artists/juanes.webp'
import LuchoRkLaPanteraImage from '@/assets/artists/luchork-pantera.webp'
import BadGyalImage from '@/assets/artists/badgyal.webp'
import AnuelAAImage from '@/assets/artists/anuel-aa.webp'

export const ARTISTS: Artist[] = [
  {
    id: '0eHQ9o50hj6ZDNBt6Ys1sD',
    name: 'Yandel',
    image: YandelImage,
  },
  {
    id: '0UWZUmn7sybxMCqrw9tGa7',
    name: 'Juanes',
    image: JuanesImage,
  },
  {
    id: ['1y6tVxTqgNfqxTayfohSKJ', '0IEzMvarfVycBJAXjjEZOL'].join('-'),
    name: 'Lucho Rk & La Pantera',
    image: LuchoRkLaPanteraImage,
  },
  {
    id: '4F4pp8NUW08JuXwnoxglpN',
    name: 'Bad Gyal',
    image: BadGyalImage,
  },
  {
    id: '2R21vXR83lH98kGeO99Y66',
    name: 'Anuel AA',
    image: AnuelAAImage,
  },
]
