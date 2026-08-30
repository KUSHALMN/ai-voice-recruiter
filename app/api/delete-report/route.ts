import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = getAdminClient()

    if (body.clearAll) {
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
        const { error, count } = await supabase.from('interviews').delete().in('id', interviews.map(i => i.id))
        
        // If we found interviews but couldn't delete them, it's an RLS issue
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Final check to see if clear was successful (if using anon key without RLS bypass, they won't delete)
      const { count: remainingCount } = await supabase.from('interviews').select('id', { count: 'exact', head: true })
      if (remainingCount && remainingCount > 0) {
        return NextResponse.json({ 
          error: 'Could not delete reports. Row Level Security is blocking the request. Please run the clear-data.sql script in Supabase manually.'
        }, { status: 403 })
      }

      return NextResponse.json({ success: true, cleared: true })
    }

    const { id } = body
    if (!id) return NextResponse.json({ error: 'Interview ID required' }, { status: 400 })

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
