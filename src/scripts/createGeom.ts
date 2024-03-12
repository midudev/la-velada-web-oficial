import { indexGeom, vertexGeom } from "./const"

export interface bufferVertex {
	buffer: WebGLBuffer
	data: Float32Array
}
export interface bufferIndex {
	buffer: WebGLBuffer
	data: Uint16Array
}
export interface buffers {
	vertex: bufferVertex
	index: bufferIndex
}

// En esta etapa vamos a crear dos buffers
// el primero corresponde las coordenadas de los vertices del quad (cuadrilatero) y sera de tipo ARRAY_BUFFER
// el segundo buffer expresara de forma ordenada la manera de construir los triangulos, ya que las GPU por
// eficiencia solo saben pintar triangulos cualquier otra forma debera descomponerse en triangulos

export function createGeom(gl: WebGL2RenderingContext, program: WebGLProgram) {
	// Crear buffer de vertices
	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	const vertices = new Float32Array(vertexGeom)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
	if (!positionBuffer) return null
	// en el vertex shader vamos a usar las coordenadas que pasemos para configurar las posiciones de los vertices
	// por ello debemos buscar el attributo en el propio shader creado y vincularlos
	const positionLocation = gl.getAttribLocation(program, "a_position")
	gl.enableVertexAttribArray(positionLocation)
	// desde de definir el array de las coordenadas necesitamos especificar el tamaño y el tipo de dato de cada vertice
	// en nuestro caso solo vamos a pintar un quad a pantalla completa por ello con 2 coordenadas nos vale
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

	// repetimos el bindeo y la asignacion de los datos para los indices pero no hay que especificar nada
	// ya que al ser de tipo ELEMENT_ARRAY_BUFFER estos apuntan a vertices no a coordenadas
	// Se puede no indexar (usar geometria indexada) pero tendriamos que definir vertices por cada triangulo
	const indexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
	const indices = new Uint16Array(indexGeom)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
	if (!indexBuffer) return null
	const verticesData = { buffer: positionBuffer, data: vertices }
	const indexData = { buffer: indexBuffer, data: indices }
	const data: buffers = { vertex: verticesData, index: indexData }
	const error = gl.getError()
	if (error !== gl.NO_ERROR) {
		return null
		// console.error(`Error al crear el buffer: ${error}`)
	}
	return data
}
