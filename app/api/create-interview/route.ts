import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { createInterviewSchema } from '@/lib/validations'
import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    // Check for authenticated recruiter/admin session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const userEmail = token?.email
    const isAdmin = token?.role === 'admin' || userEmail?.includes('admin')

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

    // Set recruiter_email securely from authenticated token, or allow admin override
    if (userEmail && !isAdmin) {
      interviewData.recruiter_email = userEmail
    } else if (validatedData.recruiter_email) {
      interviewData.recruiter_email = validatedData.recruiter_email
    } else if (userEmail) {
      interviewData.recruiter_email = userEmail
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
