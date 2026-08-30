import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { getToken } from 'next-auth/jwt'
import { generateQuestionSet } from '@/lib/ai/questionGenerator'
import { QuestionSet } from '@/types/resume'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewId = params.id

    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // 2. Parse request body for option to force regeneration
    let regenerate = false
    try {
      const body = await request.json()
      regenerate = body?.regenerate === true
    } catch (e) {
      // Body may be empty or not JSON, default to no regeneration
    }

    // 3. Initialize Supabase Admin Client
    const supabase = getAdminClient()

    // 4. Fetch Interview details
    const { data: interview, error: dbError } = await supabase
      .from('interviews')
      .select('id, recruiter_email, job_title, job_description, interview_type, candidate_type, duration, parsed_resume, question_set')
      .eq('id', interviewId)
      .single()

    if (dbError || !interview) {
      return NextResponse.json(
        { error: 'Interview not found.' },
        { status: 404 }
      )
    }

    // 5. Verify Authorization
    const userEmail = token.email
    const isAdmin = token.role === 'admin' || userEmail.includes('admin')
    if (!isAdmin && interview.recruiter_email !== userEmail) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this interview.' },
        { status: 403 }
      )
    }

    // 6. Return cached questions if available and not forcing regeneration
    if (!regenerate && interview.question_set) {
      console.log(`ℹ️ Returning cached question set for interview ${interviewId}`)
      return NextResponse.json({
        success: true,
        message: 'Questions retrieved from cache.',
        data: interview.question_set
      })
    }

    // 7. Generate questions
    console.log(`⌛ Generating questions for interview ${interviewId} (with resume: ${!!interview.parsed_resume})...`)
    const questionSet = await generateQuestionSet(
      interview.job_title || 'Software Engineer',
      interview.job_description || '',
      interview.interview_type || 'technical',
      interview.candidate_type || 'mid',
      interview.duration || 15,
      interview.parsed_resume || undefined
    )

    // 8. Update interview with the generated questions
    const { error: updateError } = await supabase
      .from('interviews')
      .update({ question_set: questionSet })
      .eq('id', interviewId)

    if (updateError) {
      console.error('Supabase update error:', updateError.message)
      throw new Error(`Failed to update interview with question set: ${updateError.message}`)
    }

    console.log(`✅ Question generation completed for interview ${interviewId}`)

    return NextResponse.json({
      success: true,
      message: 'Questions generated successfully.',
      data: questionSet
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('API generate-questions error:', message)
    return NextResponse.json(
      { error: `Failed to generate questions: ${message}` },
      { status: 500 }
    )
  }
}
