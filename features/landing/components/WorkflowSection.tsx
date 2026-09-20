'use client'

import { motion } from 'framer-motion'
import { FileCheck, Headphones, Award } from 'lucide-react'

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Create Role or Upload Resume',
    description: 'Upload a job description or drop a candidate resume. AIRA automatically extracts key requirements, tech stacks, and creates custom question banks.',
    icon: FileCheck
  },
  {
    step: '02',
    title: 'Candidate Takes Voice Interview',
    description: 'Send a link. Candidates complete their live adaptive voice & coding interview on their own time, 24/7, without scheduling bottlenecks.',
    icon: Headphones
  },
  {
    step: '03',
    title: 'Review Verified Scorecards & Hire',
    description: 'Access standardized rubrics, full audio replays, code execution logs, and anti-cheat audit reports to make fast, confident hiring decisions.',
    icon: Award
  }
]

export function WorkflowSection() {
  return (
    <section className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
            Autonomous Pipeline
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How top talent teams hire 10x faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all relative group"
              >
                <div className="text-4xl font-mono font-bold text-slate-700 mb-6 group-hover:text-primary-500/40 transition-colors">
                  {step.step}
                </div>
                <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
