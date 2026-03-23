import { memo } from 'react'
import type { Quote } from '@/types'
import QuoteCard from './QuoteCard'
import SkeletonCard from './SkeletonCard'
import { LeafIcon } from './icons'

interface GalleryGridProps {
  quotes: Quote[]
  loading?: boolean
  skeletonCount?: number
}

// rerender-memo: props가 바뀌지 않으면 리렌더 스킵
function GalleryGrid({ quotes, loading = false, skeletonCount = 6 }: GalleryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <LeafIcon className="w-10 h-10 mx-auto mb-3 text-stone-300" />
        <p>아직 문장이 없어요.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map((quote) => (
        <QuoteCard key={quote.quoteId} quote={quote} showActions />
      ))}
    </div>
  )
}

export default memo(GalleryGrid)
