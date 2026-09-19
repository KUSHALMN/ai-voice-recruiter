'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import {
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Mail,
  ExternalLink,
  PlusCircle,
  Copy,
  Check,
  Filter,
  Loader2,
  UserCheck,
  TrendingUp,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'

interface CandidateMatch {
  id: string
  candidateName: string
  candidateEmail: string
  resumeUrl?: string
  headline: string
  skills: string[]
  experienceSummary: string
  matchScore: number
  highlightKeywords: string[]
}

const SAMPLE_QUERIES = [
  'Senior React engineer with WebSockets and Docker experience',
  'Full Stack Next.js & Supabase developer with PostgreSQL indexing',
  'Python backend engineer experienced in FastAPI, Redis, and microservices',
  'DevOps engineer with Kubernetes, CI/CD pipelines, and AWS Terraform',
  'Lead engineer with distributed systems and team mentorship experience',
]

export default function TalentSearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState<CandidateMatch[]>([])
  const [searchStats, setSearchStats] = useState<{ count: number; timeMs: number } | null>(null)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [minScoreFilter, setMinScoreFilter] = useState(0)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || !searchQuery.trim()) return

    setLoading(true)
    try {
      const res = await axios.post('/api/ats/match', {
        query: searchQuery.trim(),
        limit: 20,
      })

      if (res.data && Array.isArray(res.data.candidates)) {
        setCandidates(res.data.candidates)
        setSearchStats({
          count: res.data.totalMatches || res.data.candidates.length,
          timeMs: res.data.executionTimeMs || 42,
        })
      }
    } catch (err: any) {
      console.error('Talent search error:', err)
      toast.error('Search failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-search default prompt on mount
  useEffect(() => {
    const initialQuery = 'Senior React engineer with WebSockets and Docker experience'
    setQuery(initialQuery)
    handleSearch(initialQuery)
  }, [handleSearch])

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    toast.success('Candidate email copied!')
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const filteredCandidates = candidates.filter(c => c.matchScore >= minScoreFilter)

  return (
    <ResponsiveLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                RAG Semantic Search
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-3 h-3" /> pgvector 768-dim
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI Talent Matcher
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400">
              Find best-fit candidates using natural language queries powered by semantic vector similarity.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard/create-interview')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Interview
          </button>
        </div>

        {/* Search Input Card */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(query)
            }}
            className="space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-neutral-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your ideal candidate in natural language..."
                className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm sm:text-base transition-all"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                Suggested Semantic Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUERIES.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(sample)
                      handleSearch(sample)
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-neutral-800 dark:hover:bg-blue-950/40 text-slate-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Filter & Results Bar */}
          {searchStats && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} matched
                </span>
                <span>•</span>
                <span>Vector execution: {searchStats.timeMs}ms</span>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" />
                <span>Min Match:</span>
                {[0, 60, 75, 85].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScoreFilter(score)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      minScoreFilter === score
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 text-slate-600 dark:text-neutral-300'
                    }`}
                  >
                    {score === 0 ? 'All' : `${score}%+`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-slate-100 dark:bg-neutral-900/60 animate-pulse border border-slate-200/50 dark:border-neutral-800"
              />
            ))}
          </div>
        ) : filteredCandidates.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredCandidates.map((cand) => (
                <motion.div
                  key={cand.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200/80 dark:border-neutral-800 p-5 flex flex-col justify-between hover:shadow-lg hover:border-blue-400/40 dark:hover:border-blue-600/40 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Name & Match Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cand.candidateName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                          {cand.headline}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          cand.matchScore >= 80
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : cand.matchScore >= 65
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>{cand.matchScore}%</span>
                      </div>
                    </div>

                    {/* Email with copy */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-950 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{cand.candidateEmail}</span>
                      </div>
                      <button
                        onClick={() => copyEmail(cand.candidateEmail)}
                        className="p-1 hover:text-blue-600 transition-colors shrink-0"
                        title="Copy Email"
                      >
                        {copiedEmail === cand.candidateEmail ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Highlighted Match Reason */}
                    {cand.highlightKeywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap text-[11px] text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">Query Match:</span>
                        {cand.highlightKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-blue-100/70 dark:bg-blue-950/80 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Experience Summary */}
                    <p className="text-xs text-slate-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                      {cand.experienceSummary}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cand.skills.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    {cand.resumeUrl ? (
                      <a
                        href={cand.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Indexed via RAG</span>
                    )}

                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/create-interview?name=${encodeURIComponent(
                            cand.candidateName
                          )}&email=${encodeURIComponent(cand.candidateEmail)}&job=${encodeURIComponent(
                            cand.headline
                          )}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Invite to Interview</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 space-y-3">
            <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No matching candidate profiles found
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
              Try broadening your query keywords or adjusting the minimum match percentage filter.
            </p>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}
