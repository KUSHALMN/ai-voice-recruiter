import { queryResumeChunks, ResumeChunkMatch } from './vectorStore'

export interface ResumeRAGContext {
  chunks: ResumeChunkMatch[]
  formattedContext: string
  hasEvidence: boolean
}

/**
 * Retrieves the most relevant candidate resume chunks matching the job competencies and focus areas.
 */
export async function retrieveRelevantResumeContext(
  interviewId: string,
  focusAreas: string[],
  limitPerFocus = 2
): Promise<ResumeRAGContext> {
  if (!interviewId) {
    return { chunks: [], formattedContext: '', hasEvidence: false }
  }

  const queries = focusAreas.length > 0
    ? focusAreas
    : ['work experience and key projects', 'technical stack and architecture', 'problem solving and leadership']

  const matchedChunksMap = new Map<string, ResumeChunkMatch>()

  await Promise.all(
    queries.map(async query => {
      const results = await queryResumeChunks(interviewId, query, limitPerFocus, 0.22)
      for (const r of results) {
        if (!matchedChunksMap.has(r.id)) {
          matchedChunksMap.set(r.id, r)
        }
      }
    })
  )

  const uniqueChunks = Array.from(matchedChunksMap.values()).sort(
    (a, b) => b.similarity - a.similarity
  ).slice(0, 6)

  if (uniqueChunks.length === 0) {
    return { chunks: [], formattedContext: '', hasEvidence: false }
  }

  const lines = uniqueChunks.map((chunk, idx) => {
    const section = chunk.metadata?.section || 'Experience'
    const cleanContent = chunk.content.replace(/\n+/g, ' ').trim()
    return `[Resume Evidence #${idx + 1} | Section: ${section} | Match: ${Math.round(chunk.similarity * 100)}%]: "${cleanContent}"`
  })

  const formattedContext = `
GROUND-TRUTH CANDIDATE RESUME EVIDENCE (Retrieved via RAG):
The following verified excerpts were retrieved directly from the candidate's uploaded resume:
${lines.join('\n')}

INSTRUCTION: Formulate at least 2 questions that explicitly reference these real projects, technical stacks, or achievements. Ask the candidate to explain their concrete design choices, metrics, or technical tradeoffs.
`.trim()

  return {
    chunks: uniqueChunks,
    formattedContext,
    hasEvidence: true,
  }
}
