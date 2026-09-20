import { useState, useEffect, useRef, useCallback } from 'react'
import { WebRTCAudioManager, WebRTCConfig } from '@/lib/audio/webrtcManager'

export function useWebRTCAudio(config?: {
  onInterruption?: () => void
}) {
  const [isActive, setIsActive] = useState(false)
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false)
  const [volume, setVolume] = useState(0)
  const managerRef = useRef<WebRTCAudioManager | null>(null)

  const startSession = useCallback(async (isAISpeaking: boolean = false) => {
    try {
      if (!managerRef.current) {
        managerRef.current = new WebRTCAudioManager({
          onCandidateSpeakingChange: (speaking) => setIsCandidateSpeaking(speaking),
          onVolumeChange: (vol) => setVolume(vol),
          onInterruption: () => {
            config?.onInterruption?.()
          }
        })
      }

      managerRef.current.setAISpeaking(isAISpeaking)
      await managerRef.current.start()
      setIsActive(true)
    } catch (err) {
      console.warn('[useWebRTCAudio] Failed to start WebRTC audio stream:', err)
      setIsActive(false)
    }
  }, [config])

  const stopSession = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.stop()
      managerRef.current = null
    }
    setIsActive(false)
    setIsCandidateSpeaking(false)
    setVolume(0)
  }, [])

  const setAISpeaking = useCallback((speaking: boolean) => {
    if (managerRef.current) {
      managerRef.current.setAISpeaking(speaking)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (managerRef.current) {
        managerRef.current.stop()
      }
    }
  }, [])

  return {
    isActive,
    isCandidateSpeaking,
    volume,
    startSession,
    stopSession,
    setAISpeaking
  }
}
