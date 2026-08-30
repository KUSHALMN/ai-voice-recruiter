import Groq from 'groq-sdk'
import { ParsedResume, QuestionSet, GeneratedQuestion } from '@/types/resume'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

/**
 * Generates structured interview questions tailored to the candidate's resume (if provided)
 * or fallback to role-based questions. Uses Groq API with JSON mode.
 */
export async function generateQuestionSet(
  jobTitle: string,
  jobDescription: string,
  interviewType: string,
  candidateType: string,
  duration: number,
  parsedResume?: ParsedResume
): Promise<QuestionSet> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.')
  }

  // 1. Determine Question Count (average 3 mins per question, min 3 questions)
  const questionCount = Math.max(3, Math.floor(duration / 3))

  // 2. Prepare Difficulty Distribution
  const easyCount = Math.max(1, Math.round(questionCount * 0.3))
  const hardCount = Math.max(1, Math.round(questionCount * 0.2))
  const mediumCount = Math.max(1, questionCount - easyCount - hardCount)

  const difficultyTargets = `${easyCount} easy, ${mediumCount} medium, and ${hardCount} hard questions`

  let prompt = ''

  if (parsedResume && parsedResume.candidate_name) {
    // Mode 1: With Resume Prompt
    prompt = `You are a senior technical interviewer. Generate a structured set of interview questions for:

Role: ${jobTitle}
Job Description: ${jobDescription}
Interview Type: ${interviewType}
Candidate Level: ${candidateType}

Candidate's Resume Summary:
- Name: ${parsedResume.candidate_name}
- Total Experience: ${parsedResume.total_experience_years || 'Not specified'} years
- Current Role: ${parsedResume.current_role || 'Not specified'}
- Primary Skills: ${parsedResume.skills?.primary?.join(', ') || 'Not specified'}
- Key Projects: ${parsedResume.projects?.map(p => `${p.name}: ${p.description}`).join(' | ') || 'None specified'}
- Red Flags to probe: ${parsedResume.gaps_or_flags?.join(', ') || 'None'}

Generate exactly ${questionCount} questions. The target difficulty distribution is: ${difficultyTargets}.
Your questions must include a mix of:
1. Questions that reference their SPECIFIC projects/experience (most impactful).
2. Core technical questions for the role of ${jobTitle}.
3. Behavioral questions based on their background.
4. At least 1 question probing any red flags or employment gaps if listed.

Return ONLY a valid JSON object matching the JSON schema below. No markdown backticks (such as \`\`\`json), no preamble, and no explanation.

JSON Schema:
{
  "questions": [
    {
      "id": "<generate a random UUID>",
      "text": "<the question>",
      "type": "technical" | "behavioral" | "situational",
      "difficulty": "easy" | "medium" | "hard",
      "target_skill": "<what this question tests>",
      "ideal_answer_hints": ["<key point 1 recruiter should look for>", "<key point 2>"],
      "follow_up": "<optional follow-up question if they give a shallow answer>"
    }
  ]
}`
  } else {
    // Mode 2: Without Resume Prompt (Generic)
    prompt = `You are a senior technical interviewer. Generate a structured set of generic interview questions for:

Role: ${jobTitle}
Job Description: ${jobDescription}
Interview Type: ${interviewType}
Candidate Level: ${candidateType}

Generate exactly ${questionCount} questions. The target difficulty distribution is: ${difficultyTargets}.
Include a mix of:
1. Core technical questions for the role of ${jobTitle}.
2. Situational and behavioral questions appropriate for ${candidateType} level.

Return ONLY a valid JSON object matching the JSON schema below. No markdown backticks (such as \`\`\`json), no preamble, and no explanation.

JSON Schema:
{
  "questions": [
    {
      "id": "<generate a random UUID>",
      "text": "<the question>",
      "type": "technical" | "behavioral" | "situational",
      "difficulty": "easy" | "medium" | "hard",
      "target_skill": "<what this question tests>",
      "ideal_answer_hints": ["<key point 1 recruiter should look for>", "<key point 2>"],
      "follow_up": "<optional follow-up question if they give a shallow answer>"
    }
  ]
}`
  }

  // 3. Call Groq with JSON Mode
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const rawJson = response.choices[0]?.message?.content || '{}'
    const questionSet = JSON.parse(rawJson) as QuestionSet

    // 4. Fill in dynamic IDs if the model didn't generate valid UUIDs
    if (questionSet.questions && Array.isArray(questionSet.questions)) {
      questionSet.questions = questionSet.questions.map((q, idx) => ({
        ...q,
        id: q.id && q.id.length > 10 ? q.id : crypto.randomUUID()
      }))
    } else {
      questionSet.questions = []
    }

    return questionSet
  } catch (error: any) {
    console.error('Error generating question set via Groq:', error)
    throw new Error(`Failed to generate question set: ${error.message || error}`)
  }
}
