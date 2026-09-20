import React from 'react'
import { Award, CheckCircle2, AlertCircle, Share2, Mail } from 'lucide-react'
import { Badge } from '@/components/ui'

export interface ReportViewerProps {
  report: {
    candidate_name: string
    role: string
    overall_score: number
    technical_score: number
    communication_score: number
    summary: string
    strengths?: string[]
    weaknesses?: string[]
    recommendation?: string
  }
  onEmailReport?: () => void
}

export function ReportViewer({ report, onEmailReport }: ReportViewerProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">{report.candidate_name}</h2>
            <Badge variant="success" size="sm">
              {report.recommendation || 'Hire'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">{report.role}</p>
        </div>

        <div className="flex items-center gap-3">
          {onEmailReport && (
            <button
              onClick={onEmailReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
            Overall Score
          </span>
          <span className="text-2xl font-bold text-primary-400">{report.overall_score}%</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
            Technical
          </span>
          <span className="text-2xl font-bold text-emerald-400">{report.technical_score}%</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
            Communication
          </span>
          <span className="text-2xl font-bold text-indigo-400">{report.communication_score}%</span>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 mb-6">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Executive Summary
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">{report.summary}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.strengths && (
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Key Strengths</span>
            </h5>
            <ul className="space-y-1.5">
              {report.strengths.map((str, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.weaknesses && (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Areas for Improvement</span>
            </h5>
            <ul className="space-y-1.5">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
