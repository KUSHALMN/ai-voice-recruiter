import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { generateQuestionSet } from '@/lib/ai/questionGenerator'
import { QuestionSet } from '@/types/resume'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { interviewId, jobTitle, jobDescription, interviewType, candidateType, duration } = body

    const supabase = getAdminClient()

    // 1. If interviewId is provided, check database first
    if (interviewId) {
      const { data: interview, error: dbError } = await supabase
        .from('interviews')
        .select('id, job_title, job_description, interview_type, candidate_type, duration, parsed_resume, question_set')
        .eq('id', interviewId)
        .single()

      if (!dbError && interview) {
        // If question_set already exists, return it from cache
        if (interview.question_set && (interview.question_set as QuestionSet).questions?.length > 0) {
          const qSet = interview.question_set as QuestionSet
          console.log(`ℹ️ Returning cached question set for interview ${interviewId} (length: ${qSet.questions.length})`)
          return NextResponse.json({
            questions: qSet.questions.map(q => q.text),
            questionSet: qSet
          })
        }

        // Generate tailored questions
        console.log(`⌛ Generating new question set for interview ${interviewId} (tailored: ${!!interview.parsed_resume})...`)
        const qSet = await generateQuestionSet(
          interview.job_title || jobTitle || 'Software Engineer',
          interview.job_description || jobDescription || '',
          interview.interview_type || interviewType || 'technical',
          interview.candidate_type || candidateType || 'mid',
          interview.duration || duration || 15,
          interview.parsed_resume || undefined
        )

        // Store the question set
        const { error: updateError } = await supabase
          .from('interviews')
          .update({ question_set: qSet })
          .eq('id', interviewId)

        if (updateError) {
          console.error('Supabase update question_set error:', updateError.message)
        }

        return NextResponse.json({
          questions: qSet.questions.map(q => q.text),
          questionSet: qSet
        })
      }
    }

    // 2. Fallback: Generate generic questions if no interviewId or interview not found
    console.log(`⌛ Generating generic question set (no interview ID)...`)
    const qSet = await generateQuestionSet(
      jobTitle || 'Software Engineer',
      jobDescription || '',
      interviewType || 'technical',
      candidateType || 'mid',
      duration || 15
    )

    return NextResponse.json({
      questions: qSet.questions.map(q => q.text),
      questionSet: qSet
    })
  } catch (error: any) {
    console.error('Generate questions API error:', error)
    return NextResponse.json({
      error: 'Failed to generate questions',
      questions: [],
      details: error.message
    }, { status: 500 })
  }
}