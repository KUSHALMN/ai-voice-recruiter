import React from 'react'
import Link from 'next/link'
import { Shield, Lock, ArrowLeft, CheckCircle2, ShieldCheck, AlertTriangle, Key, Terminal, Server } from 'lucide-react'

export const metadata = {
  title: 'Security Policy & Architecture | AI Voice Recruiter',
  description: 'Enterprise security architecture, threat model, defense-in-depth protection, and vulnerability disclosure policy.'
}

export default function SecurityPage() {
  const lastUpdated = 'September 21, 2026'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary-500/30 selection:text-primary-200">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-white">Enterprise Defense-in-Depth</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Security Overview
        </h1>
        <p className="text-sm text-slate-400">
          Last Updated: <span className="text-slate-300 font-medium">{lastUpdated}</span> &bull; Security Standard Tier-1
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-12 text-sm leading-relaxed text-slate-300">
        {/* Section 1: Overview */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-400" />
            1. Enterprise Defense-in-Depth Architecture
          </h2>
          <p className="mb-3">
            AI Voice Recruiter is engineered from the ground up with a defense-in-depth architecture to ensure confidential interviews, proprietary question banks, and candidate evaluations remain immune to unauthorized access, scraping, tampering, and automated exploits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 font-medium text-white mb-1.5 text-xs">
                <Server className="w-4 h-4 text-emerald-400" />
                Edge WAF &amp; IP Rate Limiting
              </div>
              <p className="text-xs text-slate-400">
                Next.js Edge Middleware dynamically evaluates incoming traffic, blocking suspicious vulnerability scanners, path traversal probes, and burst scrapers with HTTP 403.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 font-medium text-white mb-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Strict Content Security Policy (CSP)
              </div>
              <p className="text-xs text-slate-400">
                Zero clickjacking protection via <code className="text-indigo-300 font-mono text-[10px]">frame-ancestors &apos;none&apos;</code>, 2-Year HSTS Preload, COOP, and strict resource origin isolation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Anti-Tamper & Anti-Scraping */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            2. Candidate Interview Room Anti-Tamper Safeguards
          </h2>
          <p>
            To preserve fairness and protect hiring companies&apos; confidential intellectual property, technical and voice assessment rooms feature real-time integrity controls:
          </p>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>DevTools Inspection Prevention:</strong> Intercepts F12, Ctrl+Shift+I, and DevTools inspection shortcuts to prevent DOM inspection of answer rubrics.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Context Menu &amp; Selection Locking:</strong> Prevents unauthorized copy-pasting of interview questions to external automated AI solvers or search engines.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Tab Switch &amp; Focus Probing:</strong> Actively monitors window blur events and tab switches, providing hiring managers with an objective integrity audit log.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Data Protection & Input Sanitization */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-400" />
            3. Input Sanitization &amp; Cryptographic CSRF Guards
          </h2>
          <p>
            Every API endpoint enforces strict payload boundaries, recursive HTML entity escaping, and SQL injection pattern rejection. State-mutating routes require cryptographically signed HMAC-SHA256 double-submit cookie tokens to prevent Cross-Site Request Forgery.
          </p>
        </section>

        {/* Section 4: Vulnerability Disclosure Program */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary-400" />
            4. Vulnerability Disclosure Program (VDP)
          </h2>
          <p className="text-xs text-slate-300">
            We welcome ethical security researchers and security professionals. If you believe you have discovered a vulnerability, please contact our security team:
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="mailto:security@aivoicerecruiter.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-500/20 transition-colors"
            >
              Contact Security Team
            </a>
            <a
              href="https://github.com/KUSHALMN/ai-voice-recruiter/blob/main/docs/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              View Full Security Policy on GitHub &rarr;
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
