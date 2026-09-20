import { NextRequest, NextResponse } from 'next/server'
import { interviewService } from '@/services/interview.service'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'

/**
 * GET /api/interviews
 * List all interviews with optional role and status filtering
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || undefined
    const status = searchParams.get('status') as any || undefined

    const interviews = await interviewService.getInterviews({ role, status })

    return NextResponse.json({
      success: true,
      data: interviews,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch interviews', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

/**
 * POST /api/interviews
 * Create a new interview
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.candidate_name || !body.role) {
      return NextResponse.json(
        { success: false, error: 'candidate_name and role are required', timestamp: new Date().toISOString() },
        { status: 400 }
      )
    }

    const created = await interviewService.createInterview(body)

    return NextResponse.json({
      success: true,
      data: created,
      timestamp: new Date().toISOString()
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create interview', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
