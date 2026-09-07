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
  Loader2,
  Zap,
  PlusCircle,
  Shield
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
        { name: 'Command Center', href: '/admin', icon: Zap },
        { name: 'Template Engine', href: '/admin/templates', icon: FileText },
        { name: 'Global Reports', href: '/admin/reports', icon: BarChart3 },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Create Interview', href: '/dashboard/create-interview', icon: PlusCircle },
        { name: 'Interviews', href: '/dashboard/interviews', icon: Users },
        { name: 'Job Templates', href: '/dashboard/templates', icon: FileText },
        { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
      ]

  const settingsHref = isAdminPath ? '/admin/settings' : '/dashboard/settings'
  const settingsLabel = isAdminPath ? 'System Governance' : 'Settings'
  const SettingsIcon = isAdminPath ? Shield : Settings

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
    <aside className={`w-60 sm:w-64 lg:w-60 h-screen flex flex-col justify-between p-4 overflow-y-auto scrollbar-hide select-none transition-colors duration-200 ${
      isAdminPath
        ? 'bg-white/70 backdrop-blur-xl border-r border-indigo-100/80 shadow-[4px_0_24px_rgba(99,102,241,0.04)] text-slate-800'
        : 'bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-900'
    }`}>
      {/* Header */}
      <div>
        {isAdminPath ? (
          /* Admin Brand Header - Minimal Frosted Glass */
          <div className="mb-6 sm:mb-8 px-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  AIRA ADMIN
                </span>
                <p className="text-[10px] text-slate-500 font-medium leading-none">Executive Console</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-[9px] font-bold text-indigo-700 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              SUPERADMIN CONSOLE
            </div>
          </div>
        ) : (
          /* Recruiter Brand Header */
          <div className="mb-6 sm:mb-8 px-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-blue-800/40">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">AIRA TALENT</span>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-none">Recruiter Workspace</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 text-[9px] font-bold text-blue-700 dark:text-blue-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              RECRUITER WORKSPACE
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1.5" aria-label="Sidebar Navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (isAdminPath) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-75 cursor-pointer active:scale-[0.97] ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-900 active:bg-indigo-100/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            }

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
        <div className={`mt-6 pt-6 ${isAdminPath ? 'border-t border-indigo-950/60' : 'border-t border-slate-200 dark:border-neutral-900'}`}>
          <Link
            href={settingsHref}
            prefetch={true}
            onMouseEnter={() => router.prefetch(settingsHref)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-75 cursor-pointer active:scale-[0.97] ${
              isAdminPath
                ? pathname === settingsHref
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-900/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                : pathname === settingsHref
                  ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-100 dark:bg-blue-600/15 dark:text-blue-400 dark:border dark:border-blue-500/25 dark:shadow-none'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-900/80 dark:hover:text-white'
            }`}
          >
            <SettingsIcon className={`w-5 h-5 shrink-0 ${
              isAdminPath
                ? pathname === settingsHref ? 'text-white' : 'text-slate-400'
                : pathname === settingsHref ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-neutral-500'
            }`} />
            <span>{settingsLabel}</span>
          </Link>
        </div>
      </div>

      {/* Footer / Portal Switcher, User Profile & Signout */}
      <div className="space-y-3">
        {/* 1-Click Portal Switcher Button */}
        {isAdminPath ? (
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/80 hover:bg-indigo-50/80 border border-slate-200/80 text-xs text-indigo-700 hover:text-indigo-900 transition-all shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 group-hover:rotate-12 transition-transform" />
              <span className="font-semibold">Recruiter Workspace</span>
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 transition-colors">Switch &rarr;</span>
          </Link>
        ) : (
          <Link
            href="/admin"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Admin Console</span>
            </span>
            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        )}

        {/* User Card */}
        <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
          isAdminPath
            ? 'bg-indigo-50/60 border-indigo-100/80 text-slate-800 shadow-sm'
            : 'bg-slate-50 dark:bg-neutral-950 border-slate-200/80 dark:border-neutral-900'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
            isAdminPath ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-blue-600'
          }`}>
            <span className="text-white text-xs font-bold">
              {session?.user?.name?.charAt(0)?.toUpperCase() || (isAdminPath ? 'A' : 'U')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${isAdminPath ? 'text-slate-800' : 'text-slate-900 dark:text-white'}`}>
              {session?.user?.name || (isAdminPath ? 'Administrator' : 'Recruiter')}
            </p>
            <p className={`text-[11px] truncate ${isAdminPath ? 'text-slate-500' : 'text-slate-500 dark:text-neutral-400'}`}>
              {session?.user?.email || (isAdminPath ? 'admin@company.com' : 'recruiter@company.com')}
            </p>
          </div>
        </div>

        {/* Sign Out */}
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
          className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-75 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdminPath
              ? 'text-slate-500 hover:text-red-600 hover:bg-red-50/80'
              : 'text-slate-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
          }`}
        >
          {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}

export default memo(Sidebar)