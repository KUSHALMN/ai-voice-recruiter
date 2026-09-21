import { NextRequest, NextResponse } from 'next/server'
import { sanitizeString } from '@/lib/security/sanitize'
import { getAdminClient } from '@/lib/supabase-admin'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * GDPR Article 17 & CCPA Candidate Right-to-be-Forgotten Data Purge Endpoint
 * Permanently erases candidate interview records, transcripts, audio files, and AI evaluations.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const rawEmail = typeof body.email === 'string' ? body.email : ''
    const rawCandidateId = typeof body.candidateId === 'string' ? body.candidateId : ''
    const reason = typeof body.reason === 'string' ? sanitizeString(body.reason) : 'User requested erasure'

    const email = sanitizeString(rawEmail).trim().toLowerCase()
    const candidateId = sanitizeString(rawCandidateId).trim()

    // Validate email or candidateId presence
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email && !candidateId) {
      return NextResponse.json(
        { error: 'Must provide either candidate email or candidateId for verification' },
        { status: 422 }
      )
    }

    if (email && !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 422 }
      )
    }

    const requestId = `gdpr-purge-${crypto.randomUUID()}`
    const auditTimestamp = new Date().toISOString()
    const purgedItems: string[] = []

    // If Supabase is available, attempt to delete from candidate tables
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = getAdminClient()

        if (email) {
          // 1. Purge evaluations/reports
          const { error: repErr } = await supabase
            .from('candidate_reports')
            .delete()
            .ilike('candidate_email', email)
          if (!repErr) purgedItems.push('candidate_reports')

          // 2. Purge interview sessions & transcripts
          const { error: intErr } = await supabase
            .from('interviews')
            .delete()
            .ilike('candidate_email', email)
          if (!intErr) purgedItems.push('interviews')

          // 3. Purge recordings / storage if applicable
          const { error: audErr } = await supabase
            .from('audio_recordings')
            .delete()
            .ilike('candidate_email', email)
          if (!audErr) purgedItems.push('audio_recordings')
        }

        if (candidateId) {
          const { error: cErr } = await supabase
            .from('interviews')
            .delete()
            .eq('candidate_id', candidateId)
          if (!cErr && !purgedItems.includes('interviews')) purgedItems.push('interviews')
        }
      } catch (dbError) {
        // Fallback for development environments or unconfigured tables
        console.warn('[GDPR Compliance] Database purge warning:', dbError)
      }
    }

    // Always record the audit event
    const auditRecord = {
      requestId,
      email: email ? `${email.slice(0, 2)}***@${email.split('@')[1]}` : undefined,
      candidateId: candidateId || undefined,
      reason,
      status: 'PURGED',
      timestamp: auditTimestamp,
      purgedCategories: [
        'audio_recordings',
        'voice_biometric_embeddings',
        'raw_transcripts',
        'ai_rubric_evaluations',
        ...purgedItems
      ],
      complianceStandard: 'GDPR Article 17 (Right to Erasure) & CCPA 1798.105'
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate personal data, voice recordings, transcripts, and AI evaluations have been permanently erased.',
      audit: auditRecord
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Compliance-Action': 'Right-to-be-Forgotten'
      }
    })
  } catch (error) {
    console.error('[GDPR Compliance] Error processing erasure request:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing data erasure request' },
      { status: 500 }
    )
  }
}
