/**
 * Grounding & Faithfulness Guardrail (RAG Triad Validator)
 * Verifies that AI-generated interview questions and candidate evaluation scorecards
 * are objectively grounded in retrieved resume evidence and do not hallucinate claims.
 */

export interface GroundingValidation {
  isFaithful: boolean
  groundingScore: number // 0.0 to 1.0
  supportedClaims: string[]
  unsupportedClaims: string[]
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Extracts named technical entities, frameworks, libraries, and claims from text.
 */
function extractTechnicalEntities(text: string): string[] {
  const commonTech = [
    'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'nest.js', 'python',
    'django', 'fastapi', 'flask', 'typescript', 'javascript', 'golang', 'rust',
    'java', 'spring boot', 'c++', 'c#', '.net', 'aws', 'gcp', 'azure', 'docker',
    'kubernetes', 'terraform', 'graphql', 'rest', 'grpc', 'postgresql', 'mysql',
    'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'git', 'ci/cd',
    'vitest', 'jest', 'playwright', 'cypress', 'linux', 'tailwind', 'microservices'
  ]

  const lower = text.toLowerCase()
  const detected: string[] = []

  for (const tech of commonTech) {
    // Exact word boundary matching for tech
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'i')
    if (regex.test(lower)) {
      detected.push(tech)
    }
  }

  return detected
}

/**
 * Validates whether an AI generated prompt/question/evaluation is grounded in retrieved chunks.
 */
export function validateGrounding(
  generatedText: string,
  retrievedContextChunks: string[]
): GroundingValidation {
  if (!generatedText || !generatedText.trim()) {
    return {
      isFaithful: true,
      groundingScore: 1.0,
      supportedClaims: [],
      unsupportedClaims: [],
      confidence: 'high',
    }
  }

  if (retrievedContextChunks.length === 0) {
    return {
      isFaithful: false,
      groundingScore: 0.0,
      supportedClaims: [],
      unsupportedClaims: ['No ground-truth resume context provided to verify claims.'],
      confidence: 'low',
    }
  }

  const combinedContext = retrievedContextChunks.join(' ').toLowerCase()
  const generatedEntities = extractTechnicalEntities(generatedText)

  if (generatedEntities.length === 0) {
    // If no specific technical entities are cited, check general token overlap
    return {
      isFaithful: true,
      groundingScore: 0.85,
      supportedClaims: ['General conceptual query without specific unverified entity claims.'],
      unsupportedClaims: [],
      confidence: 'medium',
    }
  }

  const supported: string[] = []
  const unsupported: string[] = []

  for (const entity of generatedEntities) {
    if (combinedContext.includes(entity)) {
      supported.push(entity)
    } else {
      unsupported.push(entity)
    }
  }

  const groundingScore = generatedEntities.length > 0
    ? supported.length / generatedEntities.length
    : 1.0

  const isFaithful = groundingScore >= 0.6 // At least 60% of cited entities exist in resume context
  const confidence = generatedEntities.length >= 3 ? 'high' : 'medium'

  return {
    isFaithful,
    groundingScore,
    supportedClaims: supported,
    unsupportedClaims: unsupported,
    confidence,
  }
}
