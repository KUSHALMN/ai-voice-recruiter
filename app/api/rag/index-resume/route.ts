import { NextRequest, NextResponse } from 'next/server'
import { chunkResumeText } from '@/lib/rag/chunker'
import { storeResumeChunks, storeCandidateProfile } from '@/lib/rag/vectorStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/rag/index-resume
 * Accepts resume raw text or structured resume data to chunk and index into Supabase vector stores.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      interviewId,
      resumeText,
      candidateName,
      candidateEmail,
      headline,
      skills,
    } = body

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Missing required "resumeText" string field.' },
        { status: 400 }
      )
    }

    const effectiveId = interviewId || crypto.randomUUID()
    const name = candidateName || 'Candidate'
    const email = candidateEmail || `candidate_${effectiveId}@talent.ai`

    // 1. Chunk resume text
    const chunks = chunkResumeText(resumeText)

    // 2. Store chunks in resume_embeddings
    const chunkResult = await storeResumeChunks(effectiveId, name, email, chunks)

    // 3. Store consolidated candidate profile for ATS search
    const profileResult = await storeCandidateProfile({
      candidateName: name,
      candidateEmail: email,
      headline: headline || 'Software Professional',
      skills: Array.isArray(skills) ? skills : [],
      experienceSummary: resumeText.slice(0, 600),
      fullProfileText: resumeText,
    })

    return NextResponse.json({
      success: true,
      interviewId: effectiveId,
      chunksCount: chunkResult.count,
      profileIndexed: profileResult.success,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error in /api/rag/index-resume:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
