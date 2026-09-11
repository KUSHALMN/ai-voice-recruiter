import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'
import { checkRateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // 1. Rate Limiting Protection (Max 40 conversational turns per minute per IP)
        const rateCheck = checkRateLimit(request, 'generate-response', { limit: 40, windowSeconds: 60 })
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: `Too many interview requests. Please wait ${rateCheck.resetSeconds} seconds.` },
                { status: 429 }
            )
        }

        const { currentQuestion, candidateAnswer, nextQuestion, jobTitle, candidateName, enableProbing, isWrapUpPhase, language } = await request.json()

        if (!currentQuestion || !candidateAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Clamp candidate answer to prevent excessive token consumption
        const safeAnswer = typeof candidateAnswer === 'string' ? candidateAnswer.slice(0, 5000) : ''

        // Disable follow-up probing if in wrap-up phase or if this is the last question
        const shouldEnableProbing = !isWrapUpPhase && Boolean(nextQuestion) && Boolean(enableProbing)

        const responseData = await geminiService.generateConversationalResponse(
            currentQuestion,
            safeAnswer,
            nextQuestion || '',
            jobTitle || 'General Assessment',
            candidateName || 'Candidate',
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
