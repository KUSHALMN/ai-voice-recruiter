'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus, Users, FileText, BarChart3, Clock, CheckCircle, Loader2, Sparkles, ArrowRight, Copy, Check, Play, PlayCircle, RefreshCw, AlertCircle } from 'lucide-react'
import DashboardCharts from '@/components/DashboardCharts'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import toast from 'react-hot-toast'
import { DEMO_REPORTS } from '@/lib/demo-data'

import { OptimizedButton } from '@/components/OptimizedButton'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [navigatingId, setNavigatingId] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    inProgressInterviews: 0,
    successRate: 0
  })
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [allInterviewsData, setAllInterviewsData] = useState<any[]>([])

  const handleCopyLink = useCallback((interviewId: string) => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/interview/${interviewId}`
    navigator.clipboard.writeText(url)
    setCopiedId(interviewId)
    toast.success('Interview link copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2500)
  }, [])

  const fetchDashboardData = useCallback(async (showRefreshingSpinner = false) => {
    try {
      if (showRefreshingSpinner) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setErrorMessage(null)

      // Use server-side API to bypass Supabase RLS
      const res = await fetch('/api/get-interviews')
      const json = await res.json()

      let allInterviews = json.data || []

      // Graceful fallback to demo data if the database is brand new or empty
      if (allInterviews.length === 0) {
        allInterviews = DEMO_REPORTS.map(r => ({ ...r, id: r.id }))
      }

      setAllInterviewsData(allInterviews)
      setRecentInterviews(allInterviews.slice(0, 5))

      const total = allInterviews.length
      const completed = allInterviews.filter((i: { status: string }) => i.status === 'completed').length
      const pending = allInterviews.filter((i: { status: string }) => i.status === 'scheduled').length
      const inProgress = allInterviews.filter((i: { status: string }) => i.status === 'in_progress').length

      setStats({
        totalInterviews: total,
        completedInterviews: completed,
        pendingInterviews: pending,
        inProgressInterviews: inProgress,
        successRate: total > 0 ? Math.round((completed / total) * 100) : 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setErrorMessage('Could not connect to live database. Displaying offline demo pipeline.')
      const fallback = DEMO_REPORTS.map(r => ({ ...r, id: r.id }))
      setAllInterviewsData(fallback)
      setRecentInterviews(fallback.slice(0, 5))
      const total = fallback.length
      const completed = fallback.filter((i: { status: string }) => i.status === 'completed').length
      const pending = fallback.filter((i: { status: string }) => i.status === 'scheduled').length
      const inProgress = fallback.filter((i: { status: string }) => i.status === 'in_progress').length
      setStats({
        totalInterviews: total,
        completedInterviews: completed,
        pendingInterviews: pending,
        inProgressInterviews: inProgress,
        successRate: total > 0 ? Math.round((completed / total) * 100) : 0
      })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    // Fetch data immediately — compatible with both Supabase and NextAuth auth
    setIsCheckingAuth(false)
    fetchDashboardData()
  }, [fetchDashboardData])

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="space-y-8 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="h-8 bg-slate-200 dark:bg-neutral-800 rounded w-48 mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-64"></div>
            </div>
            <div className="h-10 bg-slate-200 dark:bg-neutral-800 rounded w-36"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl h-32 bg-slate-100 dark:bg-neutral-900 flex flex-col justify-end border border-slate-200/50 dark:border-neutral-800">
                <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-slate-200 dark:bg-neutral-800 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-slate-100 dark:bg-neutral-900 rounded-2xl glass-card border border-slate-200/50 dark:border-neutral-800"></div>
        </div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-slate-500 dark:text-neutral-400">Here&apos;s what&apos;s happening with your recruitment pipeline.</p>
          </div>
          <OptimizedButton
            onClick={() => router.push('/dashboard/create-interview')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 font-medium px-5 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Interview
          </OptimizedButton>
        </div>

        {/* Database Status / Fallback Notice Banner */}
        {errorMessage && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex items-center justify-between text-amber-800 dark:text-amber-200 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => fetchDashboardData(true)}
              className="text-xs font-semibold px-3 py-1.5 bg-white dark:bg-neutral-800 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-neutral-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200/60 dark:border-neutral-800"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-indigo-600 dark:text-indigo-400 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 border border-indigo-100 dark:border-indigo-900/50">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalInterviews}</h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium">Total Interviews</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200/60 dark:border-neutral-800"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle className="w-24 h-24 text-emerald-600 dark:text-emerald-400 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 border border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.completedInterviews}</h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium">Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200/60 dark:border-neutral-800"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-24 h-24 text-amber-500 dark:text-amber-400 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300 border border-amber-100 dark:border-amber-900/50">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.pendingInterviews}</h3>
            <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 text-sm font-medium">
              <span>Scheduled</span>
              {stats.inProgressInterviews > 0 && (
                <span className="text-[11px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/50">
                  {stats.inProgressInterviews} Active
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-slate-200/60 dark:border-neutral-800"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="w-24 h-24 text-purple-600 dark:text-purple-400 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300 border border-purple-100 dark:border-purple-900/50">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.successRate}%</h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium">Success Rate</p>
          </motion.div>
        </div>

        {/* Analytics Charts */}
        {allInterviewsData.length > 0 && (
          <DashboardCharts interviews={allInterviewsData} />
        )}

        {/* Recent Interviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200/60 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Recent Activity
              </h2>
              <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">Latest updates from your interview sessions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={isRefreshing}
                className="text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => startTransition(() => router.push('/dashboard/interviews'))}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {recentInterviews.length > 0 ? (
            <div className="space-y-4">
              {recentInterviews.map((interview, i) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/50 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-xl transition-all duration-300 hover:shadow-md hover:border-indigo-100 dark:hover:border-neutral-700 gap-4"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shrink-0 border border-slate-100 dark:border-neutral-800">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{interview.job_title}</h3>
                      <p className="text-sm text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                        {interview.candidate_name}
                        <span className="w-1 h-1 bg-slate-300 dark:bg-neutral-600 rounded-full"></span>
                        {new Date(interview.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${interview.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50' :
                      interview.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50' :
                        'bg-slate-50 text-slate-600 border-slate-100 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-700'
                      }`}>
                      {interview.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {interview.resume_url && (
                      <a
                        href={interview.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#374151] dark:text-neutral-200 hover:text-[#2563EB] dark:hover:text-indigo-400 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 border border-[#E5E7EB] dark:border-neutral-700 px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Resume
                      </a>
                    )}

                    {/* Quick Copy Link button */}
                    <button
                      onClick={() => handleCopyLink(interview.id)}
                      title="Copy interview link"
                      className="flex items-center gap-1 text-xs text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700 px-2.5 py-1.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                      {copiedId === interview.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Link</span>
                        </>
                      )}
                    </button>

                    {interview.status === 'scheduled' && (
                      <button
                        onClick={() => {
                          if (!interview.id) {
                            toast.error('Interview ID is missing')
                            return
                          }
                          setNavigatingId(interview.id)
                          startTransition(() => router.push(`/interview/${interview.id}`))
                        }}
                        disabled={isPending && navigatingId === interview.id}
                        className="flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                      >
                        {isPending && navigatingId === interview.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        Start
                      </button>
                    )}

                    {interview.status === 'in_progress' && (
                      <button
                        onClick={() => {
                          if (!interview.id) {
                            toast.error('Interview ID is missing')
                            return
                          }
                          setNavigatingId(interview.id)
                          startTransition(() => router.push(`/interview/${interview.id}`))
                        }}
                        disabled={isPending && navigatingId === interview.id}
                        className="flex items-center gap-1.5 bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                      >
                        {isPending && navigatingId === interview.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <PlayCircle className="w-3.5 h-3.5" />
                        )}
                        Continue
                      </button>
                    )}

                    {interview.status === 'completed' && (
                      <button
                        onClick={() => {
                          setNavigatingId(interview.id)
                          startTransition(() => router.push(`/dashboard/reports/${interview.id}`))
                        }}
                        disabled={isPending && navigatingId === interview.id}
                        className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all shadow-sm disabled:opacity-50"
                      >
                        {isPending && navigatingId === interview.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        )}
                        Report
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/30 dark:bg-neutral-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800">
              <div className="w-16 h-16 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No interviews yet</h3>
              <p className="text-slate-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto">Create your first AI-powered interview to start streamlining your hiring process.</p>
              <OptimizedButton
                onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20"
              >
                Create Interview
              </OptimizedButton>
            </div>
          )}
        </motion.div>
      </div>
    </ResponsiveLayout>
  )
}