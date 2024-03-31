import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	server: {
		TWITCH_CLIENT_ID: z.string().min(1),
		TWITCH_CLIENT_SECRET: z.string().min(1),
		AUTH_SECRET: z.string().min(1),
		AUTH_TRUST_HOST: z.boolean().default(true),
	},
	runtimeEnv: process.env,
})
