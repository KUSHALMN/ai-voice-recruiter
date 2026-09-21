import React from 'react'
import Link from 'next/link'
import { FileText, Shield, ArrowLeft, AlertTriangle, CheckCircle, Scale } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | AI Voice Recruiter',
  description: 'Terms of Service and Acceptable Use Policy for AI Voice Recruiter.'
}

export default function TermsOfServicePage() {
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
            <Scale className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-white">Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400">
          Effective Date: <span className="text-slate-300 font-medium">{lastUpdated}</span> &bull; Version 2.1
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-12 text-sm leading-relaxed text-slate-300">
        {/* Section 1: Agreement */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" />
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
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
            2. Prohibited Conduct & Anti-Tampering Policy
          </h2>
          <p>
            To preserve interview fairness, security, and intellectual property, the following actions are strictly prohibited and result in immediate session termination, reporting to employers, and legal action:
          </p>
          <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-2 text-xs">
            <div className="font-semibold flex items-center gap-2 text-rose-400 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              Strictly Prohibited Actions
            </div>
            <p>&bull; <strong>Reverse Engineering & Scraping:</strong> Decompiling, reverse-engineering, scraping, or extracting questions, prompts, or proprietary interview banks.</p>
            <p>&bull; <strong>Automated Solvers & Teleprompters:</strong> Using unauthorized third-party automated browser extensions, live ChatGPT solvers, or reading scripted AI responses.</p>
            <p>&bull; <strong>Malicious Code Injection:</strong> Submitting code into the live sandbox designed to exploit system binaries, execute network port scans, or access server memory.</p>
            <p>&bull; <strong>Impersonation & Proxy Attendance:</strong> Allowing another individual to take the voice or coding interview on your behalf.</p>
          </div>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
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
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
            4. Limitation of Liability & AI Disclaimers
          </h2>
          <p>
            The Platform provides automated screening assistance to hiring organizations. The Platform does not guarantee employment or job offers. Under no circumstances shall AI Voice Recruiter be liable for indirect, incidental, or consequential damages arising from recruitment decisions made by hiring companies.
          </p>
        </section>

        {/* Section 5: Governing Law */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-base font-semibold text-white mb-2">5. Governing Law & Dispute Resolution</h3>
          <p className="text-xs text-slate-400">
            These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without giving effect to any principles of conflicts of law.
          </p>
        </section>
      </main>
    </div>
  )
}
