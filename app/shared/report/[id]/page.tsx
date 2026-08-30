'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Loader2, PlayCircle, Building } from 'lucide-react'
import { DEMO_REPORTS_MAP } from '@/lib/demo-data'

interface SharedReportQuestion {
  question: string
  answer: string
  score?: number
}

export default function SharedReportPage() {
  const params = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)

  const reportId = params?.id as string

  useEffect(() => {
    if (!reportId) return

    if (reportId.startsWith('demo-')) {
      const demoData = DEMO_REPORTS_MAP[reportId]
      if (demoData) setReport(demoData)
      setLoading(false)
      return
    }

    fetchReport(reportId)
  }, [reportId])

  const fetchReport = async (id: string) => {
    try {
      const res = await fetch(`/api/get-single-report?id=${id}`)
      const json = await res.json()
      if (res.ok && json.data) {
        setReport(json.data)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Not Found</h2>
          <p className="text-slate-500">This interview report link may have expired or is invalid.</p>
        </div>
      </div>
    )
  }

  const session_data = report.interview_sessions?.[0]
  if (session_data && !session_data.report) {
    session_data.report = session_data.evaluation || {}
  }
  if (!session_data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-700 text-lg font-semibold">Report is being generated...</p>
        </div>
      </div>
    )
  }

  const scores = session_data.scores || session_data.evaluation?.scores || {}
  const overallScore = scores.overall ?? 0
  const isHire = session_data.recommendation?.toLowerCase().includes('hire')

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header branding */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">AI Recruiter</span>
          <span className="text-slate-400 font-medium ml-1">Candidate Evaluation</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          {/* Top Banner section */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 tracking-tight">{report.candidate_name}</h1>
                <div className="flex items-center gap-4 text-indigo-100">
                  <span className="text-lg font-medium">{report.job_title}</span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(session_data.completed_at || report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="text-center border-r border-white/20 pr-5">
                  <p className="text-sm text-indigo-200 font-medium mb-1">Overall</p>
                  <p className={`text-3xl font-bold ${overallScore >= 7 ? 'text-emerald-400' : overallScore >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {overallScore}<span className="text-lg opacity-70">/10</span>
                  </p>
                </div>
                <div className="pl-1">
                  <p className="text-sm text-indigo-200 font-medium mb-1">AI Verdict</p>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${
                    isHire ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isHire ? '✓ Recommended' : '⚠ Review Needed'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Executive Summary */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                Executive Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {session_data.report?.summary || 'No summary available.'}
              </p>
            </div>

            {/* Q&A Breakdown (The requested Feature 4) */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Question Analysis</h3>
              <div className="space-y-4">
                {session_data.report?.questions && Array.isArray(session_data.report.questions) ? (
                  session_data.report.questions.map((q: SharedReportQuestion, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 group">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 leading-tight">
                            <span className="text-indigo-600 mr-2">Q:</span>
                            {q.question}
                          </h4>
                          <p className="text-slate-700 leading-relaxed mb-4">
                            <span className="text-slate-400 font-medium mr-2">A:</span>
                            {q.answer}
                          </p>
                        </div>
                        {q.score !== undefined && (
                          <div className="bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg text-center shrink-0">
                            <span className="block text-2xl font-bold text-indigo-600">{q.score}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                          </div>
                        )}
                      </div>
                      <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-4 h-4" />
                        Listen to snippet
                      </button>
                    </div>
                  ))
                ) : Array.isArray(session_data.questions) && session_data.questions.length > 0 ? (
                  session_data.questions.map((q: string, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 group">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 leading-tight">
                            <span className="text-indigo-600 mr-2">Q:</span>
                            {q}
                          </h4>
                          <p className="text-slate-700 leading-relaxed">
                            <span className="text-slate-400 font-medium mr-2">A:</span>
                            {Array.isArray(session_data.answers) ? session_data.answers[idx] || 'No answer provided' : 'No answer provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic text-center py-4">No detailed Q&A available for this session.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
