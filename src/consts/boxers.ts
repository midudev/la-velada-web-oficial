import { type Boxer } from "@/types/Boxer"

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
		clips: [
			{
				text: "Viruzz ha dejado las drogas de doping, un aplauso.",
				url: "https://youtube.com/clip/UgkxGivF3aSpyQdc9L4P6JBE0q5ZTstNC0jm?si=m0J04aypC-2ud74U",
			},
			{
				text: "El año pasado me hicieron sentir que no merecía esta oportunidad, entonces me maté entrenando",
				url: "https://youtube.com/clip/UgkxxiL9X5jvl1Pj3eirGiDOIyjrMZFQjbQs?si=nA1rCooWna03VV7g",
			},
			{
				text: "Siento que es muy bueno que te den una oportunidad de redención, Viruzz",
				url: "https://youtube.com/clip/UgkxACB-VsHvjoYbtrWir9sqZomlseYCpmlV?si=Qo0S5TK_r8_-c-bk",
			},
		],
		rotate: true,
		workout: {
			videoID: "xJqhfK5oXK4",
			thumbnail: "/img/boxers/workoutThumbnails/shelao.webp",
		},
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
		clips: [
			{
				text: "Soy competitiva, no me gusta perder y creo que nos enfadamos mucho",
				url: "https://youtube.com/clip/Ugkx1GFvGZOaZ9z_HvOqUUNwai5fvgFPdiHX?si=22BsoUeULnhqT73-",
			},
			{
				text: "Por mi parte ya no habrá tan buen rollo como antes",
				url: "https://youtube.com/clip/UgkxvB5Kn63tTAz2oSsA8E-2Pq_lnA7nDmJF?si=92af92-UCIjsnV4Z",
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
		clips: [
			{
				text: "No estoy preparando excusas, no soy el xocas, si pierdo será con dignidad",
				url: "https://youtube.com/clip/UgkxJJ3K1UB1MGsxI_WzPxyiQo-hL4YMn9KB?si=dInk9hcrBB_uSIXK",
			},
			{
				text: "Alana, veo que eres muy bonita y cuqui pero es que yo soy de barrio",
				url: "https://youtube.com/clip/UgkxWTeqQT62-L-LYjSBofjx2i5zsxaeHCqf?si=K08UiInfEvVsIKIe",
			},
			{
				text: "Una cosa es entrenar en gimnasio, verse bonita, y otra darse de ostias",
				url: "https://youtube.com/clip/UgkxptfPo72fI8yntHVo2UfsuyGjpmsfI3js?si=63ttE4alT2k73Aoo",
			},
		],
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
		clips: [
			{
				text: "El año pasado la vida me cagó a trompadas y esto me vino como anillo al dedo",
				url: "https://youtube.com/clip/UgkxtwjSORg57TZFqKsJBhUB1VqgYvL_W-cH?si=i7vlKyALk5vXaR5q",
			},
			{
				text: "Con ese bigote de Agustín me dan ganas de pegarle",
				url: "https://youtube.com/clip/Ugkx5U4X6gOIS3cqBerhC8OmebW7fRakNqCM?si=Z6yzxl1aQsRjrXa9",
			},
			{
				text: "Tenemos un buen peso para que esto sea una pelea muy divertida",
				url: "https://youtube.com/clip/Ugkx7iS-4hpvBT1QHGAabmfrVamnMu2IefPX?si=c8s5vkc5gO6UD8_q",
			},
		],
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
		clips: [
			{
				text: "Me gusta pelear en el Bernabeu el patio de la casa de Messi",
				url: "https://youtube.com/clip/Ugkxjm_VBOO_hEVTcaT1iIn1wkqhdSgz0PEz?si=4FNXieUC5rSWA4N5",
			},
			{
				text: "Quiero que la pelea dure nueve minutos",
				url: "https://youtube.com/clip/UgkxJxXzX5p5WQ-qnTCVSY_yHKLwN1mF_yRt?si=hYvXI2ERkJ3DP6ZT",
			},
		],
		rotate: true,
	},
	{
		id: "karchez",
		name: "Karchez",
		realName: "José Carlos Sánchez",
		birthDate: new Date(2000, 7, 4),
		weight: 85, // No encontrado
		height: 1.84,
		country: "es",
		socials: {
			twitch: "https://www.twitch.tv/karchez",
			instagram: "https://www.instagram.com/karchezz/",
			twitter: "https://twitter.com/Karchezzz",
			youtube: "https://www.youtube.com/Karchez",
			tiktok: "https://tiktok.com/@karchez",
		},
		clips: [
			{
				text: "A Will le digo que no toque a Skain. A Skain me lo pido yo",
				url: "https://youtube.com/clip/UgkxiWzPv1OLVZmD_T_NH7XTY4QP3beSSc-V?si=CvyH-pbOAi4H5HMT",
			},
			{
				text: "¿Quién crees que es el rival mas peligroso? Karchez: Nadie",
				url: "https://youtube.com/clip/UgkxIiWOmEccr40oWJUkQzYVAkjVxLSvG2HU?si=jJtd35_Rliq97o6D",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "peldanyos",
		name: "Peldanyos",
		realName: "Sergio Bolaños",
		birthDate: new Date(1998, 3, 13),
		weight: 87, // No encontrado
		height: 1.91, // No es seguro
		guard: "Derecha",
		country: "es",
		workout: {
			videoID: "I8R5sQXjpKk",
			thumbnail: "/img/boxers/workoutThumbnails/peldanyos.webp",
		},
		socials: {
			twitch: "https://twitch.tv/peldanyos",
			instagram: "https://instagram.com/peldanyos",
			twitter: "https://twitter.com/peldanyos",
			youtube: "https://youtube.com/@peldanyos",
			tiktok: "https://tiktok.com/@peldanyos",
		},
		clips: [
			{
				text: "Me los bajaré a todos, decir que no sería tener mala actitud",
				url: "https://youtube.com/clip/UgkxDDiYcrums2e6329f6Zi2MveywHF8R-da?si=Eplk8G484ovrTM0Z",
			},
			{
				text: "No puedo estar más emocionado por el reto, pero no me voy a flipar",
				url: "https://youtube.com/clip/Ugkx1VRxwu3liP3LO5E7FxvR97Qy7VHQ-AMy?si=g0Qwd0gm2dhcZL3t",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "aldo-geo",
		name: "Aldo Geo",
		realName: "Aldo Geovanni",
		birthDate: new Date(1996, 9, 14),
		weight: 80, // No encontrado
		height: 1.79,
		country: "mx",
		socials: {
			twitch: "https://www.twitch.tv/aldo_geo/about",
			instagram: "https://www.instagram.com/_aldogeo_/",
			twitter: "https://twitter.com/aldogeotv",
			youtube: "https://www.youtube.com/user/aldogeo100",
			tiktok: "https://www.tiktok.com/@aldo_geo?lang=es",
		},
		clips: [
			{
				text: "Ni siquiera ha empezado la pelea y ya estoy sintiendo adrenalina en mi cuerpo",
				url: "https://youtube.com/clip/UgkxGm-L9MDFvEf3AjwjoGxRAn-2P0mbBcHM?si=tNDah2eREaipv6iz",
			},
			{
				text: "Estoy muy entusiasmado por empezar a entrenar y darle a full",
				url: "https://youtube.com/clip/UgkxPN9KOdpqCyfZMzSpASYG-GintxzHx1au?si=ki9ob750dSvegoIJ",
			},
			{
				text: "Si hablamos de tirar vergazos, yo no le tengo miedo a nada ni a nadie",
				url: "https://youtube.com/clip/Ugkx1MY5pq1j1Ehe3I_w05O9OZgTCBUlhTBJ?si=p2dXn_oUyonwT2sV",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "will",
		name: "Will",
		realName: "Ángelo Valdés",
		birthDate: new Date(2000, 5, 29),
		weight: 85, // No encontrado
		height: 1.85, // No encontrado
		country: "do",
		socials: {
			instagram: "https://instagram.com/mrangelovaldes",
			twitter: "https://twitter.com/MrAngeloValdes",
			youtube: "https://youtube.com/@misterfactoush",
			tiktok: "https://tiktok.com/@mrangelovaldes",
		},
		versus: "rey-de-la-pista",
		clips: [
			{
				text: "Espero que se acostumbren a la regla del knockout.",
				url: "https://www.youtube.com/clip/UgkxgdKFyMCvRcN-fj-tuiF1i4KB2msHncZo",
			},
			{
				text: "Esta sera mi prioridad de los proximos meses.",
				url: "https://youtube.com/clip/UgkxgTZz_h0N3COR9qQ6sRMmd_PSN_0CNFfJ?si=w5wRjWdKSjtiWnXx",
			},
			{
				text: "César parepárate para tres minutos mágicos.",
				url: "https://www.youtube.com/clip/UgkxHy3xXDVJdgv9BUaArwgIYrA_ae1M5FIX",
			},
		],
	},
	{
		id: "sezar-blue",
		name: "Sezar Blue",
		realName: "César González",
		birthDate: new Date(1973, 7, 29),
		weight: 87,
		height: 1.77,
		country: "es",
		socials: {
			twitch: "https://www.twitch.tv/sezarbluelive",
			instagram: "https://www.instagram.com/sezarblue/",
			twitter: "https://twitter.com/soysezarblue",
			youtube: "https://www.youtube.com/sezarblue",
			tiktok: "https://www.tiktok.com/@sezar_blue_",
		},
		clips: [
			{
				text: "Me siento muy preparado para el reto, además me siento el padre de toda la gente que hay",
				url: "https://www.youtube.com/clip/Ugkxpgjoq-dSHfusbcM7joiiJlE6DvAz-O3V",
			},
			{
				text: "Ibai, ¿dónde está el vídeo de las dominadas? Porque si quieres las hago aquí mismo",
				url: "https://youtube.com/clip/UgkxRLtIUYYyPRqrRa02tpC26Ppyclg5U2G4?si=e7sqNk11GMDgpCqE",
			},
			{
				text: "Creo que el cardio será una cosa importante, entonces estaré 60 minutos sudando como una bestia",
				url: "https://youtube.com/clip/UgkxfeafuAmAxWjXfSHLE2rdeuiA51BI93qc?si=rKmhv-XfMm2lSRIO",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "unicornio",
		name: "Unicornio",
		realName: "Germán Usinger",
		birthDate: new Date(1999, 5, 7),
		weight: 75, // No encontrado
		height: 1.69, // No es seguro
		country: "ar",
		socials: {
			twitch: "https://twitch.tv/unicornio",
			instagram: "https://www.instagram.com/germanusinger",
			twitter: "https://twitter.com/GermanUsinger",
			youtube: "https://youtube.com/c/unicornioperro",
			tiktok: "https://www.tiktok.com/@german.usinger",
		},
		versus: "rey-de-la-pista",
	},
	{
		id: "pelicanger",
		name: "Pelicanger",
		realName: "Angerson Esneider",
		birthDate: new Date(2001, 0, 7),
		weight: 85, // No es seguro
		height: 1.91,
		country: "co",
		socials: {
			twitch: "https://www.twitch.tv/pelicanger",
			instagram: "https://www.instagram.com/pelicanger__",
			twitter: "https://twitter.com/offpeli",
			youtube: "https://www.youtube.com/c/Pelicanger",
			tiktok: "https://www.tiktok.com/@pelicanger.oficial",
		},
		clips: [
			{
				text: "Me emociona mucho,y me los puedo bajar a todos",
				url: "https://youtube.com/clip/UgkxQdajCilFEG8GfFfoazDZmwQFHMG3zjW3?si=0kA6MIrGBov58T0B",
			},
			{
				text: "Todos están diciendo que me van a partir, pues demuéstrenlo",
				url: "https://youtube.com/clip/UgkxevzOvk1Ef_BGIefrB9v2YyRZEvU9a-0B?si=IgoywtV5JkUqM0gB",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "roberto-cein",
		name: "RobertoCein",
		realName: "Roberto Sebastián Guadarrama Jiménez",
		birthDate: new Date(1998, 6, 29),
		weight: 85, // No encontrado
		height: 1.69, // No es seguro
		country: "mx",
		socials: {
			twitch: "https://m.twitch.tv/robertocein/home",
			instagram: "https://www.instagram.com/robertocein/",
			twitter: "https://twitter.com/Roberto_Cein",
			youtube: "https://www.youtube.com/channel/UCt8RJDArdFmULfqNENimQvw",
			tiktok: "https://www.tiktok.com/@roberto_cein?lang=es",
		},
		clips: [
			{
				text: "Estoy muy emocionado, algunos me sacan dos cabezas entonces mi estrategía será sacar aire",
				url: "https://youtube.com/clip/UgkxfyqAvmfPS6r6qAFFHvfleqBWQZpj8Zfr?si=a4Did3Jb4eCXw5iB",
			},
			{
				text: "Todos han sido muy amables y algunos se ven muy fuertes, no sé si podré vencerlos",
				url: "https://youtube.com/clip/Ugkxg29Xx8-7eE1qRTNKFuMCb2tZ9KdCzV-a?si=JDK7GjtmKYN7DOgs",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "skain",
		name: "Skain",
		realName: "David Carbó Ferrer",
		birthDate: new Date(1997, 2, 10),
		weight: 83, // No encontrado
		height: 1.83, // No encontrado
		country: "es",
		socials: {
			twitch: "https://www.twitch.tv/skain",
			instagram: "https://www.instagram.com/skain24",
			twitter: "https://twitter.com/skain24",
			youtube: "https://www.youtube.com/@skain24",
			tiktok: "https://www.tiktok.com/@skain24",
		},
		workout: {
			videoID: "BlN7FgdDoHM",
			thumbnail: "/img/boxers/workoutThumbnails/skain.webp",
		},
		versus: "rey-de-la-pista",
	},
	{
		id: "folagor",
		name: "Folagor",
		realName: "Yoel Ramírez Pulido",
		birthDate: new Date(1994, 11, 9),
		weight: 71,
		height: 1.8,
		country: "es",
		socials: {
			twitch: "https://www.twitch.tv/folagorlives",
			instagram: "https://www.instagram.com/yoel__ramirez",
			twitter: "https://twitter.com/FolagoR",
			tiktok: "https://www.tiktok.com/@folagor_official",
			youtube: "https://www.youtube.com/Folagor03",
		},
		clips: [
			{
				text: "Aunque tenga un mes de retraso, voy a llegar a su nivel",
				url: "https://youtube.com/clip/UgkxXwT3QIrF_18ubc4LU2t2rn0fSy36XCl9?si=f6sqmOfhnbKd-qE1",
			},
			{
				text: "Empezaré a entrenar y daré todo lo que pueda",
				url: "https://youtube.com/clip/UgkxU-0uUkxYVWUrr6wdMw33KgTDlmSecjNm?si=4Hgou6TkI_jRrqwR",
			},
			{
				text: "En El Rey de la Pista el cardio no es importante, es la fuerza",
				url: "https://youtube.com/clip/UgkxnYTPVsLLRS3h4sOEdR8--oZxVx01vCum?si=UcUZpzw5d_8NkJWK",
			},
		],

		// clips: [
		// 	{
		// 		text: "Aunque tenga un mes de retraso, voy a llegar a su nivel",
		// 		url: "https://player.twitch.tv/?enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=auto&t=3h6m39s&video=2081166660&volume=1",
		// 	},
		// 	{
		// 		text: "Empezaré a entrenar y daré todo lo que pueda",
		// 		url: "https://player.twitch.tv/?enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=auto&t=3h7m6s&video=2081166660&volume=1",
		// 	},
		// 	{
		// 		text: "En El Rey de la Pista el cardio no es importante, es la fuerza",
		// 		url: "https://player.twitch.tv/?enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=auto&t=3h18m43s&video=2081166660&volume=1",
		// 	},
		// ],
		versus: "rey-de-la-pista",
		rotate: true,
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
		workout: {
			videoID: "svXhWZ1sZJE",
			thumbnail: "/img/boxers/workoutThumbnails/plex.webp",
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
		clips: [
			{
				text: "Nos apostamos los cinturones de la Velada, porque el tuyo no te lo mereces",
				url: "https://youtube.com/clip/UgkxfYWnQtr1SDApiBtm-EBvS352rnz22bz0?si=3ek10syjTVif2Jz_",
			},
			{
				text: "Shelao, te enfrentas a mi redención, no hay manera de que ganes",
				url: "https://youtube.com/clip/UgkxO_tFZ74OirLeHBIu0xMnvHEcWtYNs7fB?si=aLY0rakseZ1ZYiYZ",
			},
			{
				text: "Te propongo que sea el primer combate de la Velada sin casco",
				url: "https://youtube.com/clip/UgkxuLDeLsfhwMN1DgJoLSThw_nNNrsLFVGF?si=EHJD4g3G_-53dYbB",
			},
		],
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
			thumbnail: "/img/boxers/workoutThumbnails/alana.webp",
		},
		clips: [
			{
				text: "No me siento nerviosa, sino ansiosa para que comience ya",
				url: "https://youtube.com/clip/Ugkx0Mw7RT8n-aa7XwatTTg7zG0y8x14BMiY?si=8p0UBNrZsD0nFQHs",
			},
			{
				text: "Siento que Nissaxter viene con más motivación y a Zeling la noto con miedo",
				url: "https://youtube.com/clip/Ugkx06ew5d2CB1oLDIc9HPOzTmR5tDi5VHi-?si=SeGMhL7Nejc0M4Bd",
			},
			{
				text: "Sé del combate meses antes pero no me puse a entrenar porque soy justa y honesta",
				url: "https://youtube.com/clip/UgkxnCHow_qxDh6_zAdO5Tirg2UryjIgpNQi?si=X11a4D-0TPK-LnyX",
			},
		],
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
		gallery: true,
		socials: {
			twitch: "https://twitch.tv/amablitz",
			instagram: "https://instagram.com/amablitz",
			twitter: "https://twitter.com/amablitz",
			youtube: "https://youtube.com/c/amablitz",
			tiktok: "https://tiktok.com/@amablitz",
		},
		clips: [
			{
				text: "Si hablamos de ventajas, yo soy la que menos ha practicado de todas",
				url: "https://youtube.com/clip/UgkxP_fhKdpqIa-DNHn21UofXxOS6dcJ46iH?si=aEOCLGdxSk82Mcgp",
			},
			{
				text: "Voy a entrenar con Jhonny González, que es un campeón mundial",
				url: "https://youtube.com/clip/Ugkx7Cx_kusf73FDmnSXKZFpkSagGjhzykoR?si=pKGVXbtOKM8umKJJ",
			},
		],
		rotate: true,
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
		clips: [
			{
				text: "Después del combate nos podemos dar un abrazo porque lo importante es dar un buen ejemplo",
				url: "https://youtube.com/clip/UgkxJszPGolZaON3QjSuzzh5TP2luW9qLX4W?si=_KPbivwhIxlrhMR-",
			},
			{
				text: "Siento que soy un chaval con mucha energía pero cuando me ponen la mano encima me caliento",
				url: "https://youtube.com/clip/UgkxRZ3cq1lEgLDe-NizURNpwN3vPxowiITS?si=iF103l7J-MVN4MbY",
			},
			{
				text: "Si a mi me tienen que nerfear en los torneos por algo será, espero no me nerfeen en la velada",
				url: "https://youtube.com/clip/UgkxHCkkSU67P09o20vM1ZCrohVvOYDmVIh2?si=1IVMhiqKxoUYbxQe",
			},
		],
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
		clips: [
			{
				text: "Era un sueño un día subirme aquí, muchas gracias a todos por venir",
				url: "https://youtube.com/clip/UgkxMc_uxsDRteyleobjWTLU7VzlM74PVEul?si=oKWmaUc3mUKDQuOt",
			},
			{
				text: "Me van a perdonar pero creo que es el mejor combate de toda la Velada",
				url: "https://youtube.com/clip/UgkxoHOE311rgi9xvpr3WSU0k3yaMVx7N8Lm?si=cESF8DpadP52bhBT",
			},
			{
				text: "Es un rival duro y me gustó mucho, fue muy intenso desde el primer momento",
				url: "https://youtube.com/clip/UgkxRpobly-wM3CN1F8FuuMJ9Q2GLrFNHTuZ?si=hiIeodSEwIjWmlDp4",
			},
		],
		rotate: true,
	},
] as const)
