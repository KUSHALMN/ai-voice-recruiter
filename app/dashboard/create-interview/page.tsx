'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Briefcase, Clock, User, Mail, Sparkles, ChevronDown, Loader2, Upload, CheckCircle, FileText, BrainCircuit, ShieldAlert } from 'lucide-react'
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

const DURATIONS = [1, 2, 10, 20, 30, 45]
const DURATION_LABELS = {
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
    interviewType: '',
    candidateType: '',
    duration: 1,
    candidateName: '',
    candidateEmail: '',
    resumeText: '',
    enableProbing: true,
    enableStrictProctoring: true,
  })
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
      if (!formData.jobTitle || !formData.jobDescription || !formData.interviewType || !formData.candidateType) {
        toast.error('Please fill in all fields')
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

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setIsParsingResume(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume')
      }

      setFormData(prev => ({ ...prev, resumeText: data.text }))
      toast.success('Resume parsed successfully!')
    } catch (error) {
      console.error('Error parsing resume:', error)
      toast.error('Failed to parse resume')
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => startTransition(() => router.push('/dashboard'))}
            disabled={isPending || isSubmitting}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-6 transition-colors font-medium disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-[#111827] mb-2">Create New Interview</h1>
          <p className="text-[#6B7280]">Set up an AI-powered voice interview in minutes</p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${step >= 1 ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
              Interview Details
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'
              }`} />
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${step >= 2 ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
              Candidate Info
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'
              }`} />
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${step >= 3 ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
              Resume Upload
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-8"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-6 border-b border-[#E5E7EB]">
                <Briefcase className="w-6 h-6 text-[#2563EB]" />
                <h2 className="text-xl font-semibold text-[#111827]">Interview Details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl bg-[#F9FAFB] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_#DBEAFE] "
                    placeholder="e.g. Senior React Developer"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase font-medium text-[#6B7280] tracking-wide">Job Description</label>
                    <button
                      onClick={generateJobDescription}
                      disabled={isGenerating || !formData.jobTitle}
                      className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl bg-[#F9FAFB] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_#DBEAFE]  resize-none"
                    placeholder="Describe the role, responsibilities, and requirements..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Upload Resume (Optional)
                  </label>
                  <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center hover:border-[#2563EB] transition-colors bg-[#F9FAFB]">
                    {formData.resumeText ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Resume parsed successfully</span>
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, resumeText: '' }))}
                          className="text-xs text-red-500 hover:text-red-700 ml-2 underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                          disabled={isParsingResume}
                        />
                        <label
                          htmlFor="resume-upload"
                          className={`cursor-pointer flex flex-col items-center gap-2 ${isParsingResume ? 'opacity-50' : ''}`}
                        >
                          {isParsingResume ? (
                            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
                          ) : (
                            <Upload className="w-8 h-8 text-[#9CA3AF]" />
                          )}
                          <span className="text-sm text-[#6B7280]">
                            {isParsingResume ? 'Parsing resume...' : 'Click to upload PDF resume'}
                          </span>
                          <span className="text-xs text-[#9CA3AF]">
                            AI will generate custom questions based on this
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide">Interview Type</label>
                  <div className="relative">
                    <select
                      value={formData.interviewType}
                      onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                      className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl bg-[#F9FAFB] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_#DBEAFE]  appearance-none"
                    >
                      <option value="">Select type</option>
                      {INTERVIEW_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide">Candidate Level</label>
                  <div className="relative">
                    <select
                      value={formData.candidateType}
                      onChange={(e) => setFormData({ ...formData, candidateType: e.target.value })}
                      className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl bg-[#F9FAFB] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_#DBEAFE]  appearance-none"
                    >
                      <option value="">Select level</option>
                      {CANDIDATE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {DURATIONS.map(duration => (
                      <button
                        key={duration}
                        onClick={() => setFormData({ ...formData, duration })}
                        className={`px-6 py-3 rounded-xl font-medium  ${formData.duration === duration
                          ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                          : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                          }`}
                      >
                        {DURATION_LABELS[duration as keyof typeof DURATION_LABELS]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-[#E5E7EB] mt-2">
                  <h3 className="text-sm font-semibold text-[#111827] mb-4">Advanced AI Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Feature 1: AI Probing */}
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, enableProbing: !prev.enableProbing }))}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex gap-4 ${formData.enableProbing ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${formData.enableProbing ? 'bg-[#2563EB] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold ${formData.enableProbing ? 'text-[#1E40AF]' : 'text-[#374151]'}`}>Dynamic AI Probing</h4>
                          <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${formData.enableProbing ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.enableProbing ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <p className={`text-xs ${formData.enableProbing ? 'text-[#1E40AF]/80' : 'text-[#6B7280]'}`}>AI generates custom follow-up questions if the candidate gives shallow answers.</p>
                      </div>
                    </div>

                    {/* Feature 2: Anti-Cheating */}
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, enableStrictProctoring: !prev.enableStrictProctoring }))}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex gap-4 ${formData.enableStrictProctoring ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${formData.enableStrictProctoring ? 'bg-[#2563EB] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold ${formData.enableStrictProctoring ? 'text-[#1E40AF]' : 'text-[#374151]'}`}>Anti-Cheating Monitor</h4>
                          <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${formData.enableStrictProctoring ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.enableStrictProctoring ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <p className={`text-xs ${formData.enableStrictProctoring ? 'text-[#1E40AF]/80' : 'text-[#6B7280]'}`}>Tracks tab switches and analyzes speech for scripted/robotic AI answers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-7 py-3 rounded-xl font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-6 border-b border-[#E5E7EB]">
                <User className="w-6 h-6 text-[#2563EB]" />
                <h2 className="text-xl font-semibold text-[#111827]">Candidate Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide">Candidate Name</label>
                  <input
                    type="text"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl bg-[#F9FAFB] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_#DBEAFE] "
                    placeholder="Enter candidate's full name"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-[#6B7280] mb-3 tracking-wide flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.candidateEmail}
                    onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl bg-[#F9FAFB] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:shadow-[0_0_0_3px_#DBEAFE] "
                    placeholder="candidate@example.com"
                  />
                </div>
              </div>



              {/* Interview Summary */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#111827] mb-4">Interview Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><span className="text-[#6B7280] font-medium">Position:</span> <span className="text-[#111827]">{formData.jobTitle}</span></p>
                    <p><span className="text-[#6B7280] font-medium">Type:</span> <span className="text-[#111827]">{formData.interviewType}</span></p>
                    <p><span className="text-[#6B7280] font-medium">Level:</span> <span className="text-[#111827]">{formData.candidateType}</span></p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="text-[#6B7280] font-medium">Duration:</span> <span className="text-[#111827]">{formData.duration} minutes</span></p>
                    <p><span className="text-[#6B7280] font-medium">Candidate:</span> <span className="text-[#111827]">{formData.candidateName}</span></p>
                    <p><span className="text-[#6B7280] font-medium">Email:</span> <span className="text-[#111827]">{formData.candidateEmail}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#F3F4F6] text-[#374151] rounded-xl font-medium hover:bg-[#E5E7EB] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.candidateName || !formData.candidateEmail || isSubmitting}
                  className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-7 py-3 rounded-xl font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isSubmitting ? 'Creating...' : 'Create Interview'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && createdInterviewId && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-6 border-b border-[#E5E7EB]">
                <Upload className="w-6 h-6 text-[#2563EB]" />
                <h2 className="text-xl font-semibold text-[#111827]">Upload Candidate's Resume</h2>
              </div>

              <div className="space-y-6 max-w-xl mx-auto">
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 text-sm text-[#1E40AF]">
                  <p className="font-semibold mb-1">Optional but highly recommended:</p>
                  <p>Uploading the candidate's resume allows Groq to parse their experiences and tailor interview questions specifically to their background.</p>
                </div>
                
                <ResumeUpload
                  interviewId={createdInterviewId}
                  onUploadComplete={(url) => {
                    toast.success('Resume linked to interview successfully!')
                  }}
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => startTransition(() => {
                    router.push('/dashboard')
                    router.refresh()
                  })}
                  className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-7 py-3 rounded-xl font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
                >
                  Finish & Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div >
    </ResponsiveLayout >
  )
}