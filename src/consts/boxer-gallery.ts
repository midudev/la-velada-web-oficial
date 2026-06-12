
const CDN = 'https://cdn.infolavelada.com/boxeadores'

/**
 * Galería de fotos de cada boxeador (bucket R2 de Cloudflare).
 *
 * La clave es el `id` del boxeador en `boxers.ts`. Guardamos solo la cantidad
 * de fotos (la numeración es corrida 01..count) y, cuando la carpeta del CDN
 * no coincide con el id, el `slug` real.
 *
 * Cada foto existe en sm / md / normal × avif / webp. Acá usamos:
 *   - sm → miniatura de la galería (carga prioritaria)
 *   - md → imagen ampliada (lightbox)
 * El tamaño `normal` no se usa (muy pesado; con md alcanza).
 */
const GALLERY: Record<string, { count: number; slug?: string }> = {
    alondrissa: { count: 18, slug: 'alondrisa' }, // slug del CDN != id
    'angie-velasco': { count: 16 },
    clersss: { count: 10, slug: 'clerss' }, // slug del CDN != id
    'edu-aguirre': { count: 13 },
    'fabiana-sevillano': { count: 10, slug: 'fabiana' }, // slug del CDN != id
    fernanfloo: { count: 11 },
    'gaston-edul': { count: 13 },
    'gero-arias': { count: 17 },
    illojuan: { count: 13 },
    'kidd-keo': { count: 15 },
    'la-parce': { count: 14 },
    'lit-killah': { count: 16 },
    'marta-diaz': { count: 11 },
    'natalia-mx': { count: 13 },
    'plex': { count: 15 },
    'roro': { count: 13 },
    'samy-rivers': { count: 15 },
    'tatiana-kaer': { count: 12 },
    'thegrefg': { count: 14 },
    viruzz: { count: 14 },
}

/** Par de fuentes para un `<picture>` (avif preferido, webp de fallback). */
export interface GalleryImageSources {
    avif: string
    webp: string
}

export interface GalleryImage {
  /** Número de foto (1-based). */
    index: number
  /** Texto alternativo accesible. */
    alt: string
  /** Tamaño chico — miniatura de la galería. */
    sm: GalleryImageSources
  /** Tamaño mediano — imagen ampliada. */
    md: GalleryImageSources
}

/**
 * Devuelve la galería de un boxeador lista para renderizar.
 * @param boxerId   id del boxeador (coincide con `boxers.ts`)
 * @param boxerName nombre para el alt (opcional, recomendado)
 */
export function getBoxerGallery(boxerId: string, boxerName?: string): GalleryImage[] {
    const entry = GALLERY[boxerId]
    if (!entry) return []

    const slug = entry.slug ?? boxerId
    const label = boxerName ?? boxerId

return Array.from({ length: entry.count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    const base = `${CDN}/${slug}/${n}`
    return {
        index: i + 1,
        alt: `Foto ${i + 1} de ${label}`,
        sm: { avif: `${base}-sm.avif`, webp: `${base}-sm.webp` },
        md: { avif: `${base}-md.avif`, webp: `${base}-md.webp` },
    }
})
}

/** ¿Tiene galería este boxeador? */
export function hasBoxerGallery(boxerId: string): boolean {
    return Object.hasOwn(GALLERY, boxerId)
}
