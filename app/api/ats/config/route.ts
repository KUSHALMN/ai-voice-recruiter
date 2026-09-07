import { NextRequest, NextResponse } from 'next/server'
import { ATSProvider } from '@/lib/ats/atsService'

// Default in-memory / storage fallback for ATS settings
let atsConfigurations: Record<ATSProvider, {
  enabled: boolean
  isSandbox: boolean
  apiKey?: string
  subdomain?: string
  autoSync: boolean
  lastSyncAt?: string
}> = {
  greenhouse: {
    enabled: true,
    isSandbox: true,
    autoSync: true,
    subdomain: 'demo-corp'
  },
  lever: {
    enabled: true,
    isSandbox: true,
    autoSync: false,
    subdomain: 'demo-corp'
  },
  workday: {
    enabled: false,
    isSandbox: true,
    autoSync: false
  },
  ashby: {
    enabled: true,
    isSandbox: true,
    autoSync: true
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: atsConfigurations
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, config } = body

    if (!provider || !config) {
      return NextResponse.json({ error: 'Provider and config are required' }, { status: 400 })
    }

    atsConfigurations[provider as ATSProvider] = {
      ...atsConfigurations[provider as ATSProvider],
      ...config
    }

    return NextResponse.json({
      success: true,
      message: `${provider} configuration updated successfully`,
      data: atsConfigurations[provider as ATSProvider]
    })
  } catch (error) {
    console.error('Failed to update ATS config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
