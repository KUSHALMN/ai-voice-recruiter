'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Play, Shield, Users, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const TYPING_PHRASES = [
  'high-velocity hiring teams.',
  'engineering leaders.',
  'modern talent teams.',
  'fast-growing startups.',
  'global tech recruiters.'
]

export function HeroSection() {
  const router = useRouter()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(TYPING_PHRASES[0].length)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex]
    const typingSpeed = isDeleting ? 30 : 60

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setCharIndex(prev => prev + 1)
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        const pauseTimer = setTimeout(() => setIsDeleting(true), 2500)
        return () => clearTimeout(pauseTimer)
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(prev => prev - 1)
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setPhraseIndex(prev => (prev + 1) % TYPING_PHRASES.length)
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, phraseIndex])

  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs sm:text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen Autonomous Technical Recruiter</span>
        </motion.div>

        {/* Dynamic Headings */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
          AI Voice & Code Interviews engineered for{' '}
          <span className="bg-gradient-to-r from-primary-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            {TYPING_PHRASES[phraseIndex].substring(0, charIndex)}
          </span>
          <span className="inline-block w-1 h-8 sm:h-12 bg-primary-400 ml-1 animate-pulse" />
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Conduct natural voice conversations, real-time code executions, and anti-cheat proctoring. Auto-generate executive hiring dossiers in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => router.push('/dashboard/create-interview')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all duration-200 group"
          >
            <span>Create First Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-white font-medium flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Play className="w-4 h-4 fill-current text-slate-300" />
            <span>Recruiter Dashboard</span>
          </button>
        </div>

        {/* Value Proof Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-primary-400" />
            <span>Sub-20ms Voice Latency</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Anti-Cheat AI Proctoring</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>50,000+ Interviews</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>99.4% Accuracy Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
