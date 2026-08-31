import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { getToken } from 'next-auth/jwt'
import { parseResume } from '@/lib/resume/parseResume'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: interviewId } = await params

    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // 2. Initialize Supabase Admin Client
    const supabase = getAdminClient()

    // 3. Fetch Interview details (including owner recruiter and resume_url)
    const { data: interview, error: dbError } = await supabase
      .from('interviews')
      .select('id, recruiter_email, resume_url')
      .eq('id', interviewId)
      .single()

    if (dbError || !interview) {
      return NextResponse.json(
        { error: 'Interview not found.' },
        { status: 404 }
      )
    }

    // 4. Verify Authorization
    const userEmail = token.email
    const isAdmin = token.role === 'admin' || userEmail.includes('admin')
    if (!isAdmin && interview.recruiter_email !== userEmail) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this interview.' },
        { status: 403 }
      )
    }

    // 5. Handle "No resume uploaded" case gracefully
    if (!interview.resume_url) {
      return NextResponse.json({
        success: false,
        message: 'No resume has been uploaded for this interview.',
        parsed: false
      })
    }

    // 6. Call parseResume logic
    console.log(`⌛ Parsing resume for interview ${interviewId}...`)
    const parsedData = await parseResume(interview.resume_url, interviewId)
    console.log(`✅ Resume parsing completed for interview ${interviewId}`)

    return NextResponse.json({
      success: true,
      message: 'Resume parsed successfully.',
      parsed: true,
      data: parsedData
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('API parse-resume error:', message)
    return NextResponse.json(
      { error: `Failed to parse resume: ${message}` },
      { status: 500 }
    )
  }
}
