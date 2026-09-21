import { NextRequest, NextResponse } from 'next/server'
import { sanitizePayload, validatePayloadSize, containsSqlInjection } from './sanitize'
import { checkRateLimit, RateLimitOptions } from './rateLimit'

/**
 * Security Guard Wrapper for API Route Handlers
 * Enforces rate limiting, payload size validation, and input sanitization.
 */
export async function secureApiHandler<T = any>(
  req: NextRequest,
  action: string,
  options?: {
    rateLimit?: RateLimitOptions
    maxPayloadBytes?: number
    allowSqlPatterns?: boolean
  }
): Promise<{ success: boolean; data?: T; response?: NextResponse }> {
  // 1. Check Rate Limit
  const rateLimitOpts = options?.rateLimit || { limit: 60, windowSeconds: 60 }
  const rateCheck = checkRateLimit(req, action, rateLimitOpts)
  if (!rateCheck.allowed) {
    return {
      success: false,
      response: NextResponse.json(
        { error: `Rate limit exceeded. Please wait ${rateCheck.resetSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetSeconds) } }
      )
    }
  }

  // 2. Parse and validate JSON payload for mutating methods
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      const rawBody = await req.json()

      // Validate payload size
      if (!validatePayloadSize(rawBody, options?.maxPayloadBytes)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Payload Too Large: Request body exceeds limit.' },
            { status: 413 }
          )
        }
      }

      // Check for SQL Injection patterns if not explicitly allowed
      if (!options?.allowSqlPatterns) {
        const bodyStr = JSON.stringify(rawBody)
        if (containsSqlInjection(bodyStr)) {
          console.warn(`[Security Alert] Potential SQL Injection blocked on ${action}`)
          return {
            success: false,
            response: NextResponse.json(
              { error: 'Security Violation: Malicious payload pattern detected.' },
              { status: 400 }
            )
          }
        }
      }

      const sanitizedData = sanitizePayload(rawBody) as T
      return { success: true, data: sanitizedData }
    } catch {
      return {
        success: false,
        response: NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 })
      }
    }
  }

  return { success: true }
}
