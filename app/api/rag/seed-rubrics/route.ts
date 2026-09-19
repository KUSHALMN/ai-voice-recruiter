import { NextResponse } from 'next/server'
import { STANDARD_RUBRICS } from '@/lib/rag/rubricData'
import { storeEvaluationRubric } from '@/lib/rag/vectorStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/rag/seed-rubrics
 * Seeds the evaluation_rubrics vector table with standardized reference rubrics and criteria.
 */
export async function POST() {
  try {
    let seededCount = 0
    const errors: string[] = []

    for (const rubric of STANDARD_RUBRICS) {
      const ok = await storeEvaluationRubric(rubric)
      if (ok) {
        seededCount++
      } else {
        errors.push(`Failed to seed rubric: ${rubric.questionConcept}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seededCount} of ${STANDARD_RUBRICS.length} evaluation rubrics into vector store.`,
      seededCount,
      total: STANDARD_RUBRICS.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Seed rubrics route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/rag/seed-rubrics
 * Returns preview of available standard rubrics in the system.
 */
export async function GET() {
  return NextResponse.json({
    totalAvailable: STANDARD_RUBRICS.length,
    rubrics: STANDARD_RUBRICS,
  })
}
