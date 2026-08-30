'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, CheckCircle, XCircle, AlertCircle, Code2, Mail, Loader2, Sparkles, Share2, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

import { DEMO_REPORTS_MAP } from '@/lib/demo-data'

interface TechnicalAnalysis {
  isCorrect: boolean
  timeComplexity?: string
  spaceComplexity?: string
  readabilityScore?: number
  bestPracticesScore?: number
  feedback?: string
  submittedCode?: string
}

interface ReportQuestion {
  question: string
  answer?: string
  score?: number
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isGeneratingDetailed, setIsGeneratingDetailed] = useState(false)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasTriggeredGenRef = useRef(false)

  const reportId = params?.id as string

  useEffect(() => {
    if (!reportId) return

    // If it's a demo report, load static data immediately
    if (reportId.startsWith('demo-')) {
      const demoData = DEMO_REPORTS_MAP[reportId]
      if (demoData) {
        setReport(demoData)
      }
      setLoading(false)
      return
    }

    // Real report — fetch from API
    fetchReport(reportId)
    
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    }
  }, [reportId])

  const fetchReport = async (id: string, isPolling = false) => {
    try {
      const res = await fetch(`/api/get-single-report?id=${id}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch report')
      }

      const interview = json.data
      if (!interview) {
        throw new Error('Report not found')
      }

      setReport(interview)

      // Background Generation Logic
      const sessionData = interview.interview_sessions?.[0]
      if (sessionData?.report?.isFallback) {
        setIsGeneratingDetailed(true)

        if (!hasTriggeredGenRef.current) {
          hasTriggeredGenRef.current = true
          fetch('/api/generate-report-async', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interviewId: interview.id })
          }).catch(console.error)
        }

        // Poll every 5 seconds
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
        pollTimerRef.current = setTimeout(() => {
          if (params?.id) fetchReport(params.id as string, true)
        }, 5000)
      } else if (isPolling) {
        // We were polling, but the report is no longer a fallback! It finished.
        setIsGeneratingDetailed(false)
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
        toast.success('Detailed AI Analysis is ready!', { icon: '✨' })
      }

    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      if (!isPolling) setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (isSendingEmail) return

    // Resolve email with fallback chain
    const targetEmail = report.recruiter_email || report.candidate_email
    if (!targetEmail) {
      toast.error('No email address available for this interview')
      return
    }

    setIsSendingEmail(true)

    try {
      const response = await fetch('/api/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          candidateName: report.candidate_name,
          jobTitle: report.job_title,
          score: report.interview_sessions?.[0]?.scores?.overall || 0,
          reportLink: window.location.href
        })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to send email')

      toast.success('Email sent successfully!')
    } catch (error: unknown) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/shared/report/${report.id}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </main>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-4">Report not found</p>
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Back to Reports
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // If interview exists but session not yet saved, show processing state
  if (!report.interview_sessions?.[0]) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-semibold mb-2">Report is being generated...</p>
              <p className="text-gray-500 text-sm mb-6">This may take a few moments. Please wait.</p>
              <button
                onClick={() => { setLoading(true); if (params?.id) fetchReport(params.id as string) }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-3"
              >
                Refresh
              </button>
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
              >
                Back to Reports
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const session_data = report.interview_sessions[0]
  if (session_data && !session_data.report) {
    session_data.report = session_data.evaluation || {}
  }
  // Handle both normalized score format (flat) and nested format
  const rawScores = session_data.scores || session_data.evaluation?.scores || {}
  const scores = {
    overall: rawScores.overall ?? 0,
    technical: rawScores.technical ?? rawScores.technical_skill ?? 0,
    communication: rawScores.communication ?? rawScores.communication_skill ?? 0,
    confidence: rawScores.confidence ?? 0,
    problem_solving: rawScores.problem_solving ?? 0,
    integrity_score: rawScores.integrity_score ?? 10,
  }
  const questions = Array.isArray(session_data.questions) ? session_data.questions : []
  const answers = Array.isArray(session_data.answers) ? session_data.answers : []
  const evalData = session_data.evaluation || {}

  return (
    <div className="flex h-screen bg-gray-50 print:bg-white print:h-auto">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col print:block">
        <div className="print:hidden">
          <TopBar />
        </div>
        <main className="flex-1 p-6 overflow-auto print:p-0 print:overflow-visible print:block">
          <div className="max-w-5xl mx-auto print:max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between print:hidden"
            >
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Reports
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {isSendingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {isSendingEmail ? 'Sending...' : 'Email Report'}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors hidden sm:flex"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button 
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </motion.div>

            {/* This wrapper is what gets exported to PDF */}
            <div className="pdf-content pb-10 print:pb-0">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Report</h1>
                <p className="text-gray-600">{report.candidate_name} • {report.job_title}</p>
              </div>

              {isGeneratingDetailed && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin mt-0.5" />
                  <div>
                    <h4 className="text-blue-900 font-medium">Generating Detailed AI Analysis</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Our AI is deeply analyzing the response transcripts to provide a comprehensive evaluation. This page will automatically update when the final report is ready.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Candidate Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{report.candidate_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg text-gray-900">{report.candidate_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interview Type</p>
                    <p className="text-lg text-gray-900">{report.interview_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session ID</p>
                    <p className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mt-1">
                      {session_data?.id || report?.session_id || report?.id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-lg text-gray-900">
                      {session_data.completed_at
                        ? new Date(session_data.completed_at).toLocaleDateString()
                        : session_data.created_at
                          ? new Date(session_data.created_at).toLocaleDateString()
                          : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white"
              >
                <h3 className="text-sm font-semibold mb-4 opacity-90">Overall Score</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-6xl font-bold">{scores.overall || 0}</span>
                  <span className="text-2xl opacity-80 mb-2">/10</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Technical</span>
                    <span>{scores.technical || 0}/10</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${(scores.technical || 0) * 10}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm opacity-90 mt-2">
                    <span>Communication</span>
                    <span>{scores.communication || 0}/10</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${(scores.communication || 0) * 10}%` }}></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Technical Analysis Section */}
            {session_data.technical_analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Code2 className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Technical Code Analysis</h2>
                </div>

                <div className="space-y-6">
                  {session_data.technical_analysis.map((analysis: TechnicalAnalysis, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {analysis.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Time Complexity</p>
                          <p className="text-sm font-mono bg-white border border-gray-200 px-2 py-1 rounded">
                            {analysis.timeComplexity || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Space Complexity</p>
                          <p className="text-sm font-mono bg-white border border-gray-200 px-2 py-1 rounded">
                            {analysis.spaceComplexity || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase font-medium mb-2">Code Quality</p>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                            Readability: {analysis.readabilityScore}/10
                          </span>
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-100">
                            Best Practices: {analysis.bestPracticesScore}/10
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase font-medium mb-2">Feedback</p>
                        <p className="text-sm text-gray-700">{analysis.feedback}</p>
                      </div>

                      {analysis.submittedCode && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium mb-2">Submitted Code</p>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {analysis.submittedCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Analysis</h3>
              
              {session_data.report?.summary && (
                <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Executive Summary</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">{session_data.report.summary}</p>
                </div>
              )}

              {/* Anti-Cheating Integrity Block */}
              {scores.integrity_score !== undefined && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-4 ${scores.integrity_score >= 8 ? 'bg-green-50/50 border-green-100' : scores.integrity_score >= 5 ? 'bg-yellow-50/50 border-yellow-100' : 'bg-red-50/50 border-red-100'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${scores.integrity_score >= 8 ? 'bg-green-100 text-green-700' : scores.integrity_score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="w-full">
                     <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-sm font-semibold ${scores.integrity_score >= 8 ? 'text-green-900' : scores.integrity_score >= 5 ? 'text-yellow-900' : 'text-red-900'}`}>Integrity & Proctoring Score</h4>
                        <span className={`text-lg font-bold ${scores.integrity_score >= 8 ? 'text-green-700' : scores.integrity_score >= 5 ? 'text-yellow-700' : 'text-red-700'}`}>{scores.integrity_score}/10</span>
                     </div>
                     <p className={`text-sm leading-relaxed ${scores.integrity_score >= 8 ? 'text-green-800' : scores.integrity_score >= 5 ? 'text-yellow-800' : 'text-red-800'}`}>
                       {session_data.report?.integrity_notes || 'No proctoring violations recorded during the interview session.'}
                     </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {session_data.report?.strengths && session_data.report.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Key Strengths
                    </h4>
                    <div className="flex flex-col gap-2">
                      {session_data.report.strengths.map((str: string, i: number) => (
                        <div key={i} className="px-3 py-2 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100">
                          {str}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Check both 'improvements' (demo data) and 'weaknesses' (AI-generated) + evaluation.weaknesses */}
                {(() => {
                  const weaknessList = session_data.report?.improvements 
                    || session_data.report?.weaknesses 
                    || evalData?.weaknesses 
                    || []
                  return weaknessList.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Areas for Improvement
                      </h4>
                      <div className="flex flex-col gap-2">
                        {weaknessList.map((imp: string, i: number) => (
                          <div key={i} className="px-3 py-2 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-100">
                            {imp}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}
              </div>

              <div className="space-y-6 mt-8 pt-8 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Question & Answer Breakdown</h4>
                {session_data.report?.questions && Array.isArray(session_data.report.questions) ? (
                  session_data.report.questions.map((qObj: ReportQuestion, i: number) => (
                    <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <p className="font-medium text-gray-900">Q{i + 1}: {qObj.question}</p>
                        {qObj.score !== undefined && (
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 ${
                            qObj.score >= 8 ? 'bg-emerald-100 text-emerald-700' :
                            qObj.score >= 5 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {qObj.score}/10
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong className="text-gray-800">Answer:</strong><br />{qObj.answer || 'No answer provided'}</p>
                      </div>
                    </div>
                  ))
                ) : questions.length > 0 ? (
                  questions.map((q: string, i: number) => (
                    <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <p className="font-medium text-gray-900 mb-2">Q{i + 1}: {q}</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong className="text-gray-800">Answer:</strong><br />{answers[i] || 'No answer provided'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No detailed Q&A available for this session.</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AIRA Recommendation</h3>
              <div className={`p-4 rounded-lg flex items-start gap-3 ${(session_data.recommendation || evalData.recommendation)?.toLowerCase().includes('hire') ||
                (session_data.recommendation || evalData.recommendation)?.toLowerCase().includes('recommended')
                ? 'bg-green-50 text-green-800'
                : 'bg-yellow-50 text-yellow-800'
                }`}>
                {(session_data.recommendation || evalData.recommendation)?.toLowerCase().includes('hire') ||
                  (session_data.recommendation || evalData.recommendation)?.toLowerCase().includes('recommended')
                  ? <CheckCircle className="w-5 h-5 mt-0.5" />
                  : <AlertCircle className="w-5 h-5 mt-0.5" />
                }
                <div>
                  <p className="font-medium mb-1">
                    {session_data.recommendation || evalData.recommendation || 'Analysis complete'}
                  </p>
                  <p className="text-sm opacity-90">
                    {evalData.summary || 'Based on the interview responses, the candidate has been evaluated by AIRA.'}
                  </p>
                </div>
              </div>
            </motion.div>
            
            </div> {/* End of PDF content wrapper */}
            
          </div>
        </main>
      </div>
    </div>
  )
}
