import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
}

export function Container({
  size = 'xl',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const maxMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${maxMap[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
