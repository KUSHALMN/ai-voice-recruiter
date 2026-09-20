import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 ${className}`}>
      {Icon && (
        <div className="p-3 mb-4 rounded-xl bg-slate-800/80 text-slate-400">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-lg shadow-primary-600/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
