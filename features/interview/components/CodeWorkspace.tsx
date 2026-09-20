import React from 'react'
import CodeEditor from '@/components/CodeEditor'

export interface CodeWorkspaceProps {
  code: string
  onChange: (value: string | undefined) => void
  onRunCode: () => void
  isRunning: boolean
  language?: string
}

export function CodeWorkspace({
  code,
  onChange,
  onRunCode,
  isRunning,
  language = 'javascript'
}: CodeWorkspaceProps) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
      <div className="rounded-xl overflow-hidden border border-slate-800 min-h-[360px]">
        <CodeEditor
          initialCode={code}
          onChange={onChange}
          language={language}
          onSubmit={onRunCode}
          isSubmitting={isRunning}
        />
      </div>
    </div>
  )
}
