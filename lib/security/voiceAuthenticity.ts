/**
 * Server-Side Voice Authenticity & Synthetic Speech Guardrail
 * Cross-references acoustic telemetry, response latency signatures, and cadence metrics
 * to detect candidates using AI voice synthesizers, TTS bots, or virtual audio relay cables.
 */

export interface VoiceTelemetryPayload {
  answerText: string
  responseDelaySeconds?: number
  answerDurationSeconds?: number
  virtualDeviceDetected?: boolean
  pitchVariance?: number
  jitterEstimate?: number
  breathPausesDetected?: number
  deviceLabel?: string
}

export interface VoiceAuthenticityEvaluation {
  isRealVoice: boolean
  authenticityScore: number // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  flags: string[]
  explanation: string
  enforcementAction: 'PASS' | 'WARN_CANDIDATE' | 'FLAG_INTEGRITY_VIOLATION'
}

// Spontaneous human speech markers
const HUMAN_CONVERSATIONAL_MARKERS = [
  /\b(um|uh|hmm|well|you know|i mean|like|actually|basically|so|honestly|in my experience)\b/i,
  /\b(let me think|to be honest|if i recall|as far as i remember|i would say)\b/i,
  /\b(we tried|i worked on|my team|at my previous|in that project)\b/i
]

/**
 * Validates candidate voice authenticity using multi-factor acoustic and cadence signals.
 */
export function evaluateVoiceAuthenticity(telemetry: VoiceTelemetryPayload): VoiceAuthenticityEvaluation {
  const flags: string[] = []
  let scoreDeduction = 0

  const {
    answerText,
    responseDelaySeconds = 0,
    answerDurationSeconds = 0,
    virtualDeviceDetected = false,
    pitchVariance,
    jitterEstimate,
    breathPausesDetected,
    deviceLabel = 'Microphone'
  } = telemetry

  // 1. Hardware / Device Level Check
  if (virtualDeviceDetected) {
    flags.push(`Virtual audio device detected: "${deviceLabel}". Audio loopback or synthetic routing prohibited.`)
    scoreDeduction += 50
  }

  // 2. Acoustic Biometrics (if client reported Web Audio telemetry)
  if (typeof pitchVariance === 'number' && pitchVariance < 2.5 && pitchVariance >= 0) {
    flags.push('Robotic pitch constancy detected: Unnaturally low vocal F0 variance (< 2.5Hz).')
    scoreDeduction += 30
  }

  if (typeof jitterEstimate === 'number' && jitterEstimate < 0.15 && jitterEstimate >= 0) {
    flags.push('Vocal cord jitter deficit: Absence of biological micro-perturbations typical of human vocal cords.')
    scoreDeduction += 25
  }

  if (typeof breathPausesDetected === 'number' && breathPausesDetected === 0 && answerDurationSeconds > 12) {
    flags.push('Continuous synthetic audio stream: No natural respiration or breath pauses detected during long answer.')
    scoreDeduction += 20
  }

  // 3. Cadence and Speech Delivery Dynamics
  const wordCount = answerText ? answerText.trim().split(/\s+/).filter(Boolean).length : 0
  
  if (answerDurationSeconds > 0 && wordCount > 5) {
    const wordsPerMinute = (wordCount / answerDurationSeconds) * 60

    // TTS engines frequently stream at 210-280+ WPM without natural breathing
    if (wordsPerMinute > 230) {
      flags.push(`Abnormally high speech delivery velocity (${Math.round(wordsPerMinute)} WPM) with zero hesitation.`)
      scoreDeduction += 20
    }

    // AI Relay Pipeline signature: Long initial wait (for LLM generation + TTS synthesis) followed by fluid speed
    if (responseDelaySeconds >= 4.5 && wordsPerMinute > 175) {
      flags.push(`Characteristic AI relay pipeline latency: ${responseDelaySeconds.toFixed(1)}s initial processing gap followed by immediate continuous speech.`)
      scoreDeduction += 25
    }
  }

  // 4. Check for spontaneous human speech markers
  const hasHumanMarkers = HUMAN_CONVERSATIONAL_MARKERS.some(regex => regex.test(answerText || ''))
  if (!hasHumanMarkers && wordCount > 40) {
    // Highly polished monologue without single self-repair or conversational marker
    scoreDeduction += 10
  }

  // Calculate final authenticity score
  const finalScore = Math.max(0, Math.min(100, Math.round(100 - scoreDeduction)))
  const isRealVoice = finalScore >= 60 && !virtualDeviceDetected

  let riskLevel: VoiceAuthenticityEvaluation['riskLevel'] = 'LOW'
  let enforcementAction: VoiceAuthenticityEvaluation['enforcementAction'] = 'PASS'

  if (finalScore < 45 || virtualDeviceDetected) {
    riskLevel = 'HIGH'
    enforcementAction = 'FLAG_INTEGRITY_VIOLATION'
  } else if (finalScore < 70) {
    riskLevel = 'MEDIUM'
    enforcementAction = 'WARN_CANDIDATE'
  }

  let explanation = 'Voice biometrics and delivery characteristics match authentic human speech.'
  if (flags.length > 0) {
    explanation = `Voice integrity flagged (${riskLevel} risk): ${flags.join(' ')}`
  }

  return {
    isRealVoice,
    authenticityScore: finalScore,
    riskLevel,
    flags,
    explanation,
    enforcementAction
  }
}
