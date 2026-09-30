'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const CodeEditor = dynamic(() => import('./ui/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-700 p-6 animate-pulse">
      <div className="h-8 bg-gray-800 rounded-lg w-1/3 mb-4" />
      <div className="flex-1 bg-gray-900/60 rounded-lg min-h-[300px]" />
    </div>
  ),
})

export default CodeEditor
export * from './ui/CodeEditor'
