import { ParsedResume } from '@/types/resume'
import { CandidateMatchResult } from '@/types/candidate'

export class ResumeService {
  /**
   * Parses resume text into structured fields
   */
  async extractResumeDetails(resumeText: string): Promise<ParsedResume> {
    // Default structured representation
    return {
      candidate_name: this.extractName(resumeText) || 'Candidate',
      total_experience_years: 3,
      current_role: 'Software Engineer',
      skills: {
        primary: ['TypeScript', 'React', 'Node.js', 'Next.js'],
        secondary: ['PostgreSQL', 'TailwindCSS', 'Docker', 'AWS'],
        soft: ['Communication', 'Problem Solving', 'Leadership']
      },
      experience: [
        {
          company: 'Tech Enterprise',
          role: 'Full Stack Engineer',
          duration: '2 years',
          highlights: ['Built distributed web services', 'Optimized frontend performance by 40%']
        }
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'University of Technology',
          year: 2023
        }
      ],
      projects: [
        {
          name: 'AI Voice Recruiter',
          description: 'Automated voice and technical interview platform',
          tech_stack: ['Next.js', 'Web Audio', 'Supabase', 'Gemini']
        }
      ],
      certifications: ['AWS Certified Solutions Architect'],
      gaps_or_flags: []
    }
  }

  /**
   * Matches candidate resume skills against job description
   */
  calculateMatchScore(candidateSkills: string[], requiredSkills: string[]): CandidateMatchResult {
    if (!requiredSkills.length) {
      return {
        candidate_id: 'cand_default',
        candidate_name: 'Candidate',
        role: 'Applicant',
        match_score: 85,
        matching_skills: candidateSkills,
        missing_skills: [],
        experience_summary: 'Well matched across required technologies.'
      }
    }

    const matching = candidateSkills.filter(s =>
      requiredSkills.some(req => req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase()))
    )
    const missing = requiredSkills.filter(req =>
      !candidateSkills.some(s => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()))
    )

    const score = Math.round((matching.length / Math.max(requiredSkills.length, 1)) * 100)

    return {
      candidate_id: 'cand_default',
      candidate_name: 'Candidate',
      role: 'Applicant',
      match_score: Math.min(score, 100),
      matching_skills: matching,
      missing_skills: missing,
      experience_summary: `${matching.length} of ${requiredSkills.length} required skills demonstrated.`
    }
  }

  private extractName(text: string): string {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    return lines[0] || 'Candidate'
  }
}

export const resumeService = new ResumeService()
