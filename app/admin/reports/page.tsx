'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, Search, FileText, Calendar, User } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Report {
  id: string
  interview_id: string
  candidate_name: string
  candidate_email: string
  job_title: string
  interview_type: string
  scores: {
    technical: number
    technical_skill?: number
    communication: number
    communication_skill?: number
    confidence: number
    problem_solving: number
    overall: number
  }
  recommendation: string
  completed_at: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('all')

  useEffect(() => {
    fetchReports()
  }, [])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReports()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredReports = useMemo(() => {
    let filtered = reports

    if (filter !== 'all') {
      filtered = filtered.filter(report =>
        report.recommendation.toLowerCase().includes(filter.toLowerCase())
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.candidate_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (dateRange !== 'all') {
      const now = new Date()
      const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

      filtered = filtered.filter(report =>
        new Date(report.completed_at) >= cutoff
      )
    }

    return filtered
  }, [reports, filter, searchTerm, dateRange])

  const fetchReports = async () => {
    try {


      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          *,
          interviews (
            candidate_name,
            candidate_email,
            job_title,
            interview_type
          )
        `)
        .order('completed_at', { ascending: false })



      if (error) throw error

      const formattedReports = data?.map(session => {
        const report = {
          id: session.id,
          interview_id: session.interview_id,
          candidate_name: session.interviews?.candidate_name || '',
          candidate_email: session.interviews?.candidate_email || '',
          job_title: session.interviews?.job_title || '',
          interview_type: session.interviews?.interview_type || '',
          scores: session.scores || {},
          recommendation: session.recommendation || '',
          completed_at: session.completed_at
        }

        // Validate report data


        return report
      }).filter(report => report.candidate_name && report.scores && Object.keys(report.scores).length > 0) || []



      setReports(formattedReports)
    } catch (error) {
      console.error('❌ Error fetching reports:', error)
      toast.error('Failed to load reports')
    }
  }

  const exportReport = (report: Report, format: 'json' | 'pdf') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(report, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `interview-report-${report.candidate_name}-${report.id}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Report exported as JSON')
    } else {
      toast('PDF export coming soon', { icon: 'ℹ️' })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('recommended')) return 'bg-green-100 text-green-800'
    if (recommendation.toLowerCase().includes('improvement')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Reports</h1>
              <p className="text-slate-600">View and analyze completed interview evaluations</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-600" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Recommendations</option>
                      <option value="recommended">Recommended</option>
                      <option value="improvement">Needs Improvement</option>
                      <option value="not">Not Recommended</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="quarter">Last Quarter</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-slate-600" />
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  {filteredReports.length} of {reports.length} reports
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl "
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <User className="w-8 h-8 text-indigo-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{report.candidate_name}</h3>
                        <p className="text-slate-600 text-sm">{report.candidate_email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => exportReport(report, 'json')}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50  text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        JSON
                      </button>
                      <button
                        onClick={() => exportReport(report, 'pdf')}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50  text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-slate-600 text-sm">Position</p>
                      <p className="text-slate-800 font-medium">{report.job_title}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Interview Type</p>
                      <p className="text-slate-800">{report.interview_type}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Date</p>
                      <p className="text-slate-800">{new Date(report.completed_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm">Overall Score</p>
                      <p className={`font-bold text-lg ${getScoreColor(report.scores.overall || 0)}`}>
                        {report.scores.overall || 0}/10
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-slate-600 text-xs">Technical</p>
                      <p className={`font-semibold ${getScoreColor(report.scores.technical_skill || report.scores.technical || 0)}`}>
                        {report.scores.technical_skill || report.scores.technical || 0}/10
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 text-xs">Communication</p>
                      <p className={`font-semibold ${getScoreColor(report.scores.communication_skill || report.scores.communication || 0)}`}>
                        {report.scores.communication_skill || report.scores.communication || 0}/10
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 text-xs">Confidence</p>
                      <p className={`font-semibold ${getScoreColor(report.scores.confidence || 0)}`}>
                        {report.scores.confidence || 0}/10
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 text-xs">Problem Solving</p>
                      <p className={`font-semibold ${getScoreColor(report.scores.problem_solving || 0)}`}>
                        {report.scores.problem_solving || 0}/10
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(report.recommendation)}`}>
                      {report.recommendation}
                    </span>
                    <button
                      onClick={() => window.open(`/dashboard/reports/${report.interview_id}`, '_blank')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700  text-sm"
                    >
                      View Full Report
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No reports found</p>
                <p className="text-slate-500 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
