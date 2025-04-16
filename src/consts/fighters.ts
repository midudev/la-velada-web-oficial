import type { Fighters } from '@/types/fighters'
import X from "@/assets/svg/x.svg";
import Instagram from "@/assets/svg/instagram.svg";
import Youtube from "@/assets/svg/youtube.svg";
import TikTok from "@/assets/svg/tiktok.svg";
import Twitch from "@/assets/svg/twitch.svg";
import Kick from "@/assets/svg/kick.svg";

export const FIGHTERS: Fighters[] = [
  {
    // https://www.biografia.de/peereira/
    id: 'peereira',
    name: 'Peereira',
    realName: 'Pablo Pereira Ramos',
    description:
      'Pablo Pereira Ramos, conocido en línea como Peereira7, es un streamer y creador de contenido español nacido el 21 de diciembre de 1998 en Galicia, España. Ganó reconocimiento por sus transmisiones en vivo de videojuegos, especialmente Fortnite, en plataformas como Twitch y YouTube. Peereira se enfrentara al mexicano Rivaldios. Durante la presentación del evento, ambos protagonizaron un tenso cara a cara que casi derivó en una confrontación física',
    gender: 'masculino',
    birthDate: new Date(1998, 11, 21),
    height: 1.63,
    age: 26,
    weight: 63,
    country: 'es',
    city: 'A Coruña, Galicia',
    opponent: 'rivaldios',
    versus: {
      leftPortrait: 'peereira',
      rightPortrait: 'rivaldios',
    },
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/Peereira7',
        label: 'Visitar perfil de Peereira en X',
        followers: '310k',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/peereira7',
        label: 'Visitar perfil de Peereira en Instagram',
        followers: '220k',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/channel/UCOBtOqxsioUI-fFykO2I4BQ',
        label: 'Visitar canal de Peereira en Youtube',
        followers: '434k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@peereira7',
        label: 'Visitar perfil de Peereira en TikTok',
        followers: '585k',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/peereira7',
        label: 'Visitar perfil de Peereira en Twitch',
        followers: '1.3M',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'En seis meses va a caer, lo voy a noquear 100% y le voy a arrancar la p*** cabeza.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=GIR26FtonnzIbZZL&amp;clip=UgkxLQNqwPqlJLU97lVJkD2lEWrJXswPfHOU&amp;clipt=ENGYChjaywo'
      },
      {
        text: 'Vengo aquí para ser el mejor boxeador posible, estoy con el mejor equipo posible y lo único que te pido es que entrenes lo suficientemente bien para que toda esta gente vea el show que se merece.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=OQAXdqDuQ33flPQg&amp;clip=UgkxtAMxt3Q-BIOC7G6PqfRTs8qkUZgaXwWP&amp;clipt=ENS2KBjkiik'
      },
      {
        text: 'Entreno literalmente para noquearlo, no vengo a otra cosa.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=AOlsjKIAacuwz_NZ&amp;clip=Ugkx2wfrvLVecdcny4Aw7hy0wu44LEZ8p3Ua&amp;clipt=EI2IQhiVr0I'
      },
    ],
    faceOff: {
      videoID: 'OjOItlQQHNM',
      thumbnail: '/images/fighters/faceOffThumbnails/peereira-vs-rivaldios-thumbnail.webp',
    },
    workout: {
      videoID: 'msvzME2RPu0',
      thumbnail: '/images/fighters/workoutThumbnails/peereira-thumbnail.webp'
    }
  },
  {
    // https://laletrade.com/biografias/twitch/18087-perxitaa
    id: 'perxitaa',
    name: 'Perxitaa',
    realName: 'Jaume Cremades Gradoli',
    description:
      'Perxitaa, es un streamer y creador de contenido español con más de una década de experiencia en plataformas como YouTube y Twitch. Reconocido por su carisma y habilidades en el roleplay, ha participado en series destacadas como "GTA V Roleplay" y "TortillaLand". Su próximo combate contra Gaspi en "La Velada del Año 5" pondrá a prueba su determinación y capacidad para enfrentar nuevos desafíos.',
    gender: 'masculino',
    birthDate: new Date(1991, 6, 9),
    height: 1.86,
    age: 33,
    city: 'Catarroja, Valencia',
    weight: 102,
    country: 'es',
    opponent: 'gaspi',
    versus: {
      leftPortrait: 'perxitaa',
      rightPortrait: 'gaspi',
    },
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/Perxitaa',
        label: 'Visitar perfil de Perxitaa en X',
        followers: '2.1M',
        image: {
          logo: X,
          width: 200,
          height: 200,
        },
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/perxitaa',
        label: 'Visitar perfil de Perxitaa en Instagram',
        followers: '1.1M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        },
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@perxitaa',
        label: 'Visitar perfil de Perxitaa en Youtube',
        followers: '2.53M',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@srperxitaa',
        label: 'Visitar perfil de Perxitaa en TikTok',
        followers: '349.7k',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/perxitaa',
        label: 'Visitar perfil de Perxitaa en Twitch',
        followers: '2.5M',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'Me es indiferente, me adaptaré a lo que toque, competiremos y ganaremos. Es que no veo otro escenario.',
        url: 'https://www.youtube.com/embed/aOKOUIx8mPU?si=ao2b-RL5rdAkoTXY&amp;clip=Ugkx5nWUXM5WtVO9Bf3Nf3hJ1BkQP_ZY6TO9&amp;clipt=ELTuGxinpBw'
      },
      {
        text: 'Creo que este es un reto, porque lo veo grande, lo veo que va a pegar fuerte. Voy a tener que pegar el doble de fuerte.',
        url: 'https://www.youtube.com/embed/aOKOUIx8mPU?si=Fjv_96aIwtSIFxsD&amp;clip=UgkxjZakldIAOdYJdcaksZax_wQZIrZ7nq9m&amp;clipt=EKzsGhijmhs'
      },
      {
        text: '¿Va a ser una pelea de boxeo o una pelea de sumo?',
        url: 'https://www.youtube.com/embed/aOKOUIx8mPU?si=k_vt7-vi3PoyKjnp&amp;clip=UgkxWCffIotsU0x8oWW2HPc8sqFlY5EKtZ2r&amp;clipt=EJiLDRigsg0'
      },
      {
        text: 'Llevas el mismo traje hace 4 dias.',
        url: 'https://www.youtube.com/embed/aOKOUIx8mPU?si=5vHVGPD2lSLWPKGE&amp;clip=UgkxZ65f4VwWoQJLjI0oTYCpoiIxt5klwwY-&amp;clipt=EPzFCRiE7Qk'
      },
    ],
    workout: {
      videoID: 'dj-4LLi5cck',
      thumbnail: '/images/fighters/workoutThumbnails/perxitaa-thumbnail.webp',
    },
    faceOff: {
      videoID: 'aOKOUIx8mPU',
      thumbnail: '/images/fighters/faceOffThumbnails/perxitaa-vs-gaspi-thumbnail.webp',
    },
  },
  {
    // https://www.biografia.de/abby/
    id: 'abby',
    name: 'Abby',
    realName: 'Abril Gené Capriles',
    description:
      'Abby, es una destacada streamer española reconocida por su fuerte presencia en redes sociales y su habilidad para generar contenido que capta la atención de una amplia audiencia. Su próximo combate contra RoRo en "La Velada del Año 5" ha generado gran expectación, especialmente debido a la notable diferencia de altura entre ambas',
    gender: 'femenino',
    birthDate: new Date(2000, 11, 28),
    height: 1.72,
    age: 24,
    weight: 62,
    country: 'es',
    city: 'Mallorca, Islas Baleares',
    opponent: 'roro',
    versus: {
      leftPortrait: 'abby',
      rightPortrait: 'roro',
    },
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/abbyiimu',
        label: 'Visitar perfil de Abby en X',
        followers: '620.8k',
        image: {
          logo: X,
          width: 200,
          height: 200
        }
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/abbyimu/',
        label: 'Visitar perfil de Abby en Instagram',
        followers: '332k',
        image: {
          logo: Instagram,
          width: 200,
          height: 200
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@abbyimu',
        label: 'Visitar perfil de Abby en TikTok',
        followers: '794.9k',
        image: {
          logo: TikTok,
          width: 200,
          height: 200
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/abby_',
        label: 'Visitar perfil de Abby en Twitch',
        followers: '626k',
        image: {
          logo: Twitch,
          width: 200,
          height: 200
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@abbyimu',
        label: 'Visitar canal de Abby en Youtube',
        followers: '175k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200
        }
      }

    ],
    clips: [
      {
        text: 'No sé cómo ha aceptado esta pelea, la verdad.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=vZ8QPx7N3N3b8pPG&amp;clip=UgkxneRcG-WbxSh6Vsz4bAXq_sNFOJlXNP6z&amp;clipt=EJDxHhiUwx8'
      },
      {
        text: 'Cuando Roro me tenga delante en el ring... va a sentir miedo.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=PNqW7cYn-m5SIrXX&amp;clip=Ugkxgnawy6NKH7cVWFX5fhgf3ZvfaGVfzInm&amp;clipt=ELCcGxjp3Bs'
      },
      {
        text: 'Esto es algo que tenía que pasar... A ver, Roro, si estás preparada.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=KH5GLwytjfIaqnuC&amp;clip=UgkxtRthPKbk_vfmyz7EmhYbhskD5mDJcXCd&amp;clipt=EO2_BRjNpgY'
      },
    ],
    workout: {
      videoID: 'HBTuF3KONZc',
      thumbnail: '/images/fighters/workoutThumbnails/abby-thumbnail.webp',
    },
    faceOff: {
      videoID: '_A0QFge7TlI',
      thumbnail: '/images/fighters/faceOffThumbnails/abby-vs-roro-thumbnail.webp',
    },
  },
  {
    // https://www.biografia.de/roro/
    id: 'roro',
    name: 'Roro',
    realName: 'Rocío López Bueno',
    description:
      'RoRo, es una influencer española de 23 años que ha ganado popularidad por sus contenidos de cocina y estilo de vida en plataformas como TikTok e Instagram. Con una estatura de 1.49 metros, se enfrentará a Abby, quien mide 1.72 metros, en "La Velada del Año 5',
    gender: 'femenino',
    birthDate: new Date(2002, 2, 1),
    height: 1.49,
    age: 23,
    weight: 47,
    country: 'es',
    city: 'Barcelona, Cataluña',
    opponent: 'abby',
    versus: {
      leftPortrait: 'abby',
      rightPortrait: 'roro',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/whoisroro/',
        label: 'Visitar perfil de Roro en Instagram',
        followers: '3.3M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@roro.bueno',
        label: 'Visitar perfil de Roro en TikTok',
        followers: '8.1M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@roroobuenoo',
        label: 'Visitar canal de Roro en Youtube',
        followers: '92.5k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }
    ],
    faceOff: {
      videoID: '_A0QFge7TlI',
      thumbnail: '/images/fighters/faceOffThumbnails/abby-vs-roro-thumbnail.webp',
    },

    clips: [
      {
        text: 'Nunca voy a hundir a una mujer para sentirme mejor conmigo misma.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=lBVhjXJ2Zn7cbrch&amp;clip=Ugkxu-CzMHs-3zLGaFFCGIh-tcPMjImucfAT&amp;clipt=EOnqLRjv0y4'
      },
      {
        text: 'Si me enfadas, no te voy a sonreír.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=toSZw_B6pu-wvkej&amp;clip=Ugkx343aGQvxi3px_edJLMmiUwfmyRIZGyB5&amp;clipt=EIzLLBiXoC0'
      },
      {
        text: 'Yo tengo la disciplina para prepararme lo mejor que yo pueda.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=_mA5-y8p57kbFYUS&amp;clip=UgkxFEJaIdinVMKPzvTr575aHeDFcG7x60TN&amp;clipt=EOSaOhi7gzs'
      }
    ],
  },
  {
    // https://www.biografia.de/gaspi/
    id: 'gaspi',
    name: 'Gaspi',
    realName: 'Gaspar Prim Díaz',
    description:
      'Gaspi, es un youtuber y humorista argentino conocido por su contenido irreverente y humorístico que ha captado la atención de una amplia audiencia en plataformas como YouTube, donde cuenta con más de 2 millones de suscriptores. Su estilo desenfadado y su capacidad para conectar con el público lo han convertido en una figura destacada en la comunidad digital. Aunque no posee experiencia previa en boxeo, su carisma y determinación lo posicionan como un oponente a considerar en su próximo enfrentamiento contra Perxitaa en "La Velada del Año 5". ',
    gender: 'masculino',
    birthDate: new Date(2002, 11, 28),
    height: 1.83,
    age: 22,
    weight: 112,
    country: 'ar',
    city: 'Buenos Aires',
    opponent: 'perxitaa',
    versus: {
      leftPortrait: 'perxitaa',
      rightPortrait: 'gaspi',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/gaspipd/',
        label: 'Visitar perfil de Gaspi en Instagram',
        followers: '1.7M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/gaspipd',
        label: 'Visitar perfil de Gaspi en X',
        followers: '570.4k',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@gaspipdd',
        label: 'Visitar perfil de Gaspi en TikTok',
        followers: '1.5M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/GaspiPD',
        label: 'Visitar canal de Gaspi en Youtube',
        followers: '2.41M',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }

    ],
    faceOff: {
      videoID: 'aOKOUIx8mPU',
      thumbnail: '/images/fighters/faceOffThumbnails/perxitaa-vs-gaspi-thumbnail.webp',
    },
    clips: [
      {
        text: 'Perxitaa, mira que la vida real no es como el Minecraft… pasan cosas afuera.',
        url: 'https://www.youtube.com/embed/aOKOUIx8mPU?si=xe0_jPqJ7lBEMNDx&amp;clip=UgkxVZqXUgbXM15VuQBnVAg38-8W2PnL8oqT&amp;clipt=EJDeAxiYhQQ&autoplay=1'
      },
      {
        text: 'Te vi haciendo videitos. ¿Vas a pelear con el joystick o con el teclado y el mouse?',
        url: 'https://www.youtube-nocookie.com/embed/aOKOUIx8mPU?si=up7KtwZu2l3qEfmY&amp;clip=Ugkxf1_rx09dGrsr69Wdu2-Bi1wq8BvACp2f&amp;clipt=EPYLBjYjA0'
      },
      {
        text: 'Me dijiste que era contra el Rubius. ¿Quién es ese?',
        url: 'https://www.youtube-nocookie.com/embed/aOKOUIx8mPU?si=wsz9otQaciQnFKsV&amp;clip=UgkxGw6p-ksOymoiuVHBCw5Mx5UUmZqrAiY8&amp;clipt=EJycBxjRwwc'
      }
    ],
  },
  {
    // https://www.biografia.de/rivaldios/
    id: 'rivaldios',
    name: 'Rivaldios',
    realName: 'Rivaldo Reatiga Ojeda',
    description:
      'Rivaldios, cuyo nombre real es Rivaldo Reátiga Ojeda, es un creador de contenido mexicano originario de Culiacán, Sinaloa, nacido el 6 de febrero de 2001. Apasionado del fútbol, ha participado en fuerzas básicas de equipos como Santos Laguna, Querétaro y Xolos de Tijuana. Conocido por su carisma y confianza en sí mismo, ha ganado popularidad en plataformas como TikTok e Instagram, donde comparte contenido relacionado con el fútbol y su vida diaria. En "La Velada del Año 5", se enfrentará a Peereira, un combate que ha generado gran expectación debido a la intensa rivalidad entre ambos, evidenciada en su reciente cara a cara durante la presentación del evento. A pesar de no tener experiencia previa en boxeo, la determinación y espíritu competitivo de Rivaldios lo convierten en un oponente a tener en cuenta en el ring.',
    gender: 'masculino',
    birthDate: new Date(2001, 1, 6),
    height: 1.7,
    age: 24,
    weight: 69,
    country: 'mx',
    city: 'Rosales, Culiacán',
    opponent: 'peereira',
    versus: {
      leftPortrait: 'peereira',
      rightPortrait: 'rivaldios',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/rivaldios10/',
        label: 'Visitar perfil de Rivaldios en Instagram',
        followers: '1.4M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@rivaldios10',
        label: 'Visitar perfil de Rivaldios en TikTok',
        followers: '5.1M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@Rivaldios-lacabra',
        label: 'Visitar canal de Rivaldios en Youtube',
        followers: '46.9k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'Pereira, ponte trucha, amigo. Te voy a enseñar que la cuna del boxeo está en México.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=2yNcYbYAnGXc4jRD&amp;clip=UgkxuVSmgfc49HRArsmT522Vf42fmDo_W1WA&amp;clipt=EKOABBj8rgQ',
      },
      {
        text: 'Voy a llegar al punto en que este v**** me va a tener miedo después de la pelea.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=qXDaC9BtQVT2Lw3r&amp;clip=Ugkxyvlpe6cGZqC2A2tU6B_-kgYlAqHuWn90&amp;clipt=EJC-LxiY5S8',
      },
      {
        text: 'La sangre culichi está bien pesada, una vez que te metes con un culichi, papito, a ver si sales de ahí.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=JZx9yIQa0lXP9BTh&amp;clip=Ugkxjn97-DOruGG1ClS3KgmuiNEMXRf5a4aj&amp;clipt=EJytRBjj4EQ',
      },
    ],
    faceOff: {
      videoID: 'OjOItlQQHNM',
      thumbnail: '/images/fighters/faceOffThumbnails/peereira-vs-rivaldios-thumbnail.webp',
    },
    workout: {
      videoID: 'bNwgdNDz4d4',
      thumbnail: '/images/fighters/workoutThumbnails/rivaldios-thumbnail.webp',
    }
  },
  {
    id: 'andoni',
    name: 'Andoni',
    realName: 'Andoni Talledo Gutiérrez',
    description:
      'Andoni Talledo Gutiérrez, conocido en las redes sociales como Andoni Fitness, es un influencer español originario de San Sebastián, nacido el 3 de enero de 2003. Destacado por su impresionante físico y contenido relacionado con el culturismo, ha acumulado una amplia audiencia en plataformas como TikTok e Instagram, donde comparte sus entrenamientos y consejos de fitness. En "La Velada del Año 5", se enfrentará a Carlos Belcast en un combate que promete ser una intensa prueba de fuerza y resistencia.',
    gender: 'masculino',
    birthDate: new Date(2003, 0, 3),
    height: 1.87,
    age: 22,
    weight: 115,
    country: 'es',
    gallery: true,
    city: 'San Sebastian, Guipúzcoa',
    opponent: 'carlos',
    versus: {
      leftPortrait: 'andoni',
      rightPortrait: 'carlos',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/andonifitness/',
        label: 'Visitar perfil de Andoni en Instagram',
        followers: '2.9M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@andoonig',
        label: 'Visitar perfil de Andoni en TikTok',
        followers: '4.8M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@AndoniFitness',
        label: 'Visitar canal de Andoni en Youtube',
        followers: '944k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'Yo voy a ir obviamente a ganar, y que eso no afecte nuestra relación.',
        url: 'https://www.youtube.com/embed/NbaFxQiuFek?si=b9Sxnq2S0zG-74SV&amp;clip=Ugkx_ci1g5b732avNi7KVaeOw46sgni4lutX&amp;clipt=ELDMJBjYkiU'
      },
      {
        text: 'Cualquier puño de ambos, si entra, es un puño de una persona pesada. Entonces es muy probable que, si entra de manera contundente… pues que acabe.',
        url: 'https://www.youtube.com/embed/NbaFxQiuFek?si=mrqP0DjJ6dMTG3A9&amp;clip=UgkxOd-2XnnjkWi3KR1fp5cmGPP3s1yXdQqY&amp;clipt=ELjGGhiAlxs'
      },
      {
        text: 'Carlos y yo habíamos dicho que por cada puño íbamos a lanzarnos un ‘te amo’.',
        url: 'https://www.youtube.com/embed/NbaFxQiuFek?si=km59ayaLbPKm19qb&amp;clip=UgkxDfmm-4rtX6GmFfRRue8dNTsqDS2D4YbF&amp;clipt=EMG4Jhin6iY'
      },
    ],
    workout: {
      videoID: 'QDy_MM6y-7U',
      thumbnail: '/images/fighters/workoutThumbnails/andoni-thumbnail.webp',
    },
    faceOff: {
      videoID: 'NbaFxQiuFek',
      thumbnail: '/images/fighters/faceOffThumbnails/andoni-vs-carlos-thumbnail.webp',
    },
  },
  {
    // https://www.biografia.de/viruzz/
    id: 'viruzz',
    name: 'Viruzz',
    realName: 'Víctor Mélida Cambra',
    description:
      'Viruzz, cuyo nombre real es Víctor Mélida Cambra, es un youtuber y streamer español originario de Zaragoza. Antes de su carrera en las plataformas digitales, fue jugador profesional de balonmano. Inició su canal de YouTube en 2015, donde ha acumulado más de seis millones de suscriptores, ofreciendo contenido variado que incluye fitness, videojuegos y desafíos. ​En el ámbito del boxeo, Viruzz ha participado en múltiples ediciones de "La Velada del Año". En la primera edición, se enfrentó a Mister Jägger, en la segunda derrotó a Momo por detención del árbitro, y en la cuarta edición combatió contra Shelao. Su próxima pelea será contra Tomás Mazza en "La Velada del Año 5", un combate que pondrá a prueba su experiencia y habilidades en el ring',
    gender: 'masculino',
    birthDate: new Date(1992, 4, 1),
    height: 1.82,
    age: 32,
    weight: 87,
    country: 'es',
    city: 'Zaragoza, Aragón',
    opponent: 'tomas',
    versus: {
      leftPortrait: 'viruzz',
      rightPortrait: 'tomas',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/victormelida/',
        label: 'Visitar perfil de Viruzz en Instagram',
        followers: '1.7M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@victormelida',
        label: 'Visitar perfil de Viruzz en TikTok',
        followers: '1.6M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/byViruZz',
        label: 'Visitar perfil de Viruzz en Twitch',
        followers: '435k',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/byViruZz',
        label: 'Visitar perfil de Viruzz en X',
        followers: '1.1M',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/user/byViruZz',
        label: 'Visitar canal de Viruzz en Youtube',
        followers: '6.14M',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }
    ],
    faceOff: {
      videoID: 'yhs5HYCLftg',
      thumbnail: '/images/fighters/faceOffThumbnails/viruzz-vs-tomas-thumbnail.webp',
    },
    clips: [
      {
        text: 'Una de mis comidas favoritas la empanada argentina.',
        url: 'https://www.youtube.com/embed/t7r5O_5B-E0?si=1tlrUUKM-18eZlen&amp;clip=UgkxW9ZMSp3ZrKKJGaU3qR9kK2njuf0fgO-w&amp;clipt=EPPv0wQY-5bUBA'
      },
      {
        text: 'Estar de rival de visitante en otro país.',
        url: 'https://www.youtube.com/embed/t7r5O_5B-E0?si=IPvCjZ_-7K3fBW63&amp;clip=UgkxEmHfqcAo_spkOhqxLq0KHf7ZhmOMhUuB&amp;clipt=EJTM3QQY08beBA'
      }
    ],
    workout: {
      videoID: 'Uy48X5YxujI',
      thumbnail: '/images/fighters/workoutThumbnails/viruzz-thumbnail.webp'
    }
  },
  {
    // https://www.biografia.de/alana-flores/
    id: 'alana',
    name: 'Alana',
    fightName: 'Alana La Rana',
    realName: 'Alana Scarlett Flores Fuentes',
    description:
      'Alana Flores, conocida en el mundo digital como Alana, es una destacada streamer e influencer mexicana que ha consolidado su presencia en el ámbito del boxeo amateur. Su participación en "La Velada del Año 4" fue especialmente memorable, donde, junto a Ama Blitz, derrotó a las españolas Zeling y Nissaxter en un combate 2 vs 2 celebrado en el Estadio Santiago Bernabéu. Alana se enfrentará a Ari Geli en un combate que promete ser uno de los más emocionantes del evento. Ambas luchadoras han intensificado sus entrenamientos y han mostrado avances significativos en su preparación, lo que augura un enfrentamiento de alto nivel',
    gender: 'femenino',
    birthDate: new Date(2000, 11, 15),
    height: 1.57,
    age: 24,
    weight: 51,
    targetWeight: 52,
    targetGloves: '12oz',
    country: 'mx',
    city: 'Monterrey, Nuevo León',
    opponent: 'arigeli',
    versus: {
      leftPortrait: 'alana',
      rightPortrait: 'arigeli',
    },
    gallery: true,
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/alanafloresf/',
        label: 'Visitar perfil de Alana en Instagram',
        followers: '4.7M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/alanalarana',
        label: 'Visitar perfil de Alana en Twitch',
        followers: '922k',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/alanafloresf',
        label: 'Visitar perfil de Alana en X',
        followers: '1M',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@alanafloresf',
        label: 'Visitar perfil de Alana en TikTok',
        followers: '6.5M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@alanafloresf',
        label: 'Visitar canal de Alana en Youtube',
        followers: '574k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'Llevas un año pidiendo probar mis guantes; por fin, te voy a dar el gusto.',
        url: 'https://www.youtube.com/embed/qdS_XOZ5kyU?si=ma0Sdomx1JJOyld1&amp;clip=Ugkxd-wfH9H1C-ZaiGBlFn3hZeAk9qQWK48w&amp;clipt=EKjUAhiw-wI'
      },
    ],
    workout: {
      videoID: 'TmC9TuD8NoQ',
      thumbnail: '/images/fighters/workoutThumbnails/alana-thumbnail.webp',
    },
    faceOff: {
      videoID: 'qdS_XOZ5kyU',
      thumbnail: '/images/fighters/faceOffThumbnails/alana-vs-arigeli-thumbnail.webp',
    },
  },
  {
    // https://laletrade.com/biografias/youtuber/espanol/22589-thegrefg
    id: 'grefg',
    name: 'Grefg',
    realName: 'David Cánovas Martínez',
    description:
      'TheGrefg, es un creador de contenido español nacido en 1997 en Alhama de Murcia. Con una destacada trayectoria en el mundo del streaming, ha acumulado más de 19 millones de suscriptores en YouTube y una sólida presencia en Twitch, plataformas donde comparte contenido relacionado con videojuegos y entretenimiento. TheGrefg se enfrentará al streamer colombiano Westcol en el combate estelar de la noche. Este enfrentamiento ha generado gran expectación, ya que ambos buscan demostrar su valía en el ring.',
    gender: 'masculino',
    birthDate: new Date(1997, 3, 24),
    height: 1.79,
    age: 27,
    weight: 74,
    country: 'es',
    city: 'Alhama de Murcia, Murcia',
    opponent: 'westcol',
    versus: {
      leftPortrait: 'grefg',
      rightPortrait: 'westcol',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/TheGrefg/',
        label: 'Visitar perfil de Grefg en Instagram',
        followers: '7.4M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@thegrefg?_t=8ffeaGxV7Lt&_r=1',
        label: 'Visitar perfil de Grefg en TikTok',
        followers: '9.1M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/thegrefg',
        label: 'Visitar perfil de Grefg en Twitch',
        followers: '12.2M',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/TheGrefg',
        label: 'Visitar perfil de Grefg en X',
        followers: '8.4M',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@TheGrefg',
        label: 'Visitar canal de Grefg en Youtube',
        followers: '19M',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'Siempre gano; y si no, es porque no ha acabado.',
        url: 'https://www.youtube.com/embed/cfpvro5tD7g?si=rjaM5jJdImEtefJ6&amp;clip=UgkxuoAS_mblPPU-wtj4bH3GiLXmVRBAow2b&amp;clipt=EImsAhjj2gI'
      },
    ],
    workout: {
      videoID: '_Rh-VjB3ATk',
      thumbnail: '/images/fighters/workoutThumbnails/grefg-thumbnail.webp',
    },
    faceOff: {
      videoID: 'cfpvro5tD7g',
      thumbnail: '/images/fighters/faceOffThumbnails/grefg-vs-westcol-thumbnail.webp',
    },
  },
  {
    // https://www.biografia.de/westcol/
    id: 'westcol',
    name: 'Westcol',
    realName: 'Luis Fernando Villa Álvarez',
    description:
      'Westcol, es un streamer y creador de contenido colombiano nacido el 24 de diciembre de 2000 en Ciudad Bolívar, Antioquia. Comenzó su carrera en YouTube en 2015 y posteriormente se trasladó a plataformas de streaming en vivo, donde ha ganado una considerable audiencia. Westcol se enfrentará a TheGrefg en el combate estelar de "La Velada del Año 5", programado para el 26 de julio de 2025 en el Estadio La Cartuja de Sevilla. Para su preparación, ha recibido entrenamiento de figuras destacadas como Ilia Topuria y Omar Montes, quienes han compartido sesiones y conocimientos para fortalecer sus habilidades en el ring.',
    gender: 'masculino',
    birthDate: new Date(2001, 1, 2),
    height: 1.65,
    age: 24,
    weight: 63,
    country: 'co',
    city: 'Ciudad Bolívar, Antioquia',
    opponent: 'grefg',
    versus: {
      leftPortrait: 'grefg',
      rightPortrait: 'westcol',
    },
    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/westcol/',
        label: 'Visitar perfil de Westcol en Instagram',
        followers: '4.3M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/WestCOL',
        label: 'Visitar perfil de Westcol en X',
        followers: '413.3k',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/channel/UCEg_iK8FKwZfpRMn4-AnnnQ',
        label: 'Visitar canal de Westcol en Youtube',
        followers: '1.32M',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@westcol',
        label: 'Visitar perfil de Westcol en TikTok',
        followers: '993.4k',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'kick',
        name: 'Kick',
        url: 'https://www.kick.com/westcol',
        label: 'Visitar perfil de Westcol en Kick',
        followers: '1.9M',
        image: {
          logo: Kick,
          width: 200,
          height: 200,
        }
      }
    ],
    faceOff: {
      videoID: 'cfpvro5tD7g',
      thumbnail: '/images/fighters/faceOffThumbnails/grefg-vs-westcol-thumbnail.webp',
    },
    workout: {
      videoID: '_XWxZUwzhXk',
      thumbnail: '/images/fighters/workoutThumbnails/westcol-thumbnail.webp'
    },
    clips: [
      {
        text: 'Vamos a ver si le dan las hue***.',
        url: 'https://www.youtube.com/embed/cfpvro5tD7g?si=ZcMgqxaAfHxRQb96&amp;clip=UgkxQ5sj8mAkLsReNNl3UPmr5g6CkSbZyERl&amp;clipt=EKjXAhiw_gI'
      }
    ],
  },
  {
    // https://www.biografia.de/ari-geli/
    id: 'arigeli',
    name: 'Arigeli',
    realName: 'Ariadna Geli Pérez',
    description:
      'Ari Geli, es una creadora de contenido y jugadora de baloncesto 3x3 nacida el 11 de octubre de 2002 en Barcelona, España. Su pasión por el baloncesto la llevó a fundar y ser propietaria del equipo Panthers 3x3, con sede en Barcelona. A través de plataformas como TikTok, donde cuenta con más de 3.4 millones de seguidores, comparte contenido relacionado con el baloncesto, fusionando el deporte profesional con la narrativa digital moderna. Ari Geli se enfrentará a la mexicana Alana Flores en un combate que ha generado gran expectación. Ambas participantes han mostrado confianza y determinación en los eventos previos al combate, prometiendo ofrecer un espectáculo de alto nivel.',
    gender: 'femenino',
    birthDate: new Date(2002, 9, 11),
    height: 1.58,
    age: 22,
    weight: 53,
    country: 'es',
    gallery: true,
    city: 'Barcelona, Cataluña',
    opponent: 'alana',
    versus: {
      leftPortrait: 'alana',
      rightPortrait: 'arigeli',
    },
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/ariigelii',
        label: 'Visitar perfil de Arigeli en X',
        followers: '28k',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/arigelii/',
        label: 'Visitar perfil de Arigeli en Instagram',
        followers: '1.2M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@arigeli',
        label: 'Visitar perfil de Arigeli en TikTok',
        followers: '3.4M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@AriGeli',
        label: 'Visitar canal de Arigeli en Youtube',
        followers: '466k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/arigeli_',
        label: 'Visitar perfil de Arigeli en Twitch',
        followers: '32.5k',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      }
    ],
    clips: [
      {
        text: 'Disfruta del titulo mientras puedas, por que este año es mio.',
        url: 'https://www.youtube.com/embed/qdS_XOZ5kyU?si=D8fgVfCSRy_SwZHv&amp;clip=UgkxEmtFin7L3_YLiJW_OyRkmeZtFj53PnkT&amp;clipt=EPWwAhj91wI'
      },
    ],
    workout: {
      videoID: 'rugHsv9JCSU',
      thumbnail: '/images/fighters/workoutThumbnails/arigeli-thumbnail.webp',
    },
    faceOff: {
      videoID: 'qdS_XOZ5kyU',
      thumbnail: '/images/fighters/faceOffThumbnails/alana-vs-arigeli-thumbnail.webp',
    },
  },
  {
    // https://www.biografia.de/tomas-mazza/
    id: 'tomas',
    name: 'Tomás',
    realName: 'Tomás Francisco Pérez Mazza',
    description:
      'Tomás Mazza es un creador de contenido y entusiasta del fitness argentino de 24 años, reconocido por su enfoque en salud y entrenamiento físico. Cuenta con una amplia audiencia en plataformas como Instagram y YouTube, donde comparte rutinas de ejercicio y consejos de bienestar. Tomás se enfrentará al experimentado boxeador español Viruzz. Este combate representa una oportunidad para Mazza de demostrar su habilidad y consolidarse en el ámbito del boxeo de exhibición.',
    gender: 'masculino',
    birthDate: new Date(2000, 3, 16),
    height: 1.76,
    age: 25,
    weight: 80,
    country: 'ar',
    gallery: true,
    city: 'Buenos Aires',
    opponent: 'viruzz',
    versus: {
      leftPortrait: 'viruzz',
      rightPortrait: 'tomas',
    },
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/MazzaTomas',
        label: 'Visitar perfil de Tomás en X',
        followers: '259.9k',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/mazzatomas',
        label: 'Visitar perfil de Tomás en Instagram',
        followers: '2.9M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@tomasmazza',
        label: 'Visitar canal de Tomás en Youtube',
        followers: '855k',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@mazzatomas',
        label: 'Visitar perfil de Tomás en TikTok',
        followers: '2.5M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/mazzatomas',
        label: 'Visitar perfil de Tomás en Twitch',
        followers: '629k',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      }
    ],
    faceOff: {
      videoID: 'yhs5HYCLftg',
      thumbnail: '/images/fighters/faceOffThumbnails/viruzz-vs-tomas-thumbnail.webp',
    },
    clips: [
      {
        text: 'Yo soy la cura del Viruzz.',
        url: 'https://www.youtube.com/embed/t7r5O_5B-E0?si=tmS6F4zyAwJ8hjfw&amp;clip=UgkxwZjrAtle4_JWz8SOQyqTYSle3QNZSPnD&amp;clipt=EKOm0wQYz_PTBA'
      },
      {
        text: 'Es un desafío muy grande la verdad nadie cree en mi ',
        url: 'https://www.youtube.com/embed/t7r5O_5B-E0?si=x1D7VSLOkHRznEbb&amp;clip=UgkxKSYyYGXEofS0Oaeh2MtubiTWnVTYUlks&amp;clipt=EIii2QQYoJfaBA'
      }
    ],
    workout: {
      videoID: 'FBjMQogPr-U',
      thumbnail: '/images/fighters/workoutThumbnails/tomas-thumbnail.webp',
    }
  },
  {
    // https://laletrade.com/biografias/youtuber/19752-carlos-belcast
    id: 'carlos',
    name: 'Carlos',
    realName: 'Carlos Belcast',
    description:
      'Carlos Belcast, apodado "El Padrino", es un fisicoculturista y creador de contenido mexicano que ha ganado reconocimiento en el ámbito del fitness. Con una estatura de 1.77 metros y un peso aproximado de 85 kilogramos, ha construido una sólida presencia en plataformas como Instagram, donde comparte su trayectoria en el culturismo y su estilo de vida saludable. Belcast se enfrentará a Andoni Fitness en un combate que ha generado gran expectación. Andoni, de origen español, mide 1.87 metros y pesa alrededor de 115 kilogramos, lo que representa una notable diferencia de peso entre ambos contendientes',
    gender: 'masculino',
    birthDate: new Date(1998, 9, 5),
    height: 1.77,
    age: 26,
    weight: 85,
    country: 'mx',
    city: 'Monterrey, Nuevo León',
    opponent: 'andoni',
    versus: {
      leftPortrait: 'andoni',
      rightPortrait: 'carlos',
    },
    socials: [
      {
        id: 'x',
        name: 'X',
        url: 'https://x.com/CarlosBelcast',
        label: 'Visitar perfil de Carlos en X',
        followers: '22.1k',
        image: {
          logo: X,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://www.instagram.com/carlosbelcast/',
        label: 'Visitar perfil de Carlos en Instagram',
        followers: '5.1M',
        image: {
          logo: Instagram,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/@carlosbelcast',
        label: 'Visitar perfil de Carlos en TikTok',
        followers: '6.5M',
        image: {
          logo: TikTok,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com/@carlosbelcast',
        label: 'Visitar canal de Carlos en Youtube',
        followers: '1.42M',
        image: {
          logo: Youtube,
          width: 200,
          height: 200,
        }
      },
      {
        id: 'twitch',
        name: 'Twitch',
        url: 'https://www.twitch.tv/carlosbelcastt',
        label: 'Visitar perfil de Carlos en Twitch',
        followers: '50.3k',
        image: {
          logo: Twitch,
          width: 200,
          height: 200,
        }
      }
    ],
    faceOff: {
      videoID: 'NbaFxQiuFek',
      thumbnail: '/images/fighters/faceOffThumbnails/andoni-vs-carlos-thumbnail.webp',
    },
    workout: {
      videoID: 'R3nXNgSLnYA',
      thumbnail: '/images/fighters/workoutThumbnails/carlos-thumbnail.webp',
    },
    clips: [
      {
        text: 'Estoy de acuerdo, es una máquina, y eso hace más emocionante para mí la pelea. Una pelea difícil, un reto para mí.',
        url: 'https://www.youtube.com/embed/NbaFxQiuFek?si=_zo9rym4J9nuprTz&amp;clip=UgkxA55s3XmbPCzb0W3fcV3a5ynwEsfrpWnY&amp;clipt=EMD-DBjIpQ0'
      },
      {
        text: 'Quiero poner a mi país en alto, es lo que más quiero.',
        url: 'https://www.youtube.com/embed/NbaFxQiuFek?si=ycZse19c6kilirh5&amp;clip=Ugkx_DVmBQCwGsesR_3YKdmsSI2VEzymSdZW&amp;clipt=EMWoDRjH1w0'
      },
      {
        text: 'Somos muy grandes amigos, nos queremos mucho… pero eso no quiere decir que nos vayamos a dar con todo.',
        url: 'https://www.youtube.com/embed/NbaFxQiuFek?si=1KpotzlUDqM1VYYQ&amp;clip=UgkxQadrp40FBpmDXn2yaSgdQJVUYUFaAqKO&amp;clipt=EOTJIhjL_CI'
      },
    ],
  },
] as const
