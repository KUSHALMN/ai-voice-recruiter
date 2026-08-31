import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { signCandidateJWT } from '@/lib/auth-candidate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: interviewId } = await params
    const body = await request.json()
    const { action } = body

    const supabase = getAdminClient()

    // Verify interview exists and is scheduled/in_progress
    const { data: interview, error: intError } = await supabase
      .from('interviews')
      .select('id, status, candidate_name, candidate_email')
      .eq('id', interviewId)
      .single()

    if (intError || !interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    if (action === 'start') {
      // 1. Check if a session already exists for this interview
      const { data: existingSession, error: checkError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('interview_id', interviewId)
        .order('completed_at', { ascending: false })
        .limit(1)

      if (!checkError && existingSession && existingSession.length > 0) {
        console.log(`ℹ️ Session already exists for interview ${interviewId}: ${existingSession[0].id}`)
        return NextResponse.json({
          success: true,
          sessionId: existingSession[0].id,
          sessionToken: existingSession[0].session_token || '',
          currentQuestionIndex: existingSession[0].current_question_index || 0,
          difficultyLevel: existingSession[0].difficulty_level || 'medium',
          questions: existingSession[0].questions || [],
          answers: existingSession[0].answers || [],
          scores: existingSession[0].scores || {}
        })
      }

      // 2. Initialize new session
      const sessionToken = signCandidateJWT({
        interviewId: interview.id,
        candidateEmail: interview.candidate_email || '',
        candidateName: interview.candidate_name || 'Candidate'
      })
      const { data: newSession, error: insertError } = await supabase
        .from('interview_sessions')
        .insert({
          interview_id: interviewId,
          questions: [],
          answers: [],
          evaluation: {
            summary: '',
            recommendation: '',
            scores: { overall: 0, technical: 0, communication: 0, confidence: 0, problem_solving: 0, clarity: 0, professionalism: 0 },
            strengths: [],
            weaknesses: [],
            integrity_notes: ''
          },
          transcript: '',
          scores: { overall: 0, technical: 0, communication: 0, confidence: 0, problem_solving: 0, clarity: 0, professionalism: 0 },
          recommendation: '',
          current_question_index: 0,
          difficulty_level: 'medium',
          session_token: sessionToken
        })
        .select()
        .single()

      if (insertError || !newSession) {
        console.error('Failed to initialize session in DB:', insertError?.message)
        return NextResponse.json({ error: `Failed to initialize session: ${insertError?.message}` }, { status: 500 })
      }

      console.log(`✅ Session initialized for interview ${interviewId}: ${newSession.id}`)

      return NextResponse.json({
        success: true,
        sessionId: newSession.id,
        sessionToken: sessionToken,
        currentQuestionIndex: 0,
        difficultyLevel: 'medium',
        questions: [],
        answers: [],
        scores: {}
      })
    } 
    
    if (action === 'update') {
      const { sessionId, sessionToken, questions, answers, scores, currentQuestionIndex, difficultyLevel, transcript } = body

      if (!sessionId || !sessionToken) {
        return NextResponse.json({ error: 'Missing sessionId or sessionToken' }, { status: 400 })
      }

      // Verify session ownership using token
      const { data: dbSession, error: sessionFetchError } = await supabase
        .from('interview_sessions')
        .select('id, session_token')
        .eq('id', sessionId)
        .single()

      if (sessionFetchError || !dbSession || dbSession.session_token !== sessionToken) {
        return NextResponse.json({ error: 'Unauthorized session access' }, { status: 403 })
      }

      // Update session progress
      const { error: updateError } = await supabase
        .from('interview_sessions')
        .update({
          questions: questions || [],
          answers: answers || [],
          scores: scores || {},
          current_question_index: currentQuestionIndex ?? 0,
          difficulty_level: difficultyLevel || 'medium',
          transcript: transcript || ''
        })
        .eq('id', sessionId)

      if (updateError) {
        console.error('Failed to update session progress:', updateError.message)
        return NextResponse.json({ error: `Update failed: ${updateError.message}` }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('API session management error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
