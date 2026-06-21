import { betterAuth } from 'better-auth'

const secret =
  import.meta.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || 'astro-local-dev-secret'
const baseURL =
  import.meta.env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000'

export const auth = betterAuth({
  secret,
  baseURL,
  socialProviders: {
    twitch: {
      clientId: import.meta.env.TWITCH_CLIENT_ID,
      clientSecret: import.meta.env.TWITCH_CLIENT_SECRET,
    },
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    },
  },
})
