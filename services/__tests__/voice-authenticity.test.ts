import { describe, it, expect } from 'vitest'
import { evaluateVoiceAuthenticity } from '@/lib/security/voiceAuthenticity'
import { VoiceAuthenticityDetector } from '@/lib/audio/voiceAuthenticityDetector'

describe('Voice Authenticity & Synthetic Speech Detection System', () => {
  describe('evaluateVoiceAuthenticity', () => {
    it('should verify natural human speech with high authenticity score and pass action', () => {
      const evaluation = evaluateVoiceAuthenticity({
        answerText: 'Well, in my previous role at Acme, we worked on scaling PostgreSQL queries, and um, honestly it took us a few weeks to optimize the indexes.',
        responseDelaySeconds: 1.2,
        answerDurationSeconds: 14.5,
        virtualDeviceDetected: false,
        pitchVariance: 14.2,
        jitterEstimate: 1.4,
        breathPausesDetected: 3,
        deviceLabel: 'Realtek High Definition Audio'
      })

      expect(evaluation.isRealVoice).toBe(true)
      expect(evaluation.authenticityScore).toBeGreaterThanOrEqual(80)
      expect(evaluation.riskLevel).toBe('LOW')
      expect(evaluation.enforcementAction).toBe('PASS')
      expect(evaluation.flags.length).toBe(0)
    })

    it('should flag virtual audio cable loopback devices with high risk', () => {
      const evaluation = evaluateVoiceAuthenticity({
        answerText: 'A binary search tree is a node-based binary tree data structure.',
        virtualDeviceDetected: true,
        deviceLabel: 'VB-Audio Virtual Cable (Input)'
      })

      expect(evaluation.isRealVoice).toBe(false)
      expect(evaluation.riskLevel).toBe('HIGH')
      expect(evaluation.enforcementAction).toBe('FLAG_INTEGRITY_VIOLATION')
      expect(evaluation.flags.some(f => f.includes('Virtual audio device detected'))).toBe(true)
    })

    it('should detect robotic pitch constancy and lack of vocal jitter characteristic of TTS voices', () => {
      const evaluation = evaluateVoiceAuthenticity({
        answerText: 'Microservices architecture arranges an application as a collection of loosely coupled services.',
        responseDelaySeconds: 4.8,
        answerDurationSeconds: 18.0,
        pitchVariance: 1.1, // robotic constant pitch
        jitterEstimate: 0.05, // zero natural vocal micro-jitter
        breathPausesDetected: 0 // no natural breathing pauses
      })

      expect(evaluation.isRealVoice).toBe(false)
      expect(evaluation.authenticityScore).toBeLessThan(60)
      expect(evaluation.flags.some(f => f.includes('Robotic pitch constancy'))).toBe(true)
      expect(evaluation.flags.some(f => f.includes('Vocal cord jitter deficit'))).toBe(true)
    })

    it('should detect characteristic AI voice relay pipeline latency combined with unnatural velocity', () => {
      const longMonologue = 'We implemented an event driven microservice pattern using Apache Kafka to decouple order ingestion from billing and inventory updates across distributed nodes.'
      const evaluation = evaluateVoiceAuthenticity({
        answerText: longMonologue,
        responseDelaySeconds: 5.5, // 5.5s delay while candidate queries LLM & triggers TTS
        answerDurationSeconds: 5.0, // extremely rapid non-stop speech (over 250 WPM)
      })

      expect(evaluation.flags.some(f => f.includes('AI relay pipeline latency'))).toBe(true)
    })
  })

  describe('VoiceAuthenticityDetector Biometrics Engine', () => {
    it('should initialize and produce baseline authenticity reports', () => {
      const detector = new VoiceAuthenticityDetector()
      const report = detector.getReport(false)

      expect(report).toBeDefined()
      expect(report.isRealHumanVoice).toBe(true)
      expect(report.authenticityScore).toBeGreaterThanOrEqual(70)
      expect(report.biometrics).toBeDefined()
      expect(report.biometrics.virtualDeviceDetected).toBe(false)
    })

    it('should identify virtual loopback flag in report when detected', () => {
      const detector = new VoiceAuthenticityDetector()
      const report = detector.getReport(true)

      expect(report.isRealHumanVoice).toBe(false)
      expect(report.status).toBe('FLAGGED_AI_GENERATOR')
      expect(report.biometrics.virtualDeviceDetected).toBe(true)
      expect(report.suspicionFlags.some(f => f.includes('Virtual Audio Cable'))).toBe(true)
    })
  })
})
