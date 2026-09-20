import { ButtonHTMLAttributes, ReactNode, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface OptimizedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'danger'
}

export function OptimizedButton({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  className = '',
  onClick,
  disabled,
  ...props
}: OptimizedButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isProcessing || isLoading || disabled) return

    setIsProcessing(true)
    
    try {
      await onClick?.(e)
    } finally {
      setIsProcessing(false)
    }
  }

  const loading = isLoading || isProcessing

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`
        px-6 py-3 rounded-xl font-medium
        flex items-center justify-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {loading ? loadingText : children}
    </button>
  )
}
