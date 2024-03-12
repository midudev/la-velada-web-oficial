import type { Uniforms } from "./createUniforms"

export function createEventListener(
	gl: WebGL2RenderingContext,
	canvas: HTMLCanvasElement,
	uniforms: Uniforms
) {
	window.addEventListener("resize", resize)
	window.addEventListener("scroll", scroll)
	let lastResize: DOMHighResTimeStamp = performance.now()

	function scroll() {
		trackLogo()
		uniforms.iScroll([window.scrollY])
	}
	function resize() {
		const actResize = performance.now()
		if (actResize - lastResize < 10) return
		lastResize = actResize
		const newDim: DOMRect = canvas.getBoundingClientRect()
		canvas.width = newDim.width
		canvas.height = newDim.height
		gl.viewport(0, 0, newDim.width, newDim.height)
		trackLogo()
		uniforms.iResolution([newDim.width, newDim.height])
	}

	function trackLogo() {
		const logo: HTMLElement | null = document.getElementById("logoLaVelada")
		if (!logo) return null
		const logoRec: DOMRect | null = logo?.getBoundingClientRect() ?? null
		if (!logoRec) return
		uniforms.logoBox([logoRec.x, logoRec.y, logoRec.width, logoRec.height])
	}
	window.addEventListener("mousemove", mouseMove)
	function mouseMove(event: MouseEvent) {
		uniforms.iMouse([event.clientX, (canvas.height - event.clientY) / 2])
	}
}
