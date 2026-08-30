export interface ExperienceItem {
  company: string
  role: string
  duration: string
  highlights: string[]
}

export interface EducationItem {
  degree: string
  institution: string
  year: number | null
}

export interface ProjectItem {
  name: string
  description: string
  tech_stack: string[]
}

export interface ParsedResume {
  candidate_name: string
  total_experience_years: number | null
  current_role: string | null
  skills: {
    primary: string[]
    secondary: string[]
    soft: string[]
  }
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
  certifications: string[]
  gaps_or_flags: string[]
}

export interface GeneratedQuestion {
  id: string
  text: string
  type: 'technical' | 'behavioral' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
  target_skill: string
  ideal_answer_hints: string[]
  follow_up?: string
}

export interface QuestionSet {
  questions: GeneratedQuestion[]
}
