'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, Briefcase, Clock, User, Mail, Sparkles, 
  ChevronDown, Loader2, Upload, CheckCircle, FileText, BrainCircuit, 
  ShieldAlert, Globe2, Layers, Award
} from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import toast from 'react-hot-toast'
import ResumeUpload from '@/components/interview/ResumeUpload'

const INTERVIEW_TYPES = [
  'Technical',
  'Behavioral',
  'Problem Solving',
  'Leadership',
  'Experience-based'
]

const CANDIDATE_TYPES = [
  'Fresher',
  'Experienced',
  'Managerial'
]

const CONTINENTS = [
  { id: 'North America', name: 'North America', icon: '🌎', hub: 'Silicon Valley / NY / Toronto' },
  { id: 'Europe', name: 'Europe', icon: '🌍', hub: 'London / Berlin / Paris' },
  { id: 'Asia', name: 'Asia', icon: '🌏', hub: 'Tokyo / Singapore / Bengaluru' },
  { id: 'South America', name: 'South America', icon: '🌎', hub: 'São Paulo / Buenos Aires' },
  { id: 'Africa', name: 'Africa', icon: '🌍', hub: 'Lagos / Nairobi / Cape Town' },
  { id: 'Australia / Oceania', name: 'Australia / Oceania', icon: '🌏', hub: 'Sydney / Melbourne / Auckland' },
  { id: 'Antarctica', name: 'Antarctica', icon: '❄️', hub: 'Research & Polar Stations' },
]

const DURATIONS = [1, 2, 10, 20, 30, 45]
const DURATION_LABELS: Record<number, string> = {
  1: '1m',
  2: '2m',
  10: '10m',
  20: '20m',
  30: '30m',
  45: '45m'
}

export default function CreateInterview() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(1)
  const [createdInterviewId, setCreatedInterviewId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    interviewType: 'Technical',
    candidateType: 'Experienced',
    continent: 'North America',
    duration: 10,
    candidateName: '',
    candidateEmail: '',
    resumeText: '',
    enableProbing: true,
    enableStrictProctoring: true,
  })

  const [extractedData, setExtractedData] = useState<{
    keySkills: string[]
    experienceYears?: number
    summary?: string
  } | null>(null)

  const [isParsingResume, setIsParsingResume] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const interviewId = crypto.randomUUID()

      const interviewData = {
        id: interviewId,
        recruiter_email: session?.user?.email,
        job_title: formData.jobTitle,
        job_description: formData.resumeText
          ? `${formData.jobDescription}\n\n[RESUME_START]\n${formData.resumeText}`
          : formData.jobDescription,
        interview_type: formData.interviewType,
        candidate_type: formData.candidateType,
        duration: formData.duration,
        candidate_name: formData.candidateName,
        candidate_email: formData.candidateEmail,
        interview_link: `${window.location.origin}/interview/${interviewId}`,
        status: 'scheduled',
        enable_probing: formData.enableProbing,
        enable_strict_proctoring: formData.enableStrictProctoring,
      }

      const response = await fetch('/api/create-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create interview')
      }

      toast.success('Interview created successfully!')
      setCreatedInterviewId(interviewId)
      setStep(3)
      setIsSubmitting(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error creating interview:', message)
      toast.error(`Failed to create interview: ${message}`)
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.jobTitle.trim() || !formData.jobDescription.trim() || !formData.interviewType || !formData.candidateType) {
        toast.error('Please fill in Job Title and Description or upload a resume')
        return
      }
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  const generateJobDescription = async () => {
    if (!formData.jobTitle.trim()) {
      toast.error('Please enter a job title first')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: formData.jobTitle.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate description')
      }

      setFormData(prev => ({ ...prev, jobDescription: data.description }))
      toast.success('Job description generated!')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to generate description'
      console.error('Error generating description:', message)
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF file')
      return
    }

    setIsParsingResume(true)
    const toastId = toast.loading('AI analyzing resume & auto-generating job details...')
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: uploadFormData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume')
      }

      // Auto-populate all details extracted from the resume
      setFormData(prev => ({
        ...prev,
        resumeText: data.text || prev.resumeText,
        jobTitle: data.suggestedJobTitle || prev.jobTitle,
        jobDescription: data.suggestedJobDescription || prev.jobDescription,
        candidateName: data.candidateName && data.candidateName !== 'Candidate' ? data.candidateName : prev.candidateName,
        candidateEmail: data.candidateEmail || prev.candidateEmail,
        candidateType: data.candidateType || prev.candidateType,
        interviewType: data.interviewType || prev.interviewType,
        continent: data.continent || prev.continent,
      }))

      setExtractedData({
        keySkills: data.keySkills || [],
        experienceYears: data.experienceYears,
        summary: data.summary
      })

      toast.success('✨ Resume parsed! Job details & candidate info auto-filled.', { id: toastId })
    } catch (error) {
      console.error('Error parsing resume:', error)
      toast.error('Failed to parse resume', { id: toastId })
    } finally {
      setIsParsingResume(false)
    }
  }

  if (status === 'loading') {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </ResponsiveLayout>
    )
  }

  if (status === 'unauthenticated') {
    router.replace('/login')
    return null
  }

  return (
    <ResponsiveLayout>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => startTransition(() => router.push('/dashboard'))}
            disabled={isPending || isSubmitting}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-3">
                Create AI Interview
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">
                  Global 7 Continents
                </span>
              </h1>
              <p className="text-slate-500">Upload candidate resume or configure job details to start AI-powered voice hiring</p>
            </div>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs">1</span>
              Job & Resume Setup
            </div>
            <div className={`w-10 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs">2</span>
              Candidate & Region
            </div>
            <div className={`w-10 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              step >= 3 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs">3</span>
              Finalize & Link
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/80 p-8"
        >
          {step === 1 && (
            <div className="space-y-8">
              {/* Resume Upload Box */}
              <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 border-2 border-dashed border-indigo-300 rounded-2xl p-6 transition-all hover:border-indigo-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Instant Auto-Fill with Resume</h3>
                      <p className="text-xs text-slate-500">Upload a PDF resume to auto-detect skills, job role, candidate info, and region</p>
                    </div>
                  </div>
                  {formData.resumeText && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Resume Active
                    </span>
                  )}
                </div>

                {formData.resumeText ? (
                  <div className="bg-white rounded-xl p-4 border border-emerald-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Resume parsed and synced with job form</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, resumeText: '' }))
                          setExtractedData(null)
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
                      >
                        Upload Different Resume
                      </button>
                    </div>

                    {extractedData && (
                      <div className="pt-2 border-t border-slate-100 grid md:grid-cols-2 gap-3 text-xs">
                        {extractedData.summary && (
                          <div className="md:col-span-2 text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            &ldquo;{extractedData.summary}&rdquo;
                          </div>
                        )}
                        {extractedData.keySkills.length > 0 && (
                          <div className="md:col-span-2">
                            <span className="font-semibold text-slate-700 mr-2">Extracted Skills:</span>
                            <div className="inline-flex flex-wrap gap-1.5 mt-1">
                              {extractedData.keySkills.map(skill => (
                                <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium border border-blue-100">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload-input"
                      disabled={isParsingResume}
                    />
                    <label
                      htmlFor="resume-upload-input"
                      className={`cursor-pointer flex flex-col items-center justify-center p-6 bg-white/80 rounded-xl border border-indigo-200 hover:bg-white hover:border-indigo-400 transition-all ${
                        isParsingResume ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      {isParsingResume ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          <span className="text-sm font-semibold text-blue-700">Analyzing Resume & Generating Job Details...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            Click to upload PDF resume or drag & drop
                          </span>
                          <span className="text-xs text-slate-400">
                            Groq AI will extract the candidate experience and auto-generate the complete job profile
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* Job Title & Generation */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="e.g. Senior Full-Stack Engineer / AI Engineer"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase font-bold text-slate-600 tracking-wide">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateJobDescription}
                      disabled={isGenerating || !formData.jobTitle.trim()}
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Re-generate with AI'}
                    </button>
                  </div>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all resize-none text-sm leading-relaxed"
                    placeholder="Describe key responsibilities, required skills, and expectations..."
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide">Interview Type</label>
                  <div className="relative">
                    <select
                      value={formData.interviewType}
                      onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none font-medium text-sm"
                    >
                      {INTERVIEW_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide">Candidate Level</label>
                  <div className="relative">
                    <select
                      value={formData.candidateType}
                      onChange={(e) => setFormData({ ...formData, candidateType: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none font-medium text-sm"
                    >
                      {CANDIDATE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* 7 Continents Region Selector */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    Target Region / Continent (7 Continents Supported)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {CONTINENTS.map(c => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setFormData({ ...formData, continent: c.id })}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          formData.continent === c.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm ring-2 ring-blue-100'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                        }`}
                      >
                        <span className="text-xl">{c.icon}</span>
                        <span className="text-xs leading-tight">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Interview Duration
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {DURATIONS.map(duration => (
                      <button
                        type="button"
                        key={duration}
                        onClick={() => setFormData({ ...formData, duration })}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          formData.duration === duration
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {DURATION_LABELS[duration]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">AI Interview Controls</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, enableProbing: !prev.enableProbing }))}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex gap-3 ${
                        formData.enableProbing ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        formData.enableProbing ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className={`font-semibold text-sm ${formData.enableProbing ? 'text-blue-900' : 'text-slate-700'}`}>Dynamic AI Probing</h4>
                          <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${formData.enableProbing ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${formData.enableProbing ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <p className={`text-xs ${formData.enableProbing ? 'text-blue-700/80' : 'text-slate-500'}`}>
                          Deep-dives into candidate resume claims and technical answers.
                        </p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, enableStrictProctoring: !prev.enableStrictProctoring }))}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex gap-3 ${
                        formData.enableStrictProctoring ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        formData.enableStrictProctoring ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className={`font-semibold text-sm ${formData.enableStrictProctoring ? 'text-blue-900' : 'text-slate-700'}`}>Anti-Cheating Proctor</h4>
                          <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${formData.enableStrictProctoring ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${formData.enableStrictProctoring ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <p className={`text-xs ${formData.enableStrictProctoring ? 'text-blue-700/80' : 'text-slate-500'}`}>
                          Real-time tab switch tracking and AI speech script detection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  Next: Candidate Info
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Candidate Information & Region</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide">
                    Candidate Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="e.g. Sarah Connor"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-600 mb-2 tracking-wide flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Candidate Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.candidateEmail}
                    onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="candidate@example.com"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Interview & Region Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><span className="text-slate-500 font-medium">Role:</span> <span className="font-semibold text-slate-900">{formData.jobTitle || 'Not set'}</span></p>
                    <p><span className="text-slate-500 font-medium">Interview Type:</span> <span className="font-semibold text-slate-900">{formData.interviewType}</span></p>
                    <p><span className="text-slate-500 font-medium">Candidate Level:</span> <span className="font-semibold text-slate-900">{formData.candidateType}</span></p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="text-slate-500 font-medium">Continent / Region:</span> <span className="font-semibold text-blue-700">{formData.continent}</span></p>
                    <p><span className="text-slate-500 font-medium">Duration:</span> <span className="font-semibold text-slate-900">{formData.duration} minutes</span></p>
                    <p><span className="text-slate-500 font-medium">Candidate:</span> <span className="font-semibold text-slate-900">{formData.candidateName || 'Pending'} ({formData.candidateEmail || 'No email'})</span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.candidateName || !formData.candidateEmail || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    <>
                      Create AI Interview
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && createdInterviewId && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Interview Created Successfully!</h2>
                  <p className="text-xs text-slate-500">Interview ID: {createdInterviewId}</p>
                </div>
              </div>

              <div className="space-y-6 max-w-xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                  <p className="font-bold mb-1">Interview Link Ready:</p>
                  <div className="bg-white p-3 rounded-lg border border-blue-200 font-mono text-xs break-all select-all text-blue-800">
                    {`${window.location.origin}/interview/${createdInterviewId}`}
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Optional: Upload or Update PDF Resume Archive</p>
                  <ResumeUpload
                    interviewId={createdInterviewId}
                    onUploadComplete={() => {
                      toast.success('Resume linked to interview successfully!')
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => startTransition(() => {
                    router.push('/dashboard')
                    router.refresh()
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                >
                  Finish & Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ResponsiveLayout>
  )
}