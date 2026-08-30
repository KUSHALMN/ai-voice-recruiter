import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { verifyCandidateJWT } from '@/lib/auth-candidate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()
    const { currentQuestionIndex, difficultyLevel, answeredQuestions } = body

    // 1. Authenticate candidate using candidate JWT
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyCandidateJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired candidate token' }, { status: 401 })
    }

    const supabase = getAdminClient()

    // 2. Fetch session details to check ownership
    const { data: session, error: sessionErr } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionErr || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Verify session belongs to the candidate's interview
    if (session.interview_id !== payload.interviewId) {
      return NextResponse.json({ error: 'Forbidden. Interview ID mismatch.' }, { status: 403 })
    }

    // 3. Map client-side answeredQuestions to database structures
    const answers = (answeredQuestions || []).map((aq: any) => aq.answer || '')
    const scores = (answeredQuestions || []).map((aq: any) => ({
      questionId: aq.id,
      questionText: aq.text || '',
      score: aq.score || 5,
      feedback: aq.feedback || ''
    }))

    // 4. Update Database Session progress
    const { error: updateErr } = await supabase
      .from('interview_sessions')
      .update({
        current_question_index: currentQuestionIndex || 0,
        difficulty_level: difficultyLevel || 'medium',
        answers,
        scores
      })
      .eq('id', sessionId)

    if (updateErr) {
      console.error('Failed to update session progress backup:', updateErr.message)
      return NextResponse.json({ error: `Update failed: ${updateErr.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API backup progress error:', err)
    return NextResponse.json(
      { error: `Failed to backup progress: ${err.message}` },
      { status: 500 }
    )
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  // Support both POST and PATCH method fallback
  return PATCH(request, { params })
}
