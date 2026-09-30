'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const DashboardCharts = dynamic(() => import('./ui/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      <div className="h-72 bg-slate-100 dark:bg-neutral-800 rounded-3xl p-6" />
      <div className="h-72 bg-slate-100 dark:bg-neutral-800 rounded-3xl p-6" />
    </div>
  ),
})

export default DashboardCharts
export * from './ui/DashboardCharts'
