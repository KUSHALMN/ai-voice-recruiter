import React from 'react'
import Link from 'next/link'
import { FileText, Shield, ArrowLeft, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | AI Voice Recruiter',
  description: 'Terms of Service and Acceptable Use Policy for AI Voice Recruiter.'
}

export default function TermsOfServicePage() {
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
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Terms of Service</span>
          </div>
        </nav>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] shadow-xs text-indigo-600 text-xs font-semibold mb-5">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-[#86868B]">
          Effective Date: <span className="text-[#1D1D1F] font-medium">{lastUpdated}</span> &bull; Version 2.1
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-8 text-sm leading-relaxed text-[#424245]">
        {/* Section 1: Agreement */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            1. Acceptance of Terms
          </h2>
          <p className="mb-3">
            By accessing or using AI Voice Recruiter (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you are participating as a candidate, you agree to complete interviews truthfully and adhere to all integrity and anti-cheat guidelines.
          </p>
          <p>
            If you do not agree to these Terms, you may not access or participate in interviews hosted on the Platform.
          </p>
        </section>

        {/* Section 2: Prohibited Conduct & Anti-Hacking Policy */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            2. Prohibited Conduct &amp; Anti-Tampering Policy
          </h2>
          <p>
            To preserve interview fairness, security, and intellectual property, the following actions are strictly prohibited and result in immediate session termination, reporting to employers, and legal action:
          </p>
          <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2.5 text-xs">
            <div className="font-bold flex items-center gap-2 text-rose-700 text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              Strictly Prohibited Actions
            </div>
            <p>&bull; <strong>Reverse Engineering &amp; Scraping:</strong> Decompiling, reverse-engineering, scraping, or extracting questions, prompts, or proprietary interview banks.</p>
            <p>&bull; <strong>Automated Solvers &amp; Teleprompters:</strong> Using unauthorized third-party automated browser extensions, live ChatGPT solvers, or reading scripted AI responses.</p>
            <p>&bull; <strong>Malicious Code Injection:</strong> Submitting code into the live sandbox designed to exploit system binaries, execute network port scans, or access server memory.</p>
            <p>&bull; <strong>Impersonation &amp; Proxy Attendance:</strong> Allowing another individual to take the voice or coding interview on your behalf.</p>
          </div>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-3">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            3. Intellectual Property Rights
          </h2>
          <p>
            All interview questions, proprietary rubric models, scoring algorithms, and visual branding are the exclusive intellectual property of AI Voice Recruiter and its enterprise clients.
          </p>
          <p>
            Candidates retain ownership of original code solutions authored during technical challenges, granting the prospective employer a non-exclusive license to review and evaluate the submission.
          </p>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-3">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            4. Limitation of Liability &amp; AI Disclaimers
          </h2>
          <p>
            The Platform provides automated screening assistance to hiring organizations. The Platform does not guarantee employment or job offers. Under no circumstances shall AI Voice Recruiter be liable for indirect, incidental, or consequential damages arising from recruitment decisions made by hiring companies.
          </p>
        </section>

        {/* Section 5: Governing Law */}
        <section className="p-7 rounded-2xl bg-[#1D1D1F] text-white shadow-xl shadow-black/5">
          <h3 className="text-base font-bold text-white mb-2">5. Governing Law &amp; Dispute Resolution</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without giving effect to any principles of conflicts of law.
          </p>
        </section>
      </main>
    </div>
  )
}
