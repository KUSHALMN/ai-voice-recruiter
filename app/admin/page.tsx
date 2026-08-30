'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, FileText, BarChart3, Settings, TrendingUp, Activity, Shield, Database, Brain, Zap, Target, Award } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { supabase } from '@/lib/supabase'
import DashboardCharts from '@/components/DashboardCharts'

interface AdminReport {
  id: string
  candidate_name: string
  job_title: string
  interview_type: string
  status: string
  recruiter_email: string
  created_at: string
  interview_sessions?: Array<{
    completed_at: string
    scores?: Record<string, number>
    recommendation?: string
  }>
}

const InterviewReports = () => {
  const [reports, setReports] = useState<AdminReport[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const { data } = await supabase
        .from('interviews')
        .select(`
          *,
          interview_sessions (*)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      setReports(data || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 text-sm">No completed interviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {reports.map((report) => {
        const session = report.interview_sessions?.[0]
        if (!session) return null

        return (
          <div
            key={report.id}
            className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{report.candidate_name}</h3>
                <p className="text-sm text-slate-600">{report.job_title} • {report.interview_type}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(session.completed_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{session.scores?.overall || 0}/10</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-white rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">Technical</p>
                <p className="text-sm font-bold text-slate-800">{session.scores?.technical || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">Communication</p>
                <p className="text-sm font-bold text-slate-800">{session.scores?.communication || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="text-sm font-bold text-slate-800">{session.scores?.confidence || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <p className="text-xs text-slate-500">Problem Solving</p>
                <p className="text-sm font-bold text-slate-800">{session.scores?.problem_solving || 0}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${session.recommendation?.includes('Recommended') ? 'bg-green-100 text-green-700' :
                session.recommendation?.includes('improvement') ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                {session.recommendation}
              </span>
              <button
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium "
              >
                View Details →
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const CountUp = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count}</span>
}

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalInterviews: 0,
    candidatesEvaluated: 0,
    avgScore: 0,
    recommendedRate: 0,
    activeRecruiters: 0
  })
  const [recentActivity, setRecentActivity] = useState<AdminReport[]>([])
  const [allInterviewsData, setAllInterviewsData] = useState<AdminReport[]>([])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const { data: interviews } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      const { data: sessions } = await supabase
        .from('interview_sessions')
        .select('*')

      if (interviews && sessions) {
        setAllInterviewsData(interviews)
        setRecentActivity(interviews.slice(0, 10))

        const completed = interviews.filter(i => i.status === 'completed').length
        const avgScore = sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.scores?.overall || 0), 0) / sessions.length
          : 0
        const recommended = sessions.filter(s => s.recommendation === 'hire').length

        setStats({
          totalInterviews: interviews.length,
          candidatesEvaluated: sessions.length,
          avgScore: Math.round(avgScore * 10) / 10,
          recommendedRate: sessions.length > 0 ? Math.round((recommended / sessions.length) * 100) : 0,
          activeRecruiters: new Set(interviews.map(i => i.recruiter_email)).size
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      AI Recruitment Intelligence
                    </h1>
                  </div>
                  <p className="text-slate-600 text-lg">Where Data Meets Human Potential</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">System Performance Overview</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">AI System Online</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl  hover:border-indigo-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  <CountUp end={stats.totalInterviews} />
                </h3>
                <p className="text-slate-600 text-sm font-medium">Total Interviews</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl  hover:border-blue-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  <CountUp end={stats.candidatesEvaluated} />
                </h3>
                <p className="text-slate-600 text-sm font-medium">Candidates Evaluated</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl  hover:border-emerald-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  <CountUp end={stats.avgScore} />.<CountUp end={Math.round((stats.avgScore % 1) * 10)} />
                </h3>
                <p className="text-slate-600 text-sm font-medium">Avg Candidate Score</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl  hover:border-amber-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  <CountUp end={stats.recommendedRate} />%
                </h3>
                <p className="text-slate-600 text-sm font-medium">Recommended Rate</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-violet-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl  hover:border-violet-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  <CountUp end={stats.activeRecruiters} />
                </h3>
                <p className="text-slate-600 text-sm font-medium">Active Recruiters</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Analytics Charts */}
            {allInterviewsData.length > 0 && (
              <div className="mb-8">
                <DashboardCharts interviews={allInterviewsData} />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Interview Reports</h2>
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <InterviewReports />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">AI Evaluation Insights</h2>
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>

                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 6).map((interview, index) => (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-100 hover:shadow-md "
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{interview.candidate_name?.charAt(0) || 'C'}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-sm">{interview.job_title}</h3>
                            <p className="text-xs text-slate-600">{interview.candidate_name} • {new Date(interview.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            interview.status === 'in_progress' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                            {interview.status}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View →</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No recent AI evaluations</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">System Controls</h2>
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/admin/reports')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl  text-left border border-indigo-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">Analytics Dashboard</h3>
                      <p className="text-xs text-slate-600">Deep performance insights</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/admin/templates')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl  text-left border border-blue-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">AI Templates</h3>
                      <p className="text-xs text-slate-600">Manage interview models</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/admin/settings')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl  text-left border border-emerald-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">System Config</h3>
                      <p className="text-xs text-slate-600">Platform administration</p>
                    </div>
                  </motion.button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-2">AI Recruitment Console</p>
                    <p className="text-xs text-slate-400">© 2025 • v2.1.0</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}