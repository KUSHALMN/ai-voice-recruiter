'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, Check, Globe, Sparkles, Zap, Shield, 
  BarChart3, Users, Clock, Bot, Cpu, CheckCircle2, 
  ChevronRight, Star, Play, Award, FileText, CheckCircle,
  Building, Compass, ArrowUpRight, Lock, Activity
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
    color: 'from-blue-600 to-cyan-500'
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
    color: 'from-indigo-600 to-blue-500'
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
    color: 'from-purple-600 to-indigo-500'
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
    color: 'from-blue-700 to-indigo-600'
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
    color: 'from-sky-600 to-blue-400'
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
    <div className="min-h-screen bg-[#FDFEFE] dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Banner / Announcement Bar */}
      <div className="bg-[#002B49] dark:bg-[#050505] text-white py-2 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-[#003B64] dark:border-neutral-900">
        <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">NEW</span>
        <span>AIRA 2.0 is live: Real-time anti-script reading detection & 7 Continents edge network.</span>
        <a href="#continents" className="underline hover:text-emerald-300 font-bold ml-1 flex items-center gap-1">
          Explore Hub <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Modern HelloBonsai-style Header */}
      <header className="sticky top-0 z-50 bg-[#FDFEFE]/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-18 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-xl bg-[#00A389] text-white flex items-center justify-center font-black text-lg shadow-sm">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#002B49] dark:text-white">
                VOWELS<span className="text-[#00A389]">.AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none -mt-0.5">
                AI Voice Recruiter
              </span>
            </div>
          </div>
          
          {/* Centered Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-neutral-300">
            <a href="#features" className="hover:text-[#00A389] transition-colors">Features</a>
            <a href="#continents" className="hover:text-[#00A389] transition-colors flex items-center gap-1.5 font-bold text-[#00A389]">
              <Globe className="w-4 h-4" /> 7 Continents
            </a>
            <a href="#product-showcase" className="hover:text-[#00A389] transition-colors">Platform</a>
            <a href="#testimonials" className="hover:text-[#00A389] transition-colors">Customer Stories</a>
            <a href="#stats" className="hover:text-[#00A389] transition-colors">Global Impact</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="text-sm font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              disabled={isPending}
              className="bg-[#00A389] hover:bg-[#008f77] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:shadow-md transition-all text-xs tracking-wide flex items-center gap-1.5 disabled:opacity-50"
            >
              {isPending ? 'Connecting...' : 'Recruiter Portal'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION — HELLOBONSAI STYLE SPLIT GRID */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Partnership Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300">
              <span className="text-slate-500 dark:text-neutral-400">In partnership with</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <span className="w-2 h-2 rounded-full bg-[#00A389] animate-pulse"></span>
                Global Talent Network across 7 Continents
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-[#002B49] dark:text-white leading-[1.1]">
              The autonomous AI recruiter for <span className="text-[#00A389]">high-growth teams</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 dark:text-neutral-300 font-normal leading-relaxed max-w-xl">
              Designed to eliminate screening bottlenecks, conduct adaptive voice interviews across all 7 continents, and deliver comprehensive candidate evaluations in minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                disabled={isPending}
                className="bg-[#00A389] hover:bg-[#008f77] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                {isPending ? 'Opening...' : 'Start Hiring in Minutes'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('continents')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-800 dark:text-white border border-slate-300 dark:border-neutral-800 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-[#00A389]" />
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
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-400">
                <strong>4.9 / 5</strong> from 1,200+ recruiters & engineering leaders worldwide
              </span>
            </div>
          </motion.div>

          {/* Right Hero Product Card (HelloBonsai Signature Mockup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl bg-white dark:bg-[#0A0A0A] border border-slate-200/90 dark:border-neutral-800 shadow-2xl p-6 sm:p-7">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">AIRA Live Session • ID #e4eef6b7</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    VOICE AI ACTIVE
                  </span>
                </div>
              </div>

              {/* Candidate Card Inside Mockup */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Profile</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Kushal M N</h3>
                    <p className="text-xs text-slate-600 dark:text-neutral-400">Senior Full-Stack & GenAI Engineer</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#00A389]">9.4<span className="text-xs text-slate-400 font-normal">/10</span></div>
                    <span className="inline-block bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      STRONG HIRE
                    </span>
                  </div>
                </div>

                {/* Simulated Real-Time Audio Visualizer */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Activity className="w-3.5 h-3.5 text-[#00A389]" /> Adaptive Questioning
                    </span>
                    <span className="font-mono text-[#00A389]">Latency: 18ms</span>
                  </div>
                  <div className="flex items-end justify-between h-8 gap-1 px-1">
                    {[40, 65, 30, 85, 95, 55, 75, 45, 90, 60, 35, 80, 50, 70, 90, 40, 60, 80, 55].map((h, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${h}%` }} 
                        className="w-full bg-[#00A389] rounded-full transition-all duration-300 opacity-90 hover:opacity-100" 
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-300 italic pt-1">
                    &quot;Explain how you architected the AST-based drift detection algorithm in your Spring Boot backend.&quot;
                  </p>
                </div>

                {/* Real-time Insights Row */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800">
                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Proctor & Integrity</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Authentic
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800">
                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Target Region</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-4 h-4 text-blue-500" /> 7 Continents Reach
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6 BENTO CARDS GRID — HELLOBONSAI SIGNATURE SECTION */}
      <section id="features" className="py-20 px-6 bg-slate-50/70 dark:bg-neutral-950 border-y border-slate-200/70 dark:border-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#002B49] dark:text-white mb-3">
              Everything high-growth hiring teams need
            </h2>
            <p className="text-slate-600 dark:text-neutral-400 text-base">
              Autonomous, AI-driven modules engineered to replace weeks of disjointed screening workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#0A0A0A] p-7 rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00A389] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Resume Auto-Extraction</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                Drop any PDF or Word resume. Groq AI parses candidate skills, years of experience, and auto-generates custom role descriptions in seconds.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#0A0A0A] p-7 rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Adaptive Voice Agent</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                Ultra-low latency conversational voice agent delivers realistic, human-like voice interviews with zero awkward lag or robotic pauses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#0A0A0A] p-7 rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Dynamic Follow-Up Probing</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                If a candidate gives a surface-level response, AIRA automatically interrupts with targeted technical follow-up questions to test true depth.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-[#0A0A0A] p-7 rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Anti-Cheating & Script Proctor</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                Continuous window focus monitoring, background tab tracking, and speech pattern entropy analysis detect scripted reading in real time.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white dark:bg-[#0A0A0A] p-7 rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">7 Continents Edge Reach</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                Distributed edge deployment delivers sub-50ms latency globally across North America, Europe, Asia, South America, Africa, Oceania, and Antarctica.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white dark:bg-[#0A0A0A] p-7 rounded-2xl border border-slate-200/90 dark:border-neutral-800/90 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00A389] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Executive Scorecards</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                Receive standardized candidate rubrics with question-by-question scoring, audio playback transcripts, and clear hire recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BENTO SHOWCASE — HELLOBONSAI SPLIT SHOWCASES */}
      <section id="product-showcase" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        {/* Showcase Card 1 */}
        <div className="rounded-3xl bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-neutral-800 p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A389]">Autonomous Pipeline</span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#002B49] dark:text-white leading-tight">
              Deliver engineering hires on-time & on-budget
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-neutral-300">
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#00A389] shrink-0" />
                <span>Auto-match candidate tech stacks to calibrated question banks.</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#00A389] shrink-0" />
                <span>Eliminate preliminary scheduling delays with 24/7 candidate on-demand access.</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#00A389] shrink-0" />
                <span>Complete audio playback transcripts with highlighted strengths and red flags.</span>
              </div>
            </div>
            <button
              onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
              className="bg-[#002B49] dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2"
            >
              Try Free Interview <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-black p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-lg space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-neutral-900 pb-3">
              <span className="font-bold text-slate-700 dark:text-neutral-200">Evaluation Rubric Breakdown</span>
              <span className="text-[#00A389] font-bold">Passed (92%)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-neutral-400">Algorithms & Data Structures</span>
                <span className="font-bold text-slate-800 dark:text-white">9.5 / 10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00A389] h-full w-[95%]" />
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-500 dark:text-neutral-400">System Architecture & Scalability</span>
                <span className="font-bold text-slate-800 dark:text-white">9.2 / 10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00A389] h-full w-[92%]" />
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-500 dark:text-neutral-400">Technical Communication</span>
                <span className="font-bold text-slate-800 dark:text-white">9.6 / 10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00A389] h-full w-[96%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 CONTINENTS GLOBAL RECRUITMENT HUB SECTION */}
      <section id="continents" className="py-24 px-6 bg-[#002B49] dark:bg-[#050505] text-white relative overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00A389]/20 text-[#00A389] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#00A389]/30">
              <Globe className="w-3.5 h-3.5" /> Worldwide AI Edge Infrastructure
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Recruit Across All <span className="text-[#00A389]">7 Continents</span>
            </h2>
            <p className="text-slate-300 text-base">
              Deploy voice agents natively across every continent with automated timezone alignment, accent adaptation, and multi-lingual fluency.
            </p>
          </div>

          {/* Continents Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
            {CONTINENTS_DATA.map((continent) => {
              const isSelected = selectedContinent.id === continent.id
              return (
                <button
                  key={continent.id}
                  onClick={() => setSelectedContinent(continent)}
                  className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-[#00A389] border-emerald-400 text-white shadow-lg scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{continent.icon}</div>
                  <div className="text-xs font-bold truncate">{continent.name}</div>
                  <div className="text-[10px] opacity-75 font-mono mt-1">{continent.latency}</div>
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
            className="bg-white/5 border border-white/15 rounded-3xl p-8 lg:p-10 shadow-2xl backdrop-blur-md"
          >
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl">{selectedContinent.icon}</span>
                  <div>
                    <h3 className="text-3xl font-black text-white">{selectedContinent.name}</h3>
                    <p className="text-[#00A389] text-sm font-medium">Major Tech Hubs: {selectedContinent.hub}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Active Pool</span>
                    <div className="text-2xl font-bold text-white mt-1">{selectedContinent.candidates}</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Edge Voice Latency</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <Zap className="w-5 h-5" /> {selectedContinent.latency}
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Native Fluency</span>
                    <div className="text-sm font-bold text-slate-200 mt-2 truncate">{selectedContinent.languages}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Top Talent Domains</span>
                  <p className="text-sm text-slate-300 font-medium bg-black/30 p-3 rounded-xl border border-white/10">
                    {selectedContinent.roles}
                  </p>
                </div>
              </div>

              <div className="bg-[#00A389]/15 border border-[#00A389]/30 rounded-2xl p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00A389] text-white mx-auto flex items-center justify-center shadow-lg">
                  <Bot className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white">Deploy AI Recruiter for {selectedContinent.name}</h4>
                <p className="text-xs text-slate-300">
                  Instantly initiate interviews optimized for {selectedContinent.name} candidate timezones & technical standards.
                </p>
                <button
                  onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                  className="w-full bg-[#00A389] hover:bg-[#008f77] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Create {selectedContinent.name} Job
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER SECTION — HELLOBONSAI STYLE */}
      <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-[#002B49] dark:text-white leading-tight">
              See why recruiters love AIRA. Get started in 30 seconds.
            </h2>
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              className="bg-[#00A389] hover:bg-[#008f77] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              Try AIRA for Free <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-400">
                1,200+ Verified Recruiter Reviews
              </span>
            </div>
          </div>

          {/* Right Interactive Quote Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-sm relative space-y-6">
              <span className="text-5xl text-[#00A389] font-serif leading-none">&ldquo;</span>
              <p className="text-lg sm:text-xl text-slate-800 dark:text-neutral-200 font-medium leading-relaxed -mt-4">
                {TESTIMONIALS[activeTestimonial].quote}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A389] text-white font-bold flex items-center justify-center">
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{TESTIMONIALS[activeTestimonial].author}</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      {TESTIMONIALS[activeTestimonial].role} • {TESTIMONIALS[activeTestimonial].company}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeTestimonial === idx ? 'bg-[#00A389] w-6' : 'bg-slate-300 dark:bg-neutral-700'
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

      {/* GLOBAL STATS SECTION */}
      <section id="stats" className="py-20 px-6 bg-slate-50 dark:bg-[#0A0A0A] border-y border-slate-200/80 dark:border-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 shadow-sm">
              <div className="text-3xl sm:text-5xl font-black text-[#00A389] mb-1">7 / 7</div>
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-neutral-400 tracking-wider">Continents Active</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 shadow-sm">
              <div className="text-3xl sm:text-5xl font-black text-[#00A389] mb-1">&lt; 35ms</div>
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-neutral-400 tracking-wider">Global Voice Latency</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 shadow-sm">
              <div className="text-3xl sm:text-5xl font-black text-[#00A389] mb-1">94%</div>
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-neutral-400 tracking-wider">Screening Time Saved</div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 shadow-sm">
              <div className="text-3xl sm:text-5xl font-black text-[#00A389] mb-1">50,000+</div>
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-neutral-400 tracking-wider">Completed Interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER — HELLOBONSAI STYLE */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black text-[#002B49] dark:text-white tracking-tight leading-tight">
          Supercharge your technical recruiting pipeline today
        </h2>
        <p className="text-slate-600 dark:text-neutral-300 text-lg max-w-2xl mx-auto">
          Sign up today and conduct your first AI-evaluated candidate interview in under 60 seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => startTransition(() => router.push('/login'))}
            className="w-full sm:w-auto bg-[#00A389] hover:bg-[#008f77] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => startTransition(() => router.push('/dashboard'))}
            className="w-full sm:w-auto bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all"
          >
            Access Recruiter Dashboard
          </button>
        </div>
      </section>

      {/* MODERN MULTI-COLUMN FOOTER — HELLOBONSAI STYLE */}
      <footer className="bg-[#002B49] dark:bg-black text-white border-t border-[#003B64] dark:border-neutral-900 pt-16 pb-12 px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00A389] text-white flex items-center justify-center font-bold text-base">
                V
              </div>
              <span className="text-xl font-black tracking-tight text-white">VOWELS.AI</span>
            </div>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              The autonomous AI voice recruiter for engineering, product, and enterprise recruitment across all 7 continents.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All 7 Continents Edge Nodes Operational (99.99%)
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#features" className="hover:text-[#00A389]">Resume Extraction</a></li>
              <li><a href="#features" className="hover:text-[#00A389]">Voice Interviewer</a></li>
              <li><a href="#features" className="hover:text-[#00A389]">Anti-Cheating Proctor</a></li>
              <li><a href="#features" className="hover:text-[#00A389]">Executive Scorecards</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">7 Continents</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#continents" className="hover:text-[#00A389]">North America Edge</a></li>
              <li><a href="#continents" className="hover:text-[#00A389]">Europe & UK Hub</a></li>
              <li><a href="#continents" className="hover:text-[#00A389]">Asia-Pacific Nodes</a></li>
              <li><a href="#continents" className="hover:text-[#00A389]">South America & Africa</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="/login" className="hover:text-[#00A389]">Recruiter Login</a></li>
              <li><a href="/dashboard/templates" className="hover:text-[#00A389]">Job Templates</a></li>
              <li><a href="/dashboard/reports" className="hover:text-[#00A389]">Candidate Reports</a></li>
              <li><a href="/dashboard/settings" className="hover:text-[#00A389]">System Settings</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Vowels Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security & Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  )
}