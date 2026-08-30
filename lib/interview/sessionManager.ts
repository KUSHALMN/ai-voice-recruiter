import { verifyCandidateJWT } from '../auth-candidate'

export interface AnsweredQuestion {
  id: string
  answer: string
  score: number
  text: string
  feedback: string
}

export interface InterviewState {
  interviewId: string
  sessionId: string
  currentQuestionIndex: number
  answeredQuestions: AnsweredQuestion[]
  difficultyLevel: 'easy' | 'medium' | 'hard'
  startedAt: string
  lastSavedAt: string
}

/**
 * Manages saving and restoring candidate interview progress to localStorage and Supabase.
 */
export class InterviewSessionManager {
  private storageKey: string
  private interviewId: string
  public candidateToken: string

  constructor(interviewId: string, candidateToken: string) {
    this.interviewId = interviewId
    this.candidateToken = candidateToken
    this.storageKey = `interview_session_${interviewId}`
  }

  /**
   * Save interview progress to localStorage (sync) and send a backup to Supabase (async, non-blocking)
   */
  async saveProgress(state: InterviewState): Promise<void> {
    const updatedState = {
      ...state,
      lastSavedAt: new Date().toISOString()
    }

    // 1. Save to localStorage immediately
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updatedState))
    } catch (err) {
      console.error('Failed to write to localStorage:', err)
    }

    // 2. Sync to Supabase in the background
    fetch(`/api/interview/session/${state.sessionId}/progress`, {
      method: 'POST', // or PATCH
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.candidateToken}`
      },
      body: JSON.stringify({
        currentQuestionIndex: updatedState.currentQuestionIndex,
        difficultyLevel: updatedState.difficultyLevel,
        answeredQuestions: updatedState.answeredQuestions
      })
    }).catch(err => {
      console.error('Background Supabase progress sync failed:', err)
    })
  }

  /**
   * Restores session progress by comparing local storage and database states,
   * returning the most recent authoritative state.
   */
  async restoreSession(): Promise<InterviewState | null> {
    if (typeof window === 'undefined') return null

    // 1. Fetch from localStorage
    let localState: InterviewState | null = null
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        localState = JSON.parse(stored) as InterviewState
      }
    } catch (err) {
      console.error('Failed to read from localStorage:', err)
    }

    // 2. Fetch from Supabase
    let dbState: InterviewState | null = null
    try {
      // We can fetch the session details directly from a public endpoint or session route.
      // Wait, let's call the GET endpoint or POST with 'start' which retrieves the existing session!
      // In app/api/interview/[id]/session/route.ts, POST action 'start' returns:
      // { success: true, sessionId, currentQuestionIndex, difficultyLevel, questions, answers, scores }
      const res = await fetch(`/api/interview/${this.interviewId}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'start' })
      })

      const data = await res.json()
      if (data.success && data.sessionId) {
        this.candidateToken = data.sessionToken || ''
        // Construct InterviewState from DB values
        const dbAnswers: string[] = data.answers || []
        const dbScores: any[] = data.scores || []
        const dbQuestionsText: string[] = data.questions || []

        // Reconstruct answeredQuestions array
        const answeredQuestions: AnsweredQuestion[] = []
        
        // Match up answers with their scores and questions
        for (let i = 0; i < dbAnswers.length; i++) {
          const scoreObj = dbScores[i] || {}
          answeredQuestions.push({
            id: scoreObj.questionId || `q-idx-${i}`,
            text: scoreObj.questionText || dbQuestionsText[i] || '',
            answer: dbAnswers[i],
            score: scoreObj.score || 5,
            feedback: scoreObj.feedback || ''
          })
        }

        dbState = {
          interviewId: this.interviewId,
          sessionId: data.sessionId,
          currentQuestionIndex: data.currentQuestionIndex || 0,
          difficultyLevel: data.difficultyLevel || 'medium',
          answeredQuestions,
          startedAt: new Date().toISOString(), // Fallback
          lastSavedAt: new Date().toISOString() // Database state is considered saved now
        }
      }
    } catch (err) {
      console.error('Failed to fetch session progress from DB:', err)
    }

    // 3. Resolve the authoritative state
    if (!localState && !dbState) return null
    if (localState && !dbState) return localState
    if (!localState && dbState) return dbState

    // Both exist, resolve conflict
    if (localState && dbState) {
      // Prioritize the state with more answered questions to prevent progress loss
      if (localState.answeredQuestions.length > dbState.answeredQuestions.length) {
        console.log('⚡ Restoring from local state (more questions answered).')
        return localState
      }
      if (dbState.answeredQuestions.length > localState.answeredQuestions.length) {
        console.log('⚡ Restoring from DB state (more questions answered in DB).')
        return dbState
      }

      // If equal, check timestamps
      const localTime = new Date(localState.lastSavedAt).getTime()
      const dbTime = new Date(dbState.lastSavedAt).getTime()

      if (localTime >= dbTime) {
        console.log('⚡ Restoring from local state (newer timestamp).')
        return localState
      } else {
        console.log('⚡ Restoring from DB state (newer timestamp).')
        return dbState
      }
    }

    return null
  }

  /**
   * Clears session progress in localStorage (called upon interview completion)
   */
  clearSession(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(this.storageKey)
      console.log(`🧹 Cleared session progress in localStorage for key: ${this.storageKey}`)
    } catch (err) {
      console.error('Failed to clear localStorage session:', err)
    }
  }
}
