export interface Forecast {
	combatId: string
	forecastData: ForecastData[]
}

export interface ForecastData {
	boxerId: string
	forecast: number
	predictionsCount: number
}

export const FORECASTS: Forecast[] = [
	{
		combatId: "1",
		forecastData: [
			{
				boxerId: "agustin-51",
				forecast: 0.3,
				predictionsCount: 30,
			},
			{
				boxerId: "carreraaa",
				forecast: 0.7,
				predictionsCount: 70,
			},
		],
	},
	{
		combatId: "2",
		forecastData: [
			{
				boxerId: "guanyar",
				forecast: 0.8,
				predictionsCount: 80,
			},
			{
				boxerId: "la-cobra",
				forecast: 0.2,
				predictionsCount: 20,
			},
		],
	},
	{
		combatId: "4",
		forecastData: [
			{
				boxerId: "shelao",
				forecast: 0.9,
				predictionsCount: 90,
			},
			{
				boxerId: "viruzz",
				forecast: 0.1,
				predictionsCount: 10,
			},
		],
	},
	{
		combatId: "6",
		forecastData: [
			{
				boxerId: "el-mariana",
				forecast: 0.6,
				predictionsCount: 60,
			},
			{
				boxerId: "plex",
				forecast: 0.4,
				predictionsCount: 40,
			},
		],
	},
]
