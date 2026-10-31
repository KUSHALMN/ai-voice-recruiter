import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    const supabase = getAdminClient()

    const { data: interview, error } = await supabase
      .from('interviews')
      .select('*, interview_sessions (*)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Fetch single report error:', error.message)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    if (!interview) {
      return NextResponse.json({ error: 'Report not found or access denied by security rules' }, { status: 404 })
    }

    const timestampKey = interview.updated_at || interview.created_at || 'v1'
    const etag = `W/"${id}-${timestampKey}"`

    const ifNoneMatch = request.headers.get('if-none-match')
    if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === `"${id}-${timestampKey}"`)) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=300',
        },
      })
    }

    return NextResponse.json(
      { data: interview },
      {
        headers: {
          'ETag': etag,
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=300',
        },
      }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Single report API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
