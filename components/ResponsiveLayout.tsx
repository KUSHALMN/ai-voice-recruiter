'use client'

import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Menu, X } from 'lucide-react'

interface ResponsiveLayoutProps {
  children: ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-black overflow-hidden transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, always visible on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:z-auto
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopBar with mobile menu toggle */}
        <div className="relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-600 dark:text-neutral-300" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-neutral-300" />}
          </button>
          <TopBar />
        </div>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
