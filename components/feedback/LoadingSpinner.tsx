import React from 'react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  label,
  className = ''
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-24 h-4',
    md: 'w-48 h-6',
    lg: 'w-64 h-8'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`${sizeMap[size]} bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse`} />
      {label && <p className="text-xs text-slate-400 font-medium animate-pulse">{label}</p>}
    </div>
  )
}
