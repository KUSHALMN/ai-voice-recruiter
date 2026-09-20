import React from 'react'
import { Sparkles, Volume2 } from 'lucide-react'

export interface QuestionCardProps {
  currentIndex: number
  totalQuestions: number
  questionText: string
  difficulty: 'easy' | 'medium' | 'hard'
  isSpeaking: boolean
}

export function QuestionCard({
  currentIndex,
  totalQuestions,
  questionText,
  difficulty,
  isSpeaking
}: QuestionCardProps) {
  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative overflow-hidden mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-primary-400" />
            <span>AI Speaking...</span>
          </div>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-medium text-white leading-relaxed">
        {questionText || 'Generating calibrated interview question...'}
      </h3>
    </div>
  )
}
