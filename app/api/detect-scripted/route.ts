import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'
import { checkRateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting protection (Max 40 proctoring checks per minute per IP)
    const rateCheck = checkRateLimit(request, 'detect-scripted', { limit: 40, windowSeconds: 60 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many proctoring requests. Please wait ${rateCheck.resetSeconds} seconds.` },
        { status: 429 }
      )
    }

    const { jobDescription, question, answer, responseDelay, answerDuration } = await request.json()
    
    // Clamp answer length to avoid token inflation
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
    // Return safe fallback — don't crash interview flow
    return NextResponse.json({
      Scripted_Risk_Level: 'Unknown',
      Suspicion_Flags: [],
      Confidence_Score: 0
    })
  }
}
