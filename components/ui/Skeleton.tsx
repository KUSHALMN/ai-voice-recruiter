import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/90 dark:bg-neutral-800/80 ${className}`}
      {...props}
    />
  )
}

/**
 * Skeleton for Dashboard Overview (KPIs, Charts, and Recent Interviews)
 */
export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl hidden sm:block" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Chart & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4">
          <Skeleton className="h-5 w-36 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
                <div className="space-y-1.5 flex-1 pr-3">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for Candidate Interview Room
 */
export function SkeletonInterviewRoom() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-neutral-950 p-4 sm:p-6 flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Voice & Question Stage */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="h-64 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm p-6 flex flex-col items-center justify-center gap-4">
            <Skeleton className="h-28 w-28 rounded-full" />
            <Skeleton className="h-4 w-44 rounded" />
          </div>
          <div className="flex-1 min-h-[260px] rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm p-6 space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="pt-4 flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor / Workspace */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm p-5 flex flex-col gap-4 min-h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-28 rounded-xl" />
          </div>
          <div className="flex-1 space-y-3 p-4 bg-slate-50 dark:bg-neutral-950 rounded-2xl">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
            <Skeleton className="h-4 w-60 rounded" />
            <Skeleton className="h-4 w-80 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for Report Scorecards
 */
export function SkeletonReport() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 p-4 sm:p-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <div className="h-40 flex items-center justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full rounded" />
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <Skeleton className="h-6 w-40 rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for Tables (e.g. Interviews list, Reports list, Candidate profiles)
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Table Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-neutral-800 flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-neutral-800/80">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full hidden sm:block" />
            <Skeleton className="h-4 w-20 rounded hidden md:block" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
