'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { memo, useState } from 'react'
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

  return (
    <div className="w-60 sm:w-64 lg:w-60 bg-white border-r border-[#E5E7EB] h-screen flex flex-col justify-between p-4 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
          <div>
            <span className="text-base sm:text-lg font-semibold text-[#111827] tracking-tight">AIRA</span>
            <p className="text-[10px] text-[#6B7280] leading-none">AI Recruitment Assistant</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-[#E0E7FF] text-[#2563EB] font-semibold'
                  : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#2563EB]'
                  }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB] mt-6 pt-6">
          <Link href={isAdminPath ? "/admin/settings" : "/dashboard/settings"}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === (isAdminPath ? '/admin/settings' : '/dashboard/settings')
              ? 'bg-[#E0E7FF] text-[#2563EB] font-semibold'
              : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#2563EB]'
              }`}>
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] mb-3">
          <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#111827] truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-[#6B7280] truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
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
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}

export default memo(Sidebar)