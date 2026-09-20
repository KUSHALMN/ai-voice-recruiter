import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'
import { checkRateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const rateCheck = checkRateLimit(request, 'detect-scripted', { limit: 40, windowSeconds: 60 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many proctoring requests. Please wait ${rateCheck.resetSeconds} seconds.` },
        { status: 429 }
      )
    }

    const { jobDescription, question, answer, responseDelay, answerDuration } = await request.json()
    const safeAnswer = typeof answer === 'string' ? answer.slice(0, 5000) : ''

    const detection = await geminiService.detectScriptedAnswer(
      jobDescription || '',
      question || '',
      safeAnswer,
      responseDelay || 0,
      answerDuration || 0
    )
    
    return NextResponse.json(detection)
  } catch {
    return NextResponse.json({
      Scripted_Risk_Level: 'Unknown',
      Suspicion_Flags: [],
      Confidence_Score: 0
    })
  }
}
