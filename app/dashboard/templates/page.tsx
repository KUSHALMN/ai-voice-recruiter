'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface InterviewTemplate {
  id: string
  title: string
  role: string
  description: string
  questions: number
  icon: string
  interviewType?: string
  candidateType?: string
}

export default function TemplatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<InterviewTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<InterviewTemplate | null>(null)
  const [showUseModal, setShowUseModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // State for creating an interview from a template
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    duration: 30
  })

  // State for creating a new template
  const [newTemplateData, setNewTemplateData] = useState({
    title: '',
    role: '',
    description: '',
    questions: 7,
    interviewType: 'Technical',
    candidateType: 'Mid-level',
    icon: '💼'
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      // Try fetching from API first
      try {
        const response = await fetch('http://localhost:5000/api/templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data)
          return
        }
      } catch {
        // API not available, fallback to Supabase
      }

      // Fallback to Supabase
      const { data, error } = await supabase
        .from('interview_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        setTemplates(data)
      } else {
        // Fallback to static templates if DB is empty
        const fallbackTemplates = [
          { id: 'software-engineer', title: 'Software Engineer', role: 'Technology', description: 'Full-stack development, algorithms, system design', questions: 7, icon: '💻' },
          { id: 'frontend-developer', title: 'Frontend Developer', role: 'Technology', description: 'React, Vue, Angular, responsive design', questions: 6, icon: '🎨' },
          { id: 'data-scientist', title: 'Data Scientist', role: 'Analytics', description: 'Machine learning, statistical analysis, data visualization', questions: 6, icon: '📈' },
          { id: 'product-manager', title: 'Product Manager', role: 'Product', description: 'Product strategy, roadmap planning, user research', questions: 6, icon: '📊' },
          { id: 'digital-marketing', title: 'Digital Marketing', role: 'Marketing', description: 'SEO, SEM, social media marketing, analytics', questions: 5, icon: '📢' },
          { id: 'cybersecurity-analyst', title: 'Cybersecurity Analyst', role: 'Security', description: 'Threat analysis, security protocols, incident response', questions: 7, icon: '🔒' },
          { id: 'healthcare-nurse', title: 'Registered Nurse', role: 'Healthcare', description: 'Patient care, medical procedures, healthcare protocols', questions: 6, icon: '🏥' },
          { id: 'financial-advisor', title: 'Financial Advisor', role: 'Finance', description: 'Investment planning, risk assessment, portfolio management', questions: 6, icon: '💰' },
          { id: 'teacher-educator', title: 'Elementary Teacher', role: 'Education', description: 'Curriculum development, classroom management, student assessment', questions: 5, icon: '🎓' }
        ]
        setTemplates(fallbackTemplates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (template: InterviewTemplate) => {
    setSelectedTemplate(template)
    setShowUseModal(true)
  }

  const createInterviewFromTemplate = async () => {
    if (!candidateInfo.name || !candidateInfo.email) {
      toast.error('Please fill in all candidate information')
      return
    }

    if (!selectedTemplate) {
      toast.error('Please select a template first')
      return
    }

    try {
      const interviewId = crypto.randomUUID()
      const interviewData = {
        id: interviewId,
        recruiter_email: session?.user?.email,
        job_title: selectedTemplate.title,
        job_description: selectedTemplate.description,
        interview_type: selectedTemplate.interviewType || 'Technical',
        candidate_type: selectedTemplate.candidateType || 'Experienced',
        duration: candidateInfo.duration,
        candidate_name: candidateInfo.name,
        candidate_email: candidateInfo.email,
        interview_link: `${window.location.origin}/interview/${interviewId}`,
        status: 'scheduled',
      }

      const { error } = await supabase.from('interviews').insert(interviewData)

      if (error) throw error

      toast.success('Interview created successfully!')
      setShowUseModal(false)
      setCandidateInfo({ name: '', email: '', duration: 30 })
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating interview:', error)
      toast.error('Failed to create interview')
    }
  }

  const saveNewTemplate = async () => {
    if (!newTemplateData.title || !newTemplateData.role) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('interview_templates')
        .insert([newTemplateData])
        .select()
        .single()

      if (error) throw error

      setTemplates([data, ...templates])
      toast.success('Template created successfully')
      setShowCreateModal(false)
      setNewTemplateData({
        title: '',
        role: '',
        description: '',
        questions: 7,
        interviewType: 'Technical',
        candidateType: 'Mid-level',
        icon: '💼'
      })
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Templates</h1>
              <p className="text-gray-600">Create and manage reusable interview templates</p>
            </motion.div>

            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="bg-white border border-gray-200 rounded-md px-3 py-2 pl-10 w-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 "
                />
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium  hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Template
              </button>
            </div>

            {templates.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Available</h3>
                <p className="text-gray-600 mb-4">Start the backend server to load interview templates</p>
                <button
                  onClick={fetchTemplates}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 "
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, i) => (
                  <motion.div
                    key={template.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md  "
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.title}</h3>
                        <p className="text-sm text-gray-600">{template.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {template.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{template.questions} questions</span>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium  hover:bg-gray-50 text-sm"
                      >
                        Use Template
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Use Template Modal */}
      {showUseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Interview</h2>
              <button
                onClick={() => setShowUseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{selectedTemplate?.title}</h3>
              <p className="text-sm text-gray-600">{selectedTemplate?.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Candidate Name</label>
                <input
                  type="text"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-md px-3 py-2 w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 "
                  placeholder="Enter candidate name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Candidate Email</label>
                <input
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-md px-3 py-2 w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 "
                  placeholder="candidate@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Duration (minutes)</label>
                <select
                  value={candidateInfo.duration}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="bg-white border border-gray-200 rounded-md px-3 py-2 w-full text-gray-900 focus:outline-none focus:border-blue-500 "
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUseModal(false)}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium  hover:bg-gray-50 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={createInterviewFromTemplate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium  hover:bg-blue-700 flex-1"
              >
                Create Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Template</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Title</label>
                  <input
                    type="text"
                    value={newTemplateData.title}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Category</label>
                  <input
                    type="text"
                    value={newTemplateData.role}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="e.g., Technology, Marketing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTemplateData.description}
                  onChange={(e) => setNewTemplateData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Describe the role and key skills to evaluate..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Questions Count</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={newTemplateData.questions}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, questions: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                  <select
                    value={newTemplateData.interviewType}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, interviewType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Level</label>
                  <select
                    value={newTemplateData.candidateType}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, candidateType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={newTemplateData.icon}
                  onChange={(e) => setNewTemplateData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter an emoji (e.g., 💻, 🎨, 📊)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveNewTemplate}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}