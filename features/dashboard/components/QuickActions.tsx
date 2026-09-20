import React from 'react'
import { PlusCircle, Search, FileText, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: 'Create Interview',
      description: 'Configure role & questions',
      icon: PlusCircle,
      href: '/dashboard/create-interview',
      primary: true
    },
    {
      title: 'Talent Search',
      description: 'Semantic RAG candidate match',
      icon: Search,
      href: '/dashboard/talent-search',
      primary: false
    },
    {
      title: 'Candidate Reports',
      description: 'View executive dossiers',
      icon: FileText,
      href: '/dashboard/reports',
      primary: false
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {actions.map((act, idx) => {
        const Icon = act.icon
        return (
          <button
            key={idx}
            onClick={() => router.push(act.href)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 group ${
              act.primary
                ? 'bg-primary-600/10 border-primary-500/30 hover:bg-primary-600/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl ${
                act.primary
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-slate-800 text-slate-300 group-hover:text-primary-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-slate-400">{act.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
