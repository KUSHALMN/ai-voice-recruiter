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
    <div className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      {/* Search - Hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews, candidates..."
            className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pl-10 w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Mobile: Show app name */}
      <div className="md:hidden flex-1">
        <span className="text-base font-semibold text-gray-900">AIRA</span>
        <p className="text-[10px] text-gray-400 leading-none">AI Recruitment Assistant</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications - Hidden on small mobile */}
        <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-900">{session?.user?.name}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
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
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(TopBar)