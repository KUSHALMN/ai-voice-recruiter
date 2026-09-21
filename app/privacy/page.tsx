import React from 'react'
import Link from 'next/link'
import { Shield, Lock, Eye, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | AI Voice Recruiter',
  description: 'Enterprise Privacy Policy detailing AI voice processing, candidate data protection, and GDPR/CCPA compliance.'
}

export default function PrivacyPolicyPage() {
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>GDPR &amp; CCPA Compliant</span>
          </div>
        </nav>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] shadow-xs text-indigo-600 text-xs font-semibold mb-5">
          <Lock className="w-3.5 h-3.5" />
          <span>Data Privacy &amp; AI Ethics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#86868B]">
          Last Updated: <span className="text-[#1D1D1F] font-medium">{lastUpdated}</span> &bull; Version 2.4
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-8 text-sm leading-relaxed text-[#424245]">
        {/* Section 1: Overview */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            1. Overview &amp; Commitment
          </h2>
          <p className="mb-3">
            AI Voice Recruiter (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Platform&rdquo;) is dedicated to safeguarding the privacy and personal data of job candidates and recruiting teams. This Privacy Policy details how we collect, store, process, and protect your information when participating in autonomous voice and technical interviews.
          </p>
          <p>
            We strictly adhere to the <strong className="text-[#1D1D1F]">General Data Protection Regulation (GDPR)</strong>, the <strong className="text-[#1D1D1F]">California Consumer Privacy Act (CCPA)</strong>, and global artificial intelligence governance standards.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            2. Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <h3 className="font-semibold text-[#1D1D1F] mb-2 text-sm text-indigo-600">Candidate Data</h3>
              <ul className="space-y-1.5 text-xs text-[#515154]">
                <li>&bull; Full Name, Email Address, and Contact details</li>
                <li>&bull; Resumes / CVs (PDF/DOCX) and parsed career history</li>
                <li>&bull; Live audio streams and voice recordings</li>
                <li>&bull; Speech-to-text transcripts generated during interviews</li>
                <li>&bull; Sandboxed code submissions and algorithmic solutions</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <h3 className="font-semibold text-[#1D1D1F] mb-2 text-sm text-emerald-700">Integrity &amp; Proctoring Signals</h3>
              <ul className="space-y-1.5 text-xs text-[#515154]">
                <li>&bull; Browser tab-switch and focus change timestamps</li>
                <li>&bull; Speech response latency and duration patterns</li>
                <li>&bull; Scripted / teleprompter entropy indicators</li>
                <li>&bull; IP address and device browser characteristics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: AI Processing */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            3. Artificial Intelligence &amp; Automated Processing
          </h2>
          <p>
            Our platform utilizes advanced AI models (including Google Generative AI, Groq, and specialized RAG embedding pipelines) to:
          </p>
          <ul className="space-y-2 pl-4 list-disc text-[#515154]">
            <li>Generate tailored, role-specific interview questions based on job requirements.</li>
            <li>Evaluate candidate code execution for correctness, time complexity, and readability.</li>
            <li>Transcribe spoken candidate responses in real time.</li>
            <li>Produce standardized executive hiring scorecards for human recruiter review.</li>
          </ul>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mt-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong className="text-amber-950">Human-in-the-Loop Guarantee:</strong> AI Voice Recruiter does not make autonomous employment or rejection decisions. All evaluations, rubrics, and recommendations are advisory dossiers provided to human hiring managers for final determination.
            </span>
          </div>
        </section>

        {/* Section 4: Data Security */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            4. Data Security &amp; Encryption
          </h2>
          <p>
            We enforce defense-in-depth security measures to protect your data against unauthorized access, loss, or destruction:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-center">
              <span className="text-xs font-bold text-[#1D1D1F] block mb-1">In Transit</span>
              <span className="text-xs text-[#86868B]">TLS 1.3 &amp; HTTPS enforced</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-center">
              <span className="text-xs font-bold text-[#1D1D1F] block mb-1">At Rest</span>
              <span className="text-xs text-[#86868B]">AES-256 bit database encryption</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-center">
              <span className="text-xs font-bold text-[#1D1D1F] block mb-1">Isolation</span>
              <span className="text-xs text-[#86868B]">Row-Level Security (RLS)</span>
            </div>
          </div>
        </section>

        {/* Section 5: Candidate Rights */}
        <section className="p-7 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-lg font-bold text-[#1D1D1F] border-b border-[#E5E5EA] pb-3">
            5. Your Rights (GDPR &amp; CCPA)
          </h2>
          <p>
            Under global privacy frameworks, you hold full authority over your personal information:
          </p>
          <ul className="space-y-2 pl-4 list-disc text-[#515154]">
            <li><strong className="text-[#1D1D1F]">Right of Access:</strong> Request a full copy of your interview recordings and transcripts.</li>
            <li><strong className="text-[#1D1D1F]">Right to Rectification:</strong> Request correction of inaccurate personal profile data.</li>
            <li><strong className="text-[#1D1D1F]">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request permanent deletion of all audio recordings, transcripts, and evaluation scorecards via our self-serve endpoint.</li>
            <li><strong className="text-[#1D1D1F]">Right to Restrict Processing:</strong> Withdraw consent for AI voice analysis at any time.</li>
          </ul>
        </section>

        {/* Section 6: Contact & DPO */}
        <section className="p-7 rounded-2xl bg-[#1D1D1F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl shadow-black/5">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Data Protection Officer (DPO)</h3>
            <p className="text-xs text-slate-300">
              For inquiries, GDPR data deletion, or compliance audits, contact our dedicated privacy team.
            </p>
          </div>
          <a
            href="mailto:privacy@airecruiter.io"
            className="px-5 py-2.5 rounded-xl bg-white text-[#1D1D1F] font-semibold text-xs hover:bg-slate-100 transition-all shrink-0 text-center shadow-xs"
          >
            Contact Privacy Team
          </a>
        </section>
      </main>
    </div>
  )
}
