export type BoxerGender = 'f' | 'm'

export interface Boxer {
  id: string
  name: string
  realName: string
  gender: BoxerGender
  birthDate: string | null
  age: number | null
  followersUpdatedAt: string
  socials: { platform: string; username: string; followers?: number; monthlyListeners?: number }[]
  country: string
  previousVeladaWins: number[]
  youtubeChannelId?: string
  /** Peso actual en kg. */
  weightKg?: number | null
  /** Peso pactado para el combate de La Velada VI (kg). */
  fightWeightKg?: number | null
  /** Altura en cm. */
  heightCm?: number | null
  /** Alcance (wingspan) en cm. */
  reachCm?: number | null
  /** Guardia de boxeo. */
  guard?: 'Izquierda' | 'Derecha' | null
}

/**
 * Los `id` coinciden exactamente con:
 *  - `/public/character-select/{id}.webp` (miniatura del selector)
 *  - `/public/character-hero/{id}.webp` (recorte grande mostrado en el
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
      previousVeladaWins: [],
      birthDate: '2001-10-30',
      age: 24,
      weightKg: 56,
      heightCm: 167,
      fightWeightKg: 56,
      guard: 'Derecha',
      youtubeChannelId: 'UCMhJtoft9mSZ_T1FEV__LXA',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'twitch', username: 'alondrissa', followers: 1_800_000 },
        { platform: 'tiktok', username: 'alondrisaa', followers: 1_800_000 },
        { platform: 'instagram', username: 'alondraa.michellee', followers: 1_500_000 },
        { platform: 'youtube', username: 'AlondrissaOfficial', followers: 1_240_000 },
        { platform: 'kick', username: 'alondrissa', followers: 617_100 },
        { platform: 'youtube', username: 'AlondraMichelleVlogs', followers: 351_000 },
      ],
    },
    {
      id: 'angie-velasco',
      name: 'Angie Velasco',
      gender: 'f',
      realName: 'Angie Rocío Velasco',
      country: 'ar',
      previousVeladaWins: [],
      birthDate: '1998-10-30',
      age: 27,
      weightKg: 61,
      heightCm: 170,
      fightWeightKg: 61,
      guard: 'Derecha',
      youtubeChannelId: 'UC2rScBVAJSkL4qXn-27t80A',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'youtube', username: 'AngieVelasco', followers: 6_140_000 },
        { platform: 'tiktok', username: 'angievelasco98', followers: 4_900_000 },
        { platform: 'instagram', username: 'angievelasco08', followers: 2_200_000 },
      ],
    },
    {
      id: 'clersss',
      name: 'Clersss',
      realName: 'Clara Merino',
      country: 'es',
      previousVeladaWins: [],
      birthDate: null,
      gender: 'f',
      age: null,
      weightKg: 61,
      fightWeightKg: 57.5,
      youtubeChannelId: 'UCYa7uV_ICFXbho_JRyv0nFA',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'clersssss', followers: 2_600_000 },
        { platform: 'instagram', username: 'clersssss', followers: 707_000 },
        { platform: 'youtube', username: 'clersssss', followers: 14_200 },
      ],
    },
    {
      id: 'edu-aguirre',
      name: 'Edu Aguirre',
      realName: 'Eduardo Aguirre',
      country: 'es',
      previousVeladaWins: [],
      gender: 'm',
      birthDate: '1988-01-14',
      age: 38,
      heightCm: 175,
      weightKg: 70,
      fightWeightKg: 70,
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'instagram', username: 'eduaguirre7', followers: 1_100_000 },
        { platform: 'x', username: 'EduAguirre7', followers: 771_700 },
      ],
    },
    {
      id: 'fabiana-sevillano',
      name: 'Fabiana Sevillano',
      realName: 'Fabiana Sevillano',
      country: 'es',
      previousVeladaWins: [],
      gender: 'f',
      birthDate: '2002-08-08',
      age: 23,
      weightKg: 50,
      fightWeightKg: 52.5,
      youtubeChannelId: 'UCcV3n8U3gkPKYxHerfsrk7A',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'fabiana.sevillano', followers: 2_100_000 },
        { platform: 'instagram', username: 'fabiana.sevillano', followers: 1_000_000 },
        { platform: 'youtube', username: 'FabianaSevillano', followers: 183_000 },
      ],
    },
    {
      id: 'fernanfloo',
      name: 'Fernanfloo',
      gender: 'm',
      realName: 'Luis Fernando Flores Alvarado',
      country: 'sv',
      previousVeladaWins: [],
      birthDate: '1993-07-07',
      age: 32,
      weightKg: 80,
      heightCm: 185,
      guard: 'Derecha',
      youtubeChannelId: 'UCV4xOVpbcV8SdueDCOxLXtQ',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'youtube', username: 'Fernanfloo', followers: 50_400_000 },
        { platform: 'instagram', username: 'fernanfloo', followers: 11_500_000 },
        { platform: 'twitch', username: 'fernanfloo', followers: 3_500_000 },
      ],
    },
    {
      id: 'gaston-edul',
      name: 'Gastón Edul',
      realName: 'Gastón Edul',
      gender: 'm',
      country: 'ar',
      previousVeladaWins: [],
      birthDate: '1995-12-31',
      age: 29,
      weightKg: 72,
      heightCm: 171,
      fightWeightKg: 72,
      youtubeChannelId: 'UCZGr6IbuqQayELgiLivhnKA',
      followersUpdatedAt: '2026-06-10',
      socials: [
        { platform: 'instagram', username: 'gastonedul', followers: 2_400_000 },
        { platform: 'tiktok', username: 'gastonedul', followers: 1_900_000 },
        { platform: 'x', username: 'gastonedul', followers: 1_200_000 },
        { platform: 'youtube', username: 'gastonedul', followers: 510_000 },
      ],
    },
    {
      id: 'gero-arias',
      name: 'Gero Arias',
      realName: 'Gerónimo Arias',
      gender: 'm',
      country: 'ar',
      previousVeladaWins: [],
      birthDate: '2003-04-01',
      age: 23,
      weightKg: 75,
      fightWeightKg: 75,
      youtubeChannelId: 'UClYcutwIFo-UoNRw2_3Kwaw',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'instagram', username: 'geroooo_arias2.0', followers: 5_800_000 },
        { platform: 'youtube', username: 'geroariass', followers: 3_830_000 },
        { platform: 'tiktok', username: 'geroariass2.0', followers: 3_100_000 },
      ],
    },
    {
      id: 'illojuan',
      name: 'IlloJuan',
      realName: 'Juan Alberto García Gámez',
      gender: 'm',
      country: 'es',
      previousVeladaWins: [],
      birthDate: '1994-06-22',
      age: 31,
      weightKg: 86,
      fightWeightKg: 77,
      youtubeChannelId: 'UCKvoBRFqMNqvuSvFBiNadgw',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'twitch', username: 'illojuan', followers: 4_600_000 },
        { platform: 'youtube', username: 'IlloJuan_', followers: 2_810_000 },
        { platform: 'x', username: 'illojuan', followers: 2_100_000 },
        { platform: 'instagram', username: 'illojuan', followers: 1_900_000 },
      ],
    },
    {
      id: 'kidd-keo',
      name: 'Kidd Keo',
      realName: 'Padua Keoma Salas Sánchez',
      gender: 'm',
      country: 'es',
      previousVeladaWins: [],
      birthDate: '1995-09-27',
      age: 30,
      weightKg: 64,
      fightWeightKg: 70,
      youtubeChannelId: 'UCBCD1nIuiH-d10_l6Q-8rRg',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'youtube', username: 'YKMGOfficial', followers: 4_950_000 },
        { platform: 'spotify', username: 'Kidd Keo', monthlyListeners: 3_900_000 },
        { platform: 'tiktok', username: 'thekiddkeo', followers: 3_100_000 },
        { platform: 'instagram', username: 'thekiddkeo', followers: 3_000_000 },
        { platform: 'spotify', username: 'Kidd Keo', followers: 961_700 },
      ],
    },
    {
      id: 'la-parce',
      name: 'La Parce',
      realName: 'Valeria',
      gender: 'f',
      country: 'co',
      previousVeladaWins: [],
      birthDate: '2002-06-18',
      age: 23,
      weightKg: 55,
      fightWeightKg: 52.5,
      youtubeChannelId: 'UCpkHmV8jZGISRr18KrJgR_A',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'laparsec', followers: 1_200_000 },
        { platform: 'instagram', username: '_laparce_', followers: 574_000 },
        { platform: 'youtube', username: 'laparseyt', followers: 288_000 },
        { platform: 'twitch', username: 'laparce', followers: 234_100 },
        { platform: 'kick', username: 'laparce', followers: 131_100 },
      ],
    },
    {
      id: 'lit-killah',
      name: 'Lit Killah',
      realName: 'Mauro Román Monzón',
      gender: 'm',
      country: 'ar',
      previousVeladaWins: [],
      birthDate: '1999-10-04',
      age: 26,
      weightKg: 78,
      fightWeightKg: 70,
      youtubeChannelId: 'UCExVswmCLmkkoBkjBp3Ta9Q',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'instagram', username: 'litkillah', followers: 8_400_000 },
        { platform: 'spotify', username: 'LIT killah', monthlyListeners: 7_300_000 },
        { platform: 'youtube', username: 'litkillah', followers: 6_490_000 },
        { platform: 'tiktok', username: 'litkillah', followers: 3_900_000 },
      ],
    },
    {
      id: 'marta-diaz',
      name: 'Marta Díaz',
      realName: 'Marta Díaz García',
      gender: 'f',
      country: 'es',
      previousVeladaWins: [],
      birthDate: '2000-10-30',
      age: 25,
      weightKg: 57,
      heightCm: 165,
      fightWeightKg: 57,
      guard: 'Derecha',
      youtubeChannelId: 'UCF1h4Bry3S9fL12D15H5P7Q',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'maarta_diaz', followers: 7_200_000 },
        { platform: 'instagram', username: 'martaa_diiaz', followers: 3_600_000 },
        { platform: 'youtube', username: 'martadiaz1', followers: 1_990_000 },
      ],
    },
    {
      id: 'natalia-mx',
      name: 'Natalia MX',
      realName: 'Natalia García',
      gender: 'f',
      country: 'mx',
      previousVeladaWins: [],
      birthDate: null,
      age: null,
      weightKg: 54,
      fightWeightKg: 57.5,
      youtubeChannelId: 'UCLmWjPj5qLmqSCcoL1FNf1Q',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: '_nataliamx', followers: 986_800 },
        { platform: 'instagram', username: '_nataliamx', followers: 868_000 },
        { platform: 'twitch', username: 'nataliamx', followers: 211_000 },
        { platform: 'youtube', username: 'NataliaMX', followers: 66_800 },
      ],
    },
    {
      id: 'plex',
      name: 'Plex',
      realName: 'Daniel Alonso Góndez',
      gender: 'm',
      country: 'es',
      previousVeladaWins: [2024],
      birthDate: null,
      age: 24,
      weightKg: 81.9,
      heightCm: 197,
      guard: 'Izquierda',
      youtubeChannelId: 'UCl8bYBm0XAP23mReE11IBOA',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'youtube', username: 'YoSoyPlex', followers: 14_800_000 },
        { platform: 'tiktok', username: 'yosoyplex', followers: 12_100_000 },
        { platform: 'instagram', username: 'plex', followers: 3_200_000 },
      ],
    },
    {
      id: 'roro',
      name: 'RoRo',
      realName: 'Rocío López Bueno',
      gender: 'f',
      country: 'es',
      previousVeladaWins: [],
      birthDate: '2002-03-01',
      age: 24,
      weightKg: 47,
      heightCm: 149,
      fightWeightKg: 52,
      youtubeChannelId: 'UCrzySRaber8_-52PPh0GG2g',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'roro.bueno', followers: 9_700_000 },
        { platform: 'instagram', username: 'whoisroro', followers: 4_700_000 },
        { platform: 'youtube', username: 'roroobuenoo', followers: 208_000 },
      ],
    },
    {
      id: 'samy-rivers',
      name: 'Samy Rivers',
      realName: 'Samantha Guadalupe Rivera Treviño',
      gender: 'f',
      country: 'mx',
      previousVeladaWins: [2023],
      birthDate: '1998-08-20',
      age: 27,
      weightKg: 52.6,
      heightCm: 158,
      fightWeightKg: 52,
      youtubeChannelId: 'UCW3bX8K5LuQHw8cKc3U8iUg',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'rivers.gg', followers: 8_600_000 },
        { platform: 'twitch', username: 'rivers_gg', followers: 6_900_000 },
        { platform: 'instagram', username: 'samyrivera', followers: 6_100_000 },
        { platform: 'x', username: 'samyriveratv', followers: 6_400_000 },
        { platform: 'youtube', username: 'Rivers_gg', followers: 4_540_000 },
      ],
    },
    {
      id: 'tatiana-kaer',
      name: 'Tatiana Käer',
      realName: 'Tatiana Käer',
      gender: 'f',
      country: 'es',
      previousVeladaWins: [],
      birthDate: '2004',
      age: 21,
      weightKg: 57,
      heightCm: 165,
      fightWeightKg: 57,
      guard: 'Derecha',
      youtubeChannelId: 'UCZh4XmGTOxSJAsjZLDkZArA',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'tiktok', username: 'tatianakaer', followers: 19_300_000 },
        { platform: 'instagram', username: 'tatianakaer', followers: 4_800_000 },
        { platform: 'youtube', username: 'Tatianakaher', followers: 650_000 },
      ],
    },
    {
      id: 'thegrefg',
      name: 'TheGrefg',
      realName: 'David Cánovas Martínez',
      gender: 'm',
      country: 'es',
      previousVeladaWins: [2025],
      birthDate: '1997-04-24',
      age: 29,
      weightKg: 72,
      heightCm: 179,
      fightWeightKg: 77,
      youtubeChannelId: 'UCCEmjNPpJYhGDgaEqeeA4HA',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'youtube', username: 'TheGrefg', followers: 19_700_000 },
        { platform: 'twitch', username: 'thegrefg', followers: 12_300_000 },
        { platform: 'tiktok', username: 'thegrefg', followers: 9_600_000 },
        { platform: 'instagram', username: 'thegrefg', followers: 7_500_000 },
      ],
    },
    {
      id: 'viruzz',
      name: 'Viruzz',
      realName: 'Víctor Mélida Cambra',
      gender: 'm',
      country: 'es',
      previousVeladaWins: [2022, 2024, 2025],
      birthDate: '1992-05-01',
      age: 34,
      weightKg: 88.5,
      heightCm: 182,
      fightWeightKg: 81,
      guard: 'Izquierda',
      youtubeChannelId: 'UCvGiJYBPgVP7W1ypE3DKOqA',
      followersUpdatedAt: '2026-05-14',
      socials: [
        { platform: 'youtube', username: 'byViruZz', followers: 6_210_000 },
        { platform: 'instagram', username: 'victormelida', followers: 1_800_000 },
        { platform: 'twitch', username: 'byviruzz', followers: 433_441 },
        { platform: 'tiktok', username: 'victormelida', followers: 1_700_000 },
      ],
    },
]

/** Conjunto de variantes de una imagen del boxeador. Las versiones
 *  `avif` y `webp` están optimizadas (mucho más pequeñas que el PNG)
 *  y se generan con `pnpm generate:character-images`. */
export interface BoxerImageVariants {
  avif: string
  webp: string
}

/** Variantes de la miniatura del selector (carpeta `character-select`). */
export function getBoxerSelectImages(boxer: Boxer): BoxerImageVariants {
  return {
    avif: `/character-select/${boxer.id}.avif`,
    webp: `/character-select/${boxer.id}.webp`,
  }
}

/** Devuelve la ruta a la imagen de selección (miniatura) de un boxeador,
 *  formato WebP. Para mejor rendimiento, prefiere `getBoxerSelectImages`. */
export function getBoxerSelectImage(boxer: Boxer): string {
  return getBoxerSelectImages(boxer).webp
}

/** Variantes del recorte grande para el hero (carpeta `character-hero`). */
export function getBoxerHeroImages(boxer: Boxer): BoxerImageVariants {
  return {
    avif: `/character-hero/${boxer.id}.avif`,
    webp: `/character-hero/${boxer.id}.webp`,
  }
}

/**
 * Devuelve la ruta al recorte grande del boxeador usado en el hero al
 * hacer hover sobre la miniatura del selector, formato WebP. Para mejor
 * rendimiento, prefiere `getBoxerHeroImages`.
 */
export function getBoxerHeroImage(boxer: Boxer): string {
  return getBoxerHeroImages(boxer).webp
}

/** Devuelve la ruta a la foto principal del boxeador (01.webp). */
export function getBoxerPhoto(boxer: Boxer): string {
  return `/photos/${boxer.id}/01.webp`
}

/** Mapa rápido para acceder a un boxer por su id. */
export const BOXERS_BY_ID: Record<string, Boxer> = Object.fromEntries(
  BOXERS.map((boxer) => [boxer.id, boxer]),
)

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
