import type { APIRoute } from "astro"
import { COMBATS } from "@/consts/combats"
import { FORECASTS } from "@/consts/forecasts"

export const prerender = false

export const GET: APIRoute = ({ url }) => {
	const combatId = url.searchParams.get("id")

	const combat = COMBATS.find((combat) => combat.id === (combatId as string))
	if (!combat) {
		return new Response(JSON.stringify("Combat Not found"), { status: 404 })
	}
	const forecast = FORECASTS.find((forecast) => forecast.combatId === (combatId as string))

	if (!forecast) {
		return new Response(JSON.stringify("Forecast Not found"), { status: 404 })
	}

	return new Response(JSON.stringify(forecast), {
		headers: {
			"content-type": "application/json",
		},
	})
}
