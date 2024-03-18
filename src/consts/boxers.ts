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
	guard?: string
	reach?: number
	socials: {
		twitch?: string
		instagram?: string
		twitter?: string
		youtube?: string
		tiktok?: string
	}
	clips?: Array<{
		text: string
		url: string
	}>
	workout?: {
		videoID: string
		thumbnail: string
	}
	rotate?: boolean
	allies?: string[]
}

const addGetters = (boxersWithoutAge: Omit<Boxer, "age">[]): Boxer[] => {
	return boxersWithoutAge.map((boxerWithoutAge) => ({
		...boxerWithoutAge,
		get age() {
			return new Date(new Date().getTime() - this.birthDate.getTime()).getFullYear() - 1970
		},
		// El enemigo de mi enemigo es mi amigo
		get allies() {
			return boxersWithoutAge
				.filter(
					(ally) =>
						(Array.isArray(ally.versus)
							? ally.versus.every((opponent) => this.versus.includes(opponent))
							: false) && ally.id !== this.id
				)
				.map((ally) => ally.id)
		},
	}))
}

export const BOXERS: Boxer[] = addGetters([
	{
		id: "el-mariana",
		name: "El Mariana",
		realName: "Osvaldo Palacios Flores",
		birthDate: new Date(1998, 6, 23),
		weight: 87,
		height: 1.95,
		country: "mx",
		versus: "plex",
		guard: "Izquierda",
		reach: 168,
		socials: {
			twitch: "https://twitch.tv/elmariana",
			instagram: "https://instagram.com/elmarianaa",
			twitter: "https://twitter.com/elmarianaa",
			youtube: "https://youtube.com/c/elmariana",
			tiktok: "https://tiktok.com/@elmarianaa",
		},
		clips: [
			{
				text: "El combate lo verá mi madre. Voy a ir con todo, voy a ganar.",
				url: "https://youtube.com/clip/UgkxZSsrfj0sR_gZ802CbVtT2F9SKtj1OxKW?si=B-u68MU9FB7-VmPo",
			},
			{
				text: "Cuanto más alto, más fácil va a ser que le entre un gancho",
				url: "https://youtube.com/clip/Ugkx-2lQ3J2MyKiOppp0UnGVO2APKh-r4cnS?si=mqpgfimZ7-nIU2ql",
			},
		],
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/zeling",
			instagram: "https://instagram.com/zeiing",
			twitter: "https://twitter.com/zeling",
			youtube: "https://www.youtube.com/channel/UCTfejVE5het7QO8WCY7yIQA",
			tiktok: "https://tiktok.com/@zeliing",
		},
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/alanalarana",
			instagram: "https://instagram.com/alanafloresf",
			twitter: "https://twitter.com/alanafloresf",
			youtube: "https://youtube.com/c/alanalarana",
			tiktok: "https://tiktok.com/@alanatwitch",
		},
		workout: {
			videoID: "FXzCBTRWouA",
			thumbnail: "/img/boxers/workoutThumbnails/alana-thumbnails.webp",
		},
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/shelao",
			instagram: "https://instagram.com/crissalva40",
			youtube: "https://youtube.com/c/shelao",
			tiktok: "https://tiktok.com/@shelao",
		},
		rotate: true,
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/byviruzz",
			instagram: "https://instagram.com/victormelida",
			twitter: "https://twitter.com/byViruZz",
			youtube: "https://youtube.com/c/byViruZz",
			tiktok: "https://tiktok.com/@victormelida",
		},
		rotate: true,
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/amablitz",
			instagram: "https://instagram.com/amablitz",
			twitter: "https://twitter.com/amablitz",
			youtube: "https://youtube.com/c/amablitz",
			tiktok: "https://tiktok.com/@amablitz",
		},
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			instagram: "https://instagram.com/yosoyplex",
			twitter: "https://twitter.com/yosoyplex",
			youtube: "https://youtube.com/c/YoSoyPlex",
			tiktok: "https://tiktok.com/@yosoyplexx",
		},
		clips: [
			{
				text: "No hay chance de que pierda. Soy un psicópata",
				url: "https://youtube.com/clip/UgkxwyKEwj17kL8yJ2XVPNMI4dMuq-FdjYuG?si=LTAScm2qp6d7Bi4L",
			},
			{
				text: "¿Se supone que tiene que picar?",
				url: "https://youtube.com/clip/UgkxCVitcQsAn1I5wO4GlZY_kMcwLKaOI7HI?si=oyHb0fJkIWWQ8wTz",
			},
			{
				text: "Hablaré en el ring. No tengo nada que decir.",
				url: "https://youtube.com/clip/UgkxSCdNOmvFVB74IC_D56vglujXVWtVI60Q?si=Eqhsbja42efTdCaz",
			},
		],
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/nissaxter",
			instagram: "https://instagram.com/nissaxter",
			twitter: "https://twitter.com/nissaxter",
			youtube: "https://www.youtube.com/channel/UCjUjTl1MiPdAwRxklFLNklg",
			tiktok: "https://tiktok.com/@nissaxter_",
		},
		rotate: true,
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/guanyar",
			instagram: "https://instagram.com/guanyarr",
			twitter: "https://twitter.com/guanyarr",
			youtube: "https://www.youtube.com/channel/UCEy75s5IJw-ISYDu1d7HzlA?view_as=subscriber",
			tiktok: "https://tiktok.com/@guanyar",
		},
		rotate: true,
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://www.twitch.tv/lacobraaa",
			instagram: "https://www.instagram.com/lautarodelcampo/",
			twitter: "https://twitter.com/lautarodeIcampo",
			youtube: "https://www.youtube.com/channel/UCCfPkh8osJPC2pPq283kKXg",
			tiktok: "https://www.tiktok.com/@lacobraaa.9",
		},
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/agustin51",
			instagram: "https://www.instagram.com/IMAGUS51",
			twitter: "https://twitter.com/ImAgus51",
			youtube: "https://www.youtube.com/channel/UC1Bb0DVSgXLKuLbenbpkb8g",
			tiktok: "https://www.tiktok.com/@agustin51",
		},
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
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/carreraaa",
			instagram: "https://www.instagram.com/rodricarreraaa/",
			twitter: "http://twitter.com/rodricarreraaa",
			youtube: "http://youtube.com/carreraaa",
			tiktok: "https://www.tiktok.com/@carreproroblox74",
		},
	},
	// {
	// 	id: "sezar-blue",
	// 	name: "Sezar Blue",
	// 	realName: "César González",
	// 	birthDate: new Date(1973, 7, 29),
	// 	weight: 87,
	// 	height: 1.77,
	// 	country: "es",
	// 	socials: {},
	// },
	// {
	// 	id: "will",
	// 	name: "Will",
	// 	realName: "Ángelo Valdés",
	// 	birthDate: new Date(2000, 5, 29),
	// 	weight: 85, // No encontrado
	// 	height: 1.85, // No encontrado
	// 	country: "do",
	// 	socials: {},
	// },
	// {
	// 	id: "peldanyos",
	// 	name: "Peldanyos",
	// 	realName: "Sergio Bolaños",
	// 	birthDate: new Date(1998, 3, 13),
	// 	weight: 87, // No encontrado
	// 	height: 1.91, // No es seguro
	// 	country: "es",
	// 	socials: {},
	// },
	// {
	// 	id: "aldo-geo",
	// 	name: "Aldo Geo",
	// 	realName: "Aldo Geovanni",
	// 	birthDate: new Date(1996, 9, 14),
	// 	weight: 80, // No encontrado
	// 	height: 1.79,
	// 	country: "mx",
	// 	socials: {},
	// },
	// {
	// 	id: "pelicanger",
	// 	name: "Pelicanger",
	// 	realName: "Angerson Esneider",
	// 	birthDate: new Date(2001, 0, 7),
	// 	weight: 85, // No es seguro
	// 	height: 1.91,
	// 	country: "co",
	// 	socials: {},
	// },
	// {
	// 	id: "roberto-cein",
	// 	name: "RobertoCein",
	// 	realName: "Roberto Sebastián Guadarrama Jiménez",
	// 	birthDate: new Date(1998, 6, 29),
	// 	weight: 85, // No encontrado
	// 	height: 1.69, // No es seguro
	// 	country: "mx",
	// 	socials: {},
	// },
	// {
	// 	id: "unicornio",
	// 	name: "Unicornio",
	// 	realName: "Germán Usinger",
	// 	birthDate: new Date(1999, 5, 7),
	// 	weight: 75, // No encontrado
	// 	height: 1.69, // No es seguro
	// 	country: "ar",
	// 	socials: {},
	// },
	// {
	// 	id: "karchez",
	// 	name: "Karchez",
	// 	realName: "José Carlos Sánchez",
	// 	birthDate: new Date(2000, 7, 4),
	// 	weight: 85, // No encontrado
	// 	height: 1.84,
	// 	country: "es",
	// 	socials: {},
	// },
	// {
	// 	id: "skain",
	// 	name: "Skain",
	// 	realName: "David Carbó Ferrer",
	// 	birthDate: new Date(1997, 2, 10),
	// 	weight: 83, // No encontrado
	// 	height: 1.83, // No encontrado
	// 	country: "es",
	// 	socials: {},
	// },
	// {
	// 	id: "folagor",
	// 	name: "Folagor",
	// 	realName: "Yoel Ramírez Pulido",
	// 	birthDate: new Date(1994, 11, 9),
	// 	weight: 71,
	// 	height: 1.8,
	// 	country: "es",
	// 	socials: {},
	// },
] as const)
