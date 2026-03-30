import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock database to force memory fallback
vi.mock('@/lib/database', () => ({
  turso: {
    execute: vi.fn().mockRejectedValue(new Error('DB not available')),
  },
}))

import { checkRateLimit, getClientIp, rateLimitHeaders } from '../rate-limiter'

describe('checkRateLimit (memory fallback)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow requests within the limit', async () => {
    const result = await checkRateLimit('test-allow', { maxRequests: 5, windowMs: 60000 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
    expect(result.limit).toBe(5)
  })

  it('should block requests exceeding the limit', async () => {
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('test-block', { maxRequests: 3, windowMs: 60000 })
    }
    const result = await checkRateLimit('test-block', { maxRequests: 3, windowMs: 60000 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset after the time window expires', async () => {
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('test-reset', { maxRequests: 3, windowMs: 1000 })
    }
    const blocked = await checkRateLimit('test-reset', { maxRequests: 3, windowMs: 1000 })
    expect(blocked.allowed).toBe(false)

    vi.advanceTimersByTime(1001)

    const allowed = await checkRateLimit('test-reset', { maxRequests: 3, windowMs: 1000 })
    expect(allowed.allowed).toBe(true)
    expect(allowed.remaining).toBe(2)
  })

  it('should track different keys independently', async () => {
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('key-a', { maxRequests: 3, windowMs: 60000 })
    }
    const blockedA = await checkRateLimit('key-a', { maxRequests: 3, windowMs: 60000 })
    expect(blockedA.allowed).toBe(false)

    const allowedB = await checkRateLimit('key-b', { maxRequests: 3, windowMs: 60000 })
    expect(allowedB.allowed).toBe(true)
  })

  it('should decrement remaining count correctly', async () => {
    const r1 = await checkRateLimit('test-count', { maxRequests: 5, windowMs: 60000 })
    expect(r1.remaining).toBe(4)

    const r2 = await checkRateLimit('test-count', { maxRequests: 5, windowMs: 60000 })
    expect(r2.remaining).toBe(3)

    const r3 = await checkRateLimit('test-count', { maxRequests: 5, windowMs: 60000 })
    expect(r3.remaining).toBe(2)
  })
})

describe('getClientIp', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getClientIp(request)).toBe('1.2.3.4')
  })

  it('should extract IP from x-real-ip header', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.0.0.1' },
    })
    expect(getClientIp(request)).toBe('10.0.0.1')
  })

  it('should return unknown when no IP headers present', () => {
    const request = new Request('http://localhost')
    expect(getClientIp(request)).toBe('unknown')
  })

  it('should prefer x-forwarded-for over x-real-ip', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4', 'x-real-ip': '10.0.0.1' },
    })
    expect(getClientIp(request)).toBe('1.2.3.4')
  })
})

describe('rateLimitHeaders', () => {
  it('should return correct header format', () => {
    const result = { allowed: true, limit: 60, remaining: 55, resetTime: 1711800000000 }
    const headers = rateLimitHeaders(result)

    expect(headers['X-RateLimit-Limit']).toBe('60')
    expect(headers['X-RateLimit-Remaining']).toBe('55')
    expect(headers['X-RateLimit-Reset']).toBeDefined()
  })

  it('should clamp remaining to 0 when negative', () => {
    const result = { allowed: false, limit: 3, remaining: -1, resetTime: 1711800000000 }
    const headers = rateLimitHeaders(result)
    expect(headers['X-RateLimit-Remaining']).toBe('0')
  })
})
