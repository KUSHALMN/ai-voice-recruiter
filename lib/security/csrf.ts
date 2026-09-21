import { NextRequest, NextResponse } from 'next/server'

/**
 * Cross-Site Request Forgery (CSRF) Protection Utility
 * Enforces Origin and Referer validation for state-modifying HTTP methods.
 */

const ALLOWED_ORIGINS = [
  process.env.NEXTAUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
].filter(Boolean) as string[]

/**
 * Validates request Origin / Referer to prevent Cross-Site Request Forgery
 */
export function validateCsrfOrigin(request: NextRequest): boolean {
  // Safe methods (GET, HEAD, OPTIONS) do not alter server state
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true
  }

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  // If origin header is present, verify against allowed origins
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.some(allowed => {
      try {
        const allowedUrl = new URL(allowed)
        const originUrl = new URL(origin)
        return originUrl.origin === allowedUrl.origin
      } catch {
        return false
      }
    })
    return isAllowed
  }

  // If no origin, check referer header
  if (referer) {
    const isAllowed = ALLOWED_ORIGINS.some(allowed => {
      try {
        const allowedUrl = new URL(allowed)
        const refererUrl = new URL(referer)
        return refererUrl.origin === allowedUrl.origin
      } catch {
        return false
      }
    })
    return isAllowed
  }

  // Same-site requests in certain headless or mobile contexts may lack both,
  // allow if host header matches internal host
  const host = request.headers.get('host')
  return Boolean(host && (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('vercel.app')))
}

/**
 * Middleware / Route helper that returns a 403 Forbidden response if CSRF check fails
 */
export function csrfGuard(request: NextRequest): NextResponse | null {
  if (!validateCsrfOrigin(request)) {
    console.warn(`[Security Alert] CSRF check failed for ${request.method} on ${request.nextUrl.pathname}`)
    return NextResponse.json(
      { error: 'Forbidden: Invalid or untrusted request origin (CSRF protection)' },
      { status: 403 }
    )
  }
  return null
}
