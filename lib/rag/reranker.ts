/**
 * Semantic Re-ranking Engine
 * Implements a two-stage re-ranking pass over retrieved candidate resume chunks.
 * Combines semantic similarity with evidence density, section priority, and metric presence.
 */

export interface CandidateChunk {
  id: string
  content: string
  section?: string
  metadata?: Record<string, any>
  initialScore: number
}

export interface ReRankedResult extends CandidateChunk {
  reRankedScore: number
  rank: number
  evidenceFactors: {
    baseScore: number
    keywordBoost: number
    metricsBoost: number
    sectionWeight: number
  }
}

const SECTION_WEIGHTS: Record<string, number> = {
  experience: 1.25,
  'work experience': 1.25,
  'professional experience': 1.25,
  projects: 1.2,
  'key projects': 1.2,
  skills: 1.1,
  'technical skills': 1.1,
  certifications: 1.05,
  education: 0.95,
  summary: 0.9,
  overview: 0.9,
}

// Regex to detect quantitative proof (percentages, monetary amounts, scale metrics, latencies)
const METRIC_REGEX = /\b(?:\d+(?:\.\d+)?%|\$\d+(?:[kKmMbB])?|\d+\s*(?:ms|rps|qps|users|req\/s|x|fold)|[1-9]\d{1,4}\b)/

/**
 * Re-ranks a list of retrieved chunks using multi-signal cross scoring.
 */
export function reRankChunks(
  query: string,
  chunks: CandidateChunk[],
  topN = 5
): ReRankedResult[] {
  if (!chunks || chunks.length === 0) return []

  const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2)

  const reRanked = chunks.map(chunk => {
    const textLower = chunk.content.toLowerCase()
    const sectionLower = (chunk.section || chunk.metadata?.section || 'experience').toLowerCase().trim()

    // 1. Base Score
    const baseScore = chunk.initialScore

    // 2. Exact Query Token Overlap
    let matchedTokens = 0
    for (const token of queryTokens) {
      if (textLower.includes(token)) {
        matchedTokens++
      }
    }
    const keywordOverlapRatio = queryTokens.length > 0 ? matchedTokens / queryTokens.length : 0
    const keywordBoost = keywordOverlapRatio * 0.25

    // 3. Evidence Density (quantified metrics)
    const hasMetrics = METRIC_REGEX.test(chunk.content)
    const metricsBoost = hasMetrics ? 0.15 : 0

    // 4. Section Priority Weight
    let sectionWeight = 1.0
    for (const [sec, weight] of Object.entries(SECTION_WEIGHTS)) {
      if (sectionLower.includes(sec)) {
        sectionWeight = weight
        break
      }
    }

    // Compute composite re-ranked score
    const reRankedScore = (baseScore + keywordBoost + metricsBoost) * sectionWeight

    return {
      ...chunk,
      reRankedScore,
      rank: 0,
      evidenceFactors: {
        baseScore,
        keywordBoost,
        metricsBoost,
        sectionWeight,
      },
    }
  })

  // Sort descending by reRankedScore
  reRanked.sort((a, b) => b.reRankedScore - a.reRankedScore)

  return reRanked.slice(0, topN).map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}
