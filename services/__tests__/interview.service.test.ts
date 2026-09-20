import { describe, it, expect } from 'vitest'
import { interviewService } from '../interview.service'

describe('InterviewService', () => {
  it('should retrieve scheduled interviews or fallback to empty array', async () => {
    const interviews = await interviewService.getInterviews()
    expect(Array.isArray(interviews)).toBe(true)
  })

  it('should return null for non-existent interview ID', async () => {
    const interview = await interviewService.getInterviewById('non_existent_id_9999')
    expect(interview).toBeNull()
  })

  it('should generate calibrated interview questions with required properties', async () => {
    const questions = await interviewService.generateQuestions({
      role: 'Frontend Engineer',
      skills: ['React', 'TypeScript', 'TailwindCSS'],
      difficulty: 'mid',
      count: 3
    })

    expect(Array.isArray(questions)).toBe(true)
    expect(questions.length).toBeGreaterThanOrEqual(1)

    const firstQuestion = questions[0]
    expect(firstQuestion).toHaveProperty('id')
    expect(firstQuestion).toHaveProperty('text')
    expect(firstQuestion).toHaveProperty('type')
    expect(firstQuestion).toHaveProperty('difficulty')
  })
})
