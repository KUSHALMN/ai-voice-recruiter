import { NextRequest, NextResponse } from 'next/server'
import { ATSProvider } from '@/lib/ats/atsService'
import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Default in-memory / storage fallback for ATS settings
const atsConfigurations: Record<ATSProvider, {
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

export async function GET(request: NextRequest) {
  // 1. Authenticate Request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || !token.email) {
    return NextResponse.json(
      { error: 'Unauthorized. Please sign in.' },
      { status: 401 }
    )
  }

  // Mask API keys in read responses for security
  const sanitized = Object.entries(atsConfigurations).reduce((acc, [key, conf]) => {
    acc[key as ATSProvider] = {
      ...conf,
      apiKey: conf.apiKey ? `sk-••••••••${conf.apiKey.slice(-4)}` : undefined
    }
    return acc
  }, {} as Record<ATSProvider, any>)

  return NextResponse.json({
    success: true,
    data: sanitized
  })
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to update ATS configurations.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { provider, config } = body

    if (!provider || !config) {
      return NextResponse.json({ error: 'Provider and config are required' }, { status: 400 })
    }

    const validProviders: ATSProvider[] = ['greenhouse', 'lever', 'workday', 'ashby']
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid ATS provider' }, { status: 400 })
    }

    atsConfigurations[provider as ATSProvider] = {
      ...atsConfigurations[provider as ATSProvider],
      ...config
    }

    return NextResponse.json({
      success: true,
      message: `${provider} configuration updated successfully`,
      data: {
        ...atsConfigurations[provider as ATSProvider],
        apiKey: atsConfigurations[provider as ATSProvider]?.apiKey ? '••••••••' : undefined
      }
    })
  } catch (error) {
    console.error('Failed to update ATS config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
