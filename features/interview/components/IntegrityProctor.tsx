import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

export interface IntegrityProctorProps {
  isActive: boolean
  onViolation: (type: string) => void
}

export function IntegrityProctor({ isActive, onViolation }: IntegrityProctorProps) {
  useEffect(() => {
    if (!isActive) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation('Tab switched or minimized')
      }
    }

    const handleBlur = () => {
      onViolation('Window lost focus')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isActive, onViolation])

  return null
}
