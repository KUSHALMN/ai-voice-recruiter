import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'bordered'
  interactive?: boolean
  children: React.ReactNode
}

export function Card({
  variant = 'glass',
  interactive = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    glass: 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl',
    solid: 'bg-slate-900 border border-slate-800 shadow-lg',
    bordered: 'bg-transparent border border-slate-800/80 hover:border-slate-700'
  }

  const hoverStyles = interactive
    ? 'hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-primary-500/5 transition-all duration-300 cursor-pointer'
    : ''

  return (
    <div
      className={`rounded-2xl p-6 ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
