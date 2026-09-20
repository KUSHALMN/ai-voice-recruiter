import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })
const GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { jobTitle } = await request.json()

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const prompt = `Generate a professional job description for the position: ${jobTitle}

Include:
- Brief role overview
- Key responsibilities (3-4 points)
- Required qualifications
- Preferred skills

Keep it concise and professional, around 100-150 words.`

    let description = ''
    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        })
        description = completion.choices[0]?.message?.content || ''
        if (description) break
      } catch (err: any) {
        console.warn(`Groq model ${model} failed, trying next:`, err.message)
      }
    }

    if (!description) {
      description = `We are looking for an experienced ${jobTitle} to join our high-velocity team. Key responsibilities include designing scalable systems, collaborating with cross-functional teams, and maintaining code quality. Qualifications include proven experience in relevant technologies, problem-solving abilities, and strong communication skills.`
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error generating job description:', error)
    return NextResponse.json(
      { error: `Failed to generate description: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
