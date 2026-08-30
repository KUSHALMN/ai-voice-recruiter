'use client'

import { motion } from 'framer-motion'
import { Play, RotateCcw, HelpCircle, AlertCircle } from 'lucide-react'

interface ResumeModalProps {
  candidateName: string
  currentQuestionIndex: number
  totalQuestions: number
  onResume: () => void
  onRestart: () => void
}

export default function ResumeModal({
  candidateName,
  currentQuestionIndex,
  totalQuestions,
  onResume,
  onRestart
}: ResumeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-lg overflow-hidden border border-slate-100 rounded-3xl bg-white shadow-2xl"
      >
        {/* Decorative Top Accent */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-xy" />

        <div className="p-8">
          {/* Header Icon */}
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <HelpCircle className="w-8 h-8" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-950 mb-2">
            Welcome back, {candidateName}!
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            It looks like you had an active interview session. You were on question{' '}
            <span className="font-semibold text-indigo-600">
              {currentQuestionIndex + 1}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{totalQuestions}</span>.
            Would you like to resume where you left off or start a new attempt?
          </p>

          {/* Notice Card */}
          <div className="flex gap-3 bg-amber-50/70 border border-amber-100 rounded-2xl p-4 mb-8 text-xs text-amber-800">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <div>
              <span className="font-semibold">Important note:</span> Starting over will discard all answers and scores you have recorded in the current session.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Continue Button */}
            <button
              onClick={onResume}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Play className="w-5 h-5 fill-current" />
              Continue from Q{currentQuestionIndex + 1}
            </button>

            {/* Restart Button */}
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 font-semibold py-4 px-6 rounded-2xl transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Start over
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
