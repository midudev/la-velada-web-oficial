import blurPlaceholders from '@/blur-placeholders.json'
import { getOptimizedImageUrl } from '@/utils/get-optimized-image-url'
import type { UnresolvedImageTransform } from 'astro'
export async function getBlurredImageUrl(imageObjectOrUrl: UnresolvedImageTransform['src']): Promise<ImageMetadata | string> {
    const imageUrl = typeof imageObjectOrUrl === 'string' ? imageObjectOrUrl : (imageObjectOrUrl as ImageMetadata).src

    const blurKey = Object.keys(blurPlaceholders).find((key) => imageUrl.includes(key))
    if (blurKey) {
        return blurPlaceholders[blurKey as keyof typeof blurPlaceholders]
    }

    return getOptimizedImageUrl({ src: imageUrl, inferSize: true, width: 10, format: 'webp' })
}