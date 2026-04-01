// app/dashboard/loading.tsx — Dashboard-specific loading skeleton

export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4 space-y-3">
            <div className="h-3 bg-[#252D3D] rounded w-24" />
            <div className="h-6 bg-[#252D3D] rounded w-32" />
            <div className="h-3 bg-[#252D3D] rounded w-20" />
          </div>
        ))}
      </div>

      {/* Chart + panel skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#1E2433] border border-[#2A3348] rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <div className="space-y-2">
              <div className="h-7 bg-[#252D3D] rounded w-40" />
              <div className="h-3 bg-[#252D3D] rounded w-28" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#252D3D] rounded-lg w-16" />
              ))}
            </div>
          </div>
          <div className="h-64 bg-[#252D3D] rounded-lg" />
        </div>
        <div className="space-y-4">
          <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl p-4 space-y-3">
            <div className="h-4 bg-[#252D3D] rounded w-28" />
            <div className="h-10 bg-[#252D3D] rounded-xl" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-[#252D3D] rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Market table skeleton */}
      <div className="bg-[#1E2433] border border-[#2A3348] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A3348]">
          <div className="h-4 bg-[#252D3D] rounded w-28" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[#2A3348]/50">
            <div className="w-8 h-8 bg-[#252D3D] rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-[#252D3D] rounded w-24" />
              <div className="h-2.5 bg-[#252D3D] rounded w-16" />
            </div>
            <div className="h-3 bg-[#252D3D] rounded w-20" />
            <div className="h-5 bg-[#252D3D] rounded-full w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
