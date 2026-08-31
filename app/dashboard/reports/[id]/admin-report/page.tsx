'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface EvidenceFeedback {
  skill: string
  score: number
  did_well?: string[]
  did_poorly?: string[]
  evidence_quote?: string
}

interface ScriptedDetection {
  Scripted_Risk_Level: string
  Suspicion_Flags?: string[]
  Short_Explanation?: string
}

export default function AdminReportPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [params.id])

  const fetchReport = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('interview_id', params.id)
        .single()

      if (sessionError) throw sessionError

      // Check if admin report exists in evaluation
      if (sessionData?.evaluation?.evidence_feedback) {
        setReport(sessionData.evaluation)
      } else {
        // Generate admin report from existing data
        const { data: interviewData } = await supabase
          .from('interviews')
          .select('*')
          .eq('id', params.id)
          .single()

        if (sessionData && interviewData) {
          const adminReport = {
            candidateName: interviewData.candidate_name,
            interviewRole: interviewData.job_title,
            interviewType: interviewData.interview_type,
            summary: sessionData.evaluation?.summary || `${interviewData.candidate_name} completed the ${interviewData.interview_type} interview for ${interviewData.job_title}.`,
            scores: sessionData.scores || {
              technical_knowledge: 0,
              problem_solving: 0,
              communication: 0,
              confidence: 0,
              experience_relevance: 0,
              overall: 0
            },
            evidence_feedback: [
              {
                skill: 'Technical Knowledge',
                score: sessionData.scores?.technical_skill || 0,
                did_well: ['Completed interview questions'],
                did_poorly: ['Limited evaluation data available'],
                evidence_quote: 'Evaluation in progress'
              },
              {
                skill: 'Problem Solving',
                score: sessionData.scores?.problem_solving || 0,
                did_well: ['Attempted problem-solving questions'],
                did_poorly: [],
                evidence_quote: 'See detailed transcript'
              },
              {
                skill: 'Communication',
                score: sessionData.scores?.communication_skill || 0,
                did_well: ['Communicated responses clearly'],
                did_poorly: [],
                evidence_quote: 'Voice interview completed'
              },
              {
                skill: 'Confidence',
                score: sessionData.scores?.confidence || 0,
                did_well: ['Participated in full interview'],
                did_poorly: [],
                evidence_quote: 'Interview session completed'
              },
              {
                skill: 'Experience Relevance',
                score: sessionData.scores?.overall || 0,
                did_well: ['Relevant background for role'],
                did_poorly: [],
                evidence_quote: 'Based on overall performance'
              }
            ],
            final_recommendation: {
              tag: sessionData.recommendation?.includes('Recommended') ? 'Hire' : 
                   sessionData.recommendation?.includes('improvement') ? 'Consider' : 'Reject',
              reason: sessionData.recommendation || 'Review complete interview transcript for detailed assessment.'
            }
          }
          setReport(adminReport)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (tag: string) => {
    if (tag === 'Hire') return 'bg-green-100 text-green-800 border-green-300'
    if (tag === 'Consider') return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ResponsiveLayout>
    )
  }

  if (!report) {
    return (
      <ResponsiveLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Report not found</p>
        </div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{report.candidateName}</h1>
            <p className="text-blue-100 text-lg">{report.interviewRole} • {report.interviewType}</p>
          </div>

          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </div>

          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skill Scores</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(report.scores || {}).map(([key, value]: [string, any]) => {
                if (key === 'overall') return null
                const score = typeof value === 'number' ? value : 0
                const percentage = (score / 10) * 100
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>
                        {score.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Overall Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(report.scores?.overall || 0)}`}>
                  {(report.scores?.overall || 0).toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Evidence-Based Feedback</h2>
            {!report.evidence_feedback || report.evidence_feedback.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p className="text-yellow-800 font-medium mb-2">⚠️ Detailed feedback not yet generated</p>
                <p className="text-yellow-700 text-sm">This report shows basic scores. For detailed evidence-based feedback with exact quotes, the interview needs to be re-evaluated with the new admin report system.</p>
              </div>
            ) : (
            <div className="space-y-6">
              {report.evidence_feedback.map((feedback: EvidenceFeedback, index: number) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{feedback.skill}</h3>
                    <span className={`text-xl font-bold ${getScoreColor(feedback.score)}`}>
                      {feedback.score}/10
                    </span>
                  </div>

                  {(feedback.did_well && feedback.did_well.length > 0) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Strengths</span>
                      </div>
                      <ul className="ml-7 space-y-1">
                        {feedback.did_well.map((item: string, i: number) => (
                          <li key={i} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(feedback.did_poorly && feedback.did_poorly.length > 0) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-900">Weaknesses</span>
                      </div>
                      <ul className="ml-7 space-y-1">
                        {feedback.did_poorly.map((item: string, i: number) => (
                          <li key={i} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.evidence_quote && (
                    <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Evidence:</p>
                      <p className="text-gray-800 italic">&quot;{feedback.evidence_quote}&quot;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Scripted Detection */}
          {report.evaluation?.scripted_detections && report.evaluation.scripted_detections.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Authenticity Analysis</h2>
              <div className="space-y-4">
                {report.evaluation.scripted_detections.map((detection: ScriptedDetection, index: number) => (
                  <div key={index} className={`border-2 rounded-xl p-6 ${
                    detection.Scripted_Risk_Level === 'High' ? 'border-red-300 bg-red-50' :
                    detection.Scripted_Risk_Level === 'Medium' ? 'border-yellow-300 bg-yellow-50' :
                    'border-green-300 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Answer {index + 1}</h3>
                      <span className={`px-4 py-2 rounded-full font-bold ${
                        detection.Scripted_Risk_Level === 'High' ? 'bg-red-200 text-red-900' :
                        detection.Scripted_Risk_Level === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                        'bg-green-200 text-green-900'
                      }`}>
                        {detection.Scripted_Risk_Level} Risk
                      </span>
                    </div>
                    
                    {detection.Suspicion_Flags && detection.Suspicion_Flags.length > 0 && (
                      <div className="mb-4">
                        <p className="font-semibold text-gray-900 mb-2">Suspicion Flags:</p>
                        <ul className="list-disc ml-6 space-y-1">
                          {detection.Suspicion_Flags.map((flag: string, i: number) => (
                            <li key={i} className="text-gray-800">{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="bg-white bg-opacity-50 rounded-lg p-4">
                      <p className="text-gray-900">{detection.Short_Explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Final Recommendation</h2>
            <div className={`border-2 rounded-xl p-6 ${getRecommendationColor(report.final_recommendation?.tag)}`}>
              <div className="flex items-center gap-3 mb-3">
                {report.final_recommendation?.tag === 'Hire' && <CheckCircle className="w-8 h-8" />}
                {report.final_recommendation?.tag === 'Consider' && <AlertCircle className="w-8 h-8" />}
                {report.final_recommendation?.tag === 'Reject' && <XCircle className="w-8 h-8" />}
                <span className="text-2xl font-bold">{report.final_recommendation?.tag}</span>
              </div>
              <p className="text-lg">{report.final_recommendation?.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
