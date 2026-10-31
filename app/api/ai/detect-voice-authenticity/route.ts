import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rateLimit'
import { evaluateVoiceAuthenticity, VoiceTelemetryPayload } from '@/lib/security/voiceAuthenticity'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const rateCheck = checkRateLimit(request, 'detect-voice-authenticity', { limit: 60, windowSeconds: 60 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many authenticity verification requests. Please wait ${rateCheck.resetSeconds}s.` },
        { status: 429 }
      )
    }

    const payload: VoiceTelemetryPayload = await request.json()
    const evaluation = evaluateVoiceAuthenticity(payload)

    return NextResponse.json({
      success: true,
      data: evaluation,
      timestamp: new Date().toISOString()
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown evaluation error'
    return NextResponse.json({
      success: false,
      error: msg,
      data: {
        isRealVoice: true,
        authenticityScore: 80,
        riskLevel: 'LOW',
        flags: [],
        explanation: 'Voice verification service fallback.',
        enforcementAction: 'PASS'
      }
    }, { status: 500 })
  }
}
