/**
 * Query Expansion & HyDE (Hypothetical Document Embeddings) Engine
 * Decomposes and expands user queries into multi-faceted technical search vectors
 * to bridge the vocabulary mismatch between concise interview queries and detailed candidate resumes.
 */

export interface ExpandedQueries {
  originalQuery: string
  subQueries: string[]
  expandedKeywords: string[]
}

const DOMAIN_EXPANSIONS: Record<string, string[]> = {
  frontend: ['react', 'next.js', 'typescript', 'tailwind', 'state management', 'web vitals', 'bundle optimization', 'ui components'],
  backend: ['node.js', 'express', 'python', 'fastapi', 'rest api', 'graphql', 'grpc', 'microservices', 'concurrency'],
  database: ['postgresql', 'mongodb', 'redis', 'indexing', 'query optimization', 'data modeling', 'caching', 'migrations', 'pgvector'],
  cloud: ['aws', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'lambda', 'cloud architecture', 'devops', 'scalability'],
  architecture: ['system design', 'high availability', 'fault tolerance', 'horizontal scaling', 'event-driven', 'message queues', 'kafka'],
  security: ['oauth', 'jwt', 'xss', 'csrf', 'encryption', 'rbac', 'sanitization', 'rate limiting', 'audit logging'],
  ai: ['llm', 'rag', 'embeddings', 'vector database', 'fine-tuning', 'prompt engineering', 'openai', 'groq', 'langchain']
}

/**
 * Expands a single search query into multiple targeted sub-queries and technical keywords.
 */
export function expandQuery(query: string): ExpandedQueries {
  if (!query || !query.trim()) {
    return { originalQuery: '', subQueries: [], expandedKeywords: [] }
  }

  const clean = query.trim()
  const lower = clean.toLowerCase()
  const detectedKeywords = new Set<string>()

  // Check matching domain vocabularies
  for (const [domain, keywords] of Object.entries(DOMAIN_EXPANSIONS)) {
    if (lower.includes(domain) || keywords.some(k => lower.includes(k))) {
      keywords.forEach(k => detectedKeywords.add(k))
    }
  }

  // Generate multi-angle sub-queries
  const subQueries: string[] = [clean]

  // Sub-query 1: Architecture and technical implementation
  subQueries.push(`${clean} technical implementation architecture system design`)

  // Sub-query 2: Measurable impact and scale
  subQueries.push(`${clean} measurable impact metrics performance optimization production scale`)

  // Sub-query 3: Tools, frameworks, and technologies
  const matchedList = Array.from(detectedKeywords).slice(0, 5)
  if (matchedList.length > 0) {
    subQueries.push(`${clean} ${matchedList.join(' ')}`)
  }

  return {
    originalQuery: clean,
    subQueries: Array.from(new Set(subQueries)),
    expandedKeywords: Array.from(detectedKeywords),
  }
}

/**
 * HyDE (Hypothetical Document Embeddings) Generator
 * Synthesizes a hypothetical ideal resume excerpt for a given query to align vector retrieval
 * with actual resume phrasing and bullet point structures.
 */
export function generateHypotheticalResumeChunk(roleOrTopic: string, focusArea: string): string {
  return `Engineered and architected scalable solutions for ${roleOrTopic}, specifically focusing on ${focusArea}. ` +
    `Led the design, implemented robust system boundaries, optimized response latency, and achieved 99.9% uptime ` +
    `utilizing industry best practices, automated testing, and cloud-native infrastructure.`
}
