import { NextRequest, NextResponse } from 'next/server'
import { syncToATS, ATSProvider, ATSSyncPayload } from '@/lib/ats/atsService'
import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to synchronize candidates with ATS.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { provider, payload, config } = body

    if (!provider || !payload || !payload.candidateName) {
      return NextResponse.json(
        { error: 'Missing required provider or payload fields' },
        { status: 400 }
      )
    }

    const validProviders: ATSProvider[] = ['greenhouse', 'lever', 'workday', 'ashby']
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid ATS provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      )
    }

    const syncResult = await syncToATS(provider, payload as ATSSyncPayload, config)

    return NextResponse.json({
      success: true,
      data: syncResult
    })
  } catch (error) {
    console.error('ATS sync API error:', error)
    return NextResponse.json(
      { error: 'Failed to synchronize interview data with ATS' },
      { status: 500 }
    )
  }
}
