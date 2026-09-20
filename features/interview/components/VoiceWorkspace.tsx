import React from 'react'
import { Mic, Send, Loader2, Zap } from 'lucide-react'
import VoiceWave from '@/components/interview/VoiceWave'

export interface VoiceWorkspaceProps {
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  transcript: string
  onToggleListening: () => void
  onSubmitAnswer: () => void
  isWebRTCActive?: boolean
}

export function VoiceWorkspace({
  isListening,
  isSpeaking,
  isProcessing,
  transcript,
  onToggleListening,
  onSubmitAnswer,
  isWebRTCActive = true
}: VoiceWorkspaceProps) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between min-h-[320px]">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Speech & Audio Stream
            </span>
            {isWebRTCActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-2.5 h-2.5 fill-current" />
                WebRTC Full-Duplex (&lt;50ms)
              </span>
            )}
          </div>
          <VoiceWave isAISpeaking={isSpeaking} isCandidateSpeaking={isListening} />
        </div>

        {/* Live speech transcription */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 min-h-[140px] max-h-[220px] overflow-y-auto">
          {transcript ? (
            <p className="text-sm text-slate-200 leading-relaxed font-normal">{transcript}</p>
          ) : (
            <p className="text-xs text-slate-500 italic">
              {isListening
                ? 'Listening... Speak clearly into your microphone. Native interruption is active.'
                : 'Click the microphone button below to start your answer.'}
            </p>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80 mt-4">
        <button
          onClick={onToggleListening}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25 animate-pulse'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/25'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{isListening ? 'Stop Speaking' : 'Answer with Voice'}</span>
        </button>

        <button
          onClick={onSubmitAnswer}
          disabled={isProcessing || !transcript.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <span>Submit Answer</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
