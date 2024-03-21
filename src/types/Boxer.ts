export interface Boxer {
	id: string
	name: string
	birthDate: Date
	age: number
	gallery?: boolean
	realName: string
	weight: number
	height: number
	country: string
	countryName?: string
	versus: string | string[]
	guard?: string
	reach?: number
}
