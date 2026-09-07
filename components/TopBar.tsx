'use client'

import { Search, Bell, User, Loader2 } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, memo, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

import { usePathname, useRouter } from 'next/navigation'
import BackButton from './BackButton'

function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [showProfile, setShowProfile] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdminPath = pathname.startsWith('/admin')
  const showBackButton = pathname !== '/dashboard' && pathname !== '/admin'
  const fallback = isAdminPath ? '/admin' : '/dashboard'

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
    <header className={`h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200 ${
      isAdminPath
        ? 'bg-white/70 backdrop-blur-xl text-slate-800 border-b border-indigo-100/80 shadow-sm'
        : 'bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-900'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {showBackButton && (
          <BackButton fallbackUrl={fallback} variant="subtle" className="text-xs py-1.5 px-2.5" />
        )}

        {/* Portal Distinct Badge */}
        {isAdminPath ? (
          <div className="hidden sm:flex items-center gap-2 bg-indigo-50/90 border border-indigo-200/70 px-3 py-1 rounded-xl text-xs font-bold text-indigo-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Executive Admin Console</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 px-3 py-1 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Recruiter Console</span>
          </div>
        )}

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isAdminPath ? 'text-slate-400' : 'text-gray-400 dark:text-neutral-500'
            }`} />
            <input
              type="text"
              placeholder={isAdminPath ? "Search system logs, templates, recruiters..." : "Search interviews, candidates..."}
              className={`rounded-xl px-3 py-2 pl-10 w-full text-xs sm:text-sm border focus:outline-none transition-colors ${
                isAdminPath
                  ? 'bg-white/80 border-slate-200/80 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white shadow-sm'
                  : 'bg-gray-50 dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Mobile App Title */}
        <div className="md:hidden flex-1">
          <span className={`text-base font-bold ${isAdminPath ? 'text-indigo-700' : 'text-gray-900 dark:text-white'}`}>
            {isAdminPath ? 'AIRA ADMIN' : 'AIRA'}
          </span>
          <p className="text-[10px] text-gray-500 leading-none">
            {isAdminPath ? 'Command Center' : 'Recruitment Assistant'}
          </p>
        </div>
      </div>

      {/* Right side telemetry & controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isAdminPath ? (
          /* Admin Telemetry - Minimal Glass Pills */
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-lg text-[11px] text-emerald-700 font-mono shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>API: 99.98%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-50/80 border border-indigo-200/60 px-2.5 py-1 rounded-lg text-[11px] text-indigo-700 font-mono shadow-xs">
              <span>AI Engine: Groq+Gemini</span>
            </div>
          </div>
        ) : (
          /* Recruiter Quick Action */
          <button
            onClick={() => router.push('/dashboard/create-interview')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span>+ Create Interview</span>
          </button>
        )}

        {/* Notifications */}
        <button className={`p-2 rounded-xl transition-colors ${
          isAdminPath
            ? 'hover:bg-indigo-50 text-slate-500 hover:text-indigo-700'
            : 'hover:bg-gray-100 dark:hover:bg-neutral-900 text-gray-500 dark:text-neutral-400'
        }`}>
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl transition-colors ${
              isAdminPath ? 'hover:bg-indigo-50/80' : 'hover:bg-gray-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              isAdminPath ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-blue-600'
            }`}>
              <User className="w-4 h-4 text-white" />
            </div>
            <span className={`hidden sm:block text-sm font-medium ${isAdminPath ? 'text-slate-800' : 'text-gray-900 dark:text-white'}`}>
              {session?.user?.name || (isAdminPath ? 'Admin' : 'Recruiter')}
            </span>
          </button>

          {showProfile && (
            <div className={`absolute right-0 top-12 w-52 rounded-2xl shadow-xl p-2 z-50 border ${
              isAdminPath
                ? 'bg-white/95 backdrop-blur-xl border-slate-200/80 text-slate-800'
                : 'bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white'
            }`}>
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold truncate text-slate-900">{session?.user?.name || (isAdminPath ? 'System Administrator' : 'Recruiter')}</p>
                <p className="text-[10px] text-slate-500 truncate">{session?.user?.email}</p>
                <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full mt-1 font-bold ${
                  isAdminPath ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' : 'bg-blue-50 text-blue-700'
                }`}>
                  {isAdminPath ? 'SUPERADMIN' : 'RECRUITER'}
                </span>
              </div>

              {/* Portal Switch Option in Dropdown */}
              <button
                onClick={() => {
                  setShowProfile(false)
                  router.push(isAdminPath ? '/dashboard' : '/admin')
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                  isAdminPath
                    ? 'text-indigo-600 hover:bg-indigo-50'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{isAdminPath ? 'Switch to Recruiter Portal' : 'Switch to Admin Console'}</span>
                <span>&rarr;</span>
              </button>

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
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 mt-1"
              >
                {isLoggingOut && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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