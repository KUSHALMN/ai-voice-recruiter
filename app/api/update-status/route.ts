import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { updateStatusSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

/**
 * POST /api/update-status
 * Server-side interview status update to bypass RLS restrictions.
 * Replaces the client-side Supabase status update in the interview page.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = updateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { interviewId, status } = parsed.data
    const supabase = getAdminClient()

    const { error } = await supabase
      .from('interviews')
      .update({ status })
      .eq('id', interviewId)

    if (error) {
      console.error('Status update error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Update status API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
