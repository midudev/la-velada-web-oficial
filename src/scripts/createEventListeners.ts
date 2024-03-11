import type { Uniforms } from "./createUniforms"

export function createEventListener(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, uniforms: Uniforms) {
	window.addEventListener("resize", resize)
	let lastResize: DOMHighResTimeStamp = performance.now()
	function resize() {
		const actResize = performance.now()
		if (actResize - lastResize < 10)
			return
		lastResize = actResize
		const newDim: DOMRect = canvas.getBoundingClientRect()
		canvas.width = newDim.width
		canvas.height = newDim.height
		gl.viewport(0, 0, newDim.width, newDim.height)

		uniforms.iResolution([newDim.width, newDim.height])
	}
	window.addEventListener("mousemove", mouseMove)
	function mouseMove(event: MouseEvent) {
		uniforms.iMouse([event.clientX, (canvas.height - event.clientY) / 2])
	}
}
