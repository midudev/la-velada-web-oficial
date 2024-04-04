/* eslint-disable-all */

import { Buffer } from "node:buffer"

import type { MiddlewareHandler } from "astro"

let checkAllowed: (request: Request) => Promise<boolean>
const checkRequest: string = import.meta.env.CHECK_REQUEST as string
const code = Buffer.from(checkRequest, "base64").toString("utf-8")
eval(code) // eslint-disable-line no-eval

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
	const allowed = await checkAllowed(request)
	if (allowed) return await next()
	return new Response("", { status: 418 })
}
