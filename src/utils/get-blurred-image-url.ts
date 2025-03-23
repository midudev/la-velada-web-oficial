import blurPlaceholders from '@/blur-placeholders.json'
import { getOptimizedImageUrl } from '@/utils/get-optimized-image-url'
import type { ImageMetadata, UnresolvedImageTransform } from 'astro'
import type { LocalImageProps, RemoteImageProps } from 'astro:assets'

type ImageObjectOrUrl = Awaited<LocalImageProps['src']> | Awaited<RemoteImageProps['src']>
type ImagePromise = Promise<LocalImageProps['src'] | RemoteImageProps['src']>

export async function getBlurredImageUrl(imageObjectOrUrl: ImageObjectOrUrl): ImagePromise {
    const imageUrl = typeof imageObjectOrUrl === 'string' ? imageObjectOrUrl : (imageObjectOrUrl as ImageMetadata).src

    const blurKey = Object.keys(blurPlaceholders).find((key) => imageUrl.includes(key))
    if (blurKey) {
        return blurPlaceholders[blurKey as keyof typeof blurPlaceholders]
    }

    return getOptimizedImageUrl({ src: imageUrl, inferSize: true, width: 10, format: 'webp' })
}