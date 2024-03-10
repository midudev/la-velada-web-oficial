import type { buffers } from "./createGeom"
import { createGeom } from "./createGeom"
import { createProgram } from "./createProgram"

interface quad {
	program: WebGLProgram
	geom: buffers
}
export function createQuad(gl: WebGL2RenderingContext, vs: string, fs: string) {
	// creamos el programa que creara los dos shader el vertex el fragment y con ellos se crea el program
	const program: WebGLProgram | null = createProgram(gl, fs, vs)
	if (!program)
		return null
	// con el programa ya podemos crear el buffer de vertices y el de indices que servira para crear los dos triangulos usando los vertices
	const geom: buffers | null = createGeom(gl, program)
	if (!geom)
		return null
	gl.useProgram(program)
	const quad: quad = { program, geom }
	return quad
}
