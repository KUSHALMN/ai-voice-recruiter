import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { DEMO_REPORTS_MAP } from '@/lib/demo-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params
    const interviewId = resolvedParams?.id

    if (!interviewId) {
      return NextResponse.json({ error: 'Missing interview ID' }, { status: 400 })
    }

    const supabase = getAdminClient()

    // 1. Fetch from database using admin client (bypasses Supabase RLS)
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .maybeSingle()

    if (error) {
      console.warn(`Supabase interview query error for ${interviewId}:`, error.message)
    }

    if (data) {
      return NextResponse.json(
        {
          data: {
            ...data,
            enable_probing: data.enable_probing ?? true,
            enable_strict_proctoring: data.enable_strict_proctoring ?? true,
          }
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      )
    }

    // 2. Fallback to demo interviews if ID matches demo data
    const demo = DEMO_REPORTS_MAP[interviewId]
    if (demo) {
      return NextResponse.json({
        data: {
          id: demo.id,
          candidate_name: demo.candidate_name,
          candidate_email: demo.candidate_email,
          job_title: demo.job_title,
          job_description: `Demo position for ${demo.job_title}`,
          interview_type: demo.interview_type || 'Technical',
          candidate_type: 'Experienced',
          status: demo.status || 'scheduled',
          duration: 10,
          enable_probing: true,
          enable_strict_proctoring: false,
          recruiter_email: demo.recruiter_email || '',
          created_at: demo.created_at || new Date().toISOString(),
        }
      })
    }

    return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Interview fetch API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
