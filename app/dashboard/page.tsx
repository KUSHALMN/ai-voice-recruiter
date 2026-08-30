'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, FileText, BarChart3, Clock, CheckCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import DashboardCharts from '@/components/DashboardCharts'
import ResponsiveLayout from '@/components/ResponsiveLayout'

import { OptimizedButton } from '@/components/OptimizedButton'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    successRate: 0
  })
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [allInterviewsData, setAllInterviewsData] = useState<any[]>([])

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)

      // Use server-side API to bypass Supabase RLS
      const res = await fetch('/api/get-interviews')
      const json = await res.json()
      const allInterviews = json.data || []

      setAllInterviewsData(allInterviews)
      setRecentInterviews(allInterviews.slice(0, 5))

      const total = allInterviews.length
      const completed = allInterviews.filter((i: { status: string }) => i.status === 'completed').length
      const pending = allInterviews.filter((i: { status: string }) => i.status === 'scheduled').length

      setStats({
        totalInterviews: total,
        completedInterviews: completed,
        pendingInterviews: pending,
        successRate: total > 0 ? Math.round((completed / total) * 100) : 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
              <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded w-36"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl h-32 bg-slate-100 flex flex-col justify-end">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl glass-card"></div>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back 👋
            </h1>
            <p className="text-slate-500">Here's what's happening with your recruitment pipeline.</p>
          </div>
          <OptimizedButton
            onClick={() => router.push('/dashboard/create-interview')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Interview
          </OptimizedButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-indigo-600 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.totalInterviews}</h3>
            <p className="text-slate-500 text-sm font-medium">Total Interviews</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle className="w-24 h-24 text-emerald-600 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.completedInterviews}</h3>
            <p className="text-slate-500 text-sm font-medium">Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-24 h-24 text-amber-500 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.pendingInterviews}</h3>
            <p className="text-slate-500 text-sm font-medium">Pending</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="w-24 h-24 text-purple-600 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.successRate}%</h3>
            <p className="text-slate-500 text-sm font-medium">Success Rate</p>
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
          className="glass-panel rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Recent Activity
              </h2>
              <p className="text-slate-500 text-sm mt-1">Latest updates from your interview sessions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchDashboardData}
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => startTransition(() => router.push('/dashboard/interviews'))}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1"
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
                  className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white border border-slate-100 rounded-xl transition-all duration-300 hover:shadow-md hover:border-indigo-100"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{interview.job_title}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        {interview.candidate_name}
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        {new Date(interview.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${interview.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      interview.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                      {interview.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {interview.resume_url && (
                      <a
                        href={interview.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#374151] hover:text-[#2563EB] bg-white hover:bg-slate-50 border border-[#E5E7EB] px-3.5 py-2 rounded-xl font-medium transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Resume
                      </a>
                    )}

                    {interview.status === 'scheduled' && (
                      <button
                        onClick={() => {
                          if (!interview.id) {
                            alert('Interview ID is missing')
                            return
                          }
                          startTransition(() => router.push(`/interview/${interview.id}`))
                        }}
                        disabled={isPending}
                        className="opacity-0 group-hover:opacity-100 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 transform translate-x-2 group-hover:translate-x-0"
                      >
                        Start
                      </button>
                    )}
                    {interview.status === 'completed' && (
                      <button
                        onClick={() => startTransition(() => router.push(`/dashboard/reports/${interview.id}`))}
                        disabled={isPending}
                        className="opacity-0 group-hover:opacity-100 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all transform translate-x-2 group-hover:translate-x-0"
                      >
                        Report
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/30 rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No interviews yet</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">Create your first AI-powered interview to start streamlining your hiring process.</p>
              <OptimizedButton
                onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                className="btn-primary"
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