export interface Combat {
	id: string
	number: number
	boxers: string[] // es un string porque hace referencia a los ids de los boxeadores
	teams?: string[]
	titleSize: [number, number]
}
