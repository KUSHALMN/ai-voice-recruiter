import { SkeletonDashboard } from '@/components/ui/Skeleton'

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-neutral-950 p-6 sm:p-10 max-w-7xl mx-auto">
      <SkeletonDashboard />
    </div>
  )
}
