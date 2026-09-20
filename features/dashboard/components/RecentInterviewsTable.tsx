import React from 'react'
import { ArrowRight, FileText, CheckCircle2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui'

export interface InterviewRow {
  id: string
  candidate_name: string
  role: string
  status: string
  created_at: string
  score?: number
}

export interface RecentInterviewsTableProps {
  interviews: InterviewRow[]
  loading?: boolean
}

export function RecentInterviewsTable({
  interviews,
  loading = false
}: RecentInterviewsTableProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse">
        Loading recent interviews...
      </div>
    )
  }

  if (!interviews.length) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-900/40 border border-slate-800">
        No recent interviews found. Create your first interview to get started.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden backdrop-blur-xl">
      <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Recent Candidate Interviews</h3>
        <span className="text-xs text-slate-400">{interviews.length} candidates</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-semibold">Candidate</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {interviews.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-medium text-white">{item.candidate_name}</td>
                <td className="py-3.5 px-4 text-slate-300">{item.role}</td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      item.status === 'completed'
                        ? 'success'
                        : item.status === 'in_progress'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => router.push(`/shared/report/${item.id}`)}
                    className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
