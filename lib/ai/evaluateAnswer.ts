import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface AnswerScore {
  score: number
  brief_feedback: string
  rubric_grounded?: boolean
  rubric_concept?: string
  criteria_met?: string[]
}

/**
 * Evaluates a single candidate answer to a given question using the Groq API in JSON mode,
 * objectively grounded against RAG-retrieved evaluation rubrics.
 * 
 * @param question The question asked to the candidate
 * @param answer The verbal/written answer provided by the candidate
 * @param jobTitle The job role (for contextual expectations)
 * @param category Optional category hint for rubric retrieval
 * @returns Object containing the numeric score (1-10) and feedback sentences.
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  jobTitle: string,
  category?: string
): Promise<AnswerScore> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.')
  }

  // Handle empty or silent answers gracefully
  if (!answer || !answer.trim()) {
    return {
      score: 1,
      brief_feedback: 'No answer was provided or captured.',
      rubric_grounded: false,
    }
  }

  // Option B: Retrieve gold-standard evaluation rubric via RAG
  let rubricContext = ''
  let rubricConcept = ''
  let isRubricGrounded = false

  try {
    const { retrieveRubricForQuestion } = await import('@/lib/rag/rubricEvaluator')
    const rubric = await retrieveRubricForQuestion(question, category)
    if (rubric && rubric.isGrounded) {
      isRubricGrounded = true
      rubricConcept = rubric.questionConcept
      rubricContext = `
GOLD-STANDARD EVALUATION RUBRIC (Retrieved via RAG):
Target Concept: "${rubric.questionConcept}"
Ideal Reference Answer: "${rubric.idealAnswer}"
Grading Criteria to Verify:
${rubric.criteria.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}

Instructions for Objective Scoring:
- Score 9-10 if candidate covers almost all criteria with technical precision.
- Score 7-8 if candidate covers majority of criteria clearly.
- Score 4-6 if candidate partially covers concepts but misses key technical depth.
- Score 1-3 if answer is incorrect, shallow, or misses the core concept.
`.trim()
    }
  } catch (rubricErr) {
    console.warn('Evaluation rubric RAG retrieval warning:', rubricErr)
  }

  const prompt = `You are a professional, unbiased technical interviewer. Evaluate the candidate's answer to the given question for a ${jobTitle} role.
${rubricContext ? `\n${rubricContext}\n` : `Score strictly between 1 and 10 based on depth, technical accuracy, and clarity.`}

Question: "${question}"
Candidate Answer: "${answer}"

Provide brief constructive feedback (maximum 2 sentences).
Identify any verified criteria met from the rubric if available.

Return ONLY a valid JSON object matching the requested schema. Do not include markdown code block backticks (like \`\`\`json), no preamble, and no explanation.

JSON Schema:
{
  "score": <number from 1 to 10>,
  "brief_feedback": "<brief feedback string>",
  "criteria_met": ["<criterion 1 satisfied>", "<criterion 2 satisfied>"]
}`

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.1, // Low temperature for consistent rating criteria
      response_format: { type: 'json_object' }
    })

    const rawJson = chatCompletion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(rawJson)

    let score = Number(result.score)
    if (isNaN(score)) score = 5
    score = Math.max(1, Math.min(10, score))

    return {
      score,
      brief_feedback: result.brief_feedback || 'Answer evaluated.',
      rubric_grounded: isRubricGrounded,
      rubric_concept: rubricConcept || undefined,
      criteria_met: Array.isArray(result.criteria_met) ? result.criteria_met : undefined,
    }
  } catch (error: any) {
    console.error('Error evaluating single answer via Groq:', error)
    return {
      score: 5, // Fallback score
      brief_feedback: 'Failed to evaluate answer. Default score applied.',
      rubric_grounded: false,
    }
  }
}
