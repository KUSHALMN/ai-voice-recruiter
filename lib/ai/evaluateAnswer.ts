import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface AnswerScore {
  score: number
  brief_feedback: string
}

/**
 * Evaluates a single candidate answer to a given question using the Groq API in JSON mode.
 * 
 * @param question The question asked to the candidate
 * @param answer The verbal/written answer provided by the candidate
 * @param jobTitle The job role (for contextual expectations)
 * @returns Object containing the numeric score (1-10) and feedback sentences.
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  jobTitle: string
): Promise<AnswerScore> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.')
  }

  // Handle empty or silent answers gracefully
  if (!answer || !answer.trim()) {
    return {
      score: 1,
      brief_feedback: 'No answer was provided or captured.'
    }
  }

  const prompt = `You are a professional technical interviewer. Evaluate the candidate's answer to the given question for a ${jobTitle} role.
Score the answer strictly between 1 and 10, where:
- 1-3: Poor, incorrect, or extremely shallow response.
- 4-6: Average, contains some correct details but misses important context, or has key gaps.
- 7-8: Good, covers the key points accurately and clearly.
- 9-10: Excellent, provides thorough, expert-level detail with outstanding explanation.

Provide brief constructive feedback (maximum 2 sentences).

Question: "${question}"
Candidate Answer: "${answer}"

Return ONLY a valid JSON object matching the requested schema. Do not include markdown code block backticks (like \`\`\`json), no preamble, and no explanation.

JSON Schema:
{
  "score": <number from 1 to 10>,
  "brief_feedback": "<brief feedback string>"
}`

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.1, // Low temperature for consistent rating criteria
      response_format: { type: 'json_object' }
    })

    const rawJson = chatCompletion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(rawJson) as AnswerScore

    let score = Number(result.score)
    if (isNaN(score)) score = 5
    score = Math.max(1, Math.min(10, score))

    return {
      score,
      brief_feedback: result.brief_feedback || 'Answer evaluated.'
    }
  } catch (error: any) {
    console.error('Error evaluating single answer via Groq:', error)
    return {
      score: 5, // Fallback score
      brief_feedback: 'Failed to evaluate answer. Default score applied.'
    }
  }
}
