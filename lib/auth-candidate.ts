import crypto from 'crypto'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-candidate-auth'

export interface CandidateTokenPayload {
  interviewId: string
  candidateEmail: string
  candidateName: string
  exp?: number
}

/**
 * Signs a payload into a candidate JWT token using native Node crypto HMAC-SHA256
 */
export function signCandidateJWT(payload: CandidateTokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 // 24-hour expiry
  })).toString('base64url')

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')

  return `${header}.${body}.${signature}`
}

/**
 * Verifies a candidate JWT token using HMAC-SHA256 and returns the decoded payload if valid
 */
export function verifyCandidateJWT(token: string): CandidateTokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url')

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CandidateTokenPayload
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null // Token has expired
    }

    return payload
  } catch (error) {
    console.error('Candidate JWT verification failed:', error)
    return null
  }
}
