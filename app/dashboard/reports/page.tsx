'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { motion } from 'framer-motion'
import { FileText, BarChart3, User, Calendar, ArrowRight, Loader2, RefreshCw, Star, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

import { DEMO_REPORTS } from '@/lib/demo-data'

interface InterviewSession {
  id: string
  scores: Record<string, number>
  recommendation?: string
}

interface InterviewReport {
  id: string
  candidate_name: string
  candidate_email?: string
  job_title?: string
  interview_type?: string
  created_at: string
  isDemo?: boolean
  interview_sessions?: InterviewSession[]
}

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<InterviewReport[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [clearingAll, setClearingAll] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleClearAll = async () => {
    try {
      setClearingAll(true)
      const res = await fetch('/api/delete-report', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Clear failed')
      setReports([])
      toast.success('All reports cleared')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to clear all'
      toast.error(message)
    } finally {
      setClearingAll(false)
      setShowClearConfirm(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const res = await fetch('/api/delete-report', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Delete failed')
      setReports(prev => prev.filter(r => r.id !== id))
      toast.success('Report deleted')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete'
      toast.error(message)
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  // Load immediately on mount — no auth blocking
  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/get-reports')
      const json = await res.json()

      if (!res.ok) {
        console.error('Error fetching reports:', json.error)
        toast.error('Failed to load reports')
        return
      }


      if (json.data && json.data.length > 0) {
        setReports(json.data)
      } else {
        setReports(DEMO_REPORTS)
      }
    } catch (err) {
      console.error('Error:', err)
      toast.error('An error occurred while loading reports')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-16 mt-2"></div>
              </div>
            ))}
          </div>

          {/* List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div>
                    <div className="h-5 bg-slate-200 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-48"></div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                  <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveLayout>
    )
  }

  // Show demo reports ONLY when no real reports exist — avoid mixing test data with production data
  const allReports = reports.some(r => !r.isDemo) ? reports.filter(r => !r.isDemo) : reports

  // Compute stats
  const totalReports = allReports.length
  const reportsWithScores = allReports.filter(r => r.interview_sessions?.[0]?.scores?.overall)
  const avgScore = reportsWithScores.length > 0
    ? (reportsWithScores.reduce((sum, r) => sum + (r.interview_sessions?.[0]?.scores?.overall || 0), 0) / reportsWithScores.length).toFixed(1)
    : null

  return (
    <ResponsiveLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Reports & Analytics</h1>
          <p className="text-slate-500">
            {totalReports > 0 ? `${totalReports} completed interview${totalReports !== 1 ? 's' : ''}` : 'View all completed interview reports'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {totalReports > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={clearingAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </motion.div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-200"
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Clear All Reports?</h2>
            <p className="text-slate-500 text-center mb-6 text-sm">
              This will permanently delete all <strong>{totalReports}</strong> interview reports and their sessions. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearingAll}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {clearingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {clearingAll ? 'Clearing...' : 'Yes, Clear All'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Total Reports</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalReports}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Avg Score</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{avgScore ?? '—'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Candidates</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalReports}</p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          placeholder="Search by candidate name, role, or paste Session ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Reports List — always has demo reports */}
      <div className="space-y-4">
        {(() => {
          const filteredReports = allReports.filter(report => {
            if (!searchQuery.trim()) return true
            const query = searchQuery.toLowerCase()
            const candidateName = (report.candidate_name || '').toLowerCase()
            const role = (report.job_title || '').toLowerCase()
            const reportId = (report.id || '').toLowerCase()
            const sessionId = (report.interview_sessions?.[0]?.id || '').toLowerCase()
            
            return candidateName.includes(query) || 
                   role.includes(query) || 
                   reportId === query || 
                   sessionId === query
          })

          if (filteredReports.length === 0) {
            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
                <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                No reports found matching your search.
              </div>
            )
          }

          return filteredReports.map((report, index) => {
            const sessionData = report.interview_sessions?.[0]
            const scores = sessionData?.scores || {}
            const overallScore = scores.overall ?? null
            const recommendation = sessionData?.recommendation || ''
            const isHire = recommendation.toLowerCase().includes('hire') ||
              recommendation.toLowerCase().includes('recommend')

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Score Badge or Avatar */}
                    {overallScore !== null ? (
                      <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                        overallScore >= 7
                          ? 'bg-emerald-100 text-emerald-700'
                          : overallScore >= 5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        <span className="text-xl">{overallScore}</span>
                        <span className="text-xs opacity-75">/10</span>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-700">
                        <span className="text-xl font-bold">
                          {(report.candidate_name || 'C').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {report.candidate_name || 'Unknown Candidate'}
                      </h3>
                      <p className="text-slate-500 text-sm">{report.job_title || 'No title'} {report.interview_type ? `• ${report.interview_type}` : ''}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                        {report.candidate_email && (
                          <span className="text-xs text-slate-400">{report.candidate_email}</span>
                        )}
                        {recommendation && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isHire
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {isHire ? '✓ Recommended' : '⚠ Review Needed'}
                          </span>
                        )}
                        {!sessionData && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            No evaluation yet
                          </span>
                        )}
                        {report.isDemo && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                            Demo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score breakdown if available */}
                  <div className="flex items-center gap-4">
                    {sessionData?.scores && (
                      <div className="hidden md:flex gap-5 text-center">
                        {[
                          { label: 'Technical', value: scores.technical ?? scores.technical_skill },
                          { label: 'Comms', value: scores.communication ?? scores.communication_skill },
                          { label: 'Confidence', value: scores.confidence },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-lg font-bold text-slate-900">{value ?? '—'}</p>
                            <p className="text-xs text-slate-400">{label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => startTransition(() => router.push(`/dashboard/reports/${report.id}`))}
                      disabled={isPending || deletingId === report.id}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      View Report
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Hide delete button for demo entries */}
                    {!report.isDemo && (
                      confirmDeleteId === report.id ? (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          <span className="text-xs text-red-700 font-medium whitespace-nowrap">Delete?</span>
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={deletingId === report.id}
                            className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {deletingId === report.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(report.id)}
                          disabled={deletingId === report.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        })()}
      </div>
    </ResponsiveLayout>
  )
}
