import { auth } from "@/lib/auth"
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerendered routes (e.g. combates, 404) are built statically and have no
  // real request, so reading `context.request.headers` there is meaningless
  // and makes Astro emit a warning. Skip the session lookup for them.
  if (context.isPrerendered) {
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  const session = await auth.api.getSession({
    headers: context.request.headers,
  })

  if (session) {
    context.locals.user = session.user
    context.locals.session = session.session
  } else {
    context.locals.user = null
    context.locals.session = null
  }

  return next()
})
