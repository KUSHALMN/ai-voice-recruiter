import { SkeletonTable, Skeleton } from '@/components/ui/Skeleton'

export default function InterviewsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  )
}
