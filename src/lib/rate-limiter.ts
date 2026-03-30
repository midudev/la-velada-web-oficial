import { turso } from '@/lib/database'

interface RateLimiterOptions {
  windowMs: number
  maxRequests: number
}

const DEFAULT_OPTIONS: RateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
}

// In-memory fallback for when DB is unavailable
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function checkRateLimit(
  key: string,
  options: Partial<RateLimiterOptions> = {},
): Promise<{ allowed: boolean; limit: number; remaining: number; resetTime: number }> {
  const { windowMs, maxRequests } = { ...DEFAULT_OPTIONS, ...options }

  try {
    return await checkRateLimitDb(key, windowMs, maxRequests)
  } catch {
    return checkRateLimitMemory(key, windowMs, maxRequests)
  }
}

async function checkRateLimitDb(
  key: string,
  windowMs: number,
  maxRequests: number,
): Promise<{ allowed: boolean; limit: number; remaining: number; resetTime: number }> {
  const now = Date.now()

  // Clean expired entries periodically
  await turso.execute({
    sql: 'DELETE FROM rate_limits WHERE reset_time < ?',
    args: [now],
  })

  // Get current entry
  const result = await turso.execute({
    sql: 'SELECT count, reset_time FROM rate_limits WHERE key = ?',
    args: [key],
  })

  if (result.rows.length === 0 || (result.rows[0].reset_time as number) < now) {
    // New or expired entry
    const resetTime = now + windowMs
    await turso.execute({
      sql: 'INSERT OR REPLACE INTO rate_limits (key, count, reset_time) VALUES (?, 1, ?)',
      args: [key, resetTime],
    })
    return { allowed: true, limit: maxRequests, remaining: maxRequests - 1, resetTime }
  }

  const currentCount = (result.rows[0].count as number) + 1
  const resetTime = result.rows[0].reset_time as number

  await turso.execute({
    sql: 'UPDATE rate_limits SET count = ? WHERE key = ?',
    args: [currentCount, key],
  })

  if (currentCount > maxRequests) {
    return { allowed: false, limit: maxRequests, remaining: 0, resetTime }
  }

  return { allowed: true, limit: maxRequests, remaining: maxRequests - currentCount, resetTime }
}

function checkRateLimitMemory(
  key: string,
  windowMs: number,
  maxRequests: number,
): { allowed: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || now > entry.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, limit: maxRequests, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  entry.count++

  if (entry.count > maxRequests) {
    return { allowed: false, limit: maxRequests, remaining: 0, resetTime: entry.resetTime }
  }

  return { allowed: true, limit: maxRequests, remaining: maxRequests - entry.count, resetTime: entry.resetTime }
}

export function rateLimitHeaders(result: { limit: number; remaining: number; resetTime: number }): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  }
}
