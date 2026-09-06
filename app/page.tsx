'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Check, Globe, Sparkles, Zap, Shield, 
  BarChart3, Users, Clock, Bot, Cpu, CheckCircle2, 
  ChevronRight, Star, Play, Award, FileText, CheckCircle,
  Activity, ShieldCheck, Mic, Code2, Terminal, Sliders,
  Layers, Volume2, Sparkle, ArrowUpRight, Share2, Compass, PlayCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const LOGOS = [
  'Vercel', 'Supabase', 'Stripe', 'Linear', 'Retool', 'Ramp', 'Figma'
]

const FEATURES_LIST = [
  {
    icon: Mic,
    tag: 'Autonomous Voice Engine',
    title: 'Adaptive interviews that sound truly human.',
    description: 'Ultra-low latency (<20ms) speech pipeline that listens, probes deep on shallow answers, and evaluates technical depth without awkward lag.',
    badge: '18ms Latency',
    gradient: 'from-blue-500/10 via-indigo-500/10 to-transparent'
  },
  {
    icon: Code2,
    tag: 'Live Coding & Sandboxing',
    title: 'Real-time coding environments built-in.',
    description: 'Candidates write and execute live code during the interview. AIRA observes algorithms, edge-case handling, and architectural choices.',
    badge: 'Monaco Engine',
    gradient: 'from-violet-500/10 via-purple-500/10 to-transparent'
  },
  {
    icon: ShieldCheck,
    tag: 'Proctor & Integrity AI',
    title: 'Enterprise-grade anti-cheat & anti-script.',
    description: 'Detects background tab switches, window blur events, and AI-script reading patterns with high-precision entropy analysis.',
    badge: '100% Verified',
    gradient: 'from-emerald-500/10 via-teal-500/10 to-transparent'
  },
  {
    icon: BarChart3,
    tag: 'Instant Scorecards',
    title: 'Data-driven rankings delivered instantly.',
    description: 'Comprehensive evaluations scoring technical skill, communication, and problem-solving with full audio replays and rubrics.',
    badge: 'Zero Bias',
    gradient: 'from-amber-500/10 via-orange-500/10 to-transparent'
  }
]

const CONTINENTS = [
  { name: 'North America', hub: 'SF, NYC, Toronto', latency: '18ms', active: '120k+' },
  { name: 'Europe', hub: 'London, Berlin, Paris', latency: '22ms', active: '95k+' },
  { name: 'Asia-Pacific', hub: 'Bengaluru, Tokyo, SG', latency: '24ms', active: '185k+' },
  { name: 'South America', hub: 'São Paulo, Buenos Aires', latency: '35ms', active: '45k+' },
  { name: 'Africa', hub: 'Lagos, Nairobi, Cairo', latency: '38ms', active: '38k+' },
  { name: 'Oceania', hub: 'Sydney, Auckland', latency: '29ms', active: '28k+' },
  { name: 'Antarctica Edge', hub: 'Polar Scientific Nodes', latency: '45ms', active: '1.2k' }
]

export default function HomePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'interview' | 'code' | 'scorecard'>('interview')

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] selection:bg-indigo-500 selection:text-white relative overflow-x-hidden font-sans antialiased">
      
      {/* Apple-style Subtle Background Grid Pattern with Radial Falloff */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 opacity-60"
        style={{
          backgroundImage: `radial-gradient(#D2D2D7 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 10%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 10%, #000 60%, transparent 100%)'
        }}
      />

      {/* Floating Apple-style Frosted Pill Header */}
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-5xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full px-5 py-2.5 flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <div 
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-semibold text-sm shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-[#1D1D1F]">
              Vowels<span className="text-indigo-600">.ai</span>
            </span>
          </div>

          {/* Minimal Centered Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#86868B]">
            <a href="#features" className="hover:text-[#1D1D1F] transition-colors">Platform</a>
            <a href="#preview" className="hover:text-[#1D1D1F] transition-colors">Product Studio</a>
            <a href="#continents" className="hover:text-[#1D1D1F] transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 7 Continents
            </a>
            <a href="#testimonials" className="hover:text-[#1D1D1F] transition-colors">Enterprise</a>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="text-[13px] font-medium text-[#1D1D1F] hover:text-black px-3.5 py-1.5 rounded-full hover:bg-black/5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => startTransition(() => router.push('/dashboard'))}
              disabled={isPending}
              className="bg-[#1D1D1F] hover:bg-black text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 active:scale-98"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </nav>
      </header>

      {/* HERO SECTION — MINIMAL, CENTERED, MONUMENTAL (APPLE AESTHETIC) */}
      <main className="pt-32 sm:pt-40 pb-20 px-6 max-w-6xl mx-auto">
        
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
            </span>
            <span>AIRA 2.0 Autonomous Hiring Engine</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-bold flex items-center gap-0.5">Explore <ChevronRight className="w-3.5 h-3.5" /></span>
          </div>
        </motion.div>

        {/* Hero Headlines */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto space-y-5"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-[-0.035em] text-[#1D1D1F] leading-[1.08]">
            Autonomous Voice Interviews.
            <span className="block text-[#86868B] font-semibold text-3xl sm:text-5xl lg:text-[58px] mt-2 tracking-[-0.03em]">
              For high-velocity hiring teams.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#6E6E73] font-normal leading-relaxed max-w-2xl mx-auto">
            Screen 100+ engineering candidates in hours, not weeks. Real-time conversational voice interviews, live coding, and instant AI scorecards.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
              disabled={isPending}
              className="w-full sm:w-auto bg-[#1D1D1F] hover:bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {isPending ? 'Launching...' : 'Start Hiring Free'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('preview')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto bg-white/80 hover:bg-white text-[#1D1D1F] text-sm font-semibold px-6 py-3.5 rounded-full border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              Watch Live Session Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-[#86868B]">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 60-second setup</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 7 Continents edge network</span>
          </div>
        </motion.div>

        {/* LOGO STRIP (APPLE / SAAS STYLE) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-16 pb-12 text-center"
        >
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#86868B]">
            ENGINEERED FOR MODERN TECH HUBS WORLDWIDE
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-6 opacity-60 grayscale hover:grayscale-0 transition-all">
            {LOGOS.map((name) => (
              <span key={name} className="text-base sm:text-lg font-bold tracking-tight text-slate-700 hover:text-black transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* MONUMENTAL FROSTED GLASS STUDIO CANVAS (PRODUCT SHOWCASE) */}
        <motion.div 
          id="preview"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-4"
        >
          {/* Ambient Glass Glow Layer */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-violet-500/15 rounded-[40px] blur-2xl -z-10 opacity-70" />

          {/* Master Glass Studio Window */}
          <div className="rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/90 shadow-[0_20px_70px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
            
            {/* Studio Header Bar */}
            <div className="px-6 py-4 border-b border-slate-200/60 bg-white/60 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 inline-block" />
                </div>
                <span className="text-xs font-mono text-slate-400 pl-2">aira-studio / session_#c4ccf6b7.live</span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-medium text-slate-600">
                <button 
                  onClick={() => setActiveTab('interview')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'interview' ? 'bg-white text-black font-semibold shadow-xs' : 'hover:text-black'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-indigo-600" />
                  Live Voice
                </button>
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'code' ? 'bg-white text-black font-semibold shadow-xs' : 'hover:text-black'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  Code Sandbox
                </button>
                <button 
                  onClick={() => setActiveTab('scorecard')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'scorecard' ? 'bg-white text-black font-semibold shadow-xs' : 'hover:text-black'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  Scorecard
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE SESSION • 18MS
              </div>
            </div>

            {/* Studio Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'interview' && (
                  <motion.div 
                    key="interview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid lg:grid-cols-12 gap-6"
                  >
                    {/* Left: Candidate Info & Waveform */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Candidate Card */}
                      <div className="bg-slate-50/80 border border-slate-200/70 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-bold flex items-center justify-center shadow-xs">
                            KM
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Kushal M N</h3>
                            <p className="text-xs text-slate-500">Senior Full-Stack & GenAI Engineer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Strong Hire • 9.4/10
                          </span>
                        </div>
                      </div>

                      {/* Live Audio Visualizer */}
                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-4 shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-indigo-600" />
                            AIRA Autonomous Speech Channel
                          </span>
                          <span className="font-mono text-slate-400">Format: Opus 48kHz</span>
                        </div>

                        {/* Animated Sound Wave Bars */}
                        <div className="flex items-end justify-between h-10 gap-1 px-2 bg-slate-50 rounded-xl p-2 border border-slate-100">
                          {[30, 65, 45, 90, 100, 75, 85, 50, 95, 70, 40, 85, 60, 80, 95, 45, 60, 90, 70, 85, 55, 75, 40].map((h, i) => (
                            <motion.div 
                              key={i} 
                              animate={{ height: [`${Math.max(20, h - 30)}%`, `${h}%`, `${Math.max(25, h - 20)}%`] }}
                              transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.04, ease: 'easeInOut' }}
                              className="w-full bg-indigo-600 rounded-full" 
                            />
                          ))}
                        </div>

                        {/* AI Question & Candidate Answer Stream */}
                        <div className="space-y-2 pt-1 text-xs">
                          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/70 text-slate-800">
                            <span className="font-bold text-indigo-700 block mb-0.5">AIRA:</span>
                            &quot;Walk me through your strategy for handling distributed state and cache invalidation under peak throughput.&quot;
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-700">
                            <span className="font-bold text-slate-900 block mb-0.5">Candidate (Live Transcription):</span>
                            &quot;I implemented a CDC (Change Data Capture) pipeline using Debezium and Redis Streams to publish events with sub-millisecond propagation...&quot;
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Real-time Evaluation Metrics */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="bg-slate-50/80 border border-slate-200/70 p-5 rounded-2xl space-y-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Live Rubric Assessment
                        </span>

                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>System Architecture</span>
                              <span className="font-bold text-indigo-600">9.6 / 10</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full w-[96%]" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>Concurrency & Performance</span>
                              <span className="font-bold text-indigo-600">9.2 / 10</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full w-[92%]" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-semibold text-slate-800">
                              <span>Communication Clarity</span>
                              <span className="font-bold text-indigo-600">9.5 / 10</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full w-[95%]" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block font-medium">INTEGRITY</span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block font-medium">TIME REMAINING</span>
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3.5 h-3.5 text-indigo-600" /> 11m 45s
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recruiter Action Strip */}
                      <button 
                        onClick={() => startTransition(() => router.push('/dashboard'))}
                        className="w-full bg-slate-900 hover:bg-black text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        Inspect Full Candidate Session <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'code' && (
                  <motion.div 
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                        <span>solution.ts — TypeScript 5.2</span>
                        <span className="text-emerald-400">● 14/14 Test Cases Passed</span>
                      </div>
                      <pre className="leading-relaxed text-slate-300">
{`export class CacheInvalidator<T> {
  private readonly store = new Map<string, { value: T; expiresAt: number }>()

  async invalidateStaleKeys(keys: string[]): Promise<number> {
    const now = Date.now()
    let evicted = 0
    for (const key of keys) {
      if (this.store.has(key)) {
        this.store.delete(key)
        evicted++
      }
    }
    return evicted
  }
}`}
                      </pre>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'scorecard' && (
                  <motion.div 
                    key="scorecard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid sm:grid-cols-3 gap-4"
                  >
                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Recommendation</span>
                      <h4 className="text-xl font-black text-emerald-600 mt-1">Strong Hire</h4>
                      <p className="text-xs text-slate-500 mt-2">Ranked top 3% among 1,200 Senior Full-Stack candidates tested this quarter.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Script & Proctor Risk</span>
                      <h4 className="text-xl font-black text-slate-900 mt-1">Low (0.01)</h4>
                      <p className="text-xs text-slate-500 mt-2">Zero window defocus events, conversational cadence matched organic speech models.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Time Saved</span>
                      <h4 className="text-xl font-black text-indigo-600 mt-1">45 Minutes</h4>
                      <p className="text-xs text-slate-500 mt-2">Eliminated preliminary phone screen and technical code review phone call.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>

      {/* MINIMAL BENTO GRID FEATURES (APPLE GLASS DESIGN) */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Engineered For Precision
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
            Every capability your hiring pipeline demands.
          </h2>
          <p className="text-base text-[#6E6E73]">
            Replace fragmented phone calls, take-homes, and manual notes with one unified autonomous recruiter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES_LIST.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div 
                key={idx}
                className="group relative bg-white/70 backdrop-blur-xl border border-white/90 p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {feat.badge}
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  {feat.tag}
                </span>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 7 CONTINENTS EDGE REACH — MINIMAL LIGHT STRIP */}
      <section id="continents" className="py-24 px-6 bg-white/60 backdrop-blur-md border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Global Edge Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
              Deploy across all 7 Continents natively.
            </h2>
            <p className="text-base text-[#6E6E73]">
              Ultra-low latency edge routing ensures seamless conversational voice interviews from Silicon Valley to Polar research stations.
            </p>
          </div>

          {/* Clean Continent Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CONTINENTS.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/80 border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.latency}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{item.hub}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Talent Pool</span>
                  <span className="font-bold text-slate-700">{item.active}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS & ENTERPRISE PROOF */}
      <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Customer Validation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight leading-tight">
              &quot;AIRA cut our screening time by 90% in 14 days.&quot;
            </h2>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Leading venture-backed engineering organizations use Vowels AI to conduct objective preliminary rounds before involving senior engineers.
            </p>
            <div className="flex items-center gap-2 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-xs font-semibold text-slate-600 ml-2">
                4.9 / 5 Average Rating across 1,200+ teams
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-xl border border-white/90 p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
              <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
                &quot;What previously took 3 engineering managers 25 hours per week of repetitive introductory coding phone calls is now completely automated by AIRA. The candidate quality has never been higher.&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                  W
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Wilian S.</h4>
                  <p className="text-xs text-slate-500">Founder & CEO • Zabal Tech Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL MONUMENTAL CALL TO ACTION (APPLE CLEAN MINIMAL) */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#1D1D1F] text-white p-10 sm:p-14 text-center shadow-xl space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to automate candidate screening?
            </h2>
            <p className="text-slate-400 text-base">
              Create an AI interview in 60 seconds and experience autonomous voice evaluation firsthand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
              className="w-full sm:w-auto bg-white text-black hover:bg-slate-100 px-8 py-3.5 rounded-full font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Create Free Interview <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-3.5 rounded-full font-semibold text-sm transition-all"
            >
              Sign In as Recruiter
            </button>
          </div>
        </div>
      </section>

      {/* MINIMAL APPLE-STYLE FOOTER */}
      <footer className="border-t border-slate-200/80 py-12 px-6 text-xs text-[#86868B]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#1D1D1F]">Vowels.ai</span>
            <span>© {new Date().getFullYear()} Vowels Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-[#1D1D1F] transition-colors">Platform</a>
            <a href="#continents" className="hover:text-[#1D1D1F] transition-colors">Edge Map</a>
            <a href="/login" className="hover:text-[#1D1D1F] transition-colors">Recruiter Portal</a>
            <span className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </footer>
    </div>
  )
}