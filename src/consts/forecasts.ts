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
