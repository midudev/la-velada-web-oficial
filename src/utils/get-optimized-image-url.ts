import type { ImageMetadata, UnresolvedImageTransform } from "astro"
import { getImage } from "astro:assets"

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

  // Get image object from the import.meta.glob
  const imageObject = await images[formattedImagePath as keyof typeof images]()

  // Return the image object
  return imageObject.default
}

export async function getOptimizedImageUrl(options: UnresolvedImageTransform): Promise<ImageMetadata | string> {
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
