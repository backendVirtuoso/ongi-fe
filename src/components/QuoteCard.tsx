import type { Quote } from '@/types'
import { CATEGORY_LABELS } from '@/types'

const CATEGORY_COLORS = {
  COMFORT: 'bg-rose-100 text-rose-600',
  CHEER: 'bg-amber-100 text-amber-600',
  ENCOURAGE: 'bg-emerald-100 text-emerald-600',
  SUPPORT: 'bg-violet-100 text-violet-600',
  CELEBRATE: 'bg-yellow-100 text-yellow-600',
  LOVE: 'bg-pink-100 text-pink-600',
} as const

interface QuoteCardProps {
  quote: Quote
  featured?: boolean
}

export default function QuoteCard({ quote, featured = false }: QuoteCardProps) {
  return (
    <div
      className={`
        rounded-2xl bg-white border border-stone-100 shadow-sm
        hover:shadow-md transition-shadow duration-200
        ${featured ? 'p-8 md:p-12' : 'p-6'}
      `}
    >
      <span
        className={`
          inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4
          ${CATEGORY_COLORS[quote.category]}
        `}
      >
        {CATEGORY_LABELS[quote.category]}
      </span>

      <p
        className={`
          text-stone-700 leading-relaxed font-medium
          ${featured ? 'text-xl md:text-2xl' : 'text-base'}
        `}
      >
        {quote.content}
      </p>
    </div>
  )
}
