import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

interface AnswerScore {
  technical?: number
  communication?: number
  confidence?: number
  problem_solving?: number
}

export async function POST(request: NextRequest) {
  try {
    const { questions, answers, allScores, jobTitle, candidateName, interviewType, proctoringLog, technicalAnswersLog } = await request.json()

    // Guard: if no scores or empty, generate fallback immediately
    const safeScores: AnswerScore[] = Array.isArray(allScores) && allScores.length > 0 ? allScores : []

    if (safeScores.length === 0) {
      return NextResponse.json({
        candidateName,
        interviewRole: jobTitle,
        interviewType,
        scores: {
          overall: 0,
          technical: 0,
          communication: 0,
          confidence: 0,
          problem_solving: 0,
          clarity: 0,
          professionalism: 0,
          integrity_score: 10
        },
        strengths: ['Completed the interview'],
        weaknesses: ['Insufficient data to evaluate'],
        summary: `${candidateName} completed the ${interviewType} interview for ${jobTitle}. Insufficient answer data to generate a detailed evaluation.`,
        recommendation: 'Further Review Required',
        spokenSummary: `Thank you for completing the interview, ${candidateName}. Your responses are now being analyzed.`,
        integrity_notes: 'No proctoring violations recorded.'
      })
    }

    // Compute fast fallback scores instantly (no API needed)
    const fastAvgScores = {
      technical: Math.round(safeScores.reduce((sum: number, s: AnswerScore) => sum + (s.technical || 0), 0) / safeScores.length),
      communication: Math.round(safeScores.reduce((sum: number, s: AnswerScore) => sum + (s.communication || 0), 0) / safeScores.length),
      confidence: Math.round(safeScores.reduce((sum: number, s: AnswerScore) => sum + (s.confidence || 0), 0) / safeScores.length),
      problem_solving: Math.round(safeScores.reduce((sum: number, s: AnswerScore) => sum + (s.problem_solving || 0), 0) / safeScores.length),
    }
    const fastOverall = Math.round((fastAvgScores.technical + fastAvgScores.communication + fastAvgScores.confidence + fastAvgScores.problem_solving) / 4)
    const fastRecommendation = fastOverall >= 8 ? "Recommended for next round" :
      fastOverall >= 6 ? "Strong candidate with minor gaps" :
        fastOverall >= 4 ? "Needs improvement" : "Not suitable for this role"

    const buildFallback = () => ({
      candidateName,
      interviewRole: jobTitle,
      interviewType,
      scores: {
        overall: fastOverall,
        technical: fastAvgScores.technical,
        communication: fastAvgScores.communication,
        confidence: fastAvgScores.confidence,
        problem_solving: fastAvgScores.problem_solving,
        clarity: fastAvgScores.communication,
        professionalism: Math.round((fastAvgScores.confidence + fastAvgScores.communication) / 2),
        integrity_score: 10,
      },
      strengths: ['Completed the interview', 'Engaged throughout the session', 'Provided structured responses'],
      weaknesses: ['Further review recommended for technical depth'],
      summary: `${candidateName} completed the ${interviewType} interview for ${jobTitle}. Answered ${answers.length} of ${questions.length} questions. Overall performance score: ${fastOverall}/10.`,
      recommendation: fastRecommendation,
      spokenSummary: `${candidateName} scored ${fastOverall} out of 10. ${fastRecommendation}.`,
      integrity_notes: (proctoringLog && proctoringLog.length > 0) ? `${proctoringLog.length} proctoring event(s) detected.` : 'No proctoring violations recorded.',
      isFallback: true
    })

    try {
      // Race: AI report vs 8-second timeout
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('REPORT_TIMEOUT')), 8000)
      )

      const report = await Promise.race([
        geminiService.generateFinalReport(
          questions,
          answers,
          safeScores,
          jobTitle,
          candidateName,
          interviewType,
          proctoringLog,
          technicalAnswersLog
        ),
        timeoutPromise
      ])

      return NextResponse.json(report)
    } catch (aiError: unknown) {
      const message = aiError instanceof Error ? aiError.message : 'Unknown AI error'
      if (message === 'REPORT_TIMEOUT') {
        console.warn('Report generation timed out (>8s), returning instant fallback')
      } else {
        console.error('AI service failed, using fallback:', message)
      }

      return NextResponse.json(buildFallback())
    }
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
