import Groq from 'groq-sdk'
import { queryResumeChunks } from './vectorStore'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface FollowUpProbe {
  needsFollowUp: boolean
  followUpQuestion?: string
  probeReason?: string
  groundedInResume: boolean
}

/**
 * Generates an intelligent, resume-grounded follow-up probe during the live interview.
 * Catches superficial or evasive answers and tests authenticity against resume claims.
 */
export async function generateLiveFollowUpProbe(
  interviewId: string,
  question: string,
  candidateAnswer: string,
  jobTitle: string
): Promise<FollowUpProbe> {
  if (!process.env.GROQ_API_KEY || !candidateAnswer || candidateAnswer.trim().length < 15) {
    return { needsFollowUp: false, groundedInResume: false }
  }

  // 1. Retrieve related resume evidence matching what the candidate just discussed
  const chunks = await queryResumeChunks(interviewId, `${question} ${candidateAnswer}`, 2, 0.25)
  const resumeSnippet = chunks.length > 0
    ? chunks.map(c => `[Resume excerpt]: ${c.content}`).join('\n')
    : null

  const prompt = `You are a world-class technical interviewer conducting an adaptive interview for a ${jobTitle} position.
Evaluate if the candidate's answer requires a follow-up probe.

Original Question: "${question}"
Candidate Answer: "${candidateAnswer}"
${resumeSnippet ? `Relevant Candidate Resume Record:\n${resumeSnippet}` : ''}

Rules:
1. If the answer is already thorough, complete, and technically sound, set "needsFollowUp": false.
2. If the answer is vague, buzzy, lacks concrete metrics, or mentions a technology from their resume without explaining the mechanism, set "needsFollowUp": true and craft a sharp, polite follow-up question.
3. If resume record is present, tie the follow-up question directly to their claimed experience (e.g. "On your resume you mentioned X at company Y; how did you solve Z?").

Return ONLY valid JSON matching:
{
  "needsFollowUp": <boolean>,
  "followUpQuestion": "<concise question under 25 words or null>",
  "probeReason": "<why this follow-up is needed or null>"
}`

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(raw)

    return {
      needsFollowUp: Boolean(parsed.needsFollowUp && parsed.followUpQuestion),
      followUpQuestion: parsed.followUpQuestion || undefined,
      probeReason: parsed.probeReason || undefined,
      groundedInResume: Boolean(resumeSnippet && parsed.needsFollowUp),
    }
  } catch (err) {
    console.warn('generateLiveFollowUpProbe error:', err)
    return { needsFollowUp: false, groundedInResume: false }
  }
}
