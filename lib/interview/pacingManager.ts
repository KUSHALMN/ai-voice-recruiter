/**
 * Interview Pacing Engine
 * Manages time-budgeted question allocation and dynamic in-session pacing
 * to prevent overwhelming candidates and ensure graceful interview conclusions.
 */

export interface PacingTarget {
  minQuestions: number
  targetQuestions: number
  maxQuestions: number
  estimatedSecondsPerQuestion: number
}

export type PacingStatus = 'ahead' | 'on_track' | 'behind' | 'wrapping_up' | 'time_expired'

export interface PacingEvaluation {
  status: PacingStatus
  canAskAnother: boolean
  isWrapUpPhase: boolean
  recommendedAction: 'continue' | 'ask_final' | 'wrap_up' | 'end_now'
  statusMessage: string
  paceColor: string
  timeRemainingSeconds: number
  percentTimeRemaining: number
}

// Minimum buffer time required to begin and properly answer a new question (75 seconds)
export const MIN_QUESTION_TIME_BUFFER_SECONDS = 75

// Buffer time for interview intro and outro (in minutes)
export const SETUP_AND_WRAPUP_BUFFER_MINUTES = 1.5

/**
 * Calculates realistic question count targets based on interview duration and type.
 * Ensures questions are paced at roughly 2.5 - 3.5 minutes per question.
 */
export function calculateTargetQuestions(
  durationMinutes: number,
  interviewType: string = 'technical'
): PacingTarget {
  const duration = Math.max(1, durationMinutes || 15)
  const normalizedType = (interviewType || 'technical').toLowerCase()

  // Determine ideal seconds per question based on interview domain
  let idealSecondsPerQ = 180 // Default 3 minutes
  if (normalizedType.includes('technical') || normalizedType.includes('coding')) {
    idealSecondsPerQ = 200 // ~3.3 minutes for coding and architecture
  } else if (normalizedType.includes('behavioral') || normalizedType.includes('culture')) {
    idealSecondsPerQ = 150 // ~2.5 minutes for behavioral answers
  } else if (normalizedType.includes('leadership')) {
    idealSecondsPerQ = 180 // ~3 minutes
  }

  const effectiveSeconds = Math.max(60, (duration * 60) - (SETUP_AND_WRAPUP_BUFFER_MINUTES * 60))
  const calculatedTarget = Math.round(effectiveSeconds / idealSecondsPerQ)

  // Calibrate lower and upper bounds based on standard interview brackets
  let minQuestions: number
  let targetQuestions: number
  let maxQuestions: number

  if (duration <= 5) {
    minQuestions = 2
    targetQuestions = 2
    maxQuestions = 3
  } else if (duration <= 10) {
    minQuestions = 2
    targetQuestions = 3
    maxQuestions = 4
  } else if (duration <= 15) {
    minQuestions = 3
    targetQuestions = Math.max(4, calculatedTarget)
    maxQuestions = 5
  } else if (duration <= 20) {
    minQuestions = 4
    targetQuestions = Math.max(5, calculatedTarget)
    maxQuestions = 7
  } else if (duration <= 30) {
    minQuestions = 6
    targetQuestions = Math.max(7, calculatedTarget)
    maxQuestions = 9
  } else if (duration <= 45) {
    minQuestions = 8
    targetQuestions = Math.max(10, calculatedTarget)
    maxQuestions = 13
  } else {
    // 60+ minutes
    minQuestions = 10
    targetQuestions = Math.max(12, Math.min(16, calculatedTarget))
    maxQuestions = 16
  }

  return {
    minQuestions,
    targetQuestions,
    maxQuestions,
    estimatedSecondsPerQuestion: idealSecondsPerQ
  }
}

/**
 * Real-time evaluator that assesses candidate pacing and determines if another question should be asked.
 */
export function evaluateInterviewPacing(options: {
  timeLeftSeconds: number
  totalDurationMinutes: number
  questionsAnsweredCount: number
  targetQuestionsCount: number
}): PacingEvaluation {
  const {
    timeLeftSeconds,
    totalDurationMinutes,
    questionsAnsweredCount,
    targetQuestionsCount
  } = options

  const totalDurationSeconds = Math.max(60, totalDurationMinutes * 60)
  const percentTimeRemaining = Math.max(0, Math.min(100, (timeLeftSeconds / totalDurationSeconds) * 100))
  const timeElapsedSeconds = totalDurationSeconds - timeLeftSeconds

  // 1. Time is practically expired (< 15 seconds)
  if (timeLeftSeconds <= 15) {
    return {
      status: 'time_expired',
      canAskAnother: false,
      isWrapUpPhase: true,
      recommendedAction: 'end_now',
      statusMessage: 'Time Expired',
      paceColor: 'text-red-500',
      timeRemainingSeconds: timeLeftSeconds,
      percentTimeRemaining
    }
  }

  // 2. Wrap-up phase (< 75 seconds left)
  // Not enough time to present, formulate, and answer another question without getting cut off
  if (timeLeftSeconds < MIN_QUESTION_TIME_BUFFER_SECONDS) {
    return {
      status: 'wrapping_up',
      canAskAnother: false,
      isWrapUpPhase: true,
      recommendedAction: 'wrap_up',
      statusMessage: 'Wrapping Up',
      paceColor: 'text-amber-500',
      timeRemainingSeconds: timeLeftSeconds,
      percentTimeRemaining
    }
  }

  // 3. Final minute warning (< 120 seconds left)
  if (timeLeftSeconds < 120) {
    const isFinalAllowed = questionsAnsweredCount < targetQuestionsCount
    return {
      status: 'wrapping_up',
      canAskAnother: isFinalAllowed,
      isWrapUpPhase: true,
      recommendedAction: isFinalAllowed ? 'ask_final' : 'wrap_up',
      statusMessage: isFinalAllowed ? 'Final Question' : 'Wrapping Up',
      paceColor: 'text-amber-500',
      timeRemainingSeconds: timeLeftSeconds,
      percentTimeRemaining
    }
  }

  // 4. In-progress pacing calculation
  const expectedQuestionsAtThisPoint = (timeElapsedSeconds / totalDurationSeconds) * targetQuestionsCount
  const delta = questionsAnsweredCount - expectedQuestionsAtThisPoint

  let status: PacingStatus = 'on_track'
  let statusMessage = 'On Track'
  let paceColor = 'text-emerald-500'

  if (delta > 0.8) {
    status = 'ahead'
    statusMessage = 'Ahead of Schedule'
    paceColor = 'text-blue-500'
  } else if (delta < -1.0) {
    status = 'behind'
    statusMessage = 'Deliberate Pace'
    paceColor = 'text-amber-500'
  }

  return {
    status,
    canAskAnother: true,
    isWrapUpPhase: false,
    recommendedAction: 'continue',
    statusMessage,
    paceColor,
    timeRemainingSeconds: timeLeftSeconds,
    percentTimeRemaining
  }
}
