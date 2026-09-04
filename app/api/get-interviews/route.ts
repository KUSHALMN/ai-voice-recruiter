import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recruiterEmail = searchParams.get('recruiter_email')

    const supabase = getAdminClient()

    let query = supabase
      .from('interviews')
      .select('id, candidate_name, candidate_email, job_title, interview_type, candidate_type, status, duration, created_at, resume_url, parsed_resume, interview_sessions (id, scores, recommendation, evaluation, completed_at, final_score)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (recruiterEmail) {
      query = query.eq('recruiter_email', recruiterEmail)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching interviews:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { data: data || [] },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Interviews API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

