import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { createInterviewSchema } from '@/lib/validations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input with Zod schema
    const parsed = createInterviewSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Invalid interview data', 
          details: parsed.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      )
    }

    const validatedData = parsed.data
    const supabase = getAdminClient()

    // Only send fields that exist in the DB 'interviews' table
    const interviewData: Record<string, unknown> = {
      id: validatedData.id,
      candidate_name: validatedData.candidate_name,
      candidate_email: validatedData.candidate_email,
      job_title: validatedData.job_title,
      job_description: validatedData.job_description || '',
      interview_type: validatedData.interview_type,
      candidate_type: validatedData.candidate_type || 'mid',
      duration: validatedData.duration,
      status: validatedData.status || 'scheduled',
      interview_link: validatedData.interview_link || '',
    }

    // Add optional DB columns if present
    if (validatedData.recruiter_email) {
      interviewData.recruiter_email = validatedData.recruiter_email
    }

    const { data: insertData, error } = await supabase
      .from('interviews')
      .insert(interviewData)

    if (error) {
      console.error('Supabase create error:', error.message)
      return NextResponse.json({ error: error.message || JSON.stringify(error), code: error.code }, { status: 500 })
    }

    return NextResponse.json({ data: insertData })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Create interview API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
