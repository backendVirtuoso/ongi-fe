export default function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white border border-stone-100 shadow-sm ${featured ? 'p-8 md:p-12' : 'p-6'}`}>
      {/* Category badge */}
      <div className="skeleton h-5 w-16 rounded-full mb-4" />
      {/* Content lines */}
      <div className="space-y-2.5">
        <div className="skeleton h-4 w-full rounded-md" />
        <div className="skeleton h-4 w-5/6 rounded-md" />
        {featured && <div className="skeleton h-4 w-4/6 rounded-md" />}
      </div>
      {/* Action bar */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-stone-100">
        <div className="skeleton h-4 w-10 rounded-md" />
        <div className="skeleton h-4 w-12 rounded-md" />
      </div>
    </div>
  )
}
