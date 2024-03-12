export interface ImageToLoad {
	url: string
	channel: number
}

export interface ImageLoaded {
	img: HTMLImageElement
	url: string
	channel: number
}

export type ImagesLoaded = ImageLoaded[] | []

export interface ImageLoadError {
	url: string
	error: Event | string // Puedes ajustar el tipo según tus necesidades
}

export async function preloadImages(images: ImageToLoad[]): Promise<ImagesLoaded> {
	const preloadImage = async (url: string, channel: number): Promise<ImageLoaded> => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.addEventListener("load", () => resolve({ img, url, channel }))
			// eslint-disable-next-line prefer-promise-reject-errors
			img.addEventListener("error", (error) => reject({ url, error }))
			img.src = url
		})
	}

	try {
		const promisesLoad = images.map(({ url, channel }) =>
			preloadImage(`/img/textures/${url}`, channel)
		)
		return await Promise.all(promisesLoad)
	} catch (error) {
		console.error("Error al cargar imágenes:", error)
		throw error
	}
}
