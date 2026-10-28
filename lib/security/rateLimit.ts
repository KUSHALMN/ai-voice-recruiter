import { NextRequest } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory token/sliding-window bucket with bounded size (max 10,000 keys)
const rateLimitMap = new Map<string, RateLimitRecord>()
const MAX_RATE_LIMIT_ENTRIES = 10000

// Periodically clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now()
    rateLimitMap.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitMap.delete(key)
      }
    })
  }, 5 * 60 * 1000)
  if (timer && typeof (timer as any).unref === 'function') {
    (timer as any).unref()
  }
}

export interface RateLimitOptions {
  limit: number          // Max requests allowed
  windowSeconds: number  // Time window in seconds
  identifier?: string    // Custom identifier (e.g. user ID, email)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetSeconds: number
}

/**
 * Extract client IP address from Next.js request headers
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim()
    if (firstIp) return firstIp
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return '127.0.0.1'
}

/**
 * Checks and increments rate limit for the given request and action scope.
 */
export function checkRateLimit(
  request: NextRequest,
  action: string,
  options: RateLimitOptions = { limit: 30, windowSeconds: 60 }
): RateLimitResult {
  const ip = options.identifier || getClientIp(request)
  const key = `${action}:${ip}`
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      const oldestKey = rateLimitMap.keys().next().value
      if (oldestKey) rateLimitMap.delete(oldestKey)
    }

    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000)
    }
  }

  if (record.count >= options.limit) {
    const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000))
    return {
      allowed: false,
      remaining: 0,
      resetSeconds
    }
  }

  record.count += 1
  const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000))
  return {
    allowed: true,
    remaining: options.limit - record.count,
    resetSeconds
  }
}
