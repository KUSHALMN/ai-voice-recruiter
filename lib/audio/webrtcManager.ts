/**
 * Full-Duplex WebRTC Audio Manager with Voice Authenticity Biometrics
 * Provides sub-50ms latency audio streaming, echo cancellation,
 * noise suppression, real-time candidate speech interruption detection,
 * and synthetic AI voice / virtual loopback detection.
 */

import { VoiceAuthenticityDetector, VoiceAuthenticityReport } from './voiceAuthenticityDetector'

export interface WebRTCConfig {
  echoCancellation?: boolean
  noiseSuppression?: boolean
  autoGainControl?: boolean
  interruptionThreshold?: number // 0-100 threshold to detect candidate talking over AI
  onInterruption?: () => void
  onCandidateSpeakingChange?: (isSpeaking: boolean) => void
  onVolumeChange?: (volume: number) => void
  onVoiceAuthenticityReport?: (report: VoiceAuthenticityReport) => void
}

export class WebRTCAudioManager {
  private mediaStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null
  private animationFrameId: number | null = null
  private isCandidateSpeaking: boolean = false
  private isAISpeaking: boolean = false
  private voiceDetector: VoiceAuthenticityDetector | null = null
  private isVirtualDevice = false
  private config: Required<WebRTCConfig>

  constructor(config?: WebRTCConfig) {
    this.config = {
      echoCancellation: config?.echoCancellation ?? true,
      noiseSuppression: config?.noiseSuppression ?? true,
      autoGainControl: config?.autoGainControl ?? true,
      interruptionThreshold: config?.interruptionThreshold ?? 25,
      onInterruption: config?.onInterruption ?? (() => {}),
      onCandidateSpeakingChange: config?.onCandidateSpeakingChange ?? (() => {}),
      onVolumeChange: config?.onVolumeChange ?? (() => {}),
      onVoiceAuthenticityReport: config?.onVoiceAuthenticityReport ?? (() => {})
    }
  }

  /**
   * Initializes full-duplex microphone stream with low-latency constraints and voice authenticity monitoring
   */
  async start(): Promise<MediaStream> {
    if (this.mediaStream) {
      return this.mediaStream
    }

    // 1. Scan for virtual audio cables (e.g. VB-Audio, VoiceMeeter)
    this.voiceDetector = new VoiceAuthenticityDetector()
    const devScan = await this.voiceDetector.scanInputDevices()
    this.isVirtualDevice = devScan.isVirtual

    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: this.config.echoCancellation,
        noiseSuppression: this.config.noiseSuppression,
        autoGainControl: this.config.autoGainControl,
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16
      },
      video: false
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

    // Setup Web Audio API for real-time frequency analysis & interruption detection
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    this.audioContext = new AudioCtx({ latencyHint: 'interactive' })
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 256
    this.analyser.smoothingTimeConstant = 0.4

    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)
    this.sourceNode.connect(this.analyser)

    // Attach stream to biometric voice detector
    this.voiceDetector.startStreamAnalysis(this.mediaStream)

    this.startAudioLoop()
    return this.mediaStream
  }

  /**
   * Sets whether the AI is currently playing speech
   */
  setAISpeaking(speaking: boolean) {
    this.isAISpeaking = speaking
  }

  /**
   * Returns current biometric authenticity assessment of candidate voice
   */
  getVoiceAuthenticityReport(): VoiceAuthenticityReport {
    if (!this.voiceDetector) {
      return {
        isRealHumanVoice: true,
        authenticityScore: 100,
        status: 'AUTHENTIC_HUMAN_VOICE',
        suspicionFlags: [],
        biometrics: {
          pitchVariance: 12,
          jitterEstimate: 1.2,
          spectralFlatness: 0.25,
          breathPausesDetected: 1,
          virtualDeviceDetected: false,
          deviceLabel: 'Microphone'
        }
      }
    }
    return this.voiceDetector.getReport(this.isVirtualDevice)
  }

  /**
   * Continuous audio loop measuring candidate volume & triggering native interruption
   */
  private startAudioLoop() {
    if (!this.analyser) return

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    const checkAudio = () => {
      if (!this.analyser) return

      this.analyser.getByteFrequencyData(dataArray)

      // Calculate root-mean-square (RMS) volume
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i]
      }
      const rms = Math.sqrt(sum / dataArray.length)
      const normalizedVolume = Math.min(Math.round((rms / 128) * 100), 100)

      this.config.onVolumeChange(normalizedVolume)

      const isSpeakingNow = normalizedVolume > this.config.interruptionThreshold

      if (isSpeakingNow !== this.isCandidateSpeaking) {
        this.isCandidateSpeaking = isSpeakingNow
        this.config.onCandidateSpeakingChange(isSpeakingNow)

        // Native Interruption: If candidate starts speaking while AI is speaking, interrupt immediately!
        if (isSpeakingNow && this.isAISpeaking) {
          console.log('[WebRTC] Interruption detected: Candidate spoke while AI was speaking.')
          this.config.onInterruption()
        }

        // Emit voice authenticity telemetry on speech completion
        if (!isSpeakingNow && this.voiceDetector) {
          const report = this.getVoiceAuthenticityReport()
          this.config.onVoiceAuthenticityReport(report)
        }
      }

      this.animationFrameId = requestAnimationFrame(checkAudio)
    }

    this.animationFrameId = requestAnimationFrame(checkAudio)
  }

  /**
   * Stops the stream and cleans up audio context and voice detector
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    if (this.voiceDetector) {
      this.voiceDetector.stop()
      this.voiceDetector = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {})
      this.audioContext = null
    }

    this.isCandidateSpeaking = false
    this.isAISpeaking = false
  }
}
