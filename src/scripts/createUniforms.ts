// nota refactorizar el tipo

export type UniformFunc = (a: number[]) => void

export interface Uniforms {
	iTime: UniformFunc
	iScroll: UniformFunc
	iResolution: UniformFunc
	iMouse: UniformFunc
	iPrimary: UniformFunc
	iSecondary: UniformFunc
	logoBox: UniformFunc
	iChannel0: UniformFunc
	iChannel1: UniformFunc
}

export function createUniforms(
	gl: WebGL2RenderingContext,
	canvas: HTMLCanvasElement,
	program: WebGLProgram
): Uniforms {
	const basicUniforms = [
		{ name: "iTime", fType: 1, defaultValue: [0.0] },
		{ name: "iScroll", fType: 1, defaultValue: [0.] },
		{ name: "iResolution", fType: 2, defaultValue: [canvas.width, canvas.height] },
		{ name: "iMouse", fType: 2, defaultValue: [canvas.width / 2, canvas.height / 2] },
		{ name: "iPrimary", fType: 3, defaultValue: [1, 1, 1] },
		{ name: "iSecondary", fType: 3, defaultValue: [0, 0, 0] },
		{ name: "logoBox", fType: 4, defaultValue: [0, 0, 0, 0] },
		{ name: "iChannel0", fType: 5, defaultValue: [0] },
		{ name: "iChannel1", fType: 5, defaultValue: [1] },
	]

	const funcs = basicUniforms.reduce((acumUnif, { name, fType, defaultValue }) => {
		const updateFunc: UniformFunc = createUniform(gl, program, name, fType, defaultValue)
		return { ...acumUnif, [name]: updateFunc }
	}, {} as Uniforms)

	return funcs
}
function createUniform(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, type: number, defaultValue: number[]): UniformFunc {
	const updateFuncs = [update1f, update2f, update3f, update4f, updateSampler]
	let uniform = gl.getUniformLocation(program, name)

	const update = updateFuncs[type - 1]
	update(defaultValue)
	function update1f(f: number[]): void {
		uniform = gl.getUniformLocation(program, name)

		gl.uniform1f(uniform, f[0])
	}
	function update2f(f: number[]): void {
		gl.uniform2f(uniform, f[0], f[1])
	}
	function update3f(f: number[]): void {
		gl.uniform3f(uniform, f[0], f[1], f[2])
	}

	function update4f(f: number[]): void {
		gl.uniform4f(uniform, f[0], f[1], f[2], f[3])
	}

	function updateSampler(f: number[]): void {
		const uniform = gl.getUniformLocation(program, name)
		gl.uniform1i(uniform, f[0])
	}

	return update
}
