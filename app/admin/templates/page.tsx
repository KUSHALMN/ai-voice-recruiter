'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit3,
  Trash2,
  FileText,
  Search,
  Filter,
  Shield,
  RotateCcw,
  Clock,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  CheckCircle2,
  Cpu,
  X
} from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import BackButton from '@/components/BackButton'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { DEFAULT_INTERVIEW_TEMPLATES, InterviewTemplate } from '@/lib/templates-data'

type CategoryFilter = 'All' | 'Engineering' | 'AI & ML' | 'DevOps' | 'Product & Strategy' | 'Security'

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<InterviewTemplate[]>(DEFAULT_INTERVIEW_TEMPLATES)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')
  
  // Modals state
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<InterviewTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<InterviewTemplate | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<InterviewTemplate>>({
    title: '',
    role: '',
    category: 'Engineering',
    description: '',
    questions: 6,
    duration: 30,
    interviewType: 'Technical',
    candidateType: 'Mid-level',
    icon: '💻',
    skills: [],
    sampleQuestions: []
  })
  const [skillsInput, setSkillsInput] = useState('')
  const [questionsInput, setQuestionsInput] = useState('')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
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
        const mappedData: InterviewTemplate[] = data.map(item => ({
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
          skills: Array.isArray(item.skills) ? item.skills : (item.skills ? item.skills.split(',') : ['Core Competencies']),
          sampleQuestions: Array.isArray(item.sampleQuestions) ? item.sampleQuestions : [
            'Describe your previous experience with high-impact systems in this domain.',
            'What strategies do you use for debugging and architectural resilience?',
            'How do you approach collaboration and continuous improvement within technical teams?'
          ]
        }))
        setTemplates(mappedData)
        if (typeof window !== 'undefined') {
          localStorage.setItem('aira_admin_templates', JSON.stringify(mappedData))
        }
      } else {
        setTemplates(DEFAULT_INTERVIEW_TEMPLATES)
        if (typeof window !== 'undefined') {
          localStorage.setItem('aira_admin_templates', JSON.stringify(DEFAULT_INTERVIEW_TEMPLATES))
        }
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates(DEFAULT_INTERVIEW_TEMPLATES)
    } finally {
      setLoading(false)
    }
  }

  const handleResetToDefaults = () => {
    if (confirm('Reset all templates to factory defaults? This will restore the 8 enterprise blueprints.')) {
      setTemplates(DEFAULT_INTERVIEW_TEMPLATES)
      if (typeof window !== 'undefined') {
        localStorage.setItem('aira_admin_templates', JSON.stringify(DEFAULT_INTERVIEW_TEMPLATES))
      }
      toast.success('Templates restored to factory defaults!')
    }
  }

  const openCreateModal = () => {
    setEditingTemplate(null)
    setFormData({
      title: '',
      role: '',
      category: 'Engineering',
      description: '',
      questions: 6,
      duration: 30,
      interviewType: 'Technical',
      candidateType: 'Mid-level',
      icon: '💼',
      skills: [],
      sampleQuestions: []
    })
    setSkillsInput('')
    setQuestionsInput('')
    setShowModal(true)
  }

  const openEditModal = (template: InterviewTemplate) => {
    setEditingTemplate(template)
    setFormData({
      ...template
    })
    setSkillsInput(template.skills ? template.skills.join(', ') : '')
    setQuestionsInput(template.sampleQuestions ? template.sampleQuestions.join('\n') : '')
    setShowModal(true)
  }

  const saveTemplate = async () => {
    if (!formData.title || !formData.role || !formData.description) {
      toast.error('Please enter title, role, and description')
      return
    }

    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const questionsArray = questionsInput
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean)

    const updatedItem: InterviewTemplate = {
      id: editingTemplate ? editingTemplate.id : `tmpl-${Date.now().toString(36)}`,
      title: formData.title || 'Untitled Blueprint',
      role: formData.role || 'General Role',
      category: (formData.category as any) || 'Engineering',
      description: formData.description || '',
      questions: formData.questions || 6,
      duration: formData.duration || 30,
      interviewType: (formData.interviewType as any) || 'Technical',
      candidateType: (formData.candidateType as any) || 'Mid-level',
      icon: formData.icon || '💼',
      skills: skillsArray.length > 0 ? skillsArray : ['Core Competencies', 'Problem Solving'],
      sampleQuestions: questionsArray.length > 0 ? questionsArray : [
        'Walk through your technical architecture and design principles.',
        'How do you manage trade-offs between delivery velocity and code quality?'
      ],
      isCustom: true
    }

    let nextTemplates: InterviewTemplate[]
    if (editingTemplate) {
      nextTemplates = templates.map(t => t.id === editingTemplate.id ? updatedItem : t)
      toast.success('Template blueprint updated')
    } else {
      nextTemplates = [updatedItem, ...templates]
      toast.success('New template blueprint published')
    }

    setTemplates(nextTemplates)
    if (typeof window !== 'undefined') {
      localStorage.setItem('aira_admin_templates', JSON.stringify(nextTemplates))
    }

    // Background sync to Supabase
    try {
      if (editingTemplate) {
        await supabase.from('interview_templates').update({
          title: updatedItem.title,
          role: updatedItem.role,
          description: updatedItem.description,
          questions: updatedItem.questions,
          interviewType: updatedItem.interviewType,
          candidateType: updatedItem.candidateType,
          icon: updatedItem.icon
        }).eq('id', editingTemplate.id)
      } else {
        await supabase.from('interview_templates').insert([{
          id: updatedItem.id,
          title: updatedItem.title,
          role: updatedItem.role,
          description: updatedItem.description,
          questions: updatedItem.questions,
          interviewType: updatedItem.interviewType,
          candidateType: updatedItem.candidateType,
          icon: updatedItem.icon
        }])
      }
    } catch (e) {
      console.warn('Supabase sync skipped/failed:', e)
    }

    setShowModal(false)
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to decommission this interview template?')) return

    const nextTemplates = templates.filter(t => t.id !== templateId)
    setTemplates(nextTemplates)
    if (typeof window !== 'undefined') {
      localStorage.setItem('aira_admin_templates', JSON.stringify(nextTemplates))
    }

    try {
      await supabase.from('interview_templates').delete().eq('id', templateId)
    } catch (e) {
      console.warn('Supabase delete skipped:', e)
    }

    toast.success('Template decommissioned')
  }

  // Filtered templates
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
      <div className="max-w-7xl mx-auto space-y-6 font-claude-sans">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <BackButton fallbackUrl="/admin" label="Back to Executive Console" />
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 liquid-glass-pill hover:bg-white rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              title="Reset templates to factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              Reset Defaults
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Blueprint
            </button>
          </div>
        </div>

        {/* Premium Claude Editorial Hero Banner with Liquid Glass Effect */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl liquid-glass-panel p-7 lg:p-9"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-indigo-800 text-xs font-semibold tracking-wide mb-3">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Executive Template Engine & Rubrics</span>
              </div>
              <h1 className="font-claude-serif text-3xl sm:text-4xl lg:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
                Enterprise Assessment Blueprints
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
                Curate standardized assessment rubrics, candidate difficulty tiers, and AI question pools enforced across all recruiting workflows.
              </p>
            </div>

            {/* Live Metrics Pills */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl liquid-glass-pill text-center shadow-xs">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Blueprints</p>
                <p className="font-claude-serif text-2xl font-bold text-indigo-700">{templates.length}</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl liquid-glass-pill text-center shadow-xs">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Domains</p>
                <p className="font-claude-serif text-2xl font-bold text-purple-700">5</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl liquid-glass-pill text-center shadow-xs">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Standard</p>
                <p className="font-claude-serif text-2xl font-bold text-emerald-700">v3.2</p>
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'liquid-glass-pill text-slate-700 hover:text-indigo-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-indigo-700 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blueprints, skills..."
              className="w-full pl-9 pr-4 py-2 liquid-glass-pill rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-xs font-medium">Synchronizing assessment blueprints...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="rounded-3xl liquid-glass-panel p-12 text-center shadow-xs">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="font-claude-serif text-lg font-bold text-slate-800 mb-1">No Matching Blueprints</h3>
            <p className="text-slate-500 text-xs mb-4">No assessment templates match your current filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group flex flex-col justify-between rounded-3xl liquid-glass-card p-5 hover:border-indigo-300 transition-all duration-200"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-center text-2xl shadow-xs">
                        {template.icon}
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 mb-0.5">
                          {template.category}
                        </span>
                        <h3 className="font-claude-serif text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
                          {template.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
                        title="Edit Blueprint"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
                        title="Decommission Blueprint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Target Role & Description */}
                  <p className="text-xs text-indigo-700 font-semibold mb-1.5">
                    Role: {template.role}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Skills chips */}
                  {template.skills && template.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {template.skills.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/60 text-slate-700 border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {template.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-500 bg-white/40">
                          +{template.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Action */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-white/80 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-indigo-600" />
                      {template.questions} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-600" />
                      {template.duration} Mins
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {template.candidateType}
                    </span>
                  </div>

                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-white/80 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white border border-slate-200/70 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Questions & Rubric
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Template Preview Modal in Liquid Glass Panel */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="liquid-glass-panel rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-2xl text-slate-900 font-claude-sans"
            >
              <div className="flex items-start justify-between pb-4 border-b border-white/80 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-3xl shadow-xs">
                    {previewTemplate.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {previewTemplate.category}
                    </span>
                    <h2 className="font-claude-serif text-xl font-bold text-slate-900 mt-1">
                      {previewTemplate.title}
                    </h2>
                    <p className="text-xs text-indigo-700 font-semibold">{previewTemplate.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Blueprint Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-claude-serif text-sm font-semibold text-slate-700 mb-1">Blueprint Scope</h4>
                  <p className="text-slate-700 leading-relaxed bg-white/60 p-3.5 rounded-xl border border-white/80">
                    {previewTemplate.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 py-1">
                  <div className="bg-white/60 p-3 rounded-xl border border-white/80 text-center">
                    <p className="text-slate-500 text-[10px] font-medium">Expected Duration</p>
                    <p className="font-claude-serif text-base font-bold text-indigo-700">{previewTemplate.duration} Minutes</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-white/80 text-center">
                    <p className="text-slate-500 text-[10px] font-medium">Target Seniority</p>
                    <p className="font-claude-serif text-base font-bold text-purple-700">{previewTemplate.candidateType}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-white/80 text-center">
                    <p className="text-slate-500 text-[10px] font-medium">Interview Schema</p>
                    <p className="font-claude-serif text-base font-bold text-emerald-700">{previewTemplate.interviewType}</p>
                  </div>
                </div>

                {/* Skills Evaluated */}
                <div>
                  <h4 className="font-claude-serif text-sm font-semibold text-slate-700 mb-2">Evaluated Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewTemplate.skills?.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/70 text-indigo-800 border border-white/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Question Bank Preview */}
                <div>
                  <h4 className="font-claude-serif text-sm font-semibold text-slate-700 mb-2">Standard AI Question Pool</h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {previewTemplate.sampleQuestions?.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white/60 border border-white/80 text-slate-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-sans">
                          {qIdx + 1}
                        </span>
                        <p className="leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/80 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const target = previewTemplate
                    setPreviewTemplate(null)
                    openEditModal(target)
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Blueprint
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Template Modal in Liquid Glass Panel */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="liquid-glass-panel rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl text-slate-900 font-claude-sans"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/80 mb-6">
                <div>
                  <h2 className="font-claude-serif text-xl font-bold text-slate-900">
                    {editingTemplate ? 'Edit Blueprint Schema' : 'Publish New Assessment Blueprint'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define the role title, skills taxonomy, and sample questions for automated AI interview generation.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Blueprint Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Distributed Backend Architect"
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Target Job Role</label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Senior Backend Engineer"
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Category Domain</label>
                    <select
                      value={formData.category || 'Engineering'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Product & Strategy">Product & Strategy</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Seniority Level</label>
                    <select
                      value={formData.candidateType || 'Mid-level'}
                      onChange={(e) => setFormData(prev => ({ ...prev, candidateType: e.target.value as any }))}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    >
                      <option value="Fresher">Fresher / Graduate</option>
                      <option value="Mid-level">Mid-level (2-5 yrs)</option>
                      <option value="Senior">Senior (5+ yrs)</option>
                      <option value="Lead">Lead / Architect</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Emoji Icon</label>
                    <input
                      type="text"
                      value={formData.icon || '💼'}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g. 💻, ⚛️, 🔒"
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={10}
                      max={90}
                      value={formData.duration || 30}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Number of Questions</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={formData.questions || 6}
                      onChange={(e) => setFormData(prev => ({ ...prev, questions: parseInt(e.target.value) || 6 }))}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Description & Evaluation Scope</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe assessment objectives, architecture focus, and candidate prerequisites..."
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. Next.js, TypeScript, PostgreSQL, Distributed Systems"
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Standard AI Question Bank (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={questionsInput}
                    onChange={(e) => setQuestionsInput(e.target.value)}
                    placeholder="Describe how you handle state consistency in microservices...&#10;How do you profile bottlenecks under heavy traffic?"
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-white/80 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white font-mono text-[11px] leading-relaxed"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/80 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white/80 hover:bg-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  {editingTemplate ? 'Save Changes' : 'Publish Blueprint'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  )
}