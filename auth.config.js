import Twitch from "@auth/core/providers/twitch"
import { defineConfig } from "auth-astro"

export default defineConfig({
	providers: [
		Twitch({
			clientId: import.meta.env.TWITCH_CLIENT_ID,
			clientSecret: import.meta.env.TWITCH_CLIENT_SECRET,
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.preferred_username,
					email: profile.email,
					image: profile.picture,
				}
			},

		}),
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id
			}
			return session
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				delete token.sub
			}
			return token
		}
	}

})
