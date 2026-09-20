import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    neutral: 'bg-slate-800/60 text-slate-300 border border-slate-700/50',
    outline: 'bg-transparent text-slate-400 border border-slate-600'
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full backdrop-blur-sm transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
