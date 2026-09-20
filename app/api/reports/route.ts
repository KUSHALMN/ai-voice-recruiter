import { NextRequest, NextResponse } from 'next/server'
import { reportService } from '@/services/report.service'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'

/**
 * GET /api/reports
 * List candidate reports
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const reports = await reportService.getReports(token?.email || undefined)

    return NextResponse.json({
      success: true,
      data: reports,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reports
 * Generate a candidate evaluation report
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const report = await reportService.generateReport(body)

    return NextResponse.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate report', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
