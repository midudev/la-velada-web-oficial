import Twitch from "next-auth/providers/twitch"
import { defineConfig } from 'auth-astro'

export default defineConfig({
	providers: [
		Twitch({
			clientId: import.meta.env.TWITCH_CLIENT_ID,
			clientSecret: import.meta.env.TWITCH_CLIENT_SECRET,
		}),
	],
})