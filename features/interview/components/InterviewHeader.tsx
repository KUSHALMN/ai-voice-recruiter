import React from 'react'
import { Wifi, ShieldAlert, Maximize2, Minimize2, Globe, Clock } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

export interface InterviewHeaderProps {
  role: string
  candidateName: string
  timeLeft: number
  selectedLanguage: string
  onLanguageChange: (lang: string) => void
  violationCount: number
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onEndInterview: () => void
}

export function InterviewHeader({
  role,
  candidateName,
  timeLeft,
  selectedLanguage,
  onLanguageChange,
  violationCount,
  isFullscreen,
  onToggleFullscreen,
  onEndInterview
}: InterviewHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-primary-500/20">
          AI
        </div>
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">{role}</h2>
          <p className="text-xs text-slate-400">Candidate: {candidateName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
          <Globe className="w-3.5 h-3.5 text-primary-400" />
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            aria-label="Interview language"
            className="bg-transparent border-none text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.name} className="bg-slate-900 text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Timer */}
        {timeLeft > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-mono font-medium text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}

        {/* Proctoring violations */}
        {violationCount > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{violationCount} Alerts</span>
          </div>
        )}

        {/* Fullscreen button */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* End interview button */}
        <button
          onClick={onEndInterview}
          className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all"
        >
          End Interview
        </button>
      </div>
    </header>
  )
}
