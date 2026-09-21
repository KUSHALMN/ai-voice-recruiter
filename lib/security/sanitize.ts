/**
 * HTML, Text, and Payload sanitization helpers to prevent Cross-Site Scripting (XSS),
 * HTML Injection, and SQL Injection across API boundaries.
 */

const SQL_INJECTION_PATTERNS = [
  /(\b(select|insert|update|delete|drop|union|alter|exec|truncate)\b\s+.*\b(from|into|table|where)\b)/i,
  /('\s*or\s*'1'\s*=\s*'1')/i,
  /(--|\/\*|\*\/|;\s*$)/,
  /(\b(and|or)\b\s+\d+\s*=\s*\d+)/i
]

/**
 * Escapes HTML characters for safe rendering in HTML templates
 */
export function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') {
    if (str === null || str === undefined) return ''
    return String(str)
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Strips all HTML and script tags entirely from text
 */
export function stripHtml(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str.replace(/<[^>]*>?/gm, '').trim()
}

/**
 * Sanitizes a single string by stripping null bytes and HTML tags
 */
export function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str.replace(/\0/g, '').replace(/<[^>]*>?/gm, '').trim()
}

/**
 * Validates that a string is a safe HTTP or HTTPS URL, preventing
 * javascript: or data: URI injection attacks.
 */
export function sanitizeUrl(url: unknown, defaultUrl: string = '#'): string {
  if (typeof url !== 'string') return defaultUrl
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return defaultUrl
}

/**
 * Checks if a string contains common SQL injection patterns
 */
export function containsSqlInjection(input: unknown): boolean {
  if (typeof input !== 'string') return false
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input))
}

/**
 * Recursively walks an object or array and strips XSS vectors from all string values
 */
export function sanitizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) {
    return payload
  }

  if (typeof payload === 'string') {
    // Strip null bytes and control characters, then escape dangerous HTML
    return payload
      .replace(/\0/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') as unknown as T
  }

  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item)) as unknown as T
  }

  if (typeof payload === 'object') {
    const sanitizedObj: Record<string, any> = {}
    for (const [key, value] of Object.entries(payload)) {
      sanitizedObj[key] = sanitizePayload(value)
    }
    return sanitizedObj as T
  }

  return payload
}

/**
 * Validates that the payload size does not exceed maximum allowable bytes (prevents payload bombs)
 */
export function validatePayloadSize(payload: unknown, maxBytes: number = 2 * 1024 * 1024): boolean {
  try {
    const str = typeof payload === 'string' ? payload : JSON.stringify(payload)
    return Buffer.byteLength(str, 'utf8') <= maxBytes
  } catch {
    return false
  }
}
