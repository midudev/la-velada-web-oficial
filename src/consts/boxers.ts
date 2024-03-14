export interface Boxer {
	id: string
	name: string
	birthDate: Date
	age: number
	realName: string
	weight: number
	height: number
	country: string
	countryName?: string
	versus: string | string[]
}

const addAgeGetter = (boxersWithoutAge: Omit<Boxer, "age">[]): Boxer[] => {
	return boxersWithoutAge.map((boxerWithoutAge) => ({
		...boxerWithoutAge,
		get age() {
			return new Date(new Date().getTime() - this.birthDate.getTime()).getFullYear() - 1970
		},
	}))
}

export const BOXERS: Boxer[] = addAgeGetter([
	{
		id: "el-mariana",
		name: "El Mariana",
		realName: "Osvaldo Palacios Flores",
		birthDate: new Date(1998, 6, 23),
		weight: 87,
		height: 1.95,
		country: "mx",
		versus: "plex",
	},
	{
		id: "zeling",
		name: "Zeling",
		realName: "Alicia González",
		birthDate: new Date(1995, 10, 3),
		weight: 65, // No encontrado
		height: 1.7, // No es seguro
		country: "es",
		versus: ["alana", "ama-blitz"],
	},
	{
		id: "alana",
		name: "Alana",
		realName: "Alana Flores",
		birthDate: new Date(2000, 11, 15),
		weight: 55,
		height: 1.7,
		country: "mx",
		versus: ["nissaxter", "zeling"],
	},
	{
		id: "shelao",
		name: "Shelao",
		realName: "Cristóbal Andrés Álvarez Leiva",
		birthDate: new Date(1990, 5, 8),
		weight: 93,
		height: 1.88,
		country: "cl",
		versus: "viruzz",
	},
	{
		id: "viruzz",
		name: "Viruzz",
		realName: "Víctor Mélida Cambra",
		birthDate: new Date(1992, 4, 1),
		weight: 85,
		height: 1.82,
		country: "es",
		versus: "shelao",
	},
	{
		id: "ama-blitz",
		name: "Amablitz",
		realName: "Amairani Garza Alonso",
		birthDate: new Date(1995, 2, 1),
		weight: 55, // No es seguro
		height: 1.58,
		country: "mx",
		versus: ["zeling", "nissaxter"],
	},
	{
		id: "plex",
		name: "YoSoyPlex",
		realName: "Daniel Alonso Góndez",
		birthDate: new Date(2001, 8, 20),
		weight: 70,
		height: 1.97,
		country: "es",
		versus: "el-mariana",
	},

	{
		id: "nissaxter",
		name: "Nissaxter",
		realName: "Cristina Magadán",
		birthDate: new Date(1994, 3, 4),
		weight: 55, // No es seguro
		height: 1.64,
		country: "es",
		versus: ["alana", "ama-blitz"],
	},
	{
		id: "guanyar",
		name: "Guanyar",
		realName: "Diego Iglesias",
		birthDate: new Date(1998, 8, 28),
		weight: 85,
		height: 1.88,
		country: "es",
		versus: "la-cobra",
	},
	{
		id: "la-cobra",
		name: "La Cobra",
		realName: "Lautaro Damián del Campo",
		birthDate: new Date(1997, 8, 8),
		weight: 105,
		height: 1.83,
		country: "ar",
		versus: "guanyar",
	},
	{
		id: "agustin-51",
		name: "Agustin51",
		realName: "José Agustín Peréz Nuñéz",
		birthDate: new Date(2000, 10, 18),
		weight: 62, // No es seguro
		height: 1.7,
		country: "es",
		versus: "carreraaa",
	},
	{
		id: "carreraaa",
		name: "Carreraaa",
		realName: "Rodrigo Ezequiel Carrera",
		birthDate: new Date(2000, 9, 9),
		weight: 61,
		height: 1.65,
		country: "ar",
		versus: "agustin-51",
	},
	/* {
		id: "sezar-blue",
		name: "Sezar Blue",
		realName: "César González",
		birthDate: new Date(1973,7,29),
		weight: 87,
		height: 1.77,
		country: "es",
	},
	{
		id: "will",
		name: "Will",
		realName: "Ángelo Valdés",
		birthDate: new Date(2000,5,29),
		weight: 85, // No encontrado
		height: 1.85, // No encontrado
		country: "do",
	},
	{
		id: "peldanyos",
		name: "Peldanyos",
		realName: "Sergio Bolaños",
		birthDate: new Date(1998,3,13),
		weight: 87, // No encontrado
		height: 1.91, // No es seguro
		country: "es",
	},
	{
		id: "aldo-geo",
		name: "Aldo Geo",
		realName: "Aldo Geovanni",
		birthDate: new Date(1996,9,14),
		weight: 80, // No encontrado
		height: 1.79,
		country: "mx",
	},
	{
		id: "pelicanger",
		name: "Pelicanger",
		realName: "Angerson Esneider",
		birthDate: new Date(2001,0,7),
		weight: 85, // No es seguro
		height: 1.91,
		country: "co",
	},
	{
		id: "roberto-cein",
		name: "RobertoCein",
		realName: "Roberto Sebastián Guadarrama Jiménez",
		birthDate: new Date(1998,6,29),
		weight: 85, // No encontrado
		height: 1.69, // No es seguro
		country: "mx",
	},
	{
		id: "unicornio",
		name: "Unicornio",
		realName: "Germán Usinger",
		birthDate: new Date(1999,5,7),
		weight: 75, // No encontrado
		height: 1.69, // No es seguro
		country: "ar",
	},
	{
		id: "karchez",
		name: "Karchez",
		realName: "José Carlos Sánchez",
		birthDate: new Date(2000,7,4),
		weight: 85, // No encontrado
		height: 1.84,
		country: "es",
	},
	{
		id: "skain",
		name: "Skain",
		realName: "David Carbó Ferrer",
		birthDate: new Date(1997,2,10),
		weight: 83, // No encontrado
		height: 1.83, // No encontrado
		country: "es",
	},
	{
		id: "folagor",
		name: "Folagor",
		realName: "Yoel Ramírez Pulido",
		birthDate: new Date(1994,11,9),
		weight: 71,
		height: 1.8,
		country: "es",
	},
	*/
] as const)
