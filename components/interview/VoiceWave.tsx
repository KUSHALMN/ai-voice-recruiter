'use client'

interface VoiceWaveProps {
  isAISpeaking: boolean
  isCandidateSpeaking: boolean
}

export default function VoiceWave({ isAISpeaking, isCandidateSpeaking }: VoiceWaveProps) {
  const active = isAISpeaking || isCandidateSpeaking
  
  let colorClass = 'bg-slate-300'
  if (isAISpeaking) {
    colorClass = 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
  } else if (isCandidateSpeaking) {
    colorClass = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
  }

  const bars = [
    { delay: '0.1s' },
    { delay: '0.3s' },
    { delay: '0.5s' },
    { delay: '0.2s' },
    { delay: '0.4s' },
    { delay: '0.6s' }
  ]

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/40">
      <div className="flex items-center justify-center gap-1.5 h-12 w-32">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`w-1.5 rounded-full transition-all duration-300 ${colorClass}`}
            style={{
              height: active ? '100%' : '6px',
              animation: active ? 'waveBounce 1.2s ease-in-out infinite' : 'none',
              animationDelay: active ? bar.delay : '0s',
              transformOrigin: 'center'
            }}
          />
        ))}
      </div>
      
      {/* Label Indicator */}
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
        {isAISpeaking 
          ? 'AI Speaking' 
          : isCandidateSpeaking 
            ? 'ASR Listening...' 
            : 'Waiting for response'}
      </span>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes waveBounce {
          0%, 100% {
            transform: scaleY(0.15);
          }
          50% {
            transform: scaleY(1.0);
          }
        }
      `}} />
    </div>
  )
}
