import type { Quote } from '@/types'
import QuoteCard from './QuoteCard'

interface GalleryGridProps {
  quotes: Quote[]
}

export default function GalleryGrid({ quotes }: GalleryGridProps) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p className="text-4xl mb-3">🌱</p>
        <p>아직 문장이 없어요.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map((quote) => (
        <QuoteCard key={quote.quoteId} quote={quote} />
      ))}
    </div>
  )
}
