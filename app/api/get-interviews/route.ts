import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('interviews')
      .select('id, candidate_name, candidate_email, job_title, interview_type, status, duration, created_at, resume_url')
      .order('created_at', { ascending: false })
      .limit(100)

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
