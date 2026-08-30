'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface ProgressBarProps {
  current: number
  total: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeElapsed: number
}

export default function ProgressBar({
  current,
  total,
  difficulty,
  timeElapsed
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / (total || 1)) * 100))

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const difficultyColors = {
    easy: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      label: 'Easy'
    },
    medium: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500',
      label: 'Medium'
    },
    hard: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
      dot: 'bg-rose-500',
      label: 'Hard'
    }
  }

  const diffConfig = difficultyColors[difficulty] || difficultyColors.medium

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Progress Text */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Current Stage
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              Question {current}
            </span>
            <span className="text-xs font-medium text-slate-400">
              of {total}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3">
          {/* Difficulty Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${diffConfig.bg}`}>
            <span className={`w-2 h-2 rounded-full ${diffConfig.dot} animate-pulse`} />
            {diffConfig.label}
          </div>

          {/* Time Elapsed Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
