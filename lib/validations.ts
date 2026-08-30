import { z } from 'zod'

/**
 * Zod validation schemas for API routes.
 * Centralizes input validation to prevent arbitrary data insertion.
 */

// ── create-interview ────────────────────────────────────────────────
export const createInterviewSchema = z.object({
  id: z.string().uuid().optional(),
  candidate_name: z.string().min(1, 'Candidate name is required').max(200),
  candidate_email: z.string().email('Invalid email address'),
  job_title: z.string().min(1, 'Job title is required').max(300),
  job_description: z.string().max(10000).optional().default(''),
  interview_type: z.string().min(1, 'Interview type is required'),
  candidate_type: z.string().optional().default('mid'),
  duration: z.number().int().min(1).max(120).default(30),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional().default('scheduled'),
  interview_link: z.string().optional().default(''),
  recruiter_email: z.string().email().optional(),
  resume_text: z.string().max(50000).optional(),
  enable_probing: z.boolean().optional().default(false),
  enable_strict_proctoring: z.boolean().optional().default(false),
  created_at: z.string().datetime().optional(),
}).passthrough()

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>

// ── save-interview ──────────────────────────────────────────────────
export const saveInterviewSchema = z.object({
  interviewId: z.string().uuid('Invalid interview ID'),
  questions: z.array(z.string()).optional().default([]),
  answers: z.array(z.string()).optional().default([]),
  report: z.object({
    summary: z.string().optional(),
    recommendation: z.string().optional(),
    scores: z.record(z.string(), z.any()).optional(),
    strengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
    integrity_notes: z.string().optional(),
  }).optional(),
  finalScores: z.any().optional(),
  fullTranscript: z.string().optional().default(''),
})

// ── evaluate-answer ─────────────────────────────────────────────────
export const evaluateAnswerSchema = z.object({
  question: z.string().min(1),
  answer: z.string(),
  jobTitle: z.string().optional().default(''),
  interviewType: z.string().optional().default('Behavioral'),
  asrConfidence: z.number().min(0).max(1).optional().default(1.0),
})

// ── email-report ────────────────────────────────────────────────────
export const emailReportSchema = z.object({
  email: z.string().email('Valid email is required'),
  candidateName: z.string().min(1),
  jobTitle: z.string().optional().default(''),
  score: z.number().optional().default(0),
  reportLink: z.string().url().optional().default(''),
})

// ── update-status (new route) ───────────────────────────────────────
export const updateStatusSchema = z.object({
  interviewId: z.string().uuid('Invalid interview ID'),
  status: z.enum(['in_progress', 'completed', 'cancelled']),
})
