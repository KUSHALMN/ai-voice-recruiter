import { useState, useCallback } from 'react'

/**
 * Custom hook to copy text to clipboard with timeout feedback
 */
export function useClipboard(timeout = 2000) {
  const [hasCopied, setHasCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported')
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), timeout)
        return true
      } catch (error) {
        console.warn('Copy failed', error)
        setHasCopied(false)
        return false
      }
    },
    [timeout]
  )

  return { copy, hasCopied }
}
