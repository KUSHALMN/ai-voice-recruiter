'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, Check, Globe, Sparkles, Zap, Shield, 
  BarChart3, Users, Clock, Bot, Cpu, CheckCircle2, 
  ChevronRight, Star, Play, Award, FileText, CheckCircle,
  Building, Compass, ArrowUpRight, Lock, Activity, Radio,
  ShieldCheck, Mic, Laptop, HelpCircle, Layers, Eye
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const CONTINENTS_DATA = [
  {
    id: 'na',
    name: 'North America',
    icon: '🌎',
    hub: 'Silicon Valley, New York, Toronto',
    candidates: '120,000+',
    latency: '18ms',
    languages: 'English, Spanish, French',
    roles: 'AI/ML Architects, Full-Stack Leads, VP Product',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'eu',
    name: 'Europe',
    icon: '🌍',
    hub: 'London, Berlin, Paris, Amsterdam',
    candidates: '95,000+',
    latency: '22ms',
    languages: 'English, German, French, Dutch',
    roles: 'Backend Engineers, DevOps, Data Scientists',
    color: 'from-indigo-600 to-violet-600'
  },
  {
    id: 'as',
    name: 'Asia',
    icon: '🌏',
    hub: 'Bengaluru, Tokyo, Singapore, Seoul',
    candidates: '185,000+',
    latency: '24ms',
    languages: 'English, Hindi, Japanese, Mandarin',
    roles: 'Cloud Architects, Mobile Devs, Algorithm Engineers',
    color: 'from-purple-600 to-pink-500'
  },
  {
    id: 'sa',
    name: 'South America',
    icon: '🌎',
    hub: 'São Paulo, Buenos Aires, Bogotá, Santiago',
    candidates: '45,000+',
    latency: '35ms',
    languages: 'Spanish, Portuguese, English',
    roles: 'Frontend Devs, QA Automation, UI/UX Designers',
    color: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'af',
    name: 'Africa',
    icon: '🌍',
    hub: 'Lagos, Nairobi, Cape Town, Cairo',
    candidates: '38,000+',
    latency: '38ms',
    languages: 'English, French, Swahili, Arabic',
    roles: 'FinTech Engineers, Web3 Devs, Systems Analysts',
    color: 'from-amber-600 to-orange-500'
  },
  {
    id: 'oc',
    name: 'Australia & Oceania',
    icon: '🌏',
    hub: 'Sydney, Melbourne, Auckland, Brisbane',
    candidates: '28,000+',
    latency: '29ms',
    languages: 'English, Maori',
    roles: 'Data Engineers, Security Analysts, Tech Leads',
    color: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'an',
    name: 'Antarctica',
    icon: '❄️',
    hub: 'McMurdo & Amundsen-Scott Polar Stations',
    candidates: '1,200+',
    latency: '45ms (Satellite Edge)',
    languages: 'English, Multi-lingual Polar Teams',
    roles: 'Scientific Computing, Polar Tech, Remote Instrumentation',
    color: 'from-sky-500 to-blue-500'
  }
]

const TESTIMONIALS = [
  {
    quote: "Vowels AI streamlined engineering screens across our 45-person team. What previously consumed 3 full weeks of screening phone calls now gets completed in 24 hours with remarkable accuracy and zero interviewer fatigue.",
    author: "Wilian S.",
    role: "Founder & CEO",
    company: "Zabal Tech Hub",
    avatar: "W",
    highlight: "Saved $140,000 / year in engineering hours"
  },
  {
    quote: "The voice AI probes deep into algorithms and system design whenever candidate answers are vague. Our technical hiring managers trust these scorecards more than our previous manual 30-minute introductory calls.",
    author: "Candice Hall",
    role: "VP of Engineering",
    company: "Artifact Cloud",
    avatar: "C",
    highlight: "94% Candidate Completion Rate"
  },
  {
    quote: "We hire talent across 4 continents simultaneously. The automated timezone scheduling, accent comprehension, and instant code evaluation made AIRA our single most valuable recruiting tool.",
    author: "Reed Price",
    role: "Head of Global Talent",
    company: "Pulse Systems",
    avatar: "R",
    highlight: "Hired 18 Senior Leads in 60 Days"
  }
]

export default function HomePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedContinent, setSelectedContinent] = useState(CONTINENTS_DATA[0])
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Soft Ambient Mesh Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/40 to-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/35 to-pink-200/25 rounded-full blur-[110px]" />
      </div>

      {/* Top Banner / Announcement Bar (Light Theme Glass) */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-violet-50/90 border-b border-indigo-100/70 text-indigo-950 py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 backdrop-blur-sm">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm shadow-indigo-500/20">
          NEW
        </span>
        <span className="text-slate-700">AIRA 2.0 is live: Real-time anti-script reading detection & 7 Continents edge network.</span>
        <a href="#continents" className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 flex items-center gap-1 transition-colors">
          Explore Hub <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Modern Light Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-950">
                VOWELS<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">.AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none -mt-0.5">
                AI Voice Recruiter
              </span>
            </div>
          </div>
          
          {/* Centered Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <a href="#features" className="px-3.5 py-2 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-all">Features</a>
            <a href="#continents" className="px-3.5 py-2 rounded-xl hover:bg-indigo-50/80 text-indigo-600 font-bold flex items-center gap-1.5 transition-all">
              <Globe className="w-4 h-4 text-indigo-600" /> 7 Continents
            </a>
            <a href="#product-showcase" className="px-3.5 py-2 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-all">Platform</a>
            <a href="#testimonials" className="px-3.5 py-2 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-all">Customer Stories</a>
            <a href="#stats" className="px-3.5 py-2 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-all">Global Impact</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-xs tracking-wide flex items-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {isPending ? 'Connecting...' : 'Recruiter Portal'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION — VIBRANT LIGHT THEME */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Partnership Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-indigo-100 shadow-xs text-xs font-semibold text-slate-700">
              <span className="text-slate-500">In partnership with</span>
              <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Global Talent Network across 7 Continents
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-slate-950 leading-[1.12]">
              The autonomous AI recruiter for <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">high-growth teams</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Eliminate screening bottlenecks, conduct natural adaptive voice interviews across all 7 continents, and receive deep candidate scorecards in minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                disabled={isPending}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-98"
              >
                {isPending ? 'Opening...' : 'Start Hiring in Minutes'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('continents')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                Explore 7 Continents
              </button>
            </div>

            {/* Reviews Summary */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-600">
                <strong className="text-slate-900">4.9 / 5</strong> from 1,200+ recruiters & engineering leaders worldwide
              </span>
            </div>
          </motion.div>

          {/* Right Hero Product Card (Clean Light Studio Mockup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-70 -z-10" />

            <div className="relative rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_20px_50px_rgba(79,70,229,0.08),0_1px_3px_rgba(0,0,0,0.05)] p-6 sm:p-7 space-y-5">
              
              {/* Top Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">AIRA Live Session • ID #e4eef6b7</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    VOICE AI ACTIVE
                  </span>
                </div>
              </div>

              {/* Candidate Card Inside Mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      KM
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Profile</span>
                      <h3 className="text-base font-black text-slate-900">Kushal M N</h3>
                      <p className="text-xs text-slate-600">Senior Full-Stack & GenAI Engineer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      9.4<span className="text-xs text-slate-400 font-normal">/10</span>
                    </div>
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      STRONG HIRE
                    </span>
                  </div>
                </div>

                {/* Light-Theme Real-Time Audio Visualizer & Studio */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-purple-50/60 border border-indigo-100/90 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" /> Adaptive Questioning
                    </span>
                    <span className="font-mono text-xs font-semibold text-indigo-600 bg-white/80 px-2 py-0.5 rounded-md border border-indigo-100">
                      Latency: 18ms
                    </span>
                  </div>

                  {/* Animated Waveform Bars (Vibrant Indigo-Violet-Cyan) */}
                  <div className="flex items-end justify-between h-9 gap-1 px-1 bg-white/70 backdrop-blur-sm rounded-xl p-2 border border-indigo-50">
                    {[45, 70, 35, 90, 100, 60, 80, 50, 95, 65, 40, 85, 55, 75, 95, 45, 65, 85, 60, 75].map((h, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ height: [`${Math.max(15, h - 25)}%`, `${h}%`, `${Math.max(20, h - 15)}%`] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.05, ease: 'easeInOut' }}
                        className="w-full bg-gradient-to-t from-blue-600 via-indigo-600 to-violet-600 rounded-full opacity-90" 
                      />
                    ))}
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">AIRA Speaking:</span>
                    </div>
                    <p className="text-xs text-slate-800 italic leading-relaxed">
                      &quot;Explain how you architected the AST-based drift detection algorithm in your Spring Boot backend.&quot;
                    </p>
                  </div>
                </div>

                {/* Real-time Insights Row */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs text-slate-500 font-medium">Proctor & Integrity</div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Authentic
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs text-slate-500 font-medium">Target Region</div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-4 h-4 text-indigo-600" /> 7 Continents Reach
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6 BENTO CARDS GRID — LIGHT THEME GLASS TILES */}
      <section id="features" className="py-20 px-6 bg-slate-50/80 border-y border-slate-200/70 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Autonomous Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Everything high-growth hiring teams need
            </h2>
            <p className="text-slate-600 text-base">
              Autonomous, AI-driven modules engineered to replace weeks of disjointed screening workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Resume Auto-Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drop any PDF or Word resume. Groq AI parses candidate skills, years of experience, and auto-generates custom role descriptions in seconds.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Adaptive Voice Agent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ultra-low latency conversational voice agent delivers realistic, human-like voice interviews with zero awkward lag or robotic pauses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Follow-Up Probing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a candidate gives a surface-level response, AIRA automatically interrupts with targeted technical follow-up questions to test true depth.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Anti-Cheating & Script Proctor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuous window focus monitoring, background tab tracking, and speech pattern entropy analysis detect scripted reading in real time.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">7 Continents Edge Reach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distributed edge deployment delivers sub-50ms latency globally across North America, Europe, Asia, South America, Africa, Oceania, and Antarctica.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant Executive Scorecards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive standardized candidate rubrics with question-by-question scoring, audio playback transcripts, and clear hire recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BENTO SHOWCASE — CLEAN LIGHT PANELS */}
      <section id="product-showcase" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Autonomous Pipeline
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
              Deliver engineering hires on-time & on-budget
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Auto-match candidate tech stacks to calibrated question banks.</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Eliminate preliminary scheduling delays with 24/7 candidate on-demand access.</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Complete audio playback transcripts with highlighted strengths and red flags.</span>
              </div>
            </div>
            <button
              onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              Try Free Interview <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-inner space-y-4">
            <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-800">Evaluation Rubric Breakdown</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Passed (92%)
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Algorithms & Data Structures</span>
                  <span className="text-slate-900">9.5 / 10</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-[95%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">System Architecture & Scalability</span>
                  <span className="text-slate-900">9.2 / 10</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full w-[92%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Technical Communication</span>
                  <span className="text-slate-900">9.6 / 10</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-600 to-pink-500 h-full w-[96%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 CONTINENTS GLOBAL RECRUITMENT HUB (LIGHT THEME LUXURY) */}
      <section id="continents" className="py-24 px-6 bg-gradient-to-b from-white via-indigo-50/20 to-white relative overflow-hidden border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> Worldwide AI Edge Infrastructure
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
              Recruit Across All <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">7 Continents</span>
            </h2>
            <p className="text-slate-600 text-base">
              Deploy voice agents natively across every continent with automated timezone alignment, accent adaptation, and multi-lingual fluency.
            </p>
          </div>

          {/* Continents Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {CONTINENTS_DATA.map((continent) => {
              const isSelected = selectedContinent.id === continent.id
              return (
                <button
                  key={continent.id}
                  onClick={() => setSelectedContinent(continent)}
                  className={`p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 border-transparent text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="text-2xl mb-2">{continent.icon}</div>
                  <div className="text-xs font-bold truncate">{continent.name}</div>
                  <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {continent.latency}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Continent Detail Card */}
          <motion.div
            key={selectedContinent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-8 lg:p-10 shadow-xl shadow-indigo-500/5 backdrop-blur-md"
          >
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl">{selectedContinent.icon}</span>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950">{selectedContinent.name}</h3>
                    <p className="text-indigo-600 text-sm font-semibold">Major Tech Hubs: {selectedContinent.hub}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Active Pool</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{selectedContinent.candidates}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Edge Voice Latency</span>
                    <div className="text-2xl font-black text-indigo-600 mt-1 flex items-center gap-1.5">
                      <Zap className="w-5 h-5 text-indigo-600" /> {selectedContinent.latency}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Native Fluency</span>
                    <div className="text-sm font-bold text-slate-800 mt-2 truncate">{selectedContinent.languages}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Top Talent Domains</span>
                  <p className="text-sm text-slate-700 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    {selectedContinent.roles}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/60 border border-indigo-100 rounded-2xl p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <Bot className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-950">Deploy AI Recruiter for {selectedContinent.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instantly initiate interviews optimized for {selectedContinent.name} candidate timezones & technical standards.
                </p>
                <button
                  onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  Create {selectedContinent.name} Job
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER SECTION */}
      <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left CTA */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Trusted Worldwide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
              See why recruiters love AIRA. Get started in 30 seconds.
            </h2>
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              Try AIRA for Free <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-600">
                1,200+ Verified Recruiter Reviews
              </span>
            </div>
          </div>

          {/* Right Interactive Quote Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-lg shadow-indigo-500/5 relative space-y-6">
              <span className="text-5xl text-indigo-500 font-serif leading-none">&ldquo;</span>
              <p className="text-lg sm:text-xl text-slate-800 font-medium leading-relaxed -mt-4">
                {TESTIMONIALS[activeTestimonial].quote}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{TESTIMONIALS[activeTestimonial].author}</h4>
                    <p className="text-xs text-slate-500">
                      {TESTIMONIALS[activeTestimonial].role} • {TESTIMONIALS[activeTestimonial].company}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeTestimonial === idx ? 'bg-indigo-600 w-6' : 'bg-slate-200 hover:bg-slate-300 w-2'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL STATS SECTION (LIGHT THEME TILES) */}
      <section id="stats" className="py-20 px-6 bg-slate-50/80 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                7 / 7
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Continents Active</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-1">
                &lt; 35ms
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Global Voice Latency</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                94%
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Screening Time Saved</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                50,000+
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Completed Interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER — RADIANT INDIGO-BLUE */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white p-10 sm:p-14 text-center shadow-2xl shadow-indigo-500/25 relative overflow-hidden space-y-6">
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight relative z-10">
            Supercharge your technical recruiting pipeline today
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto relative z-10">
            Sign up today and conduct your first AI-evaluated candidate interview in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 relative z-10">
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => startTransition(() => router.push('/dashboard'))}
              className="w-full sm:w-auto bg-white/15 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-sm backdrop-blur-sm transition-all"
            >
              Access Recruiter Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* MODERN LIGHT MULTI-COLUMN FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 px-6 text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                V
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950">VOWELS.AI</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              The autonomous AI voice recruiter for engineering, product, and enterprise recruitment across all 7 continents.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All 7 Continents Edge Nodes Operational (99.99%)
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Resume Extraction</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Voice Interviewer</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Anti-Cheating Proctor</a></li>
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Executive Scorecards</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">7 Continents</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#continents" className="hover:text-indigo-600 transition-colors">North America Edge</a></li>
              <li><a href="#continents" className="hover:text-indigo-600 transition-colors">Europe & UK Hub</a></li>
              <li><a href="#continents" className="hover:text-indigo-600 transition-colors">Asia-Pacific Nodes</a></li>
              <li><a href="#continents" className="hover:text-indigo-600 transition-colors">South America & Africa</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/login" className="hover:text-indigo-600 transition-colors">Recruiter Login</a></li>
              <li><a href="/dashboard/templates" className="hover:text-indigo-600 transition-colors">Job Templates</a></li>
              <li><a href="/dashboard/reports" className="hover:text-indigo-600 transition-colors">Candidate Reports</a></li>
              <li><a href="/dashboard/settings" className="hover:text-indigo-600 transition-colors">System Settings</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Vowels Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Security & Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  )
}