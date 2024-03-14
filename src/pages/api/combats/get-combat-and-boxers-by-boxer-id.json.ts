import { BOXERS } from "@/consts/boxers"
import { COMBATS } from "@/consts/combats"
import type { APIRoute } from "astro"
export const prerender = false

export const GET: APIRoute = ({ url }) => {
	const boxerId = url.searchParams.get("boxerId")

	const combat = COMBATS.find((combat) => combat.boxers.includes(boxerId as string))
	if (combat) {
		const boxers = BOXERS.filter((boxer) => combat.boxers.includes(boxer.id))
		return new Response(JSON.stringify({ combat, boxers }), {
			headers: {
				"content-type": "application/json",
			},
		})
	} else {
		return new Response(JSON.stringify("Not found"), { status: 404 })
	}
}
