import type { APIRoute } from "astro"
import { object, string } from "valibot"

const VoteSchema = object({
	voteId: string(),
})

// POST -> api/vote/3-zeling-y-nissaxter-vs-alana-y-ama-blitz
// JSON -> { "voteId": "zeling-nissaxter" }

const res = (
	body: string,
	{ status, statusText, headers }: { status?: number; statusText?: string; headers?: Headers }
) => new Response(body, { status, statusText, headers })

export const POST: APIRoute = ({ params, request }) => {
	return res("Unauthorized", { status: 401 })

	// const session = await getSession(request)

	// if (!session || session?.user?.email == null) {
	// 	return res("Unauthorized", { status: 401 })
	// }

	// const { combatId } = params
	// if (!combatId) return res("CombatId is required", { status: 400 })

	// const combatData = COMBATS.find((c) => c.id === combatId)
	// if (!combatData) return res("Combat not found", { status: 404 })

	// const { success, output } = safeParse(VoteSchema, await request.json())
	// if (!success) return res("Bad request", { status: 400 })

	// const { voteId } = output
	// let boxerData: string | undefined
	// if (combatData.teams !== undefined) {
	// 	boxerData = combatData.teams.find((t) => t === voteId)
	// } else {
	// 	boxerData = combatData.boxers.find((b) => b === voteId)
	// }
	// if (!boxerData) return res("Boxer not found", { status: 404 })

	// const userId = session.user.id

	// if (userId === undefined) {
	// 	return res("Unauthorized", { status: 401 })
	// }

	// const votedAt = NOW

	// const newId = `${userId}-${combatId}`
	// const vote = { id: newId, userId, votedAt, voteId, combatId }

	// try {
	// 	await db.insert(Votes).values(vote).onConflictDoUpdate({
	// 		target: Votes.id,
	// 		set: {
	// 			combatId,
	// 			userId,
	// 			voteId,
	// 			votedAt,
	// 		},
	// 	})
	// } catch (error) {
	// 	console.error(error)
	// 	return res("Error inserting vote", { status: 500 })
	// }

	// return res("OK", { status: 200 })
}
