'use client'

import { Search, Bell, User, Loader2 } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, memo, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

function TopBar() {
  const { data: session } = useSession()
  const [showProfile, setShowProfile] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-14 sm:h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-900 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
      {/* Search - Hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search interviews, candidates..."
            className="bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl px-3 py-2 pl-10 w-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Mobile: Show app name */}
      <div className="md:hidden flex-1">
        <span className="text-base font-semibold text-gray-900 dark:text-white">AIRA</span>
        <p className="text-[10px] text-gray-400 dark:text-neutral-500 leading-none">AI Recruitment Assistant</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications - Hidden on small mobile */}
        <button className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">{session?.user?.name}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50">
              <button
                onClick={async () => {
                  if (isLoggingOut) return
                  setIsLoggingOut(true)
                  setShowProfile(false)
                  try {
                    await supabase.auth.signOut()
                    await signOut({ callbackUrl: '/login' })
                  } catch (error) {
                    console.error('Signout error:', error)
                    setIsLoggingOut(false)
                  }
                }}
                disabled={isLoggingOut}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default memo(TopBar)