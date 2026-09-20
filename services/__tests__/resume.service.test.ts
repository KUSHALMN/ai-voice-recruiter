import { describe, it, expect } from 'vitest'
import { resumeService } from '../resume.service'

describe('ResumeService', () => {
  it('should extract structured candidate profile from resume text', async () => {
    const sampleText = 'Jane Doe\nFull Stack Engineer with 4 years experience in React and Node.js'
    const profile = await resumeService.extractResumeDetails(sampleText)

    expect(profile).toBeDefined()
    expect(profile.candidate_name).toBe('Jane Doe')
    expect(Array.isArray(profile.skills.primary)).toBe(true)
    expect(profile.skills.primary).toContain('React')
  })

  it('should calculate match score based on skill overlap', () => {
    const candidateSkills = ['React', 'TypeScript', 'Node.js', 'Next.js']
    const requiredSkills = ['React', 'TypeScript', 'AWS']

    const match = resumeService.calculateMatchScore(candidateSkills, requiredSkills)

    expect(match).toBeDefined()
    expect(match.match_score).toBeGreaterThan(0)
    expect(match.matching_skills).toContain('React')
    expect(match.matching_skills).toContain('TypeScript')
  })
})
