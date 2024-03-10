import { shaderImages } from "./const"
import { createQuad } from "./createQuad"
import { createTextures } from "./createTextures"
import type { Uniforms } from "./createUniforms"
import { createUniforms } from './createUniforms'
import type { ImagesLoaded } from "./loadImages"
import { preloadImages } from "./loadImages"
import shaders from './shaders'

export function createRenderer(canvasSelector: string, shadernum: number) {
	const { gl, canvas } = setCanvas(canvasSelector)
	if (!gl)
		return null
	const images = shaderImages.basic
	let textures = []
	// const Quads = [] se usara al implementar el uso de varios shaders
	let uniforms: Uniforms = {
		iTime: (_a) => { },
		iResolution: (_a) => { },
		iMouse: (_a) => { },
		iPrimary: (_a) => { },
		iSecondary: (_a) => { },
		iChannel0: (_a) => { }
	}

	const screenQuad = createQuad(gl, shaders[shadernum], "")
	void preloadImages(images).catch().then((images: ImagesLoaded) => {
		if (!gl || !screenQuad?.program)
			return null
		textures = createTextures(gl, images)
		uniforms = createUniforms(gl, canvas, screenQuad.program)
		uniforms.iPrimary(hexToVec3("#071907"))
		uniforms.iSecondary(hexToVec3("#153106"))
		render()
	})
	const startTime = performance.now()
	let frameTime: DOMHighResTimeStamp = 0
	function render() {
		if (!uniforms || !gl || !canvas)
			return null
		const timeNow: DOMHighResTimeStamp = performance.now()
		const elapsedTime = (timeNow - startTime) / 1000.0
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		uniforms.iResolution([canvas.width, canvas.height])
		uniforms.iTime([elapsedTime])
		gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0)
		frameTime = performance.now() - timeNow
		requestAnimationFrame(render)
	}
}

function setCanvas(canvasSelector: string) {
	const canvas: HTMLCanvasElement | null = document.querySelector(canvasSelector)
	if (!canvas) {
		return { gl: null, canvas: null }
	}
	const vp_size = [window.innerWidth, window.innerHeight]
	canvas.style.background = "black"
	canvas.width = vp_size[0]
	canvas.height = vp_size[1]

	const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
		desynchronized: true,
		preserveDrawingBuffer: true,
	})
	if (!gl) {
		return { gl: null, canvas }
	}
	const result = { gl, canvas }
	return result
}

function hexToVec3(hex: string): number[] {
	// Elimina el símbolo '#' si está presente
	hex = hex.replace(/^#/, "")

	// Convierte el valor hexadecimal a decimal
	const decimalValue: number = Number.parseInt(hex, 16)

	// Extrae los componentes RGB
	const red: number = (decimalValue >> 16) & 255
	const green: number = (decimalValue >> 8) & 255
	const blue: number = decimalValue & 255

	// Normaliza los componentes a valores entre 0 y 1
	const vec3Color: number[] = [red / 255, green / 255, blue / 255]

	return vec3Color
}
