'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for fast prototyping and small teams.',
    features: ['Up to 5 candidate interviews/mo', 'Autonomous voice AI', 'Standard scorecard reports', 'Community support'],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/month',
    description: 'Designed for scaling tech startups and agencies.',
    features: ['Unlimited candidate interviews', 'Monaco sandbox code evaluation', 'Anti-cheat AI proctoring', 'Enterprise RAG talent search', 'Priority email & Slack support'],
    cta: 'Start 14-Day Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Custom SLAs, ATS integrations, and dedicated fine-tuned models.',
    features: ['Dedicated AI voice model fine-tuning', 'Full ATS webhook bidirectional sync', 'Custom compliance & SOC-2 reports', 'Dedicated Technical Account Manager'],
    cta: 'Contact Sales',
    highlighted: false
  }
]

export function PricingSection() {
  const router = useRouter()

  return (
    <section className="py-24 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
            Transparent Pricing
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Predictable plans for teams of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl flex flex-col justify-between transition-all ${
                plan.highlighted
                  ? 'bg-slate-900 border-2 border-primary-500 shadow-2xl shadow-primary-500/10 relative'
                  : 'bg-slate-900/40 border border-slate-800'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold uppercase tracking-wide">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-sm text-slate-400">{plan.period}</span>}
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-primary-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => router.push('/dashboard/create-interview')}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
