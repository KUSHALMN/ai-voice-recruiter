import { SkeletonDashboard } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <SkeletonDashboard />
    </div>
  )
}
