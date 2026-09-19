import { NextRequest, NextResponse } from 'next/server'
import { searchCandidatesSemantic } from '@/lib/ats/atsMatchService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/ats/match
 * Natural language semantic candidate search across all applicant profiles.
 * Example body: { "query": "Senior React engineer with WebSockets and Docker experience", "limit": 15 }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const query = body.query || ''
    const limit = typeof body.limit === 'number' ? body.limit : 15
    const minSimilarity = typeof body.minSimilarity === 'number' ? body.minSimilarity : 0.15

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "query" is required.' },
        { status: 400 }
      )
    }

    const results = await searchCandidatesSemantic(query, limit, minSimilarity)
    return NextResponse.json(results)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('ATS match API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/ats/match?q=...&limit=...
 * Query string based semantic search
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || searchParams.get('query') || ''
    const limit = parseInt(searchParams.get('limit') || '15', 10)

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required.' },
        { status: 400 }
      )
    }

    const results = await searchCandidatesSemantic(query, limit)
    return NextResponse.json(results)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('ATS match API GET error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
