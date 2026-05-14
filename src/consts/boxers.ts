export type BoxerGender = 'f' | 'm'

export interface Boxer {
  id: string
  name: string
  realName: string
  gender: BoxerGender
  birthDate: string | null
  age: number | null
  followersUpdatedAt: string
  socials: { platform: string; username: string; followers: number; monthlyListeners?: number }[]
  country: string
}

/**
 * Los `id` coinciden exactamente con:
 *  - `/public/character-select/{id}.png` (miniatura del selector)
 *  - `/public/character-hero/{id}.png` (recorte grande mostrado en el
 *    hero al hacer hover sobre la miniatura del selector)
 *  - `/public/photos/{id}/01.webp` (foto principal usada en la ficha
 *    del combate)
 *
 * Cualquier renombrado debe mantener esa convención.
 */
export const BOXERS: Boxer[] = [
    {
      id: 'alondrissa',
      name: 'Alondrissa',
      gender: 'f',
      realName: 'Alondra Michelle',
      country: 'pr',
      birthDate: '2001-10-30',
      age: 24,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'alondraa.michellee', followers: 2_000_000 },
        { platform: 'tiktok', username: 'alondrisaa', followers: 1_800_000 },
        { platform: 'youtube', username: 'AlondrissaOfficial', followers: 1_240_000 },
        { platform: 'youtube', username: 'AlondraMichelleVlogs', followers: 350_000 },
        { platform: 'twitch', username: 'alondrissa', followers: 1_812_430 },
        { platform: 'kick', username: 'alondrissa', followers: 616_900 },
      ],
    },
    {
      id: 'angie-velasco',
      name: 'Angie Velasco',
      gender: 'f',
      realName: 'Angie Rocío Velasco',
      country: 'ar',
      birthDate: '1998-10-30',
      age: 27,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'angievelasco08', followers: 2_000_000 },
        { platform: 'youtube', username: 'AngieVelasco', followers: 6_145_712 },
        { platform: 'tiktok', username: 'angievelasco98', followers: 2_700_000 },
      ],
    },
    {
      id: 'clersss',
      name: 'Clersss',
      realName: 'Clara Merino',
      country: 'es',
      birthDate: null,
      gender: 'f',
      age: null,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'clersssss', followers: 708_000 },
        { platform: 'tiktok', username: 'clersssss', followers: 2_500_000 },
        { platform: 'youtube', username: 'clersssss', followers: 14_200 },
      ],
    },
    {
      id: 'edu-aguirre',
      name: 'Edu Aguirre',
      realName: 'Eduardo Aguirre',
      country: 'es',
      gender: 'm',
      birthDate: '1988-01-14',
      age: 38,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'eduaguirre7', followers: 1_000_000 },
        { platform: 'x', username: 'EduAguirre7', followers: 771_707 },
      ],
    },
    {
      id: 'fabiana-sevillano',
      name: 'Fabiana Sevillano',
      realName: 'Fabiana Sevillano',
      country: 'es',
      gender: 'f',
      birthDate: '2002-08-08',
      age: 23,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'fabiana.sevillano', followers: 1_000_000 },
        { platform: 'tiktok', username: 'fabiana.sevillano', followers: 1_700_000 },
        { platform: 'youtube', username: 'FabianaSevillano', followers: 144_000 },
      ],
    },
    {
      id: 'fernanfloo',
      name: 'Fernanfloo',
      gender: 'm',
      realName: 'Luis Fernando Flores Alvarado',
      country: 'sv',
      birthDate: '1993-07-07',
      age: 32,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'youtube', username: 'Fernanfloo', followers: 50_456_510 },
        { platform: 'instagram', username: 'fernanfloo', followers: 12_000_000 },
        { platform: 'twitch', username: 'fernanfloo', followers: 3_462_630 },
      ],
    },
    {
      id: 'gaston-edul',
      name: 'Gastón Edul',
      realName: 'Gastón Edul',
      gender: 'm',
      country: 'ar',
      birthDate: '1995-12-31',
      age: 30,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'gastonedul', followers: 2_000_000 },
        { platform: 'x', username: 'gastonedul', followers: 1_193_727 },
        { platform: 'tiktok', username: 'gastonedul', followers: 1_000_000 },
      ],
    },
    {
      id: 'gero-arias',
      name: 'Gero Arias',
      realName: 'Gerónimo Arias',
      gender: 'm',
      country: 'ar',
      birthDate: '2003-04-01',
      age: 23,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'geroooo_arias2.0', followers: 5_887_824 },
        { platform: 'youtube', username: 'geroariass', followers: 3_830_000 },
        { platform: 'tiktok', username: 'geroooo_arias2.0', followers: 3_400_000 },
      ],
    },
    {
      id: 'illojuan',
      name: 'IlloJuan',
      realName: 'Juan Alberto García Gámez',
      gender: 'm',
      country: 'es',
      birthDate: '1994-06-22',
      age: 31,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'twitch', username: 'illojuan', followers: 4_573_799 },
        { platform: 'instagram', username: 'illojuan', followers: 2_000_000 },
        { platform: 'x', username: 'illojuan', followers: 2_100_780 },
        { platform: 'youtube', username: 'IlloJuan', followers: 1_000_000 },
      ],
    },
    {
      id: 'kidd-keo',
      name: 'Kidd Keo',
      realName: 'Padua Keoma Salas Sánchez',
      gender: 'm',
      country: 'es',
      birthDate: '1995-09-27',
      age: 30,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'thekiddkeo', followers: 3_000_000 },
        { platform: 'youtube', username: 'KiddKeo', followers: 5_000_000 },
        { platform: 'tiktok', username: 'thekiddkeo', followers: 3_100_000 },
        { platform: 'spotify', username: 'Kidd Keo', followers: 961_700 },
        { platform: 'spotify', username: 'Kidd Keo', monthlyListeners: 3_900_000 },
      ],
    },
    {
      id: 'la-parce',
      name: 'La Parce',
      realName: 'Valeria',
      gender: 'f',
      country: 'co',
      birthDate: '2002-06-18',
      age: 23,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: '_laparce_', followers: 575_000 },
        { platform: 'twitch', username: 'laparce', followers: 234_146 },
        { platform: 'youtube', username: 'LaParce', followers: 288_000 },
        { platform: 'tiktok', username: '_laparce_', followers: 600_000 },
        { platform: 'kick', username: 'laparce', followers: 100_000 },
      ],
    },
    {
      id: 'lit-killah',
      name: 'Lit Killah',
      realName: 'Mauro Román Monzón',
      gender: 'm',
      country: 'ar',
      birthDate: '1999-10-04',
      age: 26,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'litkillah', followers: 8_000_000 },
        { platform: 'youtube', username: 'litkillah', followers: 6_480_000 },
        { platform: 'tiktok', username: 'litkillah', followers: 4_000_000 },
        { platform: 'spotify', username: 'LIT killah', monthlyListeners: 7_400_000 },
      ],
    },
    {
      id: 'marta-diaz',
      name: 'Marta Díaz',
      realName: 'Marta Díaz García',
      gender: 'f',
      country: 'es',
      birthDate: '2000-10-30',
      age: 25,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'martaa_diiaz', followers: 3_650_493 },
        { platform: 'tiktok', username: 'maarta_diaz', followers: 5_000_000 },
        { platform: 'youtube', username: 'martadiaz1', followers: 1_995_755 },
      ],
    },
    {
      id: 'natalia-mx',
      name: 'Natalia MX',
      realName: 'Natalia García',
      gender: 'f',
      country: 'mx',
      birthDate: null,
      age: null,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: '_nataliamx', followers: 869_000 },
        { platform: 'twitch', username: 'nataliamx', followers: 211_000 },
        { platform: 'youtube', username: 'NataliaMX', followers: 250_000 },
        { platform: 'tiktok', username: '_nataliamx', followers: 1_000_000 },
      ],
    },
    {
      id: 'plex',
      name: 'Plex',
      realName: 'Daniel Alonso Góndez',
      gender: 'm',
      country: 'es',
      birthDate: null,
      age: 24,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'youtube', username: 'YoSoyPlex', followers: 14_800_000 },
        { platform: 'instagram', username: 'plex', followers: 3_260_158 },
        { platform: 'tiktok', username: 'yosoyplex', followers: 12_000_000 },
      ],
    },
    {
      id: 'roro',
      name: 'RoRo',
      realName: 'Rocío López Bueno',
      gender: 'f',
      country: 'es',
      birthDate: '2002-03-01',
      age: 24,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'whoisroro', followers: 4_766_352 },
        { platform: 'tiktok', username: 'roro.bueno', followers: 9_700_000 },
        { platform: 'tiktok', username: 'roroobuenoo', followers: 201_000 },
        { platform: 'youtube', username: 'RoRoBueno', followers: 300_000 },
      ],
    },
    {
      id: 'samy-rivers',
      name: 'Samy Rivers',
      realName: 'Samantha Guadalupe Rivera Treviño',
      gender: 'f',
      country: 'mx',
      birthDate: '1998-08-20',
      age: 27,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'instagram', username: 'samyrivera', followers: 6_100_000 },
        { platform: 'twitch', username: 'rivers_gg', followers: 6_400_000 },
        { platform: 'youtube', username: 'Rivers_gg', followers: 4_230_000 },
        { platform: 'tiktok', username: 'rivers.gg', followers: 7_000_000 },
        { platform: 'x', username: 'samyriveratv', followers: 1_000_000 },
      ],
    },
    {
      id: 'tatiana-kaer',
      name: 'Tatiana Käer',
      realName: 'Tatiana Käer',
      gender: 'f',
      country: 'es',
      birthDate: '2004',
      age: 21,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'tiktok', username: 'tatianakaer', followers: 19_000_000 },
        { platform: 'instagram', username: 'tatianakaer', followers: 4_901_133 },
        { platform: 'youtube', username: 'Tatianakaher', followers: 650_000 },
      ],
    },
    {
      id: 'thegrefg',
      name: 'TheGrefg',
      realName: 'David Cánovas Martínez',
      gender: 'm',
      country: 'es',
      birthDate: '1997-04-24',
      age: 29,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'youtube', username: 'TheGrefg', followers: 19_743_325 },
        { platform: 'twitch', username: 'thegrefg', followers: 12_288_490 },
        { platform: 'instagram', username: 'thegrefg', followers: 8_000_000 },
        { platform: 'tiktok', username: 'thegrefg', followers: 7_000_000 },
      ],
    },
    {
      id: 'viruzz',
      name: 'Viruzz',
      realName: 'Víctor Mélida Cambra',
      gender: 'm',
      country: 'es',
      birthDate: '1992-05-01',
      age: 34,
      followersUpdatedAt: '2026-05-13',
      socials: [
        { platform: 'youtube', username: 'byViruZz', followers: 6_210_000 },
        { platform: 'instagram', username: 'victormelida', followers: 2_000_000 },
        { platform: 'twitch', username: 'byviruzz', followers: 433_000 },
        { platform: 'tiktok', username: 'byviruzz', followers: 1_000_000 },
      ],
    },
]

/** Conjunto de variantes de una imagen del boxeador. Las versiones
 *  `avif` y `webp` están optimizadas (mucho más pequeñas que el PNG)
 *  y se generan con `pnpm generate:character-images`. */
export interface BoxerImageVariants {
  avif: string
  webp: string
  png: string
}

/** Variantes de la miniatura del selector (carpeta `character-select`). */
export function getBoxerSelectImages(boxer: Boxer): BoxerImageVariants {
  return {
    avif: `/character-select/${boxer.id}.avif`,
    webp: `/character-select/${boxer.id}.webp`,
    png: `/character-select/${boxer.id}.png`,
  }
}

/** Devuelve la ruta a la imagen de selección (miniatura) de un boxeador,
 *  formato PNG. Para mejor rendimiento, prefiere `getBoxerSelectImages`. */
export function getBoxerSelectImage(boxer: Boxer): string {
  return getBoxerSelectImages(boxer).png
}

/** Variantes del recorte grande para el hero (carpeta `character-hero`). */
export function getBoxerHeroImages(boxer: Boxer): BoxerImageVariants {
  return {
    avif: `/character-hero/${boxer.id}.avif`,
    webp: `/character-hero/${boxer.id}.webp`,
    png: `/character-hero/${boxer.id}.png`,
  }
}

/**
 * Devuelve la ruta al recorte grande del boxeador usado en el hero al
 * hacer hover sobre la miniatura del selector, formato PNG. Para mejor
 * rendimiento, prefiere `getBoxerHeroImages`.
 */
export function getBoxerHeroImage(boxer: Boxer): string {
  return getBoxerHeroImages(boxer).png
}

/** Devuelve la ruta a la foto principal del boxeador (01.webp). */
export function getBoxerPhoto(boxer: Boxer): string {
  return `/photos/${boxer.id}/01.webp`
}

/** Mapa rápido para acceder a un boxer por su id. */
export const BOXERS_BY_ID: Record<string, Boxer> = Object.fromEntries(
  BOXERS.map((boxer) => [boxer.id, boxer]),
)

/** Emoji de bandera por código de país (alpha-2 ISO 3166-1). */
export const COUNTRY_FLAGS: Record<string, string> = {
  es: '🇪🇸',
  mx: '🇲🇽',
  co: '🇨🇴',
  ar: '🇦🇷',
  sv: '🇸🇻',
  pr: '🇵🇷',
}

/** Nombre legible por código de país. */
export const COUNTRY_NAMES: Record<string, string> = {
  es: 'España',
  mx: 'México',
  co: 'Colombia',
  ar: 'Argentina',
  sv: 'El Salvador',
  pr: 'Puerto Rico',
}

/** Etiqueta legible por género. */
export const GENDER_LABELS: Record<BoxerGender, string> = {
  f: 'Femenino',
  m: 'Masculino',
}
