export interface Forecast {
	combatId: string
	forecastData: ForecastData[]
}

export interface ForecastData {
	boxerId: string
	forecast: number
	predictionsCount: number
}
