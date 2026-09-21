import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

export interface AntiTamperGuardProps {
  enabled?: boolean
  onTamperAttempt?: (type: string) => void
}

/**
 * AntiTamperGuard: Client-side protection against DevTools inspection,
 * question copying, right-click scraping, and shortcut manipulation during interviews.
 */
export function AntiTamperGuard({
  enabled = true,
  onTamperAttempt
}: AntiTamperGuardProps) {
  useEffect(() => {
    if (!enabled) return

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      toast.error('Right-click is disabled to protect interview integrity.', {
        id: 'anti-tamper-ctx',
        duration: 2500
      })
      onTamperAttempt?.('Right-click context menu attempt')
    }

    // 2. Block Copy & Cut on Interview Content
    const handleCopyCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      // Allow copy/cut only inside the Monaco Code Editor
      if (target && target.closest('.monaco-editor')) {
        return
      }
      e.preventDefault()
      toast.error('Copying interview questions is prohibited.', {
        id: 'anti-tamper-copy',
        duration: 2500
      })
      onTamperAttempt?.('Clipboard copy/cut attempt on question')
    }

    // 3. Intercept DevTools Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Cmd+Option+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevToolsShortcut =
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['U', 'u'].includes(e.key))

      if (isDevToolsShortcut) {
        e.preventDefault()
        e.stopPropagation()
        toast.error('⚠️ Developer tools and source inspection are prohibited during the interview.', {
          id: 'anti-tamper-devtools',
          duration: 3500
        })
        onTamperAttempt?.(`DevTools shortcut blocked: ${e.key}`)
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopyCut)
    document.addEventListener('cut', handleCopyCut)
    window.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopyCut)
      document.removeEventListener('cut', handleCopyCut)
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [enabled, onTamperAttempt])

  return null
}
