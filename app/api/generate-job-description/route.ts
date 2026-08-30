import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

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



    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const description = completion.choices[0]?.message?.content || ''


    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error generating job description:', error)
    return NextResponse.json(
      { error: `Failed to generate description: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}