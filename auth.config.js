import Twitch from "@auth/core/providers/twitch"
import { defineConfig } from "auth-astro"
import { env } from "@/auth"

export default defineConfig({
	providers: [
		Twitch({
			clientId: env.TWITCH_CLIENT_ID,
			clientSecret: env.TWITCH_CLIENT_SECRET,
		}),
	],
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub,
			},
		}),
	},
})
