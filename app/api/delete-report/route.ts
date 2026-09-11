import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to delete reports.' },
        { status: 401 }
      )
    }

    const userEmail = token.email
    const isAdmin =
      token.role === 'admin' ||
      userEmail.includes('admin') ||
      userEmail === 'kkiran6094@gmail.com' ||
      userEmail === 'kushikushal416@gmail.com'

    const body = await request.json()
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = getAdminClient()

    // 2. Clear All records (Administrative Action only)
    if (body.clearAll) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden. Only system administrators can purge all interview records.' },
          { status: 403 }
        )
      }

      if (!hasServiceRoleKey) {
        return NextResponse.json({ 
          error: 'Please run the clear-data.sql script in your Supabase dashboard directly. The API is blocked by security rules without a Service Role Key.' 
        }, { status: 403 })
      }

      // Fetch IDs first to avoid massive lock timeouts
      const { data: sessions } = await supabase.from('interview_sessions').select('id')
      if (sessions && sessions.length > 0) {
        await supabase.from('interview_sessions').delete().in('id', sessions.map(s => s.id))
      }

      const { data: interviews } = await supabase.from('interviews').select('id')
      if (interviews && interviews.length > 0) {
        const { error } = await supabase.from('interviews').delete().in('id', interviews.map(i => i.id))
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Final check to see if clear was successful
      const { count: remainingCount } = await supabase.from('interviews').select('id', { count: 'exact', head: true })
      if (remainingCount && remainingCount > 0) {
        return NextResponse.json({ 
          error: 'Could not delete reports. Row Level Security is blocking the request. Please run the clear-data.sql script in Supabase manually.'
        }, { status: 403 })
      }

      return NextResponse.json({ success: true, cleared: true })
    }

    // 3. Delete single interview record
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Interview ID required' }, { status: 400 })

    // Verify interview existence and ownership
    const { data: interview, error: fetchError } = await supabase
      .from('interviews')
      .select('id, recruiter_email')
      .eq('id', id)
      .single()

    if (fetchError || !interview) {
      return NextResponse.json({ error: 'Interview report not found' }, { status: 404 })
    }

    // Role-based access control: Only owner recruiter or admin can delete
    if (!isAdmin && interview.recruiter_email && interview.recruiter_email !== userEmail) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete this report.' },
        { status: 403 }
      )
    }

    // Delete related sessions first (foreign key constraint)
    await supabase.from('interview_sessions').delete().eq('interview_id', id)

    // Delete the interview
    const { error } = await supabase.from('interviews').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
