export interface Combat {
	id: string
	boxers: string[] // es un string porque hace referencia a los ids de los boxeadores
	number: number
	titleSize: [number, number]
	teams?: string[]
}

export const REY_DE_LA_PISTA_ID = "5-rey-de-la-pista"
export const COMBATS: Combat[] = [
	{
		id: "1-agustin-51-vs-carreraaa",
		number: 1,
		boxers: ["agustin-51", "carreraaa"],
		titleSize: [1920, 1012],
	},
	{
		id: "2-guanyar-vs-la-cobra",
		number: 2,
		boxers: ["guanyar", "la-cobra"],
		titleSize: [1920, 927],
	},
	{
		id: "3-zeling-y-nissaxter-vs-alana-y-ama-blitz",
		number: 3,
		boxers: ["zeling", "alana", "nissaxter", "ama-blitz"],
		teams: ["zeling-nissaxter", "alana-ama-blitz"],
		titleSize: [1525, 1525],
	},
	{
		id: "4-viruzz-vs-shelao",
		number: 4,
		boxers: ["viruzz", "shelao"],
		titleSize: [1623, 1077],
	},
	{
		id: REY_DE_LA_PISTA_ID,
		number: 5,
		boxers: [
			"roberto-cein",
			"aldo-geo",
			"folagor",
			"karchez",
			"pelicanger",
			"peldanyos",
			"unicornio",
			"skain",
			"sezar-blue",
			"will",
		],
		titleSize: [1185, 1139],
	},
	{
		id: "6-el-mariana-vs-plex",
		number: 6,
		boxers: ["el-mariana", "plex"],
		titleSize: [1920, 950],
	},
]
