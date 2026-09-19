import { queryEvaluationRubric, RubricMatch } from './vectorStore'
import { STANDARD_RUBRICS, StandardRubric } from './rubricData'
import { generateEmbedding, cosineSimilarity } from './embeddings'

export interface GroundedRubric {
  questionConcept: string
  idealAnswer: string
  criteria: string[]
  category: string
  difficulty: string
  isGrounded: boolean
  similarity: number
}

/**
 * Retrieves the best matching evaluation rubric for a given interview question.
 * Checks the Supabase vector store first, and seamlessly falls back to the in-memory
 * standard rubric catalog so grading is always objectively grounded.
 */
export async function retrieveRubricForQuestion(
  question: string,
  categoryHint?: string
): Promise<GroundedRubric | null> {
  if (!question || !question.trim()) return null

  // 1. Try Vector Store
  try {
    const matches: RubricMatch[] = await queryEvaluationRubric(question, categoryHint, 1, 0.28)
    if (matches.length > 0 && matches[0].similarity >= 0.28) {
      const top = matches[0]
      return {
        questionConcept: top.question_concept,
        idealAnswer: top.ideal_answer,
        criteria: top.criteria,
        category: top.category,
        difficulty: top.difficulty,
        isGrounded: true,
        similarity: top.similarity,
      }
    }
  } catch (err) {
    console.warn('Vector store rubric lookup error, using catalog fallback:', err)
  }

  // 2. Resilient fallback: semantic match across standard rubrics catalog
  try {
    const qEmbedding = await generateEmbedding(question)
    let bestMatch: StandardRubric | null = null
    let highestSim = -1

    for (const rubric of STANDARD_RUBRICS) {
      const rubricText = `${rubric.category}: ${rubric.questionConcept} ${rubric.idealAnswer}`
      const rEmbedding = await generateEmbedding(rubricText)
      const sim = cosineSimilarity(qEmbedding, rEmbedding)

      if (sim > highestSim) {
        highestSim = sim
        bestMatch = rubric
      }
    }

    if (bestMatch && highestSim >= 0.25) {
      return {
        questionConcept: bestMatch.questionConcept,
        idealAnswer: bestMatch.idealAnswer,
        criteria: bestMatch.criteria,
        category: bestMatch.category,
        difficulty: bestMatch.difficulty,
        isGrounded: true,
        similarity: highestSim,
      }
    }
  } catch (catalogErr) {
    console.warn('Catalog rubric match error:', catalogErr)
  }

  return null
}
