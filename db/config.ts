import { column, defineDb } from "astro:db"

const VoteSelections = {
	columns: {
		id: column.text({ primaryKey: true }),
	},
}

const Votes = {
	columns: {
		id: column.text({ primaryKey: true }), // `userId-combatId`
		combatId: column.text(),
		userId: column.text(),
		voteId: column.text({ references: () => VoteSelections.columns.id }),
		votedAt: column.date(),
	},
}

const Cache = {
	columns: {
		id: column.text({ primaryKey: true }),
		data: column.json(),
		timestamp: column.date(),
	},
}

// https://astro.build/db/config
export default defineDb({
	tables: {
		Cache,
		VoteSelections,
		Votes,
	},
})
