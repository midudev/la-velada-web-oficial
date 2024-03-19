export interface Combat {
	id: string
	boxers: string[] // es un string porque hace referencia a los ids de los boxeadores
	number: number
}

export const COMBATS: Combat[] = [
	{
		id: "1-agustin-51-vs-carreraaa",
		number: 1,
		boxers: ["agustin-51", "carreraaa"],
	},
	{
		id: "2-guanyar-vs-la-cobra",
		number: 2,
		boxers: ["guanyar", "la-cobra"],
	},
	{
		id: "3-zeling-y-nissaxter-vs-alana-y-ama-blitz",
		number: 3,
		boxers: ["zeling", "alana", "nissaxter", "ama-blitz"],
	},
	{
		id: "4-viruzz-vs-shelao",
		number: 4,
		boxers: ["viruzz", "shelao"],
	},
	{
		id: "5-rey-de-la-pista",
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
	},
	{
		id: "6-el-mariana-vs-plex",
		number: 6,
		boxers: ["el-mariana", "plex"],
	},
]
