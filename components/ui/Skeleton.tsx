// components/ui/Skeleton.tsx — Loading skeleton shapes

import { cn } from '@/lib/utils';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cn('skeleton rounded', className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#1E2433] rounded-xl p-4 border border-[#2A3348] space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-[#2A3348]/50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
      ))}
    </tr>
  );
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-36" />
      {rows > 2 && <Skeleton className="h-3 w-20" />}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2.5 w-16" />
      </div>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 rounded-full w-14" />
    </div>
  );
}
