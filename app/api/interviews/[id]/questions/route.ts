import { NextRequest, NextResponse } from 'next/server'
import { interviewService } from '@/services/interview.service'

/**
 * POST /api/interviews/[id]/questions
 * Generates AI questions for an interview
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const interview = await interviewService.getInterviewById(params.id)

    const questions = await interviewService.generateQuestions({
      role: body.role || interview?.role || 'Software Engineer',
      jobDescription: body.jobDescription || interview?.job_description,
      difficulty: body.difficulty || interview?.difficulty,
      skills: body.skills || interview?.skills,
      count: body.count || 5
    })

    return NextResponse.json({
      success: true,
      data: questions,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate questions', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
