/**
 * Report & Analytics Domain Types
 */

export type RecommendationType = 'strong_hire' | 'hire' | 'lean_hire' | 'lean_no_hire' | 'no_hire'

export interface SkillScore {
  skill: string
  score: number // 0-100
  assessment: string
  evidence?: string[]
}

export interface CheatingFlag {
  type: string
  timestamp: string | number
  severity: 'low' | 'medium' | 'high'
  description: string
}

export interface CandidateReport {
  id: string
  interview_id: string
  candidate_name: string
  role: string
  overall_score: number // 0-100
  technical_score: number
  behavioral_score: number
  communication_score: number
  problem_solving_score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendation: RecommendationType
  skills_breakdown: SkillScore[]
  integrity_flags?: CheatingFlag[]
  transcript_summary?: string
  created_at: string
  candidate_email?: string
  ai_model_used?: string
  audio_recording_url?: string
}
