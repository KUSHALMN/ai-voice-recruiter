import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, jobTitle, interviewType, asrConfidence } = body

    // Input validation
    if (!question || !answer) {
      return NextResponse.json({
        scores: { technical: 0, communication: 0, confidence: 0, problem_solving: 0, clarity: 0, professionalism: 0 },
        feedback: 'Missing question or answer'
      })
    }

    // Default confidence to 1.0 if not provided
    const confidence = typeof asrConfidence === 'number' ? asrConfidence : 1.0

    const evaluation = await geminiService.evaluateAnswerWithASR(
      question,
      answer,
      confidence,
      jobTitle || 'General',
      interviewType || 'Mixed'
    )

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Evaluate answer error:', error)
    // Return consistent shape so frontend never crashes
    return NextResponse.json({
      scores: { technical: 3, communication: 3, confidence: 3, problem_solving: 3, clarity: 3, professionalism: 3 },
      feedback: 'Evaluation service temporarily unavailable. Default scores applied.'
    })
  }
}