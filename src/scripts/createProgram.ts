import { fsSource, vsSource } from "./const"

// Función auxiliar para crear programas
export function createProgram(gl: WebGL2RenderingContext, vs: string, fs: string) {
	const program = gl.createProgram()
	if (!program) {
		console.error("Error creando webgl program")
		return null
	}
	const finalVertex = vsSource(vs)
	const finalFragment = fsSource(fs)
	const vertexShader: WebGLShader | null = compileShader(gl, gl.VERTEX_SHADER, finalVertex)
	const fragmentShader: WebGLShader | null = compileShader(gl, gl.FRAGMENT_SHADER, finalFragment)
	if (!vertexShader || !fragmentShader) return null
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(`Error al vincular programa: ${gl.getProgramInfoLog(program)}`)
		gl.deleteProgram(program)
		return null
	}

	return program
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
	if (!gl) {
		console.error("Contexto webgl2 no valido")
		return null
	}
	const shader: WebGLShader | null = gl.createShader(type)
	if (!shader) {
		console.error("Error creando el shader")
		return null
	}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(`Error al compilar shader: ${gl.getShaderInfoLog(shader)}`)
		gl.deleteShader(shader)
		return null
	}
	return shader
}
