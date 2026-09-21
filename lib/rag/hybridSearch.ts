/**
 * Hybrid Search Engine: BM25 Sparse Keyword Scoring + Dense Vector Reciprocal Rank Fusion (RRF).
 * Provides industry-standard hybrid retrieval combining semantic understanding with exact lexical matching.
 */

export interface ScoredDocument {
  id: string
  content: string
  metadata?: Record<string, any>
  score: number
}

export interface FusionResult {
  id: string
  content: string
  metadata?: Record<string, any>
  denseScore: number
  sparseScore: number
  fusedScore: number
  rank: number
}

// Stopwords list for high-precision token filtering
const ENGLISH_STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most',
  'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll',
  'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s',
  'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
  'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your',
  'yours', 'yourself', 'yourselves'
])

/**
 * Tokenizes text into normalized unigrams and technical n-grams, removing common stopwords.
 */
export function tokenizeText(text: string): string[] {
  if (!text) return []

  // Preserve technical tokens like "node.js", "c++", "c#", "next.js"
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s.#+-]/g, ' ')

  const rawTokens = normalized.split(/\s+/).filter(t => t.length > 1)
  const filteredTokens: string[] = []

  for (const token of rawTokens) {
    if (!ENGLISH_STOPWORDS.has(token)) {
      filteredTokens.push(token)
    }
  }

  return filteredTokens
}

/**
 * In-memory BM25 Index for fast, exact lexical scoring of text chunks.
 * Parameters:
 *  - k1: term frequency saturation parameter (default: 1.5)
 *  - b: document length normalization parameter (default: 0.75)
 */
export class BM25Index {
  private documents: Map<string, { content: string; metadata?: Record<string, any>; tokens: string[] }> = new Map()
  private docLengths: Map<string, number> = new Map()
  private avgDocLength: number = 0
  private docFrequencies: Map<string, number> = new Map()
  private totalDocs: number = 0
  private k1: number
  private b: number

  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1
    this.b = b
  }

  /**
   * Adds or updates a document in the index
   */
  public addDocument(id: string, content: string, metadata?: Record<string, any>): void {
    const tokens = tokenizeText(content)
    this.documents.set(id, { content, metadata, tokens })
    this.docLengths.set(id, tokens.length)

    // Update vocabulary document frequencies
    const uniqueTokens = new Set(tokens)
    uniqueTokens.forEach(t => {
      this.docFrequencies.set(t, (this.docFrequencies.get(t) || 0) + 1)
    })

    this.totalDocs = this.documents.size
    this.recomputeAvgDocLength()
  }

  /**
   * Batch adds multiple documents
   */
  public addDocuments(docs: { id: string; content: string; metadata?: Record<string, any> }[]): void {
    for (const doc of docs) {
      this.addDocument(doc.id, doc.content, doc.metadata)
    }
  }

  private recomputeAvgDocLength(): void {
    if (this.totalDocs === 0) {
      this.avgDocLength = 0
      return
    }
    let totalLength = 0
    this.docLengths.forEach(len => {
      totalLength += len
    })
    this.avgDocLength = totalLength / this.totalDocs
  }

  /**
   * Scores all documents in the index against a search query using BM25.
   */
  public search(query: string, topK = 10): ScoredDocument[] {
    const queryTokens = tokenizeText(query)
    if (queryTokens.length === 0 || this.totalDocs === 0) return []

    const scores: { id: string; score: number }[] = []

    this.documents.forEach((doc, id) => {
      const docLen = this.docLengths.get(id) || 1
      let score = 0

      // Count term frequencies in this document
      const termCounts: Record<string, number> = {}
      for (const t of doc.tokens) {
        termCounts[t] = (termCounts[t] || 0) + 1
      }

      for (const qToken of queryTokens) {
        const tf = termCounts[qToken] || 0
        if (tf === 0) continue

        const df = this.docFrequencies.get(qToken) || 0
        // Standard Lucene/BM25 IDF formula
        const idf = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5))

        // BM25 TF formula with document length penalization
        const numerator = tf * (this.k1 + 1)
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / (this.avgDocLength || 1)))
        score += idf * (numerator / denominator)
      }

      if (score > 0) {
        scores.push({ id, score })
      }
    })

    // Sort descending by BM25 score
    scores.sort((a, b) => b.score - a.score)

    return scores.slice(0, topK).map(s => {
      const doc = this.documents.get(s.id)!
      return {
        id: s.id,
        content: doc.content,
        metadata: doc.metadata,
        score: s.score,
      }
    })
  }
}

/**
 * Reciprocal Rank Fusion (RRF)
 * Combines rankings from multiple retrieval algorithms (e.g. Dense Vector + BM25 Sparse).
 * Formula: RRF_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}
 * Where k is a smoothing constant (typically 60).
 */
export function reciprocalRankFusion(
  denseRankings: { id: string; content: string; metadata?: Record<string, any>; score: number }[],
  sparseRankings: { id: string; content: string; metadata?: Record<string, any>; score: number }[],
  k = 60,
  topN = 10
): FusionResult[] {
  const docMap = new Map<string, {
    content: string
    metadata?: Record<string, any>
    denseScore: number
    sparseScore: number
    fusedScore: number
  }>()

  // 1. Process dense rankings
  denseRankings.forEach((item, index) => {
    const rank = index + 1
    const rrfContrib = 1 / (k + rank)

    docMap.set(item.id, {
      content: item.content,
      metadata: item.metadata,
      denseScore: item.score,
      sparseScore: 0,
      fusedScore: rrfContrib,
    })
  })

  // 2. Process sparse (BM25) rankings
  sparseRankings.forEach((item, index) => {
    const rank = index + 1
    const rrfContrib = 1 / (k + rank)

    if (docMap.has(item.id)) {
      const existing = docMap.get(item.id)!
      existing.sparseScore = item.score
      existing.fusedScore += rrfContrib
    } else {
      docMap.set(item.id, {
        content: item.content,
        metadata: item.metadata,
        denseScore: 0,
        sparseScore: item.score,
        fusedScore: rrfContrib,
      })
    }
  })

  // 3. Sort by fused score
  const sorted = Array.from(docMap.entries())
    .map(([id, val]) => ({
      id,
      content: val.content,
      metadata: val.metadata,
      denseScore: val.denseScore,
      sparseScore: val.sparseScore,
      fusedScore: val.fusedScore,
      rank: 0,
    }))
    .sort((a, b) => b.fusedScore - a.fusedScore)
    .slice(0, topN)

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}
