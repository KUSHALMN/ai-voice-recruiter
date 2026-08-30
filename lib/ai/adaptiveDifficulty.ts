export interface Question {
  id: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'technical' | 'behavioral' | 'situational'
  target_skill: string
  ideal_answer_hints: string[]
  follow_up?: string
}

export interface DifficultyAction {
  newDifficulty: 'easy' | 'medium' | 'hard'
  shouldAddBonusQuestion: boolean
  bonusQuestionHint?: string
}

export interface AdaptiveDifficultyState {
  currentDifficulty: 'easy' | 'medium' | 'hard'
  consecutiveGood: number
  consecutiveBad: number
  answeredCount: number
  scoreHistory: number[]
}

/**
 * Manages dynamically adjusting question difficulty in real-time based on candidate performance.
 */
export class AdaptiveDifficultyEngine {
  private state: AdaptiveDifficultyState

  constructor(initialState?: Partial<AdaptiveDifficultyState>) {
    this.state = {
      currentDifficulty: initialState?.currentDifficulty || 'medium',
      consecutiveGood: initialState?.consecutiveGood || 0,
      consecutiveBad: initialState?.consecutiveBad || 0,
      answeredCount: initialState?.answeredCount || 0,
      scoreHistory: initialState?.scoreHistory || []
    }
  }

  /**
   * Records a new score and computes the resulting difficulty transitions
   * 
   * - 2 consecutive good answers (>= 7/10) -> increase difficulty
   * - 2 consecutive bad answers (<= 4/10) -> decrease difficulty
   * - Max difficulty with good answers -> add bonus challenge question
   * - Min difficulty with bad answers -> add supportive behavioral question
   */
  recordAnswer(score: number): DifficultyAction {
    this.state.scoreHistory.push(score)
    this.state.answeredCount++

    let shouldAddBonusQuestion = false
    let bonusQuestionHint: string | undefined = undefined
    let newDifficulty = this.state.currentDifficulty

    if (score >= 7) {
      this.state.consecutiveGood++
      this.state.consecutiveBad = 0

      if (this.state.consecutiveGood >= 2) {
        if (this.state.currentDifficulty === 'easy') {
          newDifficulty = 'medium'
          this.state.consecutiveGood = 0
        } else if (this.state.currentDifficulty === 'medium') {
          newDifficulty = 'hard'
          this.state.consecutiveGood = 0
        } else if (this.state.currentDifficulty === 'hard') {
          shouldAddBonusQuestion = true
          bonusQuestionHint = 'Generate an advanced technical problem or deep architectural challenge.'
          this.state.consecutiveGood = 0
        }
      }
    } else if (score <= 4) {
      this.state.consecutiveBad++
      this.state.consecutiveGood = 0

      if (this.state.consecutiveBad >= 2) {
        if (this.state.currentDifficulty === 'hard') {
          newDifficulty = 'medium'
          this.state.consecutiveBad = 0
        } else if (this.state.currentDifficulty === 'medium') {
          newDifficulty = 'easy'
          this.state.consecutiveBad = 0
        } else if (this.state.currentDifficulty === 'easy') {
          shouldAddBonusQuestion = true
          bonusQuestionHint = 'Generate a supportive behavioral or basic conceptual question to rebuild confidence.'
          this.state.consecutiveBad = 0
        }
      }
    } else {
      // Score is neutral (5 or 6) -> reset consecutive counts
      this.state.consecutiveGood = 0
      this.state.consecutiveBad = 0
    }

    this.state.currentDifficulty = newDifficulty

    return {
      newDifficulty,
      shouldAddBonusQuestion,
      bonusQuestionHint
    }
  }

  /**
   * Picks the next unanswered question from the pool prioritizing current difficulty level
   * fallback to closest difficulty if unavailable
   */
  getNextQuestion(questionPool: Question[], answeredIds: string[]): Question | null {
    // 1. Exact match
    let match = questionPool.find(
      q => q.difficulty === this.state.currentDifficulty && !answeredIds.includes(q.id)
    )
    if (match) return match

    // 2. Fallback to closest difficulty
    const difficultyOrder: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
    const currentIndex = difficultyOrder.indexOf(this.state.currentDifficulty)

    // Check adjacent difficulties (offset 1, -1, 2, -2)
    const offsets = [1, -1, 2, -2]
    for (const offset of offsets) {
      const checkIdx = currentIndex + offset
      if (checkIdx >= 0 && checkIdx < difficultyOrder.length) {
        const checkDiff = difficultyOrder[checkIdx]
        const fallbackMatch = questionPool.find(
          q => q.difficulty === checkDiff && !answeredIds.includes(q.id)
        )
        if (fallbackMatch) return fallbackMatch
      }
    }

    // 3. Fallback to any remaining unanswered question
    return questionPool.find(q => !answeredIds.includes(q.id)) || null
  }

  /**
   * Reconstructs the state of the engine by feeding historical score progression
   */
  static reconstructFromHistory(scoreHistory: number[]): AdaptiveDifficultyEngine {
    const engine = new AdaptiveDifficultyEngine()
    for (const score of scoreHistory) {
      engine.recordAnswer(score)
    }
    return engine
  }

  /**
   * Calculates overall session stats and candidate performance trends
   */
  getSessionStats(): { avgScore: number; trend: 'improving' | 'stable' | 'declining' } {
    const count = this.state.scoreHistory.length
    if (count === 0) {
      return { avgScore: 0, trend: 'stable' }
    }

    const sum = this.state.scoreHistory.reduce((s, a) => s + a, 0)
    const avgScore = Number((sum / count).toFixed(1))

    if (count < 2) {
      return { avgScore, trend: 'stable' }
    }

    // Compare averages of first and second half of scores
    const half = Math.floor(count / 2)
    const firstHalf = this.state.scoreHistory.slice(0, half)
    const secondHalf = this.state.scoreHistory.slice(half)

    const firstAvg = firstHalf.reduce((s, a) => s + a, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((s, a) => s + a, 0) / secondHalf.length

    let trend: 'improving' | 'stable' | 'declining' = 'stable'
    const diff = secondAvg - firstAvg

    if (diff > 1.0) trend = 'improving'
    else if (diff < -1.0) trend = 'declining'

    return { avgScore, trend }
  }

  getState(): AdaptiveDifficultyState {
    return this.state
  }
}
