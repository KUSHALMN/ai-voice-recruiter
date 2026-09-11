/**
 * HTML and text sanitization helpers to prevent Cross-Site Scripting (XSS)
 * and HTML Injection in outgoing emails and rendered dynamic content.
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
 * Validates that a string is a safe HTTP or HTTPS URL, preventing
 * javascript: or data: URI injection attacks in email and anchor links.
 */
export function sanitizeUrl(url: unknown, defaultUrl: string = '#'): string {
  if (typeof url !== 'string') return defaultUrl
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return defaultUrl
}
