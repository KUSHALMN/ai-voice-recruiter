import React from 'react'
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface CompletionViewProps {
  candidateName: string
  role: string
  reportId?: string
}

export function CompletionView({
  candidateName,
  role,
  reportId
}: CompletionViewProps) {
  const router = useRouter()

  return (
    <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-center shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6">
        <Award className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Interview Completed!</h2>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
        Thank you, <span className="text-white font-medium">{candidateName}</span>. Your responses for the <span className="text-white font-medium">{role}</span> position have been evaluated and securely submitted.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {reportId && (
          <button
            onClick={() => router.push(`/shared/report/${reportId}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2"
          >
            <span>View Executive Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}
