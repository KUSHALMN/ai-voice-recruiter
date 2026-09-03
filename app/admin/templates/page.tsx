'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, FileText, Search, Filter } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface AdminTemplate {
  id: string
  title: string
  role: string
  description: string
  questions: number
  interviewType?: string
  candidateType?: string
  icon?: string
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null)
  const [formData, setFormData] = useState({
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
      const { data, error } = await supabase
        .from('interview_templates')
        .select('*')
        .order('created_at', { ascending: false })

      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const saveTemplate = async () => {
    try {
      if (editingTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('interview_templates')
          .update(formData)
          .eq('id', editingTemplate.id)

        if (error) throw error

        setTemplates(templates.map(t =>
          t.id === editingTemplate.id ? { ...t, ...formData } : t
        ))
        toast.success('Template updated successfully')
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('interview_templates')
          .insert([formData])
          .select()
          .single()

        if (error) throw error

        setTemplates([data, ...templates])
        toast.success('Template created successfully')
      }

      setShowModal(false)
      setEditingTemplate(null)
      setFormData({
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

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await supabase
        .from('interview_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      setTemplates(templates.filter((t) => t.id !== templateId))
      toast.success('Template deleted successfully')
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  const editTemplate = (template: AdminTemplate) => {
    setEditingTemplate(template)
    setFormData({
      title: template.title,
      role: template.role,
      description: template.description,
      questions: template.questions,
      interviewType: template.interviewType || 'Technical',
      candidateType: template.candidateType || 'Mid-level',
      icon: template.icon || '💼'
    })
    setShowModal(true)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">AI Interview Templates</h1>
                  <p className="text-slate-600">Manage and customize interview templates</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 "
                >
                  <Plus className="w-5 h-5" />
                  Create Template
                </button>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, i) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl "
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{template.title}</h3>
                          <p className="text-sm text-slate-600">{template.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editTemplate(template)}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {template.description}
                    </p>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">{template.questions} questions</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                          {template.interviewType}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {template.candidateType}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Template Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role Category</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Technology, Marketing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe the role and key skills to evaluate..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Questions Count</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={formData.questions}
                    onChange={(e) => setFormData(prev => ({ ...prev, questions: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type</label>
                  <select
                    value={formData.interviewType}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewType: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Candidate Level</label>
                  <select
                    value={formData.candidateType}
                    onChange={(e) => setFormData(prev => ({ ...prev, candidateType: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter an emoji (e.g., 💻, 🎨, 📊)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingTemplate(null)
                  setFormData({
                    title: '',
                    role: '',
                    description: '',
                    questions: 7,
                    interviewType: 'Technical',
                    candidateType: 'Mid-level',
                    icon: '💼'
                  })
                }}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 "
              >
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}