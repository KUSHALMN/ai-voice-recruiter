import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <p className="text-gray-600 font-medium animate-pulse">Loading admin data...</p>
      </div>
    </div>
  )
}
