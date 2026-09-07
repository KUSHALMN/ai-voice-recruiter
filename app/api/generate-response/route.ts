import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const { currentQuestion, candidateAnswer, nextQuestion, jobTitle, candidateName, enableProbing, isWrapUpPhase, language } = await request.json()

        if (!currentQuestion || !candidateAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Disable follow-up probing if in wrap-up phase or if this is the last question
        const shouldEnableProbing = !isWrapUpPhase && Boolean(nextQuestion) && Boolean(enableProbing)

        const responseData = await geminiService.generateConversationalResponse(
            currentQuestion,
            candidateAnswer,
            nextQuestion || '',
            jobTitle,
            candidateName,
            shouldEnableProbing,
            language || 'English'
        )

        return NextResponse.json(responseData)
    } catch {
        // Return structured fallback instead of 500 — keeps interview flow alive
        return NextResponse.json({
            responseText: `Thank you. Let's continue.`,
            isFollowUp: false,
            followUpQuestion: null
        })
    }
}
