'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, Check, Globe, Sparkles, Zap, Shield, 
  BarChart3, Users, Clock, Bot, Cpu, CheckCircle2, ChevronRight
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
    hub: 'McMurdo & Amundsen-Scott Stations',
    candidates: '1,200+',
    latency: '45ms (Satellite Edge)',
    languages: 'English, Multi-lingual Polar Teams',
    roles: 'Scientific Computing, Polar Tech, Remote Instrumentation',
    color: 'from-sky-600 to-blue-400'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedContinent, setSelectedContinent] = useState(CONTINENTS_DATA[0])

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              V
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              VOWELS<span className="text-blue-600">.AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#continents" className="hover:text-blue-600 transition-colors flex items-center gap-1.5 font-semibold text-blue-600">
              <Globe className="w-4 h-4" /> 7 Continents Reach
            </a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Global Impact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => startTransition(() => router.push('/login'))}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? 'Loading...' : 'Recruiter Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Voice & Technical Recruiter
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Autonomous AI Recruiter across <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                All 7 Continents
              </span>
            </h1>

            <p className="text-lg lg:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
              Upload candidate resumes to auto-generate custom job descriptions, conduct adaptive voice interviews, and score candidates in real-time with sub-50ms latency worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => startTransition(() => router.push('/login'))}
                disabled={isPending}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isPending ? 'Opening...' : 'Start Hiring in Minutes'}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('continents')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5 text-blue-600" />
                Explore 7 Continents
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Resume Auto-Fill</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Adaptive Voice & Coding Probing</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Anti-Cheating Vision & Script Proctor</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7 CONTINENTS GLOBAL RECRUITMENT HUB SECTION */}
      <section id="continents" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-900 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Globe className="w-3.5 h-3.5" /> Worldwide AI Edge Infrastructure
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Recruit Across All <span className="text-blue-400">7 Continents</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Our low-latency AI interview edge network deploys voice agents natively across every continent with automated timezone alignment, accent adaptation, and multi-lingual fluency.
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
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-[1.03]'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
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
            className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 lg:p-10 shadow-2xl backdrop-blur-md"
          >
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl">{selectedContinent.icon}</span>
                  <div>
                    <h3 className="text-3xl font-black text-white">{selectedContinent.name}</h3>
                    <p className="text-blue-400 text-sm font-medium">Major Tech Hubs: {selectedContinent.hub}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Active Pool</span>
                    <div className="text-2xl font-bold text-white mt-1">{selectedContinent.candidates}</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Edge Voice Latency</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <Zap className="w-5 h-5" /> {selectedContinent.latency}
                    </div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Native Fluency</span>
                    <div className="text-sm font-bold text-slate-200 mt-2 truncate">{selectedContinent.languages}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Top Talent Domains</span>
                  <p className="text-sm text-slate-300 font-medium bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                    {selectedContinent.roles}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white">Deploy AI Recruiter for {selectedContinent.name}</h4>
                <p className="text-xs text-slate-300">
                  Instantly initiate interviews optimized for {selectedContinent.name} candidate timezones & technical standards.
                </p>
                <button
                  onClick={() => startTransition(() => router.push('/dashboard/create-interview'))}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Create {selectedContinent.name} Job
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Engineered for Speed, Intelligence & Precision
            </h2>
            <p className="text-slate-600 text-lg">
              Everything high-growth hiring teams need to replace hours of initial screening with instantaneous, accurate AI assessments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Resume Auto-Extraction</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Drop any PDF resume and watch Groq AI parse past projects, key skills, and auto-generate the complete job role and tailored questions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Follow-Up Probing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                If candidate answers are brief or vague, our AI interviewer dynamically asks follow-up questions to test deep architectural understanding.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Strict Anti-Cheating & Proctor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Continuous tab-switching detection and speech perplexity analysis flags scripted LLM reading during real-time voice interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Stats */}
      <section id="stats" className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-12">Global Hiring Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">7/7</div>
              <div className="text-xs uppercase font-bold text-slate-500">Continents Active</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">&lt; 50ms</div>
              <div className="text-xs uppercase font-bold text-slate-500">Global Voice Latency</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">94%</div>
              <div className="text-xs uppercase font-bold text-slate-500">Recruiter Time Saved</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">50,000+</div>
              <div className="text-xs uppercase font-bold text-slate-500">Completed Interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">V</div>
            <span className="font-bold text-lg">VOWELS.AI — 7 Continents AI Recruitment Platform</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} VOWELS. All rights reserved. Ultra-fast AI Recruitment.
          </p>
        </div>
      </footer>
    </div>
  )
}