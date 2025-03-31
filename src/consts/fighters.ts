import type { Fighters } from '@/types/fighters'
import { BASE_ATTRIBUTES, BASE_SKILLS } from '@/consts/gamified_data';
import X from "@/assets/svg/x.svg";
import Instagram from "@/assets/svg/instagram.svg";
import Youtube from "@/assets/svg/youtube.svg";
import TikTok from "@/assets/svg/tiktok.svg";
import Twitch from "@/assets/svg/twitch.svg";

export const FIGHTERS: Fighters[] = [
  {
    // https://www.biografia.de/peereira/
    id: 'peereira',
    name: 'Peereira',
    realName: 'Pablo Pereira Ramos',
    gender: 'masculino',
    birthDate: new Date(1998, 11, 21),
    height: 1.63,
    age: 26,
    weight: 63,
    country: 'es',
    city: 'A Coruña',
    versus: 'rivaldios',
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/Peereira7',
        label: 'Visitar perfil de Peereira en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 310094
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/peereira7',
        label: 'Visitar perfil de Peereira en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 220053
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/channel/UCOBtOqxsioUI-fFykO2I4BQ',
        label: 'Visitar canal de Peereira en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 434000
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@peereira7',
        label: 'Visitar perfil de Peereira en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 584500
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/peereira7',
        label: 'Visitar perfil de Peereira en Twitch',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        },
        followers: 1300000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://laletrade.com/biografias/twitch/18087-perxitaa
    id: 'perxitaa',
    name: 'Perxitaa',
    realName: 'Jaume Cremades Gradoli',
    gender: 'masculino',
    birthDate: new Date(1991, 6, 9),
    height: 1.86,
    age: 33,
    city: 'Catarroja, Valencia',
    weight: 102,
    country: 'es',
    versus: 'gaspi',
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/srperxitaa',
        label: 'Visitar perfil de Perxitaa en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 124
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/perxitaa',
        label: 'Visitar perfil de Perxitaa en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 1100000
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@perxitaa',
        label: 'Visitar perfil de Perxitaa en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 0
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@srperxitaa',
        label: 'Visitar perfil de Perxitaa en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 2530000
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/perxitaa',
        label: 'Visitar perfil de Perxitaa en Twitch',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        },
        followers: 2500000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    id: 'abby',
    name: 'Abby',
    realName: 'Abril Gené Capriles',
    gender: 'femenino',
    birthDate: new Date(2000, 11, 28),
    height: 1.72,
    age: 24,
    weight: 62,
    country: 'es',
    city: 'Barcelona',
    versus: 'roro',
    socials: [
      {
        'id': 'instagram',
        'name': 'Instagram',
        'url': 'https://www.instagram.com/abbyimu/',
        'label': 'Visitar perfil de Abby en Instagram',
        'image': {
          'logo': Instagram,
          'width': 200,
          'height': 200
        },
        followers: 332507
      },
      {
        'id': 'twitch',
        'name': 'Twitch',
        'url': 'https://www.twitch.tv/abby_',
        'label': 'Visitar perfil de Abby en Twitch',
        'image': {
          'logo': Twitch,
          'width': 200,
          'height': 200
        },
        followers: 625412
      },
      {
        'id': 'youtube',
        'name': 'Youtube',
        'url': 'https://www.youtube.com/@abbyimu',
        'label': 'Visitar canal de Abby en Youtube',
        'image': {
          'logo': Youtube,
          'width': 200,
          'height': 200
        },
        followers: 175000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/roro/
    id: 'roro',
    name: 'Roro',
    realName: 'Rocío López Bueno',
    gender: 'femenino',
    birthDate: new Date(2002, 2, 1),
    height: 1.49,
    age: 23,
    weight: 47,
    country: 'es',
    city: 'Madrid',
    versus: 'abby',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/whoisroro/',
        label: 'Visitar perfil de Roro en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 3302261
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@roro.bueno',
        label: 'Visitar perfil de Roro en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 8100000
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@roroobuenoo',
        label: 'Visitar canal de Roro en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 91400
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/gaspi/
    id: 'gaspi',
    name: 'Gaspi',
    realName: 'Gaspar Prim Díaz',
    gender: 'masculino',
    birthDate: new Date(2002, 11, 28),
    height: 1.83,
    age: 22,
    weight: 112,
    country: 'ar',
    city: 'Buenos Aires',
    versus: 'perxitaa',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/gaspipd/',
        label: 'Visitar perfil de Gaspi en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 1736569
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/gaspipd',
        label: 'Visitar perfil de Gaspi en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 570273
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/GaspiPD',
        label: 'Visitar canal de Gaspi en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 2400000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/rivaldios/
    id: 'rivaldios',
    name: 'Rivaldios',
    realName: 'Rivaldo Reatiga Ojeda',
    gender: 'masculino',
    birthDate: new Date(2001, 1, 6),
    height: 1.7,
    age: 24,
    weight: 69,
    country: 'mx',
    city: 'Culiacán',
    versus: 'peereira',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/rivaldios10/',
        label: 'Visitar perfil de Rivaldios en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 1500586
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@rivaldios10',
        label: 'Visitar perfil de Rivaldios en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 5100000
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@Rivaldios-lacabra',
        label: 'Visitar canal de Rivaldios en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 46300
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  //Andoni 
  {
    id: 'andoni',
    name: 'Andoni',
    realName: 'Andoni Talledo Gutiérrez',
    gender: 'masculino',
    birthDate: new Date(2003, 0, 3),
    height: 1.87,
    age: 22,
    weight: 115,
    country: 'es',
    city: 'Bilbao',
    versus: 'carlos',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/andonifitness/',
        label: 'Visitar perfil de Andoni en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 2961838
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@andoonig',
        label: 'Visitar perfil de Andoni en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 4800000
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@AndoniFitness',
        label: 'Visitar canal de Andoni en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 941000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/viruzz/
    id: 'viruzz',
    name: 'Viruzz',
    realName: 'Víctor Mélida Cambra',
    gender: 'masculino',
    birthDate: new Date(1992, 4, 1),
    height: 1.82,
    age: 32,
    weight: 87,
    country: 'es',
    city: 'Andorra La Vella',
    versus: 'tomas',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/victormelida/',
        label: 'Visitar perfil de Viruzz en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 1781888
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@victormelida',
        label: 'Visitar perfil de Viruzz en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 1600000
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/byViruZz',
        label: 'Visitar perfil de Viruzz en Twitch',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        },
        followers: 435315
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/byViruZz',
        label: 'Visitar perfil de Viruzz en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 1148557
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/user/byViruZz',
        label: 'Visitar canal de Viruzz en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 6130000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/alana-flores/
    id: 'alana',
    name: 'Alana',
    fightName: 'Alana La Rana',
    realName: 'Alana Scarlett Flores Fuentes',
    gender: 'femenino',
    birthDate: new Date(2000, 11, 15),
    height: 1.57,
    age: 24,
    weight: 51,
    targetWeight: 52,
    targetGloves: '12oz',
    country: 'mx',
    city: 'Nuevo León',
    versus: 'arigeli',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/alanafloresf/',
        label: 'Visitar perfil de Alana en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 4738281
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/alanalarana',
        label: 'Visitar perfil de Alana en Twitch',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        },
        followers: 921469
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/alanafloresf',
        label: 'Visitar perfil de Alana en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 999668
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@alanafloresf',
        label: 'Visitar canal de Alana en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 570000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://laletrade.com/biografias/youtuber/espanol/22589-thegrefg
    id: 'grefg',
    name: 'Grefg',
    realName: 'David Cánovas Martínez',
    gender: 'masculino',
    birthDate: new Date(1997, 3, 24),
    height: 1.79,
    age: 27,
    weight: 74,
    country: 'es',
    city: 'Alhama de Murcia',
    versus: 'westcol',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/TheGrefg/',
        label: 'Visitar perfil de Grefg en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 7481870
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@thegrefg?_t=8ffeaGxV7Lt&_r=1',
        label: 'Visitar perfil de Grefg en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 9100000
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/thegrefg',
        label: 'Visitar perfil de Grefg en Twitch',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        },
        followers: 12200000
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/TheGrefg',
        label: 'Visitar perfil de Grefg en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 8402494
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@TheGrefg',
        label: 'Visitar canal de Grefg en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 19000000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/westcol/
    id: 'westcol',
    name: 'Westcol',
    realName: 'Luis Fernando Villa Álvarez',
    gender: 'masculino',
    birthDate: new Date(2001, 1, 2),
    height: 1.65,
    age: 24,
    weight: 63,
    country: 'co',
    city: 'Medellín',
    versus: 'grefg',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/westcol/',
        label: 'Visitar perfil de Westcol en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 4300072
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/WestCOL',
        label: 'Visitar perfil de Westcol en X',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
        followers: 412389
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/channel/UCEg_iK8FKwZfpRMn4-AnnnQ',
        label: 'Visitar canal de Westcol en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 1320000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/ari-geli/
    id: 'arigeli',
    name: 'Arigeli',
    realName: 'Ariadna Geli Pérez',
    gender: 'femenino',
    birthDate: new Date(2002, 9, 11),
    height: 1.58,
    age: 22,
    weight: 53,
    country: 'es',
    city: 'Barcelona',
    versus: 'alana',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/arigelii/',
        label: 'Visitar perfil de Arigeli en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 1219939
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@arigeli',
        label: 'Visitar perfil de Arigeli en TikTok',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        },
        followers: 3400000
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@AriGeli',
        label: 'Visitar canal de Arigeli en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 465000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://www.biografia.de/tomas-mazza/
    id: 'tomas',
    name: 'Tomás',
    realName: 'Tomás Francisco Pérez Mazza',
    gender: 'masculino',
    birthDate: new Date(2000, 3, 16),
    height: 1.76,
    age: 25,
    weight: 80,
    country: 'ar',
    city: 'Buenos Aires',
    versus: 'viruzz',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/mazzatomas/',
        label: 'Visitar perfil de Tomás en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 2999414
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@tomasmazza',
        label: 'Visitar canal de Tomás en Youtube',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        },
        followers: 853000
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
  {
    // https://laletrade.com/biografias/youtuber/19752-carlos-belcast
    id: 'carlos',
    name: 'Carlos',
    realName: 'Carlos Belcast',
    gender: 'masculino',
    birthDate: new Date(1998, 9, 5),
    height: 1.77,
    age: 26,
    weight: 85,
    country: 'mx',
    city: 'Monterrey',
    versus: 'andoni',
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/carlosbelcast/',
        label: 'Visitar perfil de Carlos en Instagram',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
        followers: 5139556
      }
    ],
    clips: [],
    attributes: BASE_ATTRIBUTES,
    skills: BASE_SKILLS,
  },
] as const
