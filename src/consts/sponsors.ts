import type { Sponsors } from '@/types/sponsors'

import Alsa from '@/assets/sponsors/Alsa.svg'
import Cerave from '@/assets/sponsors/Cerave.svg'
import CocaCola from '@/assets/sponsors/CocaCola.svg'
import Grefusa from '@/assets/sponsors/Grefusa.svg'
import Infojobs from '@/assets/sponsors/Infojobs.svg'
import Mahou from '@/assets/sponsors/Mahou.svg'
import Maxibon from '@/assets/sponsors/Maxibon.svg'
import Nothing from '@/assets/sponsors/Nothing.svg'
import Revolut from '@/assets/sponsors/Revolut.svg'
import Spotify from '@/assets/sponsors/Spotify.svg'
import Vicio from '@/assets/sponsors/Vicio.svg'

export const SPONSORS: Sponsors[] = [
  {
    id: 'alsa',
    name: 'Alsa',
    url: 'https://www.alsa.es/',
    label: 'Ir a la página web de Alsa',
    image: {
      logo: Alsa,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://www.spotify.com/',
    label: 'Ir a la página web de Spotify',
    image: {
      logo: Spotify,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'revolut',
    name: 'Revolut',
    url: 'https://www.revolut.com/',
    label: 'Ir a la página web de Revolut',
    image: {
      logo: Revolut,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'vicio',
    name: 'Vicio',
    url: 'https://www.vicio.com/',
    label: 'Ir a la página web de Vicio',
    image: {
      logo: Vicio,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    url: 'https://www.cocacola.es/',
    label: 'Ir a la página web de Coca-Cola',
    image: {
      logo: CocaCola,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'infojobs',
    name: 'Infojobs',
    url: 'https://www.infojobs.net/',
    label: 'Ir a la página web de Infojobs',
    image: {
      logo: Infojobs,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'grefusa',
    name: 'Grefusa',
    url: 'https://www.grefusa.com/',
    label: 'Ir a la página web de Grefusa',
    image: {
      logo: Grefusa,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'nothing',
    name: 'Nothing',
    url: 'https://www.nothing.tech/',
    label: 'Ir a la página web de Nothing',
    image: {
      logo: Nothing,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'cerave',
    name: 'Cerave',
    url: 'https://www.cerave.es/',
    label: 'Ir a la página web de Cerave',
    image: {
      logo: Cerave,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'mahou',
    name: 'Mahou',
    url: 'https://www.mahou.es/',
    label: 'Ir a la página web de Mahou',
    image: {
      logo: Mahou,
      width: 200,
      height: 200,
    },
  },
  {
    id: 'maxibon',
    name: 'Maxibon',
    url: 'https://froneri.es/nuestras-marcas/maxibon',
    label: 'Ir a la página web de Maxibon',
    image: {
      logo: Maxibon,
      width: 200,
      height: 200,
    },
  },
] as const
