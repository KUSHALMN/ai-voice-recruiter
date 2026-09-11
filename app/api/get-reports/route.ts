import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to access reports.' },
        { status: 401 }
      )
    }

    const userEmail = token.email
    const isAdmin =
      token.role === 'admin' ||
      userEmail.includes('admin') ||
      userEmail === 'kkiran6094@gmail.com' ||
      userEmail === 'kushikushal416@gmail.com'

    const supabase = getAdminClient()

    let query = supabase
      .from('interviews')
      .select('id, candidate_name, candidate_email, job_title, interview_type, status, duration, created_at, recruiter_email, interview_sessions (id, scores, recommendation)')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(100)

    // Role-based filtering: Non-admins can only see reports for interviews they manage
    if (!isAdmin) {
      query = query.eq('recruiter_email', userEmail)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching reports:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { data: data || [] },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Reports API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
