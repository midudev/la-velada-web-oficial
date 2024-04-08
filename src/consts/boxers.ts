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
		height: 1.95,
		country: "mx",
		versus: "plex",
		guard: "Izquierda",
		reach: 168,
		socials: {
			twitch: "https://twitch.tv/elmariana",
			instagram: "https://instagram.com/elmarianaa",
			twitter: "https://twitter.com/elmarianaa",
			youtube: "https://youtube.com/elmariana",
			tiktok: "https://tiktok.com/@elmarianaa",
		},
		clips: [
			{
				text: "El combate lo verá mi madre. Voy a ir con todo, voy a ganar",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=W6h8FwdZR6NlmJ08&amp;clip=UgkxZSsrfj0sR_gZ802CbVtT2F9SKtj1OxKW&amp;clipt=ENnv5AUY8eTlBQ",
			},
			{
				text: "Cuanto más alto, más fácil va a ser que le entre un gancho",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=AAnuIiM4FcI4uFLu&amp;clip=Ugkx-2lQ3J2MyKiOppp0UnGVO2APKh-r4cnS&amp;clipt=EMSw5wUY3KXoBQ",
			},
		],
	},
	{
		id: "shelao",
		name: "Shelao",
		realName: "Cristóbal Andrés Álvarez Leiva",
		birthDate: new Date(1990, 5, 8),
		height: 1.88,
		country: "cl",
		versus: "viruzz",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/shelao",
			instagram: "https://instagram.com/crissalva40",
			youtube: "https://youtube.com/shelao",
			tiktok: "https://tiktok.com/@shelao",
		},
		clips: [
			{
				text: "Viruzz ha dejado las drogas de doping, un aplauso",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=1wb7fB-OfE7HzV6M&amp;clip=UgkxGivF3aSpyQdc9L4P6JBE0q5ZTstNC0jm&amp;clipt=ELWy4gMY8ITjAw",
			},
			{
				text: "El año pasado me hicieron sentir que no merecía esta oportunidad, entonces me maté entrenando",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=xIA8r5LJaWPitSMk&amp;clip=UgkxxiL9X5jvl1Pj3eirGiDOIyjrMZFQjbQs&amp;clipt=ENWj7wMY4-jvAw",
			},
			{
				text: "Siento que es muy bueno que te den una oportunidad de redención, Viruzz",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=HcuUn6WZf6zQMZcv&amp;clip=UgkxACB-VsHvjoYbtrWir9sqZomlseYCpmlV&amp;clipt=EO3V7gMYhtPvAw",
			},
		],
		rotate: true,
		workout: {
			videoID: "xJqhfK5oXK4",
			thumbnail: "/boxers/workoutThumbnails/shelao.webp",
			name: "Shelao",
		},
	},
	{
		id: "zeling",
		name: "Zeling",
		realName: "Alicia González",
		birthDate: new Date(1995, 10, 3),
		height: 1.7, // No es seguro
		country: "es",
		gallery: true,
		versus: ["alana", "ama-blitz"],
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/zeling",
			instagram: "https://instagram.com/zeiing",
			twitter: "https://twitter.com/zeiing",
			youtube: "https://youtube.com/@zeling_",
			tiktok: "https://tiktok.com/@zeliing",
		},
		clips: [
			{
				text: "Soy competitiva, no me gusta perder y creo que nos enfadamos mucho",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=m3QZMHr7dagPabsw&amp;clip=Ugkx1GFvGZOaZ9z_HvOqUUNwai5fvgFPdiHX&amp;clipt=EMn88wIYief0Ag",
			},
			{
				text: "Por mi parte ya no habrá tan buen rollo como antes",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=ccy_0Me4fseLPhdD&amp;clip=UgkxvB5Kn63tTAz2oSsA8E-2Pq_lnA7nDmJF&amp;clipt=EIztngMY9MyfAw",
			},
		],
		workout: {
			videoID: "bVlV1HejQag",
			thumbnail: "/boxers/workoutThumbnails/zeling.webp",
			name: "Zeling",
		},
	},
	{
		id: "nissaxter",
		name: "Nissaxter",
		realName: "Cristina Magadán",
		birthDate: new Date(1994, 3, 4),
		height: 1.64,
		country: "es",
		gallery: true,
		versus: ["alana", "ama-blitz"],
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/nissaxter",
			instagram: "https://instagram.com/nissaxter",
			twitter: "https://twitter.com/nissaxter",
			youtube: "https://youtube.com/nissaxter_",
			tiktok: "https://tiktok.com/@nissaxter_",
		},
		clips: [
			{
				text: "No estoy preparando excusas, no soy el xokas, si pierdo, será con dignidad",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=ly7dosYLSt4qYtTB&amp;clip=UgkxJJ3K1UB1MGsxI_WzPxyiQo-hL4YMn9KB&amp;clipt=EI73nAMY88adAw",
			},
			{
				text: "Alana, veo que eres muy bonita y cuqui, pero es que yo soy de barrio",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=yXlw1mJINtozHJh4&amp;clip=UgkxWTeqQT62-L-LYjSBofjx2i5zsxaeHCqf&amp;clipt=EJ_0qwMYs9msAw",
			},
			{
				text: "Una cosa es entrenar en gimnasio, verse bonita, y otra, darse de ostias",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=XXuWc4c5ywxnBHIZ&amp;clip=UgkxptfPo72fI8yntHVo2UfsuyGjpmsfI3js&amp;clipt=ELTnggMY8smDAw",
			},
		],
	},
	{
		id: "carreraaa",
		name: "Carreraaa",
		realName: "Rodrigo Ezequiel Carrera",
		birthDate: new Date(2000, 9, 9),
		height: 1.65,
		country: "ar",
		versus: "agustin-51",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/carreraaa",
			instagram: "https://instagram.com/rodricarreraaa",
			twitter: "http://twitter.com/rodricarreraaa",
			youtube: "http://youtube.com/carreraaa",
			tiktok: "https://tiktok.com/@carreproroblox74",
		},
		clips: [
			{
				text: "El año pasado, la vida me cagó a trompadas y esto me vino como anillo al dedo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=FEfEgIq0ajr1mhAj&amp;clip=UgkxtwjSORg57TZFqKsJBhUB1VqgYvL_W-cH&amp;clipt=EI_dygEY-cTLAQ",
			},
			{
				text: "Con ese bigote de Agustín me dan ganas de pegarle",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=Y_tV3VN01CdHcsJc&amp;clip=Ugkx5U4X6gOIS3cqBerhC8OmebW7fRakNqCM&amp;clipt=ENTvywEYu8fMAQ",
			},
			{
				text: "Tenemos un buen peso para que esto sea una pelea muy divertida",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=277dp_i2cC-DtBSG&amp;clip=Ugkx7iS-4hpvBT1QHGAabmfrVamnMu2IefPX&amp;clipt=ELPH2gEYmJfbAQ",
			},
		],
		rotate: true,
	},
	{
		id: "la-cobra",
		name: "La Cobra",
		realName: "Lautaro Damián del Campo",
		birthDate: new Date(1997, 8, 8),
		height: 1.83,
		country: "ar",
		versus: "guanyar",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/lacobraaa",
			instagram: "https://instagram.com/lautarodelcampo",
			twitter: "https://twitter.com/lautarodeIcampo",
			youtube: "https://youtube.com/@lacobraaa",
			tiktok: "https://tiktok.com/@lacobraaa.9",
		},
		clips: [
			{
				text: "Me gusta pelear en el Bernabeu: El patio de la casa de Messi",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=lZS-HU6R57I7jz1V&amp;clip=Ugkxjm_VBOO_hEVTcaT1iIn1wkqhdSgz0PEz&amp;clipt=EIuTqwIYo4isAg",
			},
			{
				text: "Quiero que la pelea dure nueve minutos",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=7P28IxekBEnX1G1t&amp;clip=UgkxJxXzX5p5WQ-qnTCVSY_yHKLwN1mF_yRt&amp;clipt=ENGdpwIY6ZKoAg",
			},
		],
		rotate: true,
	},
	{
		id: "karchez",
		name: "Karchez",
		realName: "José Carlos Sánchez",
		birthDate: new Date(2000, 7, 4),
		height: 1.84,
		country: "es",
		socials: {
			twitch: "https://twitch.tv/karchez",
			instagram: "https://instagram.com/karchezz",
			twitter: "https://twitter.com/Karchezzz",
			youtube: "https://youtube.com/Karchez",
			tiktok: "https://tiktok.com/@karchez",
		},
		clips: [
			{
				text: "A Will le digo que no toque a Skain. A Skain, me lo pido yo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=Vd5Q9sGrRwCpGGfu&amp;clip=UgkxiWzPv1OLVZmD_T_NH7XTY4QP3beSSc-V&amp;clipt=EMyf9wQYsOf3BA",
			},
			{
				text: "¿Quién crees que es el rival más peligroso? Karchez: Nadie",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=VHpj_R_6DVvmoYCN&amp;clip=UgkxIiWOmEccr40oWJUkQzYVAkjVxLSvG2HU&amp;clipt=EPux-QQY4on6BA",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "peldanyos",
		name: "Peldanyos",
		realName: "Sergio Bolaños",
		birthDate: new Date(1998, 3, 13),
		height: 1.91, // No es seguro
		guard: "Derecha",
		country: "es",
		workout: {
			videoID: "I8R5sQXjpKk",
			thumbnail: "/boxers/workoutThumbnails/peldanyos.webp",
			name: "Peldanyos",
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
				text: "Me los bajaré a todos, decir que no, sería tener mala actitud",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=vloF8mfHMa6viUTK&amp;clip=UgkxDDiYcrums2e6329f6Zi2MveywHF8R-da&amp;clipt=ELTe0gQY1PvTBA",
			},
			{
				text: "No puedo estar más emocionado por el reto, pero no me voy a flipar",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=6DlZeV18DJEPIlT0&amp;clip=Ugkx1VRxwu3liP3LO5E7FxvR97Qy7VHQ-AMy&amp;clipt=EOeKhQUYi4iGBQ",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "aldo-geo",
		name: "Aldo Geo",
		realName: "Aldo Geovanni",
		birthDate: new Date(1996, 9, 14),
		height: 1.79,
		country: "mx",
		socials: {
			twitch: "https://twitch.tv/aldo_geo",
			instagram: "https://instagram.com/_aldogeo_",
			twitter: "https://twitter.com/aldogeotv",
			youtube: "https://youtube.com/aldogeo100",
			tiktok: "https://tiktok.com/@aldo_geo",
		},
		clips: [
			{
				text: "Ni siquiera ha empezado la pelea, y ya estoy sintiendo adrenalina en mi cuerpo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=3ZQKvE88BpT5hswd&amp;clip=UgkxGm-L9MDFvEf3AjwjoGxRAn-2P0mbBcHM&amp;clipt=EICT7QQYvvXtBA",
			},
			{
				text: "Si hablamos de tirar vergazos, yo no le tengo miedo a nada ni a nadie",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=km5i0nh60zfXtwb6&amp;clip=Ugkx1MY5pq1j1Ehe3I_w05O9OZgTCBUlhTBJ&amp;clipt=EJi9ggUYsLKDBQ",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "will",
		name: "Will",
		realName: "Ángelo Valdés",
		birthDate: new Date(2000, 5, 29),
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
				text: "Espero que se acostumbren a la regla del knockout",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=VYSQ4bjl9r_2AWfE&amp;clip=UgkxgdKFyMCvRcN-fj-tuiF1i4KB2msHncZo&amp;clipt=ENuF5wQY3_vnBA",
			},
			{
				text: "César, parepárate para tres minutos mágicos",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=2BO21jfm469U_i_5&amp;clip=UgkxHy3xXDVJdgv9BUaArwgIYrA_ae1M5FIX&amp;clipt=EJ3ipQUYtdemBQ",
			},
		],
	},
	{
		id: "sezar-blue",
		name: "Sezar Blue",
		realName: "César González",
		birthDate: new Date(1973, 7, 29),
		height: 1.77,
		country: "es",
		socials: {
			twitch: "https://twitch.tv/sezarbluelive",
			instagram: "https://instagram.com/sezarblue",
			twitter: "https://twitter.com/soysezarblue",
			youtube: "https://youtube.com/sezarblue",
			tiktok: "https://tiktok.com/@sezar_blue_",
		},
		clips: [
			{
				text: "Me siento el padre de toda la gente que hay...",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=TwzEhzzCIuntT7km&amp;clip=Ugkxpgjoq-dSHfusbcM7joiiJlE6DvAz-O3V&amp;clipt=ENP35AQY6-zlBA",
			},
			{
				text: "¿El vídeo de las dominadas? Si quieres, las hago aquí mismo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=owA_ZlntOIMMBEiG&amp;clip=UgkxRLtIUYYyPRqrRa02tpC26Ppyclg5U2G4&amp;clipt=EMyejQUYl8GOBQ",
			},
			{
				text: "Estaré 60 minutos sudando como una bestia",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=USH-zripT5K2OQtg&amp;clip=UgkxfeafuAmAxWjXfSHLE2rdeuiA51BI93qc&amp;clipt=EPrNlgUYksOXBQ",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "unicornio",
		name: "Unicornio",
		realName: "Germán Usinger",
		birthDate: new Date(1999, 5, 7),
		height: 1.69, // No es seguro
		country: "ar",
		socials: {
			twitch: "https://twitch.tv/unicornio",
			instagram: "https://instagram.com/germanusinger",
			twitter: "https://twitter.com/GermanUsinger",
			youtube: "https://youtube.com/unicornioperro",
			tiktok: "https://tiktok.com/@german.usinger",
		},
		clips: [
			{
				text: "No entendí bien la mecánica, pero se que debo pegarles a ellos. ¿No?",
				url: "https://www.youtube.com/embed/k70W5W5UFjU?si=dlWpIp4dRS8UAagF&amp;clip=UgkxEcgcoJaVcag3z49qN_XpjZv3CHrCJ7fL&amp;clipt=EOqZGRjP6Rk",
			},
			{
				text: "Subite, ¿querés pelear? y hacemos 11 en el rey de la pista",
				url: "https://www.youtube.com/embed/k70W5W5UFjU?si=6ahmVqYOwsI54nme&amp;clip=UgkxwF9bV7tUmg7LbPeFDggtLpogaYq9Y2TA&amp;clipt=EI_dQhjNv0M",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "pelicanger",
		name: "Pelicanger",
		realName: "Angerson Esneider",
		birthDate: new Date(2001, 0, 7),
		height: 1.91,
		country: "co",
		socials: {
			twitch: "https://twitch.tv/pelicanger",
			instagram: "https://instagram.com/pelicanger__",
			twitter: "https://twitter.com/offpeli",
			youtube: "https://youtube.com/Pelicanger",
			tiktok: "https://tiktok.com/@pelicanger.oficial",
		},
		clips: [
			{
				text: "Me emociona mucho, y me los puedo bajar a todos",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=-YCK4KohZDFRnOVT&amp;clip=UgkxQdajCilFEG8GfFfoazDZmwQFHMG3zjW3&amp;clipt=EMHC1gQYqJrXBA",
			},
			{
				text: "Todos están diciendo que me van a partir, pues demuéstrenlo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=JRh3ArHOmnGABJ0f&amp;clip=UgkxevzOvk1Ef_BGIefrB9v2YyRZEvU9a-0B&amp;clipt=EK2nhgUYvPSGBQ",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "roberto-cein",
		name: "RobertoCein",
		realName: "Roberto Sebastián Guadarrama Jiménez",
		birthDate: new Date(1998, 6, 29),
		height: 1.69, // No es seguro
		country: "mx",
		socials: {
			twitch: "https://twitch.tv/robertocein",
			instagram: "https://instagram.com/robertocein",
			twitter: "https://twitter.com/Roberto_Cein",
			youtube: "https://youtube.com/c/robertocein1",
			tiktok: "https://tiktok.com/@roberto_cein",
		},
		clips: [
			{
				text: "Estoy muy emocionado, algunos me sacan dos cabezas, entonces, mi estrategía será sacar aire",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=jjRKCQyop5aK34Ft&amp;clip=UgkxfyqAvmfPS6r6qAFFHvfleqBWQZpj8Zfr&amp;clipt=ELjN4QQY_c_iBA",
			},
			{
				text: "Todos han sido muy amables y algunos se ven muy fuertes, no sé si podré vencerlos",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=E-JCK6-AamolNDky&amp;clip=Ugkxg29Xx8-7eE1qRTNKFuMCb2tZ9KdCzV-a&amp;clipt=EMXi4wQY3dfkBA",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "skain",
		name: "Skain",
		realName: "David Carbó Ferrer",
		birthDate: new Date(1997, 2, 10),
		height: 1.83, // No encontrado
		country: "es",
		socials: {
			twitch: "https://twitch.tv/skain",
			instagram: "https://instagram.com/skain24",
			twitter: "https://twitter.com/skain24",
			youtube: "https://youtube.com/@skain24",
			tiktok: "https://tiktok.com/@skain24",
		},
		workout: {
			videoID: "PUNBQ1_rbuo",
			thumbnail: "/boxers/workoutThumbnails/skain.webp",
			name: "Skain",
		},
		clips: [
			{
				text: "Yo solo voy a decir que Karchez el año pasado se salvó, no diré nada más",
				url: "https://www.youtube.com/embed/k70W5W5UFjU?si=9JQt5c-yDe4uJUfL&amp;clip=UgkxlGr0lw1Xr65CkY4r_CfV18y4JuAVSL7y&amp;clipt=ELj7ORicxTo",
			},
			{
				text: "Estoy muy preparado y muy contento. El Rey de la Pista será un formato que dará mucho de qué hablar",
				url: "https://www.youtube.com/embed/k70W5W5UFjU?si=XAH2OmLeMxvo2Mbd&amp;clip=UgkxyZGxKPtKZdEfTUP21jDFgEV2Ps2dvqfb&amp;clipt=EK3IHxjrqiA",
			},
		],
		versus: "rey-de-la-pista",
	},
	{
		id: "folagor",
		name: "Folagor",
		realName: "Yoel Ramírez Pulido",
		birthDate: new Date(1994, 11, 9),
		height: 1.8,
		country: "es",
		socials: {
			twitch: "https://twitch.tv/folagorlives",
			instagram: "https://instagram.com/yoel__ramirez",
			twitter: "https://twitter.com/FolagoR",
			tiktok: "https://tiktok.com/@folagor_official",
			youtube: "https://youtube.com/Folagor03",
		},
		clips: [
			{
				text: "Aunque tenga un mes de retraso, voy a llegar a su nivel",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=KrpP_rfisr6574lH&amp;clip=UgkxXwT3QIrF_18ubc4LU2t2rn0fSy36XCl9&amp;clipt=EKnl8gQYwdrzBA",
			},
			{
				text: "Empezaré a entrenar y daré todo lo que pueda",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=mVTh4fAevjpOvQiX&amp;clip=UgkxU-0uUkxYVWUrr6wdMw33KgTDlmSecjNm&amp;clipt=ENW19AQYjoD1BA",
			},
			{
				text: "En El Rey de la Pista, el cardio no es importante, es la fuerza",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=4K5VTZUzRoESTtHT&amp;clip=UgkxnYTPVsLLRS3h4sOEdR8--oZxVx01vCum&amp;clipt=EJTyngUYiIqgBQ",
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
		// 		text: "En El Rey de la Pista, el cardio no es importante, es la fuerza",
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
		height: 1.97,
		country: "es",
		versus: "el-mariana",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			instagram: "https://instagram.com/yosoyplex",
			twitter: "https://twitter.com/yosoyplex",
			youtube: "https://youtube.com/YoSoyPlex",
			tiktok: "https://tiktok.com/@yosoyplexx",
		},
		workout: {
			videoID: "svXhWZ1sZJE",
			thumbnail: "/boxers/workoutThumbnails/plex.webp",
			name: "YoSoyPlex",
		},
		clips: [
			{
				text: "No hay chance de que pierda. Soy un psicópata",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=MozNtaEPpcxOOVQv&amp;clip=UgkxwyKEwj17kL8yJ2XVPNMI4dMuq-FdjYuG&amp;clipt=EOP3-QUY--z6BQ",
			},
			{
				text: "¿Se supone que tiene que picar?",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=IKDAgh-db2KYOQGN&amp;clip=UgkxCVitcQsAn1I5wO4GlZY_kMcwLKaOI7HI&amp;clipt=EMmf7wUY4ZTwBQ",
			},
			{
				text: "Hablaré en el ring. No tengo nada que decir",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=SeS4CM-dAmsHs1uC&amp;clip=UgkxSCdNOmvFVB74IC_D56vglujXVWtVI60Q&amp;clipt=ELL72QUYvevaBQ",
			},
		],
	},
	{
		id: "viruzz",
		name: "Viruzz",
		realName: "Víctor Mélida Cambra",
		birthDate: new Date(1992, 4, 1),
		height: 1.82,
		country: "es",
		versus: "shelao",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/byviruzz",
			instagram: "https://instagram.com/victormelida",
			twitter: "https://twitter.com/byViruZz",
			youtube: "https://youtube.com/byViruZz",
			tiktok: "https://tiktok.com/@victormelida",
		},
		clips: [
			{
				text: "Nos apostamos los cinturones de la Velada, porque el tuyo no te lo mereces",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=z8B-GDOrYBOoTASM&amp;clip=UgkxfYWnQtr1SDApiBtm-EBvS352rnz22bz0&amp;clipt=EJGo_gMYrbX_Aw",
			},
			{
				text: "Shelao, te enfrentas a mi redención, no hay manera de que ganes",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=FSIqUUhiWxGpq-jH&amp;clip=UgkxO_tFZ74OirLeHBIu0xMnvHEcWtYNs7fB&amp;clipt=EMSYjwQY3I2QBA",
			},
			{
				text: "Te propongo que sea el primer combate de la Velada sin casco",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=yTzZdAMlWzH3H6Je&amp;clip=UgkxuLDeLsfhwMN1DgJoLSThw_nNNrsLFVGF&amp;clipt=EK-Y_QMYoaj-Aw",
			},
		],
	},
	{
		id: "alana",
		name: "Alana",
		realName: "Alana Flores",
		birthDate: new Date(2000, 11, 15),
		height: 1.7,
		country: "mx",
		versus: ["nissaxter", "zeling"],
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		gallery: true,
		socials: {
			twitch: "https://twitch.tv/alanalarana",
			instagram: "https://instagram.com/alanafloresf",
			twitter: "https://twitter.com/alanafloresf",
			youtube: "https://youtube.com/alanalarana",
			tiktok: "https://tiktok.com/@alanatwitch",
		},
		workout: {
			videoID: "FXzCBTRWouA",
			thumbnail: "/boxers/workoutThumbnails/alana.webp",
			name: "Alana",
		},
		clips: [
			{
				text: "No me siento nerviosa, sino ansiosa para que comience ya",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=HOIBR6_dVZpkcXvx&amp;clip=Ugkx0Mw7RT8n-aa7XwatTTg7zG0y8x14BMiY&amp;clipt=EKXN9wIYtJr4Ag",
			},
			{
				text: "Siento que Nissaxter viene con más motivación y a Zeling la noto con miedo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=WT3jaBHM1cKZPSq_&amp;clip=Ugkx06ew5d2CB1oLDIc9HPOzTmR5tDi5VHi-&amp;clipt=EKvuhAMYoY6GAw",
			},
			{
				text: "Sé del combate meses antes, pero no me puse a entrenar porque soy justa y honesta",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=tVGA8PKZsOc5WM13&amp;clip=UgkxnCHow_qxDh6_zAdO5Tirg2UryjIgpNQi&amp;clipt=EImekwMYkcWTAw",
			},
		],
		rotate: true,
	},
	{
		id: "ama-blitz",
		name: "Amablitz",
		realName: "Amairani Garza Alonso",
		birthDate: new Date(1995, 2, 1),
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
			youtube: "https://youtube.com/amablitz",
			tiktok: "https://tiktok.com/@amablitz",
		},
		clips: [
			{
				text: "Si hablamos de ventajas, yo soy la que menos ha practicado de todas",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=BKaoMV8KgCglctOV&amp;clip=UgkxP_fhKdpqIa-DNHn21UofXxOS6dcJ46iH&amp;clipt=EMuOlQMYiOmVAw",
			},
			{
				text: "Voy a entrenar con Jhonny González, que es un campeón mundial",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=GhcMIvihto9VUMe4&amp;clip=Ugkx7Cx_kusf73FDmnSXKZFpkSagGjhzykoR&amp;clipt=ELz5ogMYpuGjAw",
			},
		],
		rotate: true,
	},
	{
		id: "agustin-51",
		name: "Agustin51",
		realName: "José Agustín Peréz Nuñéz",
		birthDate: new Date(2000, 10, 18),
		height: 1.7,
		country: "es",
		versus: "carreraaa",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/agustin51",
			instagram: "https://instagram.com/imagus51",
			twitter: "https://twitter.com/ImAgus51",
			youtube: "https://youtube.com/Agustin5111",
			tiktok: "https://tiktok.com/@agustin51",
		},
		clips: [
			{
				text: "Después del combate, nos podemos dar un abrazo porque lo importante es dar un buen ejemplo",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=ZDk9wPbAuoBtWMzX&amp;clip=UgkxJszPGolZaON3QjSuzzh5TP2luW9qLX4W&amp;clipt=EKerzQEY5IXOAQ",
			},
			{
				text: "Siento que soy un chaval con mucha energía, pero cuando me ponen la mano encima, me caliento",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=1rqjV4PxDUxC7rko&amp;clip=UgkxRZ3cq1lEgLDe-NizURNpwN3vPxowiITS&amp;clipt=EI3L0AEY97LRAQ",
			},
			{
				text: "Si a mi me tienen que nerfear en los torneos por algo será, espero no me nerfeen en la velada",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=-M2nhK1GQwhv_UqB&amp;clip=UgkxHCkkSU67P09o20vM1ZCrohVvOYDmVIh2&amp;clipt=EIjy0QEYmcfSAQ",
			},
		],
	},
	{
		id: "guanyar",
		name: "Guanyar",
		realName: "Diego Iglesias",
		birthDate: new Date(1998, 8, 28),
		height: 1.88,
		country: "es",
		versus: "la-cobra",
		guard: "Izquierda", // encontrado
		reach: 168, // No encontrado
		socials: {
			twitch: "https://twitch.tv/guanyar",
			instagram: "https://instagram.com/guanyarr",
			twitter: "https://twitter.com/guanyarr",
			youtube: "https://youtube.com/GUANYAR",
			tiktok: "https://tiktok.com/@guanyar",
		},
		clips: [
			{
				text: "Era un sueño un día subirme aquí, muchas gracias a todos por venir",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=jMTGZCedLHl9HSsS&amp;clip=UgkxMc_uxsDRteyleobjWTLU7VzlM74PVEul&amp;clipt=EMmJiwIYrtmLAg",
			},
			{
				text: "Me van a perdonar, pero creo que es el mejor combate de toda la Velada",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=tmqKR0giCuBHUFHi&amp;clip=UgkxoHOE311rgi9xvpr3WSU0k3yaMVx7N8Lm&amp;clipt=EKntjAIYi62NAg",
			},
			{
				text: "Es un rival duro y me gustó mucho, fue muy intenso desde el primer momento",
				url: "https://www.youtube.com/embed/ct0Hr6zYZGU?si=jYx2cJ103X0MPE5r&amp;clip=UgkxRpobly-wM3CN1F8FuuMJ9Q2GLrFNHTuZ&amp;clipt=EOKXlwIY-oyYAg",
			},
		],
		rotate: true,
	},
] as const)
