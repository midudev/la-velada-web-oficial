import type { ImageMetadata, UnresolvedImageTransform } from "astro"
import type { LocalImageProps, RemoteImageProps } from "astro:assets"
import { getImage } from "astro:assets"

type ImagePromise = Promise<LocalImageProps['src'] | RemoteImageProps['src']>

async function getExternalImageUrl(options: UnresolvedImageTransform): Promise<ImageMetadata | string> {
  const externalImage = await getImage({
    ...options,
    inferSize: true,
    format: 'webp',
  })
  return externalImage.src
}

async function getLocalImageUrl(imageUrl: string): Promise<ImageMetadata | string> {
   // Get the image path list from the public folder
   const images = import.meta.glob<{ default: ImageMetadata }>(
    '../../public/images/**/*.{jpg,jpeg,png,webp,avif}'
  )

  // Remove the leading slash from the image path
  const sanitizedImagePath = imageUrl.replace(/^\//, '')
  
  // Format the image path to be used in the import.meta.glob
  const formattedImagePath = sanitizedImagePath.includes('../../public') ? sanitizedImagePath : `../../public/${sanitizedImagePath}`

  // Get the image loader from the import.meta.glob
  const imageLoader = images[formattedImagePath as keyof typeof images]

  // Fail loudly with a useful message instead of an opaque "is not a function" TypeError
  if (!imageLoader) {
    throw new Error(`Imagen local no encontrada: ${formattedImagePath}`)
  }

  // Return the image object
  const imageObject = await imageLoader()
  return imageObject.default
}

export async function getOptimizedImageUrl(options: UnresolvedImageTransform): ImagePromise {
  const { src: imageObjectOrUrl } = options

  // Return the image if it's an object
  if (typeof imageObjectOrUrl === 'object' && 'src' in imageObjectOrUrl) {
    return imageObjectOrUrl
  }

  // Check if the image path is an external image, if so, return the image Url
  const isExternalImage = typeof imageObjectOrUrl === 'string' && imageObjectOrUrl.startsWith('http')
  if (isExternalImage) return await getExternalImageUrl(options)

  // Return the local image object
  return await getLocalImageUrl(imageObjectOrUrl as string)
}
