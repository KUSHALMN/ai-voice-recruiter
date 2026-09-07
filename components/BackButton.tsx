'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface BackButtonProps {
  label?: string
  fallbackUrl?: string
  className?: string
  variant?: 'default' | 'subtle' | 'outline' | 'pill'
  onClick?: () => void
}

export default function BackButton({
  label = 'Back',
  fallbackUrl = '/dashboard',
  className = '',
  variant = 'default',
  onClick
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onClick) {
      onClick()
      return
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  const variantStyles = {
    default: 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 shadow-sm',
    subtle: 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 border border-transparent',
    outline: 'border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent',
    pill: 'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-full border border-slate-200 dark:border-neutral-800'
  }

  return (
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleBack}
      type="button"
      aria-label={label}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none group ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-slate-500 group-hover:text-blue-600 dark:text-neutral-400 dark:group-hover:text-blue-400 shrink-0" />
      <span>{label}</span>
    </motion.button>
  )
}
