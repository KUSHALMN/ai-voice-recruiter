import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, question, answer, responseDelay, answerDuration } = await request.json()
    
    const detection = await geminiService.detectScriptedAnswer(
      jobDescription,
      question,
      answer,
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
