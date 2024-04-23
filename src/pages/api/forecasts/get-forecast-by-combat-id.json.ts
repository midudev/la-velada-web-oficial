import type { APIRoute } from "astro"
import { Cache, Votes, count, db, eq } from "astro:db"

import { COMBATS } from "@/consts/combats"

const CACHE_TIME = 1000 * 60 * 10 // 10 minutes

export const GET: APIRoute = async ({ url }) => {
	const combatId = url.searchParams.get("id")

	// 1. validar que el combatId nos lo pasan y que es un string
	if (!combatId || typeof combatId !== "string") {
		return new Response(JSON.stringify({ error: "Missing required combat id" }), { status: 400 })
	}

	// 2. validar que el combatId existe en la lista de combates
	const combat = COMBATS.find((combat) => combat.id === combatId)
	if (!combat) {
		return new Response(JSON.stringify({ error: "Combat Not found" }), { status: 404 })
	}

	// 3. comprobar en la cache, que tenemos el pronóstico
	// guardado.
	const cache = await db
		.select({ data: Cache.data, timestamp: Cache.timestamp })
		.from(Cache)
		.where(eq(Cache.id, combatId))

	if (cache.length) {
		const { data, timestamp } = cache[0]
		const hasExpired = Date.now() > timestamp.getTime() + CACHE_TIME

		if (!hasExpired) {
			return new Response(JSON.stringify({ data, timestamp }))
		}
	}

	// 4. Vamos a llamar a la base de datos para obtener el pronóstico
	const votes = await db
		.select({ voteId: Votes.voteId, count: count() })
		.from(Votes)
		.groupBy(Votes.voteId)
		.where(eq(Votes.combatId, combatId))

	// 5. percentage
	const percentageVotes: Record<string, number> = {}
	const totalVotes = votes.reduce((acc, { count }) => acc + count, 0)

	votes.forEach(({ voteId, count }) => {
		percentageVotes[voteId] = (count / totalVotes) * 100
	})

	// 6 Guardar en la cache con el combatId
	await db
		.insert(Cache)
		.values({
			id: combatId,
			data: percentageVotes,
			timestamp: new Date(),
		})
		.onConflictDoUpdate({
			target: Cache.id,
			set: {
				data: percentageVotes,
				timestamp: new Date(),
			},
		})

	return new Response(JSON.stringify({ percentageVotes }))
}
