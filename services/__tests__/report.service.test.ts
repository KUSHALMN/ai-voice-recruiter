import { describe, it, expect } from 'vitest'
import { reportService } from '../report.service'
import { DEMO_REPORTS } from '@/lib/demo-data'

describe('ReportService', () => {
  it('should return reports list with demo data fallback', async () => {
    const reports = await reportService.getReports()
    expect(Array.isArray(reports)).toBe(true)
    expect(reports.length).toBeGreaterThan(0)
  })

  it('should return demo report for valid demo ID', async () => {
    const report = await reportService.getReportById('demo-1')
    expect(report).toBeDefined()
    expect(report?.candidate_name).toBe('Aarav Sharma')
    expect(report?.job_title).toBe('Software Engineer')
  })

  it('should generate synthetic candidate report with overall score', async () => {
    const report = await reportService.generateReport({
      interview_id: 'test_int_123',
      candidate_name: 'Test Candidate',
      role: 'Full Stack Engineer',
      transcript: []
    })

    expect(report).toBeDefined()
    expect(report.candidate_name).toBe('Test Candidate')
    expect(report.overall_score).toBeGreaterThanOrEqual(0)
    expect(report.overall_score).toBeLessThanOrEqual(100)
    expect(report.recommendation).toBeDefined()
  })
})
