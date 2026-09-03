'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { memo, useState, useEffect } from 'react'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Loader2
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isAdminPath = pathname.startsWith('/admin') || (session?.user?.email?.includes('admin') && !pathname.startsWith('/dashboard'))

  const navigation = isAdminPath
    ? [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Templates', href: '/admin/templates', icon: FileText },
        { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Templates', href: '/dashboard/templates', icon: FileText },
        { name: 'Interviews', href: '/dashboard/interviews', icon: Users },
        { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
      ]

  const settingsHref = isAdminPath ? '/admin/settings' : '/dashboard/settings'

  // Preload all sidebar routes immediately on mount for zero-latency instant transitions
  useEffect(() => {
    navigation.forEach(item => {
      try {
        router.prefetch(item.href)
      } catch {}
    })
    try {
      router.prefetch(settingsHref)
    } catch {}
  }, [router, settingsHref])

  return (
    <aside className="w-60 sm:w-64 lg:w-60 bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-900 h-screen flex flex-col justify-between p-4 overflow-y-auto scrollbar-hide select-none transition-colors duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-6 sm:mb-8 px-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-blue-800/40">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">AIRA</span>
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-none">AI Recruitment Assistant</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5" aria-label="Sidebar Navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => router.prefetch(item.href)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-75 cursor-pointer active:scale-[0.97] ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-100 dark:bg-blue-600/15 dark:text-blue-400 dark:border dark:border-blue-500/25 dark:shadow-none'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-900/80 dark:hover:text-white active:bg-slate-200 dark:active:bg-neutral-800'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-neutral-500'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-neutral-900 mt-6 pt-6">
          <Link
            href={settingsHref}
            prefetch={true}
            onMouseEnter={() => router.prefetch(settingsHref)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-75 cursor-pointer active:scale-[0.97] ${
              pathname === settingsHref
                ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-100 dark:bg-blue-600/15 dark:text-blue-400 dark:border dark:border-blue-500/25 dark:shadow-none'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-900/80 dark:hover:text-white active:bg-slate-200 dark:active:bg-neutral-800'
            }`}
          >
            <Settings className={`w-5 h-5 shrink-0 ${pathname === settingsHref ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-neutral-500'}`} />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Footer / User Profile & Signout */}
      <div>
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-900 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            if (isLoggingOut) return
            setIsLoggingOut(true)
            try {
              await supabase.auth.signOut()
              await signOut({ callbackUrl: '/login', redirect: true })
            } catch (error) {
              console.error('Signout error:', error)
              setIsLoggingOut(false)
            }
          }}
          disabled={isLoggingOut}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-75 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}

export default memo(Sidebar)