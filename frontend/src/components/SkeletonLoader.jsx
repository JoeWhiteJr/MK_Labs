/**
 * Reusable skeleton loading primitives.
 * Uses Tailwind animate-pulse for shimmer effect.
 * MKL brand: light gray on white, no dark mode.
 */

export function SkeletonText({ width = 'w-full', className = '' }) {
  return (
    <div className={`h-4 bg-gray-200 rounded ${width} animate-pulse ${className}`} />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse ${className}`}>
      <div className="h-32 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonTableRow({ cols = 4, className = '' }) {
  return (
    <div className={`flex items-center gap-4 p-4 border-b border-gray-100 animate-pulse ${className}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded ${i === 0 ? 'w-1/4' : i === cols - 1 ? 'w-16' : 'flex-1'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 animate-pulse">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={`h-3 bg-gray-200 rounded ${i === 0 ? 'w-1/4' : 'flex-1'}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </div>
  )
}

export function SkeletonStatCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 animate-pulse ${className}`}>
      <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
      <div className="h-8 bg-gray-100 rounded w-16" />
    </div>
  )
}

export function SkeletonListItem({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 p-3 animate-pulse ${className}`}>
      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}
