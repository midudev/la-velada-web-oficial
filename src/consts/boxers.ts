export interface Boxer {
  id: string
  name: string
  country: string
}

/**
 * Los `id` coinciden exactamente con:
 *  - `/public/character-select/{id}.png` (miniatura del selector)
 *  - `/public/photos/{id}/01.webp` (foto principal)
 *
 * Cualquier renombrado debe mantener esa convención.
 */
export const BOXERS: Boxer[] = [
  { id: 'alondrissa', name: 'Alondrissa', country: 'es' },
  { id: 'angie-velasco', name: 'Angie Velasco', country: 'co' },
  { id: 'clersss', name: 'Clersss', country: 'es' },
  { id: 'edu-aguirre', name: 'Edu Aguirre', country: 'es' },
  { id: 'fabiana-sevillano', name: 'Fabiana Sevillano', country: 'ar' },
  { id: 'fernanfloo', name: 'Fernanfloo', country: 'sv' },
  { id: 'gaston-edul', name: 'Gastón Edul', country: 'ar' },
  { id: 'gero-arias', name: 'Gero Arias', country: 'ar' },
  { id: 'illojuan', name: 'Illojuan', country: 'es' },
  { id: 'kidd-keo', name: 'Kidd Keo', country: 'es' },
  { id: 'la-parce', name: 'La Parce', country: 'co' },
  { id: 'lit-killah', name: 'Lit Killah', country: 'ar' },
  { id: 'marta-diaz', name: 'Marta Díaz', country: 'es' },
  { id: 'natalia-mx', name: 'Natalia MX', country: 'mx' },
  { id: 'plex', name: 'Plex', country: 'mx' },
  { id: 'roro', name: 'Roro', country: 'es' },
  { id: 'samy-rivers', name: 'Samy Rivers', country: 'es' },
  { id: 'tatiana-kaer', name: 'Tatiana Käer', country: 'es' },
  { id: 'thegrefg', name: 'TheGrefg', country: 'es' },
  { id: 'viruzz', name: 'Viruzz', country: 'es' },
]

/** Devuelve la ruta a la imagen de selección (miniatura) de un boxeador. */
export function getBoxerSelectImage(boxer: Boxer): string {
  return `/character-select/${boxer.id}.png`
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
}

/** Nombre legible por código de país. */
export const COUNTRY_NAMES: Record<string, string> = {
  es: 'España',
  mx: 'México',
  co: 'Colombia',
  ar: 'Argentina',
  sv: 'El Salvador',
}
