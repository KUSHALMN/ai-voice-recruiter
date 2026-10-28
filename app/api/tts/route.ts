import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rateLimit'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface CachedAudio {
  buffer: ArrayBuffer
  timestamp: number
}

// In-memory audio cache for synthesized phrases (max 100 entries, 24-hr TTL)
const audioCache = new Map<string, CachedAudio>()
const MAX_CACHE_ENTRIES = 100
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function getCacheKey(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex')
}

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

    // 3. Fast Cache Lookup
    const cacheKey = getCacheKey(trimmedText)
    const cached = audioCache.get(cacheKey)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return new NextResponse(cached.buffer.slice(0), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cached.buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
          'X-Cache': 'HIT'
        }
      })
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

    // Store in LRU cache
    if (audioCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = audioCache.keys().next().value
      if (oldestKey) audioCache.delete(oldestKey)
    }
    audioCache.set(cacheKey, { buffer: audioBuffer, timestamp: now })

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}

