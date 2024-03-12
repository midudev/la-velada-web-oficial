import { shaderImages } from "./const"
import { createEventListener } from "./createEventListeners"
import { createQuad } from "./createQuad"
import { createTextures } from "./createTextures"
import type { Uniforms } from "./createUniforms"
import { createUniforms } from "./createUniforms"
import type { ImagesLoaded } from "./loadImages"
import { preloadImages } from "./loadImages"
import shaders from "./shaders"

export function createRenderer(canvasSelector: string, shadernum: number, debug: boolean) {
	const { gl, canvas } = setCanvas(canvasSelector)
	if (!gl)
		return null
	const images = shaderImages[shadernum % 10]
	// const Quads = [] se usara al implementar el uso de varios shaders
	let uniforms: Uniforms = {
		iTime: (_a) => { },
		iResolution: (_a) => { },
		iMouse: (_a) => { },
		iPrimary: (_a) => { },
		iSecondary: (_a) => { },
		iFrame: (_a) => { },
		iScroll: (_a) => { },
		logoBox: (_a) => { },
		iChannel0: (_a) => { },
		iChannel1: (_a) => { },
		iChannel2: (_a) => { },
	}

	const screenQuad = createQuad(gl, shaders[shadernum % 10], "")
	void preloadImages(images).catch().then((images: ImagesLoaded) => {
		if (!gl || !screenQuad?.program)
			return null
		createTextures(gl, images)
		uniforms = createUniforms(gl, canvas, screenQuad.program)
		uniforms.iPrimary(hexToVec3("#071907"))
		uniforms.iSecondary(hexToVec3("#153106"))
		createEventListener(gl, canvas, uniforms)
		render()
	})

	const startTime = performance.now()
	let prevTime: DOMHighResTimeStamp = 0
	const debugPanel: HTMLElement | null = document.getElementById("debug")
	if (debugPanel)
		debugPanel.style.display = debug ? "flex" : "hidden"
	function render() {
		if (!uniforms || !gl || !canvas)
			return null

		const initTime: DOMHighResTimeStamp = performance.now()
		const elapsedTime = (performance.now() - startTime) / 1000.0
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.clearColor(0.0, 0.0, 0.0, 0.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		uniforms.iTime([elapsedTime])
		gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0)

		const frameTime: DOMHighResTimeStamp = performance.now() - prevTime
		prevTime = performance.now()
		const drawTime: DOMHighResTimeStamp = performance.now() - initTime
		drawStats(drawTime, frameTime)
		requestAnimationFrame(render)
	}
}
const drawTimeNode: HTMLElement | null = document.getElementById("gpu")
const frameTimeNode: HTMLElement | null = document.getElementById("frametime")
const fpsTimeNode: HTMLElement | null = document.getElementById("fps")
function drawStats(drawTime: DOMHighResTimeStamp, frameTime: DOMHighResTimeStamp) {
	if (drawTimeNode) {
		drawTimeNode.innerText = drawTime.toFixed(2)
	}
	if (frameTimeNode) {
		frameTimeNode.innerText = frameTime.toFixed(2)
	}
	if (fpsTimeNode)
		fpsTimeNode.innerText = (1000 / frameTime).toFixed(1)
}
function setCanvas(canvasSelector: string) {
	const canvas: HTMLCanvasElement | null = document.querySelector(canvasSelector)
	if (!canvas) {
		return { gl: null, canvas: null }
	}
	const vp_size = [window.innerWidth, window.innerHeight]
	canvas.style.width = "100vw"
	canvas.style.height = "100dvh"
	canvas.width = vp_size[0]
	canvas.height = vp_size[1]

	const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {

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
