import { describe, it, expect } from 'vitest'
import { aiService } from '../ai.service'

describe('AIService', () => {
  it('should return structured questions array for a given role', async () => {
    const questions = await aiService.generateInterviewQuestions({
      role: 'Senior Backend Engineer',
      difficulty: 'senior',
      skills: ['Go', 'Kubernetes', 'PostgreSQL'],
      count: 3
    })

    expect(Array.isArray(questions)).toBe(true)
    expect(questions.length).toBeGreaterThanOrEqual(1)
    expect(typeof questions[0].text).toBe('string')
  })

  it('should evaluate code submission and return scored metrics', async () => {
    const evaluation = await aiService.evaluateCode(
      'function twoSum(nums, target) { return [0, 1]; }',
      'javascript',
      'Two Sum algorithm'
    )

    expect(evaluation).toBeDefined()
    expect(evaluation).toHaveProperty('score')
    expect(evaluation).toHaveProperty('correctness')
    expect(typeof evaluation.feedback).toBe('string')
  })
})
