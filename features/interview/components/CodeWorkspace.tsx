import React from 'react'
import { Code2, Play, CheckCircle2, Loader2 } from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'

export interface CodeWorkspaceProps {
  code: string
  onChange: (value: string) => void
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
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Technical Sandbox
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono text-slate-400 uppercase">
            {language}
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 min-h-[300px]">
          <CodeEditor
            code={code}
            onChange={onChange}
            language={language}
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-slate-800/80 mt-4">
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-primary-600/20"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing Tests...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run & Submit Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
