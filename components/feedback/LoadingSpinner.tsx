import React from 'react'
import { Loader2 } from 'lucide-react'

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
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary-500`} />
      {label && <p className="text-sm text-slate-400 font-medium">{label}</p>}
    </div>
  )
}
