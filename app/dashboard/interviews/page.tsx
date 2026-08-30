'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, Users, ExternalLink, Loader2, Check } from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import toast from 'react-hot-toast'
import { DEMO_REPORTS } from '@/lib/demo-data'

export default function InterviewsPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Fetch interviews on load — works with both Supabase and NextAuth auth
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      // Use server-side API to bypass Supabase RLS
      const res = await fetch('/api/get-interviews')
      const json = await res.json()

      if (!res.ok) {
        console.error('Error fetching interviews:', json.error)
        toast.error('Failed to load interviews')
        return
      }

      if (json.data && json.data.length > 0) {
        setInterviews(json.data)
      } else {
        // Fallback to demo data if DB is empty
        setInterviews(DEMO_REPORTS.map(r => ({
          ...r,
          id: r.id, // Keep demo ID
        })))
      }
    } catch (error) {
      console.error('Error fetching interviews:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch =
      interview.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidate_email?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="animate-pulse">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="h-10 w-full sm:w-80 bg-gray-200 rounded-md"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-56"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="w-32 h-9 bg-gray-200 rounded-lg"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded hidden sm:block"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Interviews</h1>
        <p className="text-gray-600">View and manage all interview sessions</p>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interviews..."
              className="bg-white border border-gray-200 rounded-md px-3 py-2 pl-10 w-full sm:w-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors ${showFilter ? 'bg-gray-50 ring-2 ring-blue-100 border-blue-200' : ''}`}
            >
              <Filter className="w-5 h-5" />
              Filter
              {statusFilter !== 'all' && (
                <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  1
                </span>
              )}
            </button>

            <AnimatePresence>
              {showFilter && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilter(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Filter by Status
                    </div>
                    {['all', 'scheduled', 'completed', 'in_progress'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setStatusFilter(filter)
                          setShowFilter(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="capitalize">{filter.replace('_', ' ')}</span>
                        {statusFilter === filter && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Interviews</h2>
          <span className="text-sm text-gray-500">
            Showing {filteredInterviews.length} results
          </span>
        </div>
        <div className="p-6">
          {filteredInterviews.length > 0 ? (
            <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                <div key={interview.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{interview.job_title}</h3>
                      <p className="text-sm text-gray-600">{interview.candidate_name} • {interview.candidate_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {interview.status === 'scheduled' && (
                      <button
                        onClick={() => startTransition(() => router.push(`/interview/${interview.id}`))}
                        disabled={isPending}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        Attend Interview
                      </button>
                    )}
                    {interview.status === 'completed' && (
                      <button
                        onClick={() => startTransition(() => router.push(`/dashboard/reports/${interview.id}`))}
                        disabled={isPending}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        View Report
                      </button>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                        interview.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {interview.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 hidden sm:inline">
                      {new Date(interview.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No interviews found</p>
              <p className="text-gray-500 text-sm">
                {statusFilter !== 'all' || searchQuery
                  ? 'Try adjusting your filters or search query'
                  : 'Interviews will appear here once created'}
              </p>
              {(statusFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setSearchQuery('')
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  )
}