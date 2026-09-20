'use client'

import { motion } from 'framer-motion'
import {
  Mic, Clock, BrainCircuit, Code2,
  Zap, ShieldCheck, FileText, BarChart3
} from 'lucide-react'

const CORE_FEATURES = [
  {
    icon: Mic,
    title: 'Autonomous Voice AI Interviewer',
    category: 'Conversational Voice',
    description: 'Sub-20ms ultra-low latency speech pipeline that speaks, listens, and responds naturally. Eliminates robotic lag and awkward pauses.',
    highlights: ['Natural conversational cadence', 'Adaptive speech pacing', 'Accent comprehension']
  },
  {
    icon: Clock,
    title: 'Intelligent Time-Budgeted Pacing',
    category: 'Time Optimization',
    description: 'Dynamically budgets questions based on total interview duration (15m, 30m, or 60m). Continuously evaluates time remaining.',
    highlights: ['Real-time time tracking', 'Prevents candidate cutoff', 'Smart wrap-up reflection']
  },
  {
    icon: BrainCircuit,
    title: 'Adaptive Difficulty Engine',
    category: 'Skill Calibration',
    description: 'Begins at calibrated medium difficulty and dynamically scales based on response depth. Automatically unlocks advanced challenges.',
    highlights: ['Multi-tier difficulty scaling', 'Dynamic challenge injection', 'Objective skill ceiling']
  },
  {
    icon: Code2,
    title: 'Live Coding & Sandboxed Execution',
    category: 'Technical Validation',
    description: 'Built-in Monaco code editor supporting TypeScript, Python, and JavaScript. Automatically tests candidates against hidden test cases.',
    highlights: ['Real-time code evaluation', 'Hidden unit test runner', 'Clean syntax sandboxing']
  },
  {
    icon: Zap,
    title: 'Dynamic Follow-Up Probing',
    category: 'Deep Inspection',
    description: 'Detects shallow or memorized answers in real time. AIRA automatically interrupts with targeted follow-up technical questions.',
    highlights: ['Anti-surface answer detection', 'Targeted conceptual drilldowns', 'Contextual dialogue continuity']
  },
  {
    icon: ShieldCheck,
    title: 'Integrity Proctor & Anti-Cheat AI',
    category: 'Authenticity Guard',
    description: 'Multi-layer candidate proctoring monitors browser window focus, tab-switching events, and speech entropy to detect teleprompters.',
    highlights: ['Tab switch & focus loss logging', 'AI-script speech pattern analysis', 'Tamper-proof audit logs']
  },
  {
    icon: FileText,
    title: 'Smart Resume & Role Extraction',
    category: 'Instant Setup',
    description: 'Drop any PDF or Word resume. AIRA parses candidate project history, verified tech stacks, and career progression in under 10 seconds.',
    highlights: ['1-click resume ingestion', 'Auto-generated role descriptions', 'Tailored competency questions']
  },
  {
    icon: BarChart3,
    title: 'Executive Hiring Scorecards',
    category: 'Decision Analytics',
    description: 'Comprehensive candidate dossiers generated immediately after interview completion. Includes rubric breakdown and audio replay.',
    highlights: ['Overall score out of 100', 'Competency radar charts', 'Shareable executive summary']
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative border-t border-slate-800/80 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
            Product Company Infrastructure
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Every layer built for enterprise-scale screening
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_FEATURES.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-primary-500/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-1.5">
                  {feature.highlights.map((h, i) => (
                    <span key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary-400" />
                      {h}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
