/**
 * Candidate & Talent Acquisition Types
 */

import { ParsedResume } from './resume'

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  role_applied: string
  resume_url?: string
  parsed_resume?: ParsedResume
  status: 'applied' | 'screening' | 'interviewed' | 'offered' | 'rejected'
  created_at: string
  match_score?: number
}

export interface CandidateMatchResult {
  candidate_id: string
  candidate_name: string
  role: string
  match_score: number
  matching_skills: string[]
  missing_skills: string[]
  experience_summary: string
}
