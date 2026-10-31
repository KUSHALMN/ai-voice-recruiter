import Groq from 'groq-sdk'
import { queryResumeChunks } from './vectorStore'
import { BM25Index, reciprocalRankFusion } from './hybridSearch'
import { validateGrounding } from './groundingGuard'

let cachedGroqClient: Groq | null = null

function getGroqClient(apiKey: string): Groq {
  if (!cachedGroqClient) {
    cachedGroqClient = new Groq({ apiKey })
  }
  return cachedGroqClient
}

const ACTIVE_GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']

export interface FollowUpProbe {
  needsFollowUp: boolean
  followUpQuestion?: string
  probeReason?: string
  groundedInResume: boolean
  groundingScore?: number
}

/**
 * Generates an intelligent, resume-grounded follow-up probe during the live interview.
 * Catches superficial or evasive answers and tests authenticity against resume claims using
 * active Groq models with multi-model fallback and grounding guardrails.
 */
export async function generateLiveFollowUpProbe(
  interviewId: string,
  question: string,
  candidateAnswer: string,
  jobTitle: string
): Promise<FollowUpProbe> {
  if (!candidateAnswer || candidateAnswer.trim().length < 15) {
    return { needsFollowUp: false, groundedInResume: false }
  }

  // 1. Retrieve related resume evidence matching what the candidate just discussed
  const chunks = await queryResumeChunks(interviewId, `${question} ${candidateAnswer}`, 3, 0.20)
  
  let resumeSnippet: string | null = null
  let chunkTexts: string[] = []

  if (chunks.length > 0) {
    // Apply BM25 re-ranking for exact technical keywords mentioned in the candidate's answer
    const bm25 = new BM25Index()
    bm25.addDocuments(chunks.map(c => ({ id: c.id, content: c.content })))
    const sparse = bm25.search(candidateAnswer, chunks.length)
    const dense = chunks.map(c => ({ id: c.id, content: c.content, score: c.similarity }))
    const fused = reciprocalRankFusion(dense, sparse, 60, 2)

    chunkTexts = fused.map(f => f.content)
    resumeSnippet = fused.map(f => `[Resume Excerpt]: ${f.content}`).join('\n')
  }

  const prompt = `You are a world-class technical interviewer conducting an adaptive interview for a ${jobTitle} position.
Evaluate if the candidate's answer requires a follow-up probe.

Original Question: "${question}"
Candidate Answer: "${candidateAnswer}"
${resumeSnippet ? `Verified Candidate Resume Records:\n${resumeSnippet}` : ''}

Rules:
1. If the answer is already thorough, complete, and technically sound, set "needsFollowUp": false.
2. If the answer is vague, buzzy, lacks concrete metrics, or mentions a technology without explaining the mechanism, set "needsFollowUp": true and craft a sharp, polite follow-up question.
3. If resume record is present, tie the follow-up question directly to their claimed experience (e.g. "On your resume you mentioned X at company Y; how did you solve Z?").

Return ONLY valid JSON matching:
{
  "needsFollowUp": <boolean>,
  "followUpQuestion": "<concise question under 25 words or null>",
  "probeReason": "<why this follow-up is needed or null>"
}`

  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    for (const model of ACTIVE_GROQ_MODELS) {
      try {
        const groqClient = getGroqClient(groqKey)
        const completion = await groqClient.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        })

        const raw = completion.choices[0]?.message?.content || '{}'
        const parsed = JSON.parse(raw)

        if (parsed.needsFollowUp && parsed.followUpQuestion) {
          const validation = validateGrounding(parsed.followUpQuestion, chunkTexts)

          return {
            needsFollowUp: true,
            followUpQuestion: parsed.followUpQuestion,
            probeReason: parsed.probeReason || 'Probe candidate depth on claimed experience',
            groundedInResume: Boolean(resumeSnippet && validation.isFaithful),
            groundingScore: validation.groundingScore,
          }
        }

        return {
          needsFollowUp: false,
          groundedInResume: false,
        }
      } catch (err) {
        console.warn(`generateLiveFollowUpProbe error on ${model}:`, err instanceof Error ? err.message : err)
      }
    }
  }

  // Resilient multi-provider fallback: Google Gemini
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (geminiKey) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(geminiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
      })
      const result = await model.generateContent(prompt)
      const raw = result.response.text() || '{}'
      const parsed = JSON.parse(raw)

      if (parsed.needsFollowUp && parsed.followUpQuestion) {
        const validation = validateGrounding(parsed.followUpQuestion, chunkTexts)
        return {
          needsFollowUp: true,
          followUpQuestion: parsed.followUpQuestion,
          probeReason: parsed.probeReason || 'Probe candidate depth on claimed experience',
          groundedInResume: Boolean(resumeSnippet && validation.isFaithful),
          groundingScore: validation.groundingScore,
        }
      }
    } catch (geminiErr) {
      console.warn('Gemini follow-up probe fallback error:', geminiErr instanceof Error ? geminiErr.message : geminiErr)
    }
  }

  return { needsFollowUp: false, groundedInResume: false }
}
