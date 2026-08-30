import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { saveInterviewSchema } from '@/lib/validations'

export const runtime = 'nodejs'

const supabaseAdmin = getAdminClient()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        
        // Validate input with Zod
        const parsed = saveInterviewSchema.safeParse(body)
        
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid interview data', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const {
            interviewId,
            questions,
            answers,
            report,
            fullTranscript
        } = parsed.data

        // Normalize scores to a flat, consistent format the report page can read
        const rawScores = report?.scores || {}
        const normalizedScores = {
            overall: rawScores.overall ?? 0,
            technical: rawScores.technical_skill ?? rawScores.technical ?? 0,
            communication: rawScores.communication_skill ?? rawScores.communication ?? 0,
            confidence: rawScores.confidence ?? 0,
            problem_solving: rawScores.problem_solving ?? 0,
            clarity: rawScores.clarity ?? 0,
            professionalism: rawScores.professionalism ?? 0,
            integrity_score: rawScores.integrity_score ?? 10,
        }

        // 1. Upsert/Update Interview Session
        const { data: existingSession, error: checkError } = await supabaseAdmin
            .from('interview_sessions')
            .select('id')
            .eq('interview_id', interviewId)
            .order('completed_at', { ascending: false })
            .limit(1)

        let sessionError
        if (!checkError && existingSession && existingSession.length > 0) {
            console.log(`ℹ️ Updating existing session ${existingSession[0].id} on interview completion.`)
            const { error } = await supabaseAdmin
                .from('interview_sessions')
                .update({
                    questions: questions || [],
                    answers: answers || [],
                    evaluation: {
                        summary: report?.summary || '',
                        recommendation: report?.recommendation || '',
                        scores: normalizedScores,
                        strengths: report?.strengths || [],
                        weaknesses: report?.weaknesses || [],
                        integrity_notes: report?.integrity_notes || ''
                    },
                    transcript: fullTranscript || '',
                    scores: normalizedScores,
                    recommendation: report?.recommendation || '',
                    completed_at: new Date().toISOString()
                })
                .eq('id', existingSession[0].id)
            sessionError = error
        } else {
            console.log(`ℹ️ Inserting new session for interview ${interviewId} on completion.`)
            const { error } = await supabaseAdmin
                .from('interview_sessions')
                .insert({
                    interview_id: interviewId,
                    questions: questions || [],
                    answers: answers || [],
                    evaluation: {
                        summary: report?.summary || '',
                        recommendation: report?.recommendation || '',
                        scores: normalizedScores,
                        strengths: report?.strengths || [],
                        weaknesses: report?.weaknesses || [],
                        integrity_notes: report?.integrity_notes || ''
                    },
                    transcript: fullTranscript || '',
                    scores: normalizedScores,
                    recommendation: report?.recommendation || ''
                })
            sessionError = error
        }

        if (sessionError) {
            console.error('Session insert/update error:', sessionError)
            throw sessionError
        }

        // 2. Update Interview Status to 'completed'
        const { error: updateError } = await supabaseAdmin
            .from('interviews')
            .update({ status: 'completed' })
            .eq('id', interviewId)

        if (updateError) {
            console.error('Status update error:', updateError)
            throw updateError
        }

        return NextResponse.json({ success: true })

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Save interview error:', message)
        return NextResponse.json(
            { error: 'Failed to save interview', details: message },
            { status: 500 }
        )
    }
}
