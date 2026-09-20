import { NextRequest, NextResponse } from 'next/server'
import { interviewService } from '@/services/interview.service'

export const dynamic = 'force-dynamic'

/**
 * GET /api/interviews/[id]
 * Fetch single interview by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const interview = await interviewService.getInterviewById(id)
    if (!interview) {
      return NextResponse.json(
        { success: false, error: 'Interview not found', timestamp: new Date().toISOString() },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: interview,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/interviews/[id]
 * Update interview status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'status is required', timestamp: new Date().toISOString() },
        { status: 400 }
      )
    }

    const updated = await interviewService.updateStatus(id, body.status)

    return NextResponse.json({
      success: updated,
      message: updated ? 'Status updated' : 'Update failed',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
