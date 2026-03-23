'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Quote } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import MagicLinkModal from '@/components/MagicLinkModal'
import { quoteApi } from '@/lib/api'

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
  showActions?: boolean
}

export default function QuoteCard({ quote: initialQuote, featured = false, showActions = false }: QuoteCardProps) {
  const { isLoggedIn } = useAuth()
  const pathname = usePathname()
  const [quote, setQuote] = useState(initialQuote)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState<'like' | 'save' | null>(null)

  async function handleLike() {
    if (!isLoggedIn) { setShowModal(true); return }
    if (loading) return
    setLoading('like')
    try {
      const res = await quoteApi.toggleLike(quote.quoteId)
      setQuote((q) => ({ ...q, isLiked: res.data.isLiked, likeCount: res.data.likeCount }))
    } finally {
      setLoading(null)
    }
  }

  async function handleSave() {
    if (!isLoggedIn) { setShowModal(true); return }
    if (loading) return
    setLoading('save')
    try {
      const res = await quoteApi.toggleSave(quote.quoteId)
      setQuote((q) => ({ ...q, isSaved: res.data.isSaved }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
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

        {quote.sourceType === 'AI' && (
          <span className="ml-2 inline-block text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-600 mb-4">
            AI
          </span>
        )}

        <p
          className={`
            text-stone-700 leading-relaxed font-medium
            ${featured ? 'text-xl md:text-2xl' : 'text-base'}
          `}
        >
          {quote.content}
        </p>

        {showActions && (
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-stone-50">
            <button
              onClick={handleLike}
              disabled={loading === 'like'}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                quote.isLiked ? 'text-rose-500' : 'text-stone-400 hover:text-rose-400'
              }`}
            >
              <span>{quote.isLiked ? '❤️' : '🤍'}</span>
              <span>{quote.likeCount}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading === 'save'}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                quote.isSaved ? 'text-orange-500' : 'text-stone-400 hover:text-orange-400'
              }`}
            >
              <span>{quote.isSaved ? '🔖' : '📄'}</span>
              <span>{quote.isSaved ? '저장됨' : '저장'}</span>
            </button>
          </div>
        )}
      </div>

      {showModal && <MagicLinkModal onClose={() => setShowModal(false)} returnTo={pathname} />}
    </>
  )
}
