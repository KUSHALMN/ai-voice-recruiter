/**
 * Interview Domain Types & Schemas
 */

export type InterviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'pending'
export type InterviewDifficulty = 'entry' | 'mid' | 'senior' | 'lead' | 'easy' | 'medium' | 'hard'
export type InterviewMode = 'voice' | 'text' | 'mixed' | 'technical'

export interface InterviewQuestion {
  id: string
  text: string
  type: 'technical' | 'behavioral' | 'situational' | 'system_design'
  difficulty: 'easy' | 'medium' | 'hard'
  target_skill: string
  ideal_answer_hints: string[]
  follow_up?: string
  expected_duration_seconds?: number
}

export interface TranscriptMessage {
  id?: string
  sender: 'ai' | 'candidate' | 'system'
  text: string
  timestamp: string | number
  audioUrl?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  duration?: number
}

export interface CodeSubmission {
  code: string
  language: string
  questionId?: string
  timestamp?: number
}

export interface CodeEvaluationResult {
  score: number
  correctness: number
  efficiency: number
  readability: number
  feedback: string
  testResults?: {
    passed: boolean
    input: string
    expected: string
    actual: string
  }[]
  suggestions?: string[]
}

export interface IntegrityEvent {
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'voice_anomaly'
  timestamp: number
  details?: string
}

export interface InterviewSession {
  id: string
  interview_id: string
  candidate_id?: string
  status: InterviewStatus
  started_at: string
  completed_at?: string
  current_question_index: number
  total_questions: number
  score?: number
  transcript: TranscriptMessage[]
  integrity_events?: IntegrityEvent[]
  code_submissions?: CodeSubmission[]
}

export interface Interview {
  id: string
  candidate_name: string
  candidate_email?: string
  role: string
  job_description?: string
  difficulty: InterviewDifficulty
  status: InterviewStatus
  created_at: string
  scheduled_at?: string
  questions?: InterviewQuestion[]
  skills?: string[]
  experience_years?: number
  resume_url?: string
  report_id?: string
  duration_minutes?: number
}
