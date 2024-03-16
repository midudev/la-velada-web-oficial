export interface Combat {
	id: string
	boxers: string[] // es un string porque hace referencia a los ids de los boxeadores
}

export const COMBATS: Combat[] = [
	{
		id: "1",
		boxers: ["agustin-51", "carreraaa"],
	},
	{
		id: "2",
		boxers: ["guanyar", "la-cobra"],
	},
	{
		id: "3",
		boxers: ["zeling", "alana", "nissaxter", "ama-blitz"],
	},
	{
		id: "4",
		boxers: ["viruzz", "shelao"],
	},
	{
		id: "5",
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
		id: "6",
		boxers: ["el-mariana", "plex"],
	},
]
