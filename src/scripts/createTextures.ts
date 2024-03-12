import type { ImagesLoaded } from "./loadImages"

export interface Texture {
	texture: WebGLTexture
	channel: number
	index: number
}
export type TextureElement = Texture
export type TextureList = Texture[]
export function createTextures(gl: WebGL2RenderingContext, images: ImagesLoaded) {
	let index = 0
	const textureArray: TextureList = []
	if (!images) return []
	for (let x = 0; x < images.length; x++) {
		const { img, channel } = images[x]
		const texture: WebGLTexture | null = createTexture(gl, img)
		if (texture) {
			const textureElement: TextureElement = { texture, channel, index }
			textureArray.push(textureElement)
			index++
		}
	}
	return textureArray
}

function createTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
	const texture: WebGLTexture | null = gl.createTexture()
	if (!texture) return null
	gl.bindTexture(gl.TEXTURE_2D, texture)
	// Configurar la textura
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

	// configurar parametros
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

	// subir la imagen a la textura
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
	gl.generateMipmap(gl.TEXTURE_2D)

	return texture
}
