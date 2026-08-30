import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { questions, answers, allScores, jobTitle, candidateName, interviewType } = await request.json()
    
    const report = await geminiService.generateAdminReport(
      questions,
      answers,
      allScores,
      jobTitle,
      candidateName,
      interviewType
    )
    
    return NextResponse.json(report)
  } catch (error) {
    console.error('Generate admin report error:', error)
    return NextResponse.json({ error: 'Failed to generate admin report' }, { status: 500 })
  }
}
