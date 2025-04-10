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
    "qualities": {
      "defense": {
        "description": "Defensa sólida, con capacidad para anticipar los movimientos del oponente y bloquear golpes.",
        "percentage": 0.75,
        "type": "defensivo"
      },
      "mobility": {
        "description": "Movimientos rápidos y precisos que le permiten evadir ataques y reposicionarse con facilidad.",
        "percentage": 0.78,
        "type": "defensivo-ofensivo"
      },
      "technique": {
        "description": "Técnica de golpeo refinada, con énfasis en la precisión y la potencia.",
        "percentage": 0.82,
        "type": "ofensivo"
      },
      "resistance": {
        "description": "Capacidad para mantener un alto nivel de energía durante el combate, resistiendo los embates del oponente.",
        "percentage": 0.80,
        "type": "defensivo"
      },
      "strategy": {
        "description": "Estratega en el ring, capaz de adaptarse a diferentes estilos de pelea y aprovechar las debilidades del oponente.",
        "percentage": 0.76,
        "type": "defensivo-ofensivo"
      }
    }
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
      thumbnail: '/images/fighters/workoutThumbnails/perxitaa-thumbnail.webp'
    },
    "qualities": {
      "defense": {
        "description": "Defensa sólida, con buena capacidad para bloquear golpes y evitar ser golpeado.",
        "percentage": 0.7,
        "type": "defensivo"
      },
      "mobility": {
        "description": "Movimientos ágiles que le permiten evadir ataques y reposicionarse rápidamente.",
        "percentage": 0.75,
        "type": "defensivo-ofensivo"
      },
      "technique": {
        "description": "Técnica de golpeo efectiva, con énfasis en la precisión y combinaciones rápidas.",
        "percentage": 0.8,
        "type": "ofensivo"
      },
      "resistance": {
        "description": "Capacidad para mantener un alto nivel de energía durante el combate, especialmente en peleas largas.",
        "percentage": 0.85,
        "type": "defensivo"
      },
      "strategy": {
        "description": "Estratega en el ring, capaz de adaptarse a diferentes estilos de pelea y leer a sus oponentes.",
        "percentage": 0.7,
        "type": "defensivo-ofensivo"
      }
    }
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
        text: 'Esto es algo que tenía que pasar... A ver, Roro, si estás preparada.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=KH5GLwytjfIaqnuC&amp;clip=UgkxtRthPKbk_vfmyz7EmhYbhskD5mDJcXCd&amp;clipt=EO2_BRjNpgY'
      },
    ],
    workout: {
      videoID: 'HBTuF3KONZc',
      thumbnail: '/images/fighters/workoutThumbnails/abby-thumbnail.webp'
    },
    "qualities": {
      "defense": {
        "description": "Defensa sólida, con buena capacidad para bloquear golpes y evitar ser golpeada.",
        "percentage": 0.7,
        "type": "defensivo"
      },
      "mobility": {
        "description": "Movimientos ágiles que le permiten evadir ataques y reposicionarse rápidamente.",
        "percentage": 0.75,
        "type": "defensivo-ofensivo"
      },
      "technique": {
        "description": "Técnica de golpeo efectiva, con énfasis en la precisión y combinaciones rápidas.",
        "percentage": 0.8,
        "type": "ofensivo"
      },
      "resistance": {
        "description": "Capacidad para mantener un alto nivel de energía durante el combate, especialmente en peleas largas.",
        "percentage": 0.85,
        "type": "defensivo"
      },
      "strategy": {
        "description": "Estratega en el ring, capaz de adaptarse a diferentes estilos de pelea y leer a sus oponentes.",
        "percentage": 0.7,
        "type": "defensivo-ofensivo"
      }
    }
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
    qualities: {
      defense: {
        description: "Defensa sólida, con buena capacidad para bloquear golpes y evitar ser golpeado.",
        percentage: 0.65,
        type: "defensivo"
      },
      mobility: {
        description: "Movimientos ágiles que le permiten evadir ataques y reposicionarse rápidamente.",
        percentage: 0.7,
        type: "defensivo-ofensivo"
      },
      technique: {
        description: "Técnica de golpeo efectiva, con énfasis en la precisión y combinaciones rápidas.",
        percentage: 0.75,
        type: "ofensivo"
      },
      resistance: {
        description: "Capacidad para mantener un alto nivel de energía durante el combate, especialmente en peleas largas.",
        percentage: 0.8,
        type: "defensivo"
      },
      strategy: {
        description: "Estratega en el ring, capaz de adaptarse a diferentes estilos de pelea y leer a sus oponentes.",
        percentage: 0.7,
        type: "defensivo-ofensivo"
      }
    },
    clips: [
      {
        text: 'Confío en mí; estoy lista.',
        url: 'https://www.youtube.com/embed/_A0QFge7TlI?si=3YC34708Wn8ThWVG&amp;clip=UgkxdN0LKsJBhRFzg7codYDoWTEG9MC6dh0U&amp;clipt=EIL7AhiKogM'
      }
    ],

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
    qualities: {
      defense: {
        description: "Defensa creativa, utiliza movimientos inesperados para evitar golpes. A veces se inclina hacia la comedia para desorientar a sus oponentes.",
        percentage: 0.68,
        type: "defensivo"
      },
      mobility: {
        description: "Movimientos ágiles y divertidos que le permiten evadir ataques y reposicionarse rápidamente. Su estilo es impredecible y lleno de energía.",
        percentage: 0.72,
        type: "defensivo-ofensivo"
      },
      technique: {
        description: "Técnica única que combina diversión y efectividad en sus golpes. A veces utiliza movimientos exagerados para sorprender a sus oponentes.",
        percentage: 0.75,
        type: "ofensivo"
      },
      resistance: {
        description: "Capacidad para mantener la energía y el humor durante el combate. Su actitud positiva y su capacidad para reírse de sí mismo lo ayudan a mantenerse fuerte.",
        percentage: 0.78,
        type: "defensivo"
      },
      strategy: {
        description: "Estratega en el ring, capaz de sorprender a sus oponentes con tácticas inesperadas. Su estilo es impredecible y a menudo se basa en la improvisación.",
        percentage: 0.7,
        type: "defensivo-ofensivo"
      }
    },
    clips: [
      {
        text: 'Perxitaa, mira que la vida real no es como el Minecraft… pasan cosas afuera.',
        url: 'https://www.youtube.com/embed/aOKOUIx8mPU?si=xe0_jPqJ7lBEMNDx&amp;clip=UgkxVZqXUgbXM15VuQBnVAg38-8W2PnL8oqT&amp;clipt=EJDeAxiYhQQ&autoplay=1'
      },
      {
        text: 'Te vi haciendo videitos. ¿Vas a pelear con el joystick o con el teclado y el mouse?',
        url: 'https://www.youtube-nocookie.com/embed/aOKOUIx8mPU?si=up7KtwZu2l3qEfmY&amp;clip=Ugkxf1_rx09dGrsr69Wdu2-Bi1wq8BvACp2f&amp;clipt=EPLYDBjYjA0'
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
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=2yNcYbYAnGXc4jRD&amp;clip=UgkxuVSmgfc49HRArsmT522Vf42fmDo_W1WA&amp;clipt=EKOABBj8rgQ'  
      },
      {
        text:'Voy a llegar al punto en que este v**** me va a tener miedo después de la pelea.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=qXDaC9BtQVT2Lw3r&amp;clip=Ugkxyvlpe6cGZqC2A2tU6B_-kgYlAqHuWn90&amp;clipt=EJC-LxiY5S8'
      },
      {
        text: 'La sangre culichi está bien pesada, una vez que te metes con un culichi, papito, a ver si sales de ahí.',
        url: 'https://www.youtube.com/embed/OjOItlQQHNM?si=JZx9yIQa0lXP9BTh&amp;clip=Ugkxjn97-DOruGG1ClS3KgmuiNEMXRf5a4aj&amp;clipt=EJytRBjj4EQ'
      },
    ],
    "qualities": {
      "defense": {
        "description": "Defensa sólida, con capacidad para anticipar los movimientos del oponente y bloquear golpes.",
        "percentage": 0.75,
        "type": "defensivo"
      },
      "mobility": {
        "description": "Movimientos rápidos y precisos que le permiten evadir ataques y reposicionarse con facilidad.",
        "percentage": 0.78,
        "type": "defensivo-ofensivo"
      },
      "technique": {
        "description": "Técnica de golpeo refinada, con énfasis en la precisión y la potencia.",
        "percentage": 0.82,
        "type": "ofensivo"
      },
      "resistance": {
        "description": "Capacidad para mantener un alto nivel de energía durante el combate, resistiendo los embates del oponente.",
        "percentage": 0.80,
        "type": "defensivo"
      },
      "strategy": {
        "description": "Estratega en el ring, capaz de adaptarse a diferentes estilos de pelea y aprovechar las debilidades del oponente.",
        "percentage": 0.76,
        "type": "defensivo-ofensivo"
      }
    }
  },
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
      thumbnail: '/images/fighters/workoutThumbnails/andoni-thumbnail.webp'
    },
    "qualities": {
        "defense": {
          "description": "Defensa activa, utiliza movimientos para evitar golpes.",
          "percentage": 0.65,
          "type": "defensivo"
        },
        "mobility": {
          "description": "Gran movilidad que le permite cambiar de posición rápidamente.",
          "percentage": 0.8,
          "type": "defensivo-ofensivo"
        },
        "technique": {
          "description": "Técnica de golpeo efectiva, con énfasis en la precisión.",
          "percentage": 0.75,
          "type": "ofensivo"
        },
        "resistance": {
          "description": "Resistencia media, puede mantener el ritmo en combates largos.",
          "percentage": 0.7,
          "type": "defensivo"
        },
        "strategy": {
          "description": "Capacidad para adaptarse a diferentes estilos de pelea.",
          "percentage": 0.65,
          "type": "defensivo-ofensivo"
        }
      }
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
    clips: [],
    "qualities": {
        "defense": {
          "description": "Defensa activa, utiliza movimientos para evitar golpes.",
          "percentage": 0.65,
          "type": "defensivo"
        },
        "mobility": {
          "description": "Gran movilidad que le permite cambiar de posición rápidamente.",
          "percentage": 0.8,
          "type": "defensivo-ofensivo"
        },
        "technique": {
          "description": "Técnica de golpeo efectiva, con énfasis en la precisión.",
          "percentage": 0.75,
          "type": "ofensivo"
        },
        "resistance": {
          "description": "Resistencia media, puede mantener el ritmo en combates largos.",
          "percentage": 0.7,
          "type": "defensivo"
        },
        "strategy": {
          "description": "Capacidad para adaptarse a diferentes estilos de pelea.",
          "percentage": 0.65,
          "type": "defensivo-ofensivo"
        }
      }
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
    gallery: true,
    city: 'Nuevo León',
    versus: 'arigeli',
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
      thumbnail: '/images/fighters/workoutThumbnails/alana-thumbnail.webp'
    },
    qualities: {
      defense: {
        description: 'guardia izquierda,Buena defensa ,golpes efectivos ,mano dominante.',
        percentage: 0.5,
        type: 'defensivo-ofensivo'
      },
      mobility: {
        description: 'Su estilo incluye una buena movilidad, lo que le permite esquivar golpes y posicionarse estratégicamente para atacar. Esto es crucial en el boxeo, ya que le ayuda a evitar ser golpeada mientras busca oportunidades para contraatacar.',
        percentage: 0.7,
        type: 'defensivo-ofensivo'
      },
      technique: {
        description: 'Alana ha trabajado en su técnica de golpeo, lo que le permite lanzar combinaciones rápidas y precisas. Esto es fundamental para acumular puntos y causar daño a sus oponentes.',
        percentage: 0.8,
        type: 'ofensivo'
      },
      resistance: {
        description: 'Su entrenamiento le ha proporcionado una gran resistencia, lo que le permite mantener un alto nivel de energía durante las peleas, especialmente en combates largos.',
        percentage: 0.9,
        type: 'defensivo'
      },
      strategy: {
        description: 'Alana es conocida por su capacidad para adaptarse a sus oponentes. Esto significa que puede cambiar su enfoque y estrategia en función de cómo se desarrolla la pelea.',
        percentage: 0.6,
        type: 'defensivo-ofensivo'
      }
    }
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
      thumbnail: '/images/fighters/workoutThumbnails/grefg-thumbnail.webp'
    },
    "qualities": {
        "defense": {
          "description": "Defensa sólida, con buen uso de la guardia.",
          "percentage": 0.7,
          "type": "defensivo"
        },
        "mobility": {
          "description": "Movimientos rápidos que le permiten esquivar ataques.",
          "percentage": 0.75,
          "type": "defensivo-ofensivo"
        },
        "technique": {
          "description": "Técnica de golpeo bien desarrollada, con combinaciones efectivas.",
          "percentage": 0.8,
          "type": "ofensivo"
        },
        "resistance": {
          "description": "Alta resistencia, capaz de soportar combates intensos.",
          "percentage": 0.85,
          "type": "defensivo"
        },
        "strategy": {
          "description": "Estrategia flexible, se adapta a las circunstancias del combate.",
          "percentage": 0.7,
          "type": "defensivo-ofensivo"
        }
      }
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
    qualities: {
      defense: {
        description: "Defensa sólida, con capacidad para anticipar los movimientos del oponente y bloquear golpes.",
        percentage: 0.75,
        type: "defensivo"
      },
      mobility: {
        description: "Movimientos rápidos y precisos que le permiten evadir ataques y reposicionarse con facilidad.",
        percentage: 0.78,
        type: "defensivo-ofensivo"
      },
      technique: {
        description: "Técnica de golpeo refinada, con énfasis en la precisión y la potencia.",
        percentage: 0.82,
        type: "ofensivo"
      },
      resistance: {
        description: "Capacidad para mantener un alto nivel de energía durante el combate, resistiendo los embates del oponente.",
        percentage: 0.80,
        type: "defensivo"
      },
      strategy: {
        description: "Estratega en el ring, capaz de adaptarse a diferentes estilos de pelea y aprovechar las debilidades del oponente.",
        percentage: 0.76,
        type: "defensivo-ofensivo"
      }
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
    gender: 'femenino',
    birthDate: new Date(2002, 9, 11),
    height: 1.58,
    age: 22,
    weight: 53,
    country: 'es',
    gallery: true,
    city: 'Barcelona',
    versus: 'alana',
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
      thumbnail: '/images/fighters/workoutThumbnails/arigeli-thumbnail.webp'
    },
    "qualities": {
        "defense": {
          "description": "Guardia sólida, buena capacidad para bloquear golpes.",
          "percentage": 0.6,
          "type": "defensivo"
        },
        "mobility": {
          "description": "Movimientos ágiles que le permiten evadir ataques.",
          "percentage": 0.75,
          "type": "defensivo-ofensivo"
        },
        "technique": {
          "description": "Técnica depurada que le permite realizar golpes precisos.",
          "percentage": 0.85,
          "type": "ofensivo"
        },
        "resistance": {
          "description": "Capacidad para resistir el desgaste físico durante el combate.",
          "percentage": 0.8,
          "type": "defensivo"
        },
        "strategy": {
          "description": "Estratega en el ring, capaz de leer a sus oponentes.",
          "percentage": 0.7,
          "type": "defensivo-ofensivo"
        }
      }
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
    clips: [],
    "qualities": {
        "defense": {
          "description": "Defensa activa, utiliza movimientos para evitar golpes.",
          "percentage": 0.65,
          "type": "defensivo"
        },
        "mobility": {
          "description": "Gran movilidad que le permite cambiar de posición rápidamente.",
          "percentage": 0.8,
          "type": "defensivo-ofensivo"
        },
        "technique": {
          "description": "Técnica de golpeo efectiva, con énfasis en la precisión.",
          "percentage": 0.75,
          "type": "ofensivo"
        },
        "resistance": {
          "description": "Resistencia media, puede mantener el ritmo en combates largos.",
          "percentage": 0.7,
          "type": "defensivo"
        },
        "strategy": {
          "description": "Capacidad para adaptarse a diferentes estilos de pelea.",
          "percentage": 0.65,
          "type": "defensivo-ofensivo"
        }
      }
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
    qualities: {
        defense: {
          description: "Defensa activa, utiliza movimientos para evitar golpes.",
          percentage: 0.65,
          type: "defensivo"
        },
        mobility: {
          description: "Gran movilidad que le permite cambiar de posición rápidamente.",
          percentage: 0.8,
          type: "defensivo-ofensivo"
        },
        technique: {
          description: "Técnica de golpeo efectiva, con énfasis en la precisión.",
          percentage: 0.75,
          type: "ofensivo"
        },
        resistance: {
          description: "Resistencia media, puede mantener el ritmo en combates largos.",
          percentage: 0.7,
          type: "defensivo"
        },
        strategy: {
          description: "Capacidad para adaptarse a diferentes estilos de pelea.",
          percentage: 0.65,
          type: "defensivo-ofensivo"
        }
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
