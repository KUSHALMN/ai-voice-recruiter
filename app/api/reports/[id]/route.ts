import { NextRequest, NextResponse } from 'next/server'
import { reportService } from '@/services/report.service'

export const dynamic = 'force-dynamic'

/**
 * GET /api/reports/[id]
 * Fetch single candidate report
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const report = await reportService.getReportById(id)
    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found', timestamp: new Date().toISOString() },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/reports/[id]
 * Delete candidate report
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await reportService.deleteReport(id)
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Report deleted' : 'Deletion failed',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
