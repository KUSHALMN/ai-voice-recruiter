import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800/80 py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">AI Voice Recruiter</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/talent-search" className="hover:text-white transition-colors">
            Talent Search
          </Link>
          <Link href="/dashboard/reports" className="hover:text-white transition-colors">
            Candidate Reports
          </Link>
          <Link href="/dashboard/create-interview" className="hover:text-white transition-colors">
            New Interview
          </Link>
        </div>
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} AI Recruiter Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
