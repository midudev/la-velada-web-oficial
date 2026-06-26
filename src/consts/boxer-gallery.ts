
const CDN = 'https://cdn.infolavelada.com/boxeadores'

/** Máximo de fotos que se muestran en la galería de un boxeador. */
const MAX_GALLERY_PHOTOS = 8

/**
 * Galería de fotos de cada boxeador (bucket R2 de Cloudflare).
 *
 * La clave es el `id` del boxeador en `boxers.ts`. Guardamos la cantidad total
 * de fotos (`count`, numeración corrida 01..count), el `slug` real cuando la
 * carpeta del CDN no coincide con el id y, en `best`, los índices de las fotos
 * curadas a mano: las más logradas y distintas entre sí.
 *
 * Aunque el CDN tenga más fotos, en la galería se muestran como mucho
 * `MAX_GALLERY_PHOTOS` (8). `best` define cuáles y en qué orden; si faltara,
 * se usan las primeras 8 como respaldo.
 *
 * Cada foto existe en sm / md / normal × avif / webp. Acá usamos:
 *   - sm → miniatura de la galería (carga prioritaria)
 *   - md → imagen ampliada (lightbox)
 * El tamaño `normal` no se usa (muy pesado; con md alcanza).
 */
const GALLERY: Record<string, { count: number; slug?: string; best?: number[] }> = {
    alondrissa: { count: 18, slug: 'alondrisa', best: [1, 3, 4, 5, 8, 10, 11, 17] }, // slug del CDN != id
    'angie-velasco': { count: 16, best: [1, 2, 3, 5, 6, 8, 10, 12] },
    clersss: { count: 10, slug: 'clerss', best: [1, 2, 3, 4, 6, 7, 9, 10] }, // slug del CDN != id
    'edu-aguirre': { count: 13, best: [1, 2, 3, 5, 6, 11, 12, 13] },
    'fabiana-sevillano': { count: 10, slug: 'fabiana', best: [1, 2, 3, 5, 7, 8, 9, 10] }, // slug del CDN != id
    fernanfloo: { count: 11, best: [1, 3, 5, 6, 7, 8, 9, 10] },
    'gaston-edul': { count: 13, best: [2, 4, 6, 8, 9, 10, 12, 13] },
    'gero-arias': { count: 17, best: [1, 4, 5, 8, 12, 13, 16, 17] },
    illojuan: { count: 13, best: [1, 3, 4, 6, 7, 9, 10, 13] },
    'kidd-keo': { count: 15, best: [1, 3, 4, 5, 8, 9, 14, 15] },
    'la-parce': { count: 14, best: [1, 3, 6, 8, 11, 12, 13, 14] },
    'lit-killah': { count: 16, best: [1, 4, 6, 7, 9, 10, 12, 13] },
    'marta-diaz': { count: 11, best: [1, 2, 3, 4, 6, 8, 10, 11] },
    'natalia-mx': { count: 13, best: [1, 3, 4, 6, 8, 10, 12, 13] },
    'plex': { count: 15, best: [1, 3, 4, 6, 8, 9, 10, 12] },
    'roro': { count: 13, best: [2, 4, 5, 6, 8, 9, 10, 13] },
    'samy-rivers': { count: 15, best: [1, 3, 6, 8, 9, 11, 12, 15] },
    'tatiana-kaer': { count: 12, best: [1, 2, 3, 5, 6, 8, 10, 12] },
    'thegrefg': { count: 14, best: [1, 4, 5, 6, 7, 9, 12, 13] },
    viruzz: { count: 14, best: [1, 2, 4, 6, 9, 11, 12, 13] },
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

    // Mostramos como mucho 8 fotos: las curadas en `best` (las mejores y más
    // distintas entre sí) o, si no hay curaduría, las primeras del CDN.
    const fallback = Array.from({ length: entry.count }, (_, i) => i + 1)
    const indices = (entry.best ?? fallback).slice(0, MAX_GALLERY_PHOTOS)

    return indices.map((index) => {
        const n = String(index).padStart(2, '0')
        const base = `${CDN}/${slug}/${n}`
        return {
            index,
            alt: `Foto ${index} de ${label}`,
            sm: { avif: `${base}-sm.avif`, webp: `${base}-sm.webp` },
            md: { avif: `${base}-md.avif`, webp: `${base}-md.webp` },
        }
    })
}

/** ¿Tiene galería este boxeador? */
export function hasBoxerGallery(boxerId: string): boolean {
    return Object.hasOwn(GALLERY, boxerId)
}
