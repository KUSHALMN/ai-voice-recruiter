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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] selection:bg-indigo-500 selection:text-white relative overflow-x-hidden font-sans antialiased">
      {/* Subtle Apple Background Pattern with Radial Falloff */}
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
      <header className="sticky top-4 inset-x-0 z-50 flex justify-center px-4 max-w-5xl mx-auto">
        <nav className="w-full bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full px-5 py-2.5 flex items-center justify-between transition-all">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Enterprise Defense-in-Depth</span>
          </div>
        </nav>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] shadow-xs text-indigo-600 text-xs font-semibold mb-5">
          <Shield className="w-3.5 h-3.5" />
          <span>Security &amp; Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-3">
          Security Overview
        </h1>
        <p className="text-sm text-[#86868B]">
          Last Updated: <span className="text-[#1D1D1F] font-medium">{lastUpdated}</span> &bull; Security Standard Tier-1
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-8 text-sm leading-relaxed text-[#424245]">
        {/* Section 1: Overview */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            1. Enterprise Defense-in-Depth Architecture
          </h2>
          <p className="mb-4">
            AI Voice Recruiter is engineered from the ground up with a defense-in-depth architecture to ensure confidential interviews, proprietary question banks, and candidate evaluations remain immune to unauthorized access, scraping, tampering, and automated exploits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <div className="flex items-center gap-2 font-bold text-[#1D1D1F] mb-2 text-sm">
                <Server className="w-4 h-4 text-emerald-600" />
                Edge WAF &amp; IP Rate Limiting
              </div>
              <p className="text-xs text-[#515154] leading-relaxed">
                Next.js Edge Middleware dynamically evaluates incoming traffic, blocking suspicious vulnerability scanners (<code className="text-indigo-600 font-mono text-[11px]">.env</code>, <code className="text-indigo-600 font-mono text-[11px]">.git</code>, <code className="text-indigo-600 font-mono text-[11px]">/wp-admin</code>), path traversal probes, and burst scrapers with HTTP 403.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <div className="flex items-center gap-2 font-bold text-[#1D1D1F] mb-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Strict Content Security Policy (CSP)
              </div>
              <p className="text-xs text-[#515154] leading-relaxed">
                Zero clickjacking protection via <code className="text-indigo-600 font-mono text-[11px]">frame-ancestors &apos;none&apos;</code>, 2-Year HSTS Preload, Cross-Origin Opener Policy (COOP), and strict resource origin isolation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Anti-Tamper & Anti-Scraping */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-600" />
            2. Candidate Interview Room Anti-Tamper Safeguards
          </h2>
          <p>
            To preserve fairness and protect hiring companies&apos; confidential intellectual property, technical and voice assessment rooms feature real-time integrity controls:
          </p>
          <ul className="space-y-2.5 text-xs text-[#515154]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1D1D1F]">DevTools Inspection Prevention:</strong> Intercepts F12, Ctrl+Shift+I, and DevTools inspection shortcuts to prevent DOM inspection of answer rubrics.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1D1D1F]">Context Menu &amp; Selection Locking:</strong> Prevents unauthorized copy-pasting of interview questions to external automated AI solvers or search engines.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong className="text-[#1D1D1F]">Tab Switch &amp; Focus Probing:</strong> Actively monitors window blur events and tab switches, providing hiring managers with an objective integrity audit log.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Data Protection & Input Sanitization */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-600" />
            3. Input Sanitization &amp; Cryptographic CSRF Guards
          </h2>
          <p>
            Every API endpoint enforces strict payload boundaries, recursive HTML entity escaping, and SQL injection pattern rejection. State-mutating routes require cryptographically signed HMAC-SHA256 double-submit cookie tokens to prevent Cross-Site Request Forgery.
          </p>
        </section>

        {/* Section 4: Vulnerability Disclosure Program */}
        <section className="p-7 rounded-2xl bg-[#1D1D1F] text-white space-y-4 shadow-xl shadow-black/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            4. Vulnerability Disclosure Program (VDP)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            We welcome ethical security researchers and security professionals. If you believe you have discovered a vulnerability, please contact our security team:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="mailto:security@aivoicerecruiter.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1D1D1F] text-xs font-semibold hover:bg-slate-100 transition-colors shadow-xs"
            >
              Contact Security Team
            </a>
            <a
              href="https://github.com/KUSHALMN/ai-voice-recruiter/blob/main/docs/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              View Full Security Policy on GitHub &rarr;
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
