import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Max 25 audio synthesis requests per minute per IP)
    const rateCheck = checkRateLimit(request, 'tts', { limit: 25, windowSeconds: 60 })
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many voice synthesis requests. Please wait ${rateCheck.resetSeconds} seconds.` },
        { status: 429 }
      )
    }

    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required and must be a string' }, { status: 400 })
    }

    // 2. Maximum length guard (prevent API quota draining and latency spikes)
    const trimmedText = text.trim()
    if (trimmedText.length > 500) {
      return NextResponse.json(
        { error: 'Speech text exceeds maximum length of 500 characters per synthesis.' },
        { status: 400 }
      )
    }

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.80,
            style: 0.05
          }
        }),
        signal: controller.signal
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`ElevenLabs API error: ${response.status}`, errorText)
      return NextResponse.json({ error: `ElevenLabs API error: ${response.status}` }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, immutable'
      }
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}
