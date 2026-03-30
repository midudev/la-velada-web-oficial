interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimiterOptions {
  windowMs: number
  maxRequests: number
}

// In-memory store. Note: in serverless environments (e.g. Vercel), each
// function instance has its own store, so rate limiting is best-effort.
// For stricter enforcement, consider using an external store like Vercel KV.
const store = new Map<string, RateLimitEntry>()

const DEFAULT_OPTIONS: RateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
}

function cleanExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key)
    }
  }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function checkRateLimit(
  key: string,
  options: Partial<RateLimiterOptions> = {},
): { allowed: boolean; limit: number; remaining: number; resetTime: number } {
  const { windowMs, maxRequests } = { ...DEFAULT_OPTIONS, ...options }
  const now = Date.now()

  // Periodic cleanup
  if (store.size > 10000) {
    cleanExpiredEntries()
  }

  const entry = store.get(key)

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, limit: maxRequests, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  entry.count++

  if (entry.count > maxRequests) {
    return { allowed: false, limit: maxRequests, remaining: 0, resetTime: entry.resetTime }
  }

  return { allowed: true, limit: maxRequests, remaining: maxRequests - entry.count, resetTime: entry.resetTime }
}

export function rateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  }
}
