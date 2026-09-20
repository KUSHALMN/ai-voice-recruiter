import React from 'react'
import { Users, Award, Clock, TrendingUp } from 'lucide-react'

export interface MetricItem {
  label: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export interface DashboardMetricsProps {
  totalInterviews?: number
  avgScore?: number
  completedCount?: number
  pendingCount?: number
}

export function DashboardMetrics({
  totalInterviews = 42,
  avgScore = 84,
  completedCount = 38,
  pendingCount = 4
}: DashboardMetricsProps) {
  const metrics: MetricItem[] = [
    {
      label: 'Total Interviews',
      value: totalInterviews,
      change: '+14% this month',
      icon: Users,
      color: 'text-primary-400 bg-primary-500/10'
    },
    {
      label: 'Average Score',
      value: `${avgScore}%`,
      change: '+3.2% vs benchmark',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      label: 'Completed Sessions',
      value: completedCount,
      change: '90.4% completion rate',
      icon: Clock,
      color: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      label: 'Active Pipeline',
      value: pendingCount,
      change: '4 candidates in review',
      icon: TrendingUp,
      color: 'text-amber-400 bg-amber-500/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{item.label}</span>
              <div className={`p-2 rounded-xl ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
              {item.change && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>{item.change}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
