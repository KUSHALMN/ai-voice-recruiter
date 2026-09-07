import { NextRequest, NextResponse } from 'next/server'
import { syncToATS, ATSProvider, ATSSyncPayload } from '@/lib/ats/atsService'

export async function POST(request: NextRequest) {
  try {
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
