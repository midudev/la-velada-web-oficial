import type { Fighters } from '@/types/fighters'

export const FIGHTERS: Fighters[] = [
  {
    id: 'peereira',
    name: 'Peereira',
    versus: 'rivaldios',
    age: 26,
    weight: 63,
    nationality: 'España',
    socialLinks: {
      instagram: 'https://www.instagram.com/peereira7/',
      twitter: 'https://x.com/Peereira7',
    },
    bio: 'Pereira es un popular streamer y creador de contenido español, conocido por su participación en varias veladas de boxeo entre creadores de contenido. Ha ganado notoriedad en el mundo digital por su carisma y estilo de vida como influencer y ha logrado conquistar a muchas personas dentro de la comunidad de streamers.',
  },
  {
    id: 'perxitaa',
    name: 'Perxitaa',
    versus: 'gaspi',
    age: 26,
    weight: 70,
    nationality: 'España',
    socialLinks: {
      instagram: 'https://www.instagram.com/perxitaa/',
      twitter: 'https://x.com/Perxitaa',
    },
    bio: 'Conocido streamer y creador de contenido español, muy popular en plataformas como Twitch y YouTube. En la comunidad de creadores de contenido, se destaca por su carisma y su interacción constante con sus seguidores.'
  },
  {
    id: 'abby',
    name: 'Abby',
    versus: 'roro',
    age: 27,
    nationality: 'España',
    weight: 62,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: 'Creadora de contenido y streamer española. Ha ganado popularidad por su participación en varias ediciones de La Velada del Año y otros eventos de boxeo de creadores de contenido. Se destaca por su fuerte determinación y habilidad física. En este evento, Abby tiene como objetivo mostrar sus habilidades en el ring con gran competitividad y energía, ganándose así una base de seguidores fieles.'
  },
  {
    id: 'roro',
    name: 'Roro',
    versus: 'abby',
    age: 27,
    nationality: 'España',
    weight: 65,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'gaspi',
    name: 'Gaspi',
    versus: 'perxitaa',
    age: 26,
    nationality: 'España',
    weight: 70,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'rivaldios',
    name: 'Rivaldios',
    versus: 'peereira',
    age: 26,
    nationality: 'España',
    weight: 63,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'andoni',
    name: 'Andoni',
    versus: 'carlos',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'viruzz',
    name: 'Viruzz',
    versus: 'tomas',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'alana',
    name: 'Alana',
    versus: 'arigeli',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'grefg',
    name: 'Grefg',
    versus: 'westcol',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'westcol',
    name: 'Westcol',
    versus: 'grefg',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'arigeli',
    name: 'Arigeli',
    versus: 'alana',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'tomas',
    name: 'Tomas',
    versus: 'viruzz',
    age: 28,
    nationality: 'España',
    weight: 90,
    socialLinks: {
      instagram: '',
      twitter: '',
    },
    bio: ''
  },
  {
    id: 'carlos',
    name: 'Carlos',
    versus: 'andoni',
    nationality: 'España',
    weight: 90,
    age: 28,
    socialLinks: {
      instagram: 'https://www.instagram.com/carlosbelcast/',
      twitter: 'https://x.com/CarlosBelcast',
    },
    bio: 'Conocido streamer y creador de contenido español. Es uno de los participantes destacados de La Velada del Año V, un evento de boxeo entre influenciadores y creadores de contenido. Carlos tiene una gran base de seguidores gracias a su carisma y a la comunidad que ha construido a lo largo de los años. Ha sido muy activo en el mundo de las transmisiones en vivo y otros proyectos relacionados con la cultura digital, y ha estado entrenando intensamente para este evento de boxeo, generando mucha expectativa por su habilidad y determinación en el ring.'
  },
] as const
