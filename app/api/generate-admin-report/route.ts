import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'
import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to generate executive reports.' },
        { status: 401 }
      )
    }

    const { questions, answers, allScores, jobTitle, candidateName, interviewType } = await request.json()
    
    if (!questions || !answers) {
      return NextResponse.json({ error: 'Questions and answers are required' }, { status: 400 })
    }

    const report = await geminiService.generateAdminReport(
      questions,
      answers,
      allScores || [],
      jobTitle || 'General Assessment',
      candidateName || 'Candidate',
      interviewType || 'technical'
    )
    
    return NextResponse.json(report)
  } catch (error) {
    console.error('Generate admin report error:', error)
    return NextResponse.json({ error: 'Failed to generate admin report' }, { status: 500 })
  }
}
