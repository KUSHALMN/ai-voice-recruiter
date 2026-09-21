import { queryResumeChunks, ResumeChunkMatch } from './vectorStore'
import { BM25Index, reciprocalRankFusion } from './hybridSearch'
import { expandQuery } from './queryExpansion'
import { reRankChunks, ReRankedResult } from './reranker'

export interface ResumeRAGContext {
  chunks: ResumeChunkMatch[]
  reRankedResults?: ReRankedResult[]
  formattedContext: string
  hasEvidence: boolean
  metricsCount: number
  topSkillsFound: string[]
}

/**
 * Deduplicates overlapping sentences across chunks to prevent context window bloat
 * and eliminate "Lost in the Middle" bias.
 */
function compressContextSentences(chunks: { content: string }[]): string[] {
  const seenSentences = new Set<string>()
  const compressed: string[] = []

  for (const chunk of chunks) {
    const sentences = chunk.content.split(/(?<=[.!?])\s+/).filter(Boolean)
    const uniqueForChunk: string[] = []

    for (const s of sentences) {
      const normalized = s.toLowerCase().trim().replace(/[\W_]+/g, ' ')
      if (normalized.length < 15) continue
      if (!seenSentences.has(normalized)) {
        seenSentences.add(normalized)
        uniqueForChunk.push(s.trim())
      }
    }

    if (uniqueForChunk.length > 0) {
      compressed.push(uniqueForChunk.join(' '))
    }
  }

  return compressed
}

/**
 * Modern Production RAG Pipeline for Candidate Resume Intelligence:
 * 1. Multi-Query Expansion & HyDE
 * 2. Dense Vector Retrieval (768-dim embeddings)
 * 3. In-memory BM25 Sparse Lexical Scoring
 * 4. Reciprocal Rank Fusion (RRF)
 * 5. Multi-Signal Semantic Re-ranking
 * 6. Contextual Compression & Deduplication
 */
export async function retrieveRelevantResumeContext(
  interviewId: string,
  focusAreas: string[],
  limitPerFocus = 3
): Promise<ResumeRAGContext> {
  if (!interviewId) {
    return { chunks: [], formattedContext: '', hasEvidence: false, metricsCount: 0, topSkillsFound: [] }
  }

  const queries = focusAreas.length > 0
    ? focusAreas
    : ['work experience and key projects', 'technical stack and architecture', 'problem solving and leadership']

  // Step 1: Multi-Query Expansion
  const allSearchQueries: string[] = []
  const allKeywords: string[] = []

  for (const q of queries) {
    const expanded = expandQuery(q)
    allSearchQueries.push(...expanded.subQueries)
    allKeywords.push(...expanded.expandedKeywords)
  }

  // Deduplicate search queries and limit to top 6 to prevent over-fetching
  const uniqueSearchQueries = Array.from(new Set(allSearchQueries)).slice(0, 6)

  // Step 2: Dense Vector Retrieval
  const rawDenseMatchesMap = new Map<string, ResumeChunkMatch>()

  await Promise.all(
    uniqueSearchQueries.map(async query => {
      const results = await queryResumeChunks(interviewId, query, limitPerFocus, 0.20)
      for (const r of results) {
        if (!rawDenseMatchesMap.has(r.id) || (rawDenseMatchesMap.get(r.id)?.similarity || 0) < r.similarity) {
          rawDenseMatchesMap.set(r.id, r)
        }
      }
    })
  )

  const denseList = Array.from(rawDenseMatchesMap.values())
  if (denseList.length === 0) {
    return { chunks: [], formattedContext: '', hasEvidence: false, metricsCount: 0, topSkillsFound: [] }
  }

  // Step 3: BM25 Sparse Lexical Scoring over candidate chunks
  const bm25 = new BM25Index()
  bm25.addDocuments(denseList.map(d => ({
    id: d.id,
    content: d.content,
    metadata: d.metadata,
  })))

  const combinedQuery = queries.join(' ')
  const sparseMatches = bm25.search(combinedQuery, denseList.length)

  // Step 4: Reciprocal Rank Fusion (RRF)
  const denseForRRF = denseList.map(d => ({
    id: d.id,
    content: d.content,
    metadata: d.metadata,
    score: d.similarity,
  }))

  const fused = reciprocalRankFusion(denseForRRF, sparseMatches, 60, 10)

  // Step 5: Multi-Signal Semantic Re-ranking
  const candidatesForReRank = fused.map(f => ({
    id: f.id,
    content: f.content,
    section: f.metadata?.section,
    metadata: f.metadata,
    initialScore: f.fusedScore,
  }))

  const reRanked = reRankChunks(combinedQuery, candidatesForReRank, 5)

  // Step 6: Contextual Compression
  const compressedTexts = compressContextSentences(reRanked)

  // Extract skills and metrics for recruiter observability
  const allDetectedSkills = new Set<string>()
  let metricsCount = 0

  for (const r of reRanked) {
    if (r.metadata?.detectedSkills && Array.isArray(r.metadata.detectedSkills)) {
      r.metadata.detectedSkills.forEach((s: string) => allDetectedSkills.add(s))
    }
    if (r.evidenceFactors.metricsBoost > 0) {
      metricsCount++
    }
  }

  // Format rich RAG context block
  const lines = compressedTexts.map((text, idx) => {
    const matchingChunk = reRanked[idx]
    const section = matchingChunk?.section || matchingChunk?.metadata?.section || 'Experience'
    const confidence = Math.min(99, Math.round((matchingChunk?.reRankedScore || 0.8) * 100))
    return `[Resume Evidence #${idx + 1} | Section: ${section} | RAG Confidence: ${confidence}%]: "${text}"`
  })

  const formattedContext = `
GROUND-TRUTH CANDIDATE RESUME EVIDENCE (Retrieved via Enterprise Hybrid RAG):
The following verified excerpts were retrieved and re-ranked from the candidate's resume:
${lines.join('\n')}

INSTRUCTION: Formulate questions that explicitly reference these verified projects, technical stacks, or achievements. Ask the candidate to explain concrete architectural decisions, metrics, and tradeoffs.
`.trim()

  // Map re-ranked results back to ResumeChunkMatch
  const finalChunks: ResumeChunkMatch[] = reRanked.map(r => ({
    id: r.id,
    interview_id: r.metadata?.interview_id || interviewId,
    candidate_name: r.metadata?.candidate_name,
    chunk_index: r.metadata?.chunk_index,
    content: r.content,
    metadata: r.metadata,
    similarity: r.reRankedScore,
  }))

  return {
    chunks: finalChunks,
    reRankedResults: reRanked,
    formattedContext,
    hasEvidence: true,
    metricsCount,
    topSkillsFound: Array.from(allDetectedSkills),
  }
}
