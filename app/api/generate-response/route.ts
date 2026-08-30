import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const { currentQuestion, candidateAnswer, nextQuestion, jobTitle, candidateName, enableProbing } = await request.json()

        if (!currentQuestion || !candidateAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const responseData = await geminiService.generateConversationalResponse(
            currentQuestion,
            candidateAnswer,
            nextQuestion || '',
            jobTitle,
            candidateName,
            enableProbing
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
