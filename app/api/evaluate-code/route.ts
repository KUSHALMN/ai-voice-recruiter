import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const { code, language, problemDescription } = await request.json()

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 })
        }

        const evaluation = await geminiService.evaluateCode(
            code,
            language || 'javascript',
            problemDescription || ''
        )

        return NextResponse.json(evaluation)
    } catch (error) {
        console.error('Code evaluation error:', error)
        return NextResponse.json({ error: 'Failed to evaluate code' }, { status: 500 })
    }
}
