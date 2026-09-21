import React from 'react'
import Link from 'next/link'
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | AI Voice Recruiter',
  description: 'Enterprise Privacy Policy detailing AI voice processing, candidate data protection, and GDPR/CCPA compliance.'
}

export default function PrivacyPolicyPage() {
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
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">GDPR & CCPA Compliant</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Data Privacy & AI Ethics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400">
          Last Updated: <span className="text-slate-300 font-medium">{lastUpdated}</span> &bull; Version 2.4
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-12 text-sm leading-relaxed text-slate-300">
        {/* Section 1: Overview */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary-400" />
            1. Overview & Commitment
          </h2>
          <p className="mb-3">
            AI Voice Recruiter (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Platform&rdquo;) is dedicated to safeguarding the privacy and personal data of job candidates and recruiting teams. This Privacy Policy details how we collect, store, process, and protect your information when participating in autonomous voice and technical interviews.
          </p>
          <p>
            We strictly adhere to the <strong>General Data Protection Regulation (GDPR)</strong>, the <strong>California Consumer Privacy Act (CCPA)</strong>, and global artificial intelligence governance standards.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
            2. Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="font-medium text-white mb-2 text-sm text-primary-300">Candidate Data</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>&bull; Full Name, Email Address, and Contact details</li>
                <li>&bull; Resumes / CVs (PDF/DOCX) and parsed career history</li>
                <li>&bull; Live audio streams and voice recordings</li>
                <li>&bull; Speech-to-text transcripts generated during interviews</li>
                <li>&bull; Sandboxed code submissions and algorithmic solutions</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="font-medium text-white mb-2 text-sm text-emerald-300">Integrity & Proctoring Signals</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>&bull; Browser tab-switch and focus change timestamps</li>
                <li>&bull; Speech response latency and duration patterns</li>
                <li>&bull; Scripted / teleprompter entropy indicators</li>
                <li>&bull; IP address and device browser characteristics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: AI Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
            3. Artificial Intelligence & Automated Processing
          </h2>
          <p>
            Our platform utilizes AI models (including Google Generative AI, Groq, and specialized RAG embedding pipelines) to:
          </p>
          <ul className="space-y-2 pl-4 list-disc text-slate-400">
            <li>Generate tailored, role-specific interview questions based on job requirements.</li>
            <li>Evaluate candidate code execution for correctness, time complexity, and readability.</li>
            <li>Transcribe spoken candidate responses in real time.</li>
            <li>Produce standardized executive hiring scorecards for human recruiter review.</li>
          </ul>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5 mt-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Human-in-the-Loop Guarantee:</strong> AI Voice Recruiter does not make autonomous employment or rejection decisions. All evaluations, rubrics, and recommendations are advisory dossiers provided to human hiring managers for final determination.
            </span>
          </div>
        </section>

        {/* Section 4: Data Security */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
            4. Data Security & Encryption
          </h2>
          <p>
            We enforce defense-in-depth security measures to protect your data against unauthorized access, loss, or destruction:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-white block mb-1">In Transit</span>
              <span className="text-xs text-slate-400">TLS 1.3 & HTTPS enforced</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-white block mb-1">At Rest</span>
              <span className="text-xs text-slate-400">AES-256 bit database encryption</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-white block mb-1">Isolation</span>
              <span className="text-xs text-slate-400">Row-Level Security (RLS)</span>
            </div>
          </div>
        </section>

        {/* Section 5: Candidate Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
            5. Your Rights (GDPR & CCPA)
          </h2>
          <p>
            Under global privacy frameworks, you hold full authority over your personal information:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
            <li><strong>Right of Access:</strong> Request a full copy of your interview recordings and transcripts.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal profile data.</li>
            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request permanent deletion of all audio recordings, transcripts, and evaluation scorecards.</li>
            <li><strong>Right to Restrict Processing:</strong> Withdraw consent for AI voice analysis at any time.</li>
          </ul>
        </section>

        {/* Section 6: Contact & DPO */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Data Protection Officer (DPO)</h3>
            <p className="text-xs text-slate-400">
              For inquiries, GDPR data deletion, or compliance audits, contact our security team.
            </p>
          </div>
          <a
            href="mailto:privacy@airecruiter.io"
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-xs transition-all shrink-0 text-center"
          >
            Contact Privacy Team
          </a>
        </section>
      </main>
    </div>
  )
}
