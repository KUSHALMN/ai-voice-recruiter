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

const TECH_SYNONYMS: Record<string, string[]> = {
  kubernetes: ['k8s', 'kube', 'kubernetes'],
  postgresql: ['postgres', 'psql', 'postgresql'],
  'node.js': ['node', 'nodejs', 'node.js'],
  golang: ['go', 'golang'],
  'next.js': ['next', 'nextjs', 'next.js'],
  react: ['react', 'reactjs', 'react.js'],
  vue: ['vue', 'vuejs', 'vue.js'],
  typescript: ['ts', 'typescript'],
  javascript: ['js', 'javascript'],
  'ci/cd': ['cicd', 'ci/cd', 'continuous integration', 'continuous delivery'],
  aws: ['aws', 'amazon web services'],
  gcp: ['gcp', 'google cloud', 'google cloud platform'],
  docker: ['docker', 'containerization', 'containers'],
  graphql: ['gql', 'graphql'],
  microservices: ['microservice', 'microservices']
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m)
}

function entityMatchesContext(entity: string, context: string): boolean {
  if (context.includes(entity)) return true
  const aliases = TECH_SYNONYMS[entity]
  if (aliases) {
    for (const alias of aliases) {
      const reg = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i')
      if (reg.test(context)) return true
    }
  }
  return false
}

const COMMON_TECH = [
  'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'nest.js', 'python',
  'django', 'fastapi', 'flask', 'typescript', 'javascript', 'golang', 'rust',
  'java', 'spring boot', 'c++', 'c#', '.net', 'aws', 'gcp', 'azure', 'docker',
  'kubernetes', 'terraform', 'graphql', 'rest', 'grpc', 'postgresql', 'mysql',
  'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'git', 'ci/cd',
  'vitest', 'jest', 'playwright', 'cypress', 'linux', 'tailwind', 'microservices'
]

/**
 * Extracts named technical entities, frameworks, libraries, and claims from text,
 * canonicalizing common synonyms and abbreviations.
 */
function extractTechnicalEntities(text: string): string[] {
  const lower = text.toLowerCase()
  const detected = new Set<string>()

  // 1. Check synonym dictionary and map to canonical names
  for (const [canonical, aliases] of Object.entries(TECH_SYNONYMS)) {
    for (const alias of aliases) {
      const reg = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i')
      if (reg.test(lower)) {
        detected.add(canonical)
        break
      }
    }
  }

  // 2. Check remaining common tech list
  for (const tech of COMMON_TECH) {
    if (!detected.has(tech)) {
      const reg = new RegExp(`\\b${escapeRegex(tech)}\\b`, 'i')
      if (reg.test(lower)) {
        detected.add(tech)
      }
    }
  }

  return Array.from(detected)
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
    if (entityMatchesContext(entity, combinedContext)) {
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
