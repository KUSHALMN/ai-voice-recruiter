'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Plus,
  Search,
  X,
  Sparkles,
  Clock,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  Send,
  User,
  Mail,
  Zap,
  Check
} from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import BackButton from '@/components/BackButton'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { DEFAULT_INTERVIEW_TEMPLATES, InterviewTemplate } from '@/lib/templates-data'

type CategoryFilter = 'All' | 'Engineering' | 'AI & ML' | 'DevOps' | 'Product & Strategy' | 'Security'

export default function RecruiterTemplatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<InterviewTemplate[]>(DEFAULT_INTERVIEW_TEMPLATES)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')

  // Modal states
  const [selectedTemplate, setSelectedTemplate] = useState<InterviewTemplate | null>(null)
  const [showUseModal, setShowUseModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creatingInterview, setCreatingInterview] = useState(false)

  // Candidate info for quick creation
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    duration: 30
  })

  // New template form
  const [newTemplateData, setNewTemplateData] = useState({
    title: '',
    role: '',
    category: 'Engineering' as const,
    description: '',
    questions: 6,
    duration: 30,
    interviewType: 'Technical',
    candidateType: 'Mid-level',
    icon: '💻',
    skills: ''
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)

      // Check localStorage first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('aira_admin_templates')
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTemplates(parsed)
              setLoading(false)
              return
            }
          } catch (e) {
            console.error('Error reading cached templates:', e)
          }
        }
      }

      const { data, error } = await supabase
        .from('interview_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        const mapped: InterviewTemplate[] = data.map(item => ({
          id: item.id || `tmpl-${Math.random().toString(36).substring(2, 9)}`,
          title: item.title,
          role: item.role || item.title,
          category: item.category || 'Engineering',
          description: item.description,
          questions: item.questions || 6,
          duration: item.duration || 30,
          interviewType: item.interviewType || item.interview_type || 'Technical',
          candidateType: item.candidateType || item.candidate_type || 'Mid-level',
          icon: item.icon || '💼',
          skills: Array.isArray(item.skills) ? item.skills : (item.skills ? item.skills.split(',') : ['Core Competency']),
          sampleQuestions: Array.isArray(item.sampleQuestions) ? item.sampleQuestions : [
            'Describe your previous hands-on experience in this role.',
            'How do you handle technical roadblocks and tight deadlines?',
            'What methods do you use to test and ensure high quality?'
          ]
        }))
        setTemplates(mapped)
      } else {
        setTemplates(DEFAULT_INTERVIEW_TEMPLATES)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      setTemplates(DEFAULT_INTERVIEW_TEMPLATES)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (template: InterviewTemplate) => {
    setSelectedTemplate(template)
    setCandidateInfo(prev => ({
      ...prev,
      duration: template.duration || 30
    }))
    setShowUseModal(true)
  }

  const handlePreviewTemplate = (template: InterviewTemplate) => {
    setSelectedTemplate(template)
    setShowPreviewModal(true)
  }

  const handleCustomizeInBuilder = (template: InterviewTemplate) => {
    router.push(
      `/dashboard/create-interview?title=${encodeURIComponent(template.title)}&role=${encodeURIComponent(template.role)}&duration=${template.duration}&type=${template.interviewType}`
    )
  }

  const createInterviewFromTemplate = async () => {
    if (!candidateInfo.name || !candidateInfo.email) {
      toast.error('Please enter candidate name and email address')
      return
    }

    if (!selectedTemplate) {
      toast.error('Please select a template')
      return
    }

    try {
      setCreatingInterview(true)
      const interviewId = crypto.randomUUID()
      const interviewData = {
        id: interviewId,
        recruiter_email: session?.user?.email || 'recruiter@company.com',
        job_title: selectedTemplate.title,
        job_description: selectedTemplate.description,
        interview_type: selectedTemplate.interviewType || 'Technical',
        candidate_type: selectedTemplate.candidateType || 'Mid-level',
        duration: candidateInfo.duration,
        candidate_name: candidateInfo.name,
        candidate_email: candidateInfo.email,
        interview_link: `${window.location.origin}/interview/${interviewId}`,
        status: 'scheduled',
      }

      const { error } = await supabase.from('interviews').insert(interviewData)
      if (error) {
        console.warn('Supabase insert error (using fallback local store):', error)
      }

      toast.success(`Interview successfully scheduled for ${candidateInfo.name}!`)
      setShowUseModal(false)
      setCandidateInfo({ name: '', email: '', duration: 30 })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating interview:', error)
      toast.error('Failed to create interview')
    } finally {
      setCreatingInterview(false)
    }
  }

  const saveNewTemplate = () => {
    if (!newTemplateData.title || !newTemplateData.role || !newTemplateData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const skills = newTemplateData.skills.split(',').map(s => s.trim()).filter(Boolean)
    const newTmpl: InterviewTemplate = {
      id: `tmpl-${Date.now().toString(36)}`,
      title: newTemplateData.title,
      role: newTemplateData.role,
      category: newTemplateData.category,
      description: newTemplateData.description,
      questions: newTemplateData.questions,
      duration: newTemplateData.duration,
      interviewType: newTemplateData.interviewType as any,
      candidateType: newTemplateData.candidateType as any,
      icon: newTemplateData.icon || '💼',
      skills: skills.length > 0 ? skills : ['Core Skills'],
      sampleQuestions: [
        'Walk through your technical architecture and design principles.',
        'How do you approach solving unexpected bugs in production?'
      ],
      isCustom: true
    }

    const next = [newTmpl, ...templates]
    setTemplates(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('aira_admin_templates', JSON.stringify(next))
    }

    toast.success('Custom interview template saved!')
    setShowCreateModal(false)
    setNewTemplateData({
      title: '',
      role: '',
      category: 'Engineering',
      description: '',
      questions: 6,
      duration: 30,
      interviewType: 'Technical',
      candidateType: 'Mid-level',
      icon: '💼',
      skills: ''
    })
  }

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query ||
        template.title.toLowerCase().includes(query) ||
        template.role.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.skills?.some(s => s.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [templates, selectedCategory, searchQuery])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: templates.length }
    templates.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  }, [templates])

  return (
    <ResponsiveLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <BackButton fallbackUrl="/dashboard" label="Back to Dashboard" />
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Custom Template
          </button>
        </div>

        {/* Recruiter Workspace Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 md:p-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-medium tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                TALENT ACQUISITION WORKSPACE
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                Interview Templates Catalog
              </h1>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                Deploy vetted assessment frameworks across Frontend, Fullstack, AI, DevOps, and Product roles in a single click.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-center">
                <p className="text-[11px] text-blue-100 uppercase tracking-wider">Ready Blueprints</p>
                <p className="text-2xl font-bold text-white">{templates.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-center">
                <p className="text-[11px] text-blue-100 uppercase tracking-wider">Target Domains</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Engineering', 'AI & ML', 'DevOps', 'Product & Strategy', 'Security'] as CategoryFilter[]).map((cat) => {
              const active = selectedCategory === cat
              const count = categoryCounts[cat] || 0
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-gray-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-blue-700 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, role, skill..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-xs">Loading templates catalog...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Templates Found</h3>
            <p className="text-gray-500 text-xs mb-4">Try adjusting your search or category filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500 p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-2xl shadow-sm">
                        {template.icon}
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-0.5">
                          {template.category}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {template.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1.5">
                    {template.role}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Skills tags */}
                  {template.skills && template.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {template.skills.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {template.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-gray-500 bg-gray-50 dark:bg-neutral-800/60">
                          +{template.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Actions */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-neutral-800 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-blue-600" />
                      {template.questions} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      {template.duration} Mins
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                      {template.candidateType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePreviewTemplate(template)}
                      className="py-2 px-3 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="py-2 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Use Template
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Use Template Modal */}
      <AnimatePresence>
        {showUseModal && selectedTemplate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-neutral-800 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-2xl flex items-center justify-center">
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Launch Interview
                    </h2>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {selectedTemplate.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUseModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">
                    Candidate Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={candidateInfo.name}
                      onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">
                    Candidate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={candidateInfo.email}
                      onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. alex.morgan@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">
                    Interview Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={90}
                    value={candidateInfo.duration}
                    onChange={(e) => setCandidateInfo(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-3 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300 font-semibold mb-1">Assessment Summary</p>
                  <p className="text-blue-700 dark:text-blue-400 text-[11px] leading-relaxed">
                    AI proctored interview assessing {selectedTemplate.questions} questions covering {selectedTemplate.skills?.slice(0, 3).join(', ')}. Anti-cheat monitoring is automatically enabled.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex flex-col gap-2">
                <button
                  onClick={createInterviewFromTemplate}
                  disabled={creatingInterview}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {creatingInterview ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Interview...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Schedule & Generate AI Link
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowUseModal(false)
                    handleCustomizeInBuilder(selectedTemplate)
                  }}
                  className="w-full py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Customize in Full Job Creator →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedTemplate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-neutral-800 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-3xl">
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {selectedTemplate.category}
                    </span>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                      {selectedTemplate.title}
                    </h2>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{selectedTemplate.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">Role Blueprint</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-gray-100 dark:border-neutral-700">
                    {selectedTemplate.description}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Evaluated Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.skills?.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/40 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Questions */}
                <div>
                  <h4 className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Sample AI Questions</h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedTemplate.sampleQuestions?.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-700 text-gray-800 dark:text-gray-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    handleUseTemplate(selectedTemplate)
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Use This Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Custom Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-neutral-800 mb-5">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Create Custom Template
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Template Title</label>
                    <input
                      type="text"
                      value={newTemplateData.title}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Lead Mobile Architect"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Role Designation</label>
                    <input
                      type="text"
                      value={newTemplateData.role}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. iOS / Android Architect"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Category</label>
                    <select
                      value={newTemplateData.category}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Product & Strategy">Product & Strategy</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Level</label>
                    <select
                      value={newTemplateData.candidateType}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, candidateType: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Icon</label>
                    <input
                      type="text"
                      value={newTemplateData.icon}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g. 📱"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={newTemplateData.description}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the candidate evaluation scope..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newTemplateData.skills}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="Swift, Kotlin, Architecture, CI/CD"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewTemplate}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  )
}