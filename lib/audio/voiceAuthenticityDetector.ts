/**
 * Voice Authenticity & Synthetic AI Voice Detector
 * Real-time biometric analysis of microphone audio to detect:
 * 1. Virtual audio loopback cables (VB-Cable, VoiceMeeter, BlackHole, Soundflower)
 * 2. Text-to-Speech (TTS) / AI voice generators (ElevenLabs, OpenAI TTS, VoiceMod)
 * 3. Robotic pitch constancy and absence of natural vocal cord jitter/shimmer
 * 4. Missing respiration/breath pause patterns
 */

export interface VoiceBiometrics {
  pitchVariance: number // Variance in fundamental frequency F0 (human: >8, robotic: <2.5)
  jitterEstimate: number // Micro-perturbation in vocal pitch (human: 0.4%-2.5%, robotic: ~0)
  spectralFlatness: number // Wiener entropy of spectrum
  breathPausesDetected: number // Natural biological inhalations detected
  virtualDeviceDetected: boolean
  deviceLabel: string
}

export interface VoiceAuthenticityReport {
  isRealHumanVoice: boolean
  authenticityScore: number // 0-100 (100 = verified authentic human voice)
  status: 'AUTHENTIC_HUMAN_VOICE' | 'SUSPECTED_SYNTHETIC_VOICE' | 'FLAGGED_AI_GENERATOR'
  suspicionFlags: string[]
  biometrics: VoiceBiometrics
}

const VIRTUAL_DEVICE_PATTERNS = [
  /vb-audio/i,
  /virtual\s*cable/i,
  /cable\s*(input|output)/i,
  /voicemeeter/i,
  /blackhole/i,
  /soundflower/i,
  /virtual\s*audio/i,
  /loopback/i,
  /manycam/i,
  /screaming\s*bee/i,
  /morphvox/i,
  /clownfish/i,
  /obs[\s\-_]*virtual/i,
  /epoccam/i,
  /droidcam/i,
  /ndi\s*audio/i,
]

export class VoiceAuthenticityDetector {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null
  private isAnalyzing = false
  private animFrameId: number | null = null

  // Rolling buffers for vocal feature tracking
  private pitchSamples: number[] = []
  private rmsSamples: number[] = []
  private spectralFlatnessSamples: number[] = []
  private breathPauseCount = 0
  private lastSilenceStart: number | null = null
  private activeDeviceLabel = 'Default Microphone'

  /**
   * Scans connected media devices for virtual audio cables / software loopbacks.
   */
  async scanInputDevices(): Promise<{ isVirtual: boolean; detectedLabel: string }> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      return { isVirtual: false, detectedLabel: 'Default Microphone' }
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = devices.filter(d => d.kind === 'audioinput')

      for (const dev of audioInputs) {
        const label = dev.label || ''
        for (const pattern of VIRTUAL_DEVICE_PATTERNS) {
          if (pattern.test(label)) {
            this.activeDeviceLabel = label
            return { isVirtual: true, detectedLabel: label }
          }
        }
      }

      if (audioInputs.length > 0 && audioInputs[0].label) {
        this.activeDeviceLabel = audioInputs[0].label
      }

      return { isVirtual: false, detectedLabel: this.activeDeviceLabel }
    } catch {
      return { isVirtual: false, detectedLabel: 'Microphone' }
    }
  }

  /**
   * Attaches analyzer to candidate's live MediaStream to track acoustic biometrics.
   */
  startStreamAnalysis(stream: MediaStream): void {
    if (typeof window === 'undefined') return
    this.stop()

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      this.audioContext = new AudioCtx({ latencyHint: 'interactive' })
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 1024
      this.analyser.smoothingTimeConstant = 0.3

      this.sourceNode = this.audioContext.createMediaStreamSource(stream)
      this.sourceNode.connect(this.analyser)

      this.isAnalyzing = true
      this.pitchSamples = []
      this.rmsSamples = []
      this.spectralFlatnessSamples = []
      this.breathPauseCount = 0

      this.runSampleLoop()
    } catch (err) {
      console.warn('[VoiceAuthenticityDetector] Web Audio initialization error:', err)
    }
  }

  private runSampleLoop = () => {
    if (!this.isAnalyzing || !this.analyser) return

    const timeDomain = new Float32Array(this.analyser.fftSize)
    const freqData = new Float32Array(this.analyser.frequencyBinCount)

    this.analyser.getFloatTimeDomainData(timeDomain)
    this.analyser.getFloatFrequencyData(freqData)

    // 1. RMS Energy
    let sumSquares = 0
    for (let i = 0; i < timeDomain.length; i++) {
      sumSquares += timeDomain[i] * timeDomain[i]
    }
    const rms = Math.sqrt(sumSquares / timeDomain.length)
    this.rmsSamples.push(rms)
    if (this.rmsSamples.length > 200) this.rmsSamples.shift()

    // 2. Breath & Pause Tracker (human respiration creates 200ms - 800ms soft dips)
    const now = performance.now()
    if (rms < 0.015) {
      if (this.lastSilenceStart === null) {
        this.lastSilenceStart = now
      }
    } else {
      if (this.lastSilenceStart !== null) {
        const pauseDuration = now - this.lastSilenceStart
        if (pauseDuration >= 180 && pauseDuration <= 900) {
          this.breathPauseCount++
        }
        this.lastSilenceStart = null
      }
    }

    // 3. Estimate fundamental pitch (F0) using autocorrelation if voiced
    if (rms > 0.03) {
      const pitch = this.estimatePitchAutocorrelation(timeDomain, this.audioContext?.sampleRate || 48000)
      if (pitch > 60 && pitch < 500) {
        this.pitchSamples.push(pitch)
        if (this.pitchSamples.length > 150) this.pitchSamples.shift()
      }

      // 4. Spectral Flatness (Wiener Entropy)
      const flatness = this.calculateSpectralFlatness(freqData)
      this.spectralFlatnessSamples.push(flatness)
      if (this.spectralFlatnessSamples.length > 150) this.spectralFlatnessSamples.shift()
    }

    this.animFrameId = requestAnimationFrame(this.runSampleLoop)
  }

  /**
   * Fast normalized autocorrelation for fundamental voice pitch estimation.
   */
  private estimatePitchAutocorrelation(buffer: Float32Array, sampleRate: number): number {
    const SIZE = buffer.length
    const MAX_SAMPLES = Math.floor(SIZE / 2)
    let bestOffset = -1
    let bestCorrelation = 0

    // Range: 75Hz to 450Hz (standard human vocal fundamental range)
    const minPeriod = Math.floor(sampleRate / 450)
    const maxPeriod = Math.floor(sampleRate / 75)

    for (let offset = minPeriod; offset < maxPeriod; offset++) {
      let correlation = 0
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset])
      }
      correlation = 1 - correlation / MAX_SAMPLES
      if (correlation > 0.85 && correlation > bestCorrelation) {
        bestCorrelation = correlation
        bestOffset = offset
      }
    }

    if (bestCorrelation > 0.85 && bestOffset > 0) {
      return sampleRate / bestOffset
    }
    return -1
  }

  /**
   * Calculates Wiener Entropy (Spectral Flatness) = Geometric Mean / Arithmetic Mean.
   */
  private calculateSpectralFlatness(freqData: Float32Array): number {
    let sum = 0
    let logSum = 0
    let count = 0

    // Inspect speech frequency band (150Hz - 3500Hz)
    const startBin = 4
    const endBin = Math.min(freqData.length, 80)

    for (let i = startBin; i < endBin; i++) {
      // Convert dB to linear power
      const power = Math.pow(10, freqData[i] / 10)
      if (power > 0) {
        sum += power
        logSum += Math.log(power)
        count++
      }
    }

    if (count === 0 || sum === 0) return 0.5
    const geometricMean = Math.exp(logSum / count)
    const arithmeticMean = sum / count

    return Math.min(1.0, Math.max(0.0, geometricMean / (arithmeticMean || 1)))
  }

  /**
   * Generates a comprehensive real-time Voice Authenticity Report.
   */
  getReport(virtualDeviceDetected = false): VoiceAuthenticityReport {
    const flags: string[] = []
    let penalty = 0

    // 1. Virtual audio cable check
    if (virtualDeviceDetected) {
      flags.push('Virtual Audio Cable or Loopback Device detected')
      penalty += 45
    }

    // 2. Pitch Variance / Constancy analysis
    let pitchVariance = 12.0
    let jitterEstimate = 1.2

    if (this.pitchSamples.length >= 8) {
      const meanPitch = this.pitchSamples.reduce((a, b) => a + b, 0) / this.pitchSamples.length
      const sqDiffs = this.pitchSamples.map(p => Math.pow(p - meanPitch, 2))
      pitchVariance = Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / this.pitchSamples.length)

      // Calculate sample-to-sample pitch jitter percentage
      let jitterSum = 0
      for (let i = 1; i < this.pitchSamples.length; i++) {
        jitterSum += Math.abs(this.pitchSamples[i] - this.pitchSamples[i - 1])
      }
      jitterEstimate = (jitterSum / (this.pitchSamples.length - 1)) / (meanPitch || 150) * 100

      // Robotic voice signatures: unnaturally constant pitch
      if (pitchVariance < 2.5 && this.pitchSamples.length >= 15) {
        flags.push('Robotic pitch constancy detected (abnormally low F0 variance)')
        penalty += 35
      }

      if (jitterEstimate < 0.15 && this.pitchSamples.length >= 15) {
        flags.push('Absence of natural vocal cord micro-jitter (characteristic of TTS synthesis)')
        penalty += 25
      }
    }

    // 3. Respiration & Breath Pause Check (during extended answers)
    if (this.rmsSamples.length > 80 && this.breathPauseCount === 0) {
      flags.push('No natural breathing pauses detected during sustained speech burst')
      penalty += 15
    }

    // 4. Spectral Flatness
    let avgFlatness = 0.25
    if (this.spectralFlatnessSamples.length > 0) {
      avgFlatness = this.spectralFlatnessSamples.reduce((a, b) => a + b, 0) / this.spectralFlatnessSamples.length
    }

    const authenticityScore = Math.max(0, Math.min(100, Math.round(100 - penalty)))
    const isRealHumanVoice = authenticityScore >= 60 && !virtualDeviceDetected

    let status: VoiceAuthenticityReport['status'] = 'AUTHENTIC_HUMAN_VOICE'
    if (authenticityScore < 45 || virtualDeviceDetected) {
      status = 'FLAGGED_AI_GENERATOR'
    } else if (authenticityScore < 70) {
      status = 'SUSPECTED_SYNTHETIC_VOICE'
    }

    return {
      isRealHumanVoice,
      authenticityScore,
      status,
      suspicionFlags: flags,
      biometrics: {
        pitchVariance: Number(pitchVariance.toFixed(2)),
        jitterEstimate: Number(jitterEstimate.toFixed(3)),
        spectralFlatness: Number(avgFlatness.toFixed(3)),
        breathPausesDetected: this.breathPauseCount,
        virtualDeviceDetected,
        deviceLabel: this.activeDeviceLabel,
      }
    }
  }

  stop(): void {
    this.isAnalyzing = false
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect()
      this.sourceNode = null
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {})
      this.audioContext = null
    }
  }
}
