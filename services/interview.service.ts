import { getAdminClient } from '@/lib/supabase-admin'
import { Interview, InterviewQuestion, InterviewSession, InterviewStatus } from '@/types/interview'
import { aiService } from './ai.service'

export class InterviewService {
  /**
   * Retrieves all interviews from Supabase with fallback
   */
  async getInterviews(filter?: { status?: InterviewStatus; role?: string }): Promise<Interview[]> {
    try {
      const supabase = getAdminClient()
      let query = supabase.from('interviews').select('*').order('created_at', { ascending: false })

      if (filter?.status) {
        query = query.eq('status', filter.status)
      }
      if (filter?.role) {
        query = query.ilike('role', `%${filter.role}%`)
      }

      const { data, error } = await query
      if (error) {
        console.warn('[InterviewService.getInterviews] Database query warning:', error.message)
        return []
      }

      return (data || []).map(this.mapDbInterview)
    } catch (err: any) {
      console.error('[InterviewService.getInterviews] Error:', err.message)
      return []
    }
  }

  /**
   * Retrieves a single interview by ID
   */
  async getInterviewById(id: string): Promise<Interview | null> {
    try {
      const supabase = getAdminClient()
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        console.warn(`[InterviewService.getInterviewById] Interview ${id} not found`)
        return null
      }

      return this.mapDbInterview(data)
    } catch (err: any) {
      console.error(`[InterviewService.getInterviewById] Error fetching ${id}:`, err.message)
      return null
    }
  }

  /**
   * Creates a new interview record
   */
  async createInterview(payload: {
    candidate_name: string
    candidate_email?: string
    role: string
    job_description?: string
    difficulty?: string
    skills?: string[]
    questions?: InterviewQuestion[]
  }): Promise<Interview> {
    const supabase = getAdminClient()

    const newRecord = {
      candidate_name: payload.candidate_name,
      candidate_email: payload.candidate_email || null,
      role: payload.role,
      job_description: payload.job_description || null,
      difficulty: payload.difficulty || 'mid',
      skills: payload.skills || [],
      questions: payload.questions || [],
      status: 'scheduled',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('interviews')
      .insert([newRecord])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create interview: ${error.message}`)
    }

    return this.mapDbInterview(data)
  }

  /**
   * Updates interview status
   */
  async updateStatus(id: string, status: InterviewStatus): Promise<boolean> {
    try {
      const supabase = getAdminClient()
      const { error } = await supabase
        .from('interviews')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      return !error
    } catch (err: any) {
      console.error(`[InterviewService.updateStatus] Error updating status for ${id}:`, err.message)
      return false
    }
  }

  /**
   * Saves interview session progress & answers
   */
  async saveSession(interviewId: string, sessionData: Partial<InterviewSession>): Promise<any> {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('interview_sessions')
      .upsert({
        interview_id: interviewId,
        ...sessionData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.warn('[InterviewService.saveSession] Upsert error:', error.message)
    }

    return data || sessionData
  }

  /**
   * Generates AI questions tailored to role, description, and difficulty
   */
  async generateQuestions(params: {
    role: string
    jobDescription?: string
    difficulty?: string
    skills?: string[]
    count?: number
  }): Promise<InterviewQuestion[]> {
    return aiService.generateInterviewQuestions(params)
  }

  private mapDbInterview(dbRecord: any): Interview {
    return {
      id: dbRecord.id,
      candidate_name: dbRecord.candidate_name || dbRecord.candidate || 'Unknown Candidate',
      candidate_email: dbRecord.candidate_email || dbRecord.email,
      role: dbRecord.role || dbRecord.job_title || 'Software Engineer',
      job_description: dbRecord.job_description || dbRecord.jd,
      difficulty: dbRecord.difficulty || 'mid',
      status: dbRecord.status || 'scheduled',
      created_at: dbRecord.created_at || new Date().toISOString(),
      scheduled_at: dbRecord.scheduled_at,
      questions: dbRecord.questions || [],
      skills: dbRecord.skills || [],
      experience_years: dbRecord.experience_years || dbRecord.years_experience
    }
  }
}

export const interviewService = new InterviewService()
