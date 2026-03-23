'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import type { Quote } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { quoteApi } from '@/lib/api'
import {
  HeartIcon,
  HeartFilledIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
} from '@/components/icons'

// bundle-dynamic-imports: 모달은 조건부로만 렌더링되므로 지연 로딩
const MagicLinkModal = dynamic(() => import('@/components/MagicLinkModal'))

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

  // rerender-memo: useCallback으로 안정적인 핸들러 참조 유지
  const handleLike = useCallback(async () => {
    if (!isLoggedIn) { setShowModal(true); return }
    if (loading) return
    setLoading('like')
    try {
      const res = await quoteApi.toggleLike(quote.quoteId)
      setQuote((q) => ({ ...q, isLiked: res.data.isLiked, likeCount: res.data.likeCount }))
    } finally {
      setLoading(null)
    }
  }, [isLoggedIn, loading, quote.quoteId])

  const handleSave = useCallback(async () => {
    if (!isLoggedIn) { setShowModal(true); return }
    if (loading) return
    setLoading('save')
    try {
      const res = await quoteApi.toggleSave(quote.quoteId)
      setQuote((q) => ({ ...q, isSaved: res.data.isSaved }))
    } finally {
      setLoading(null)
    }
  }, [isLoggedIn, loading, quote.quoteId])

  return (
    <>
      <div
        className={`
          rounded-2xl bg-white border border-stone-100 shadow-sm
          hover:shadow-md transition-shadow duration-200
          ${featured ? 'p-8 md:p-12' : 'p-6'}
        `}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`
              inline-block text-xs font-semibold px-3 py-1 rounded-full
              ${CATEGORY_COLORS[quote.category]}
            `}
          >
            {CATEGORY_LABELS[quote.category]}
          </span>
          {quote.sourceType === 'AI' && (
            <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-600">
              AI
            </span>
          )}
        </div>

        <p
          className={`
            text-stone-700 leading-relaxed font-medium
            ${featured ? 'text-xl md:text-2xl' : 'text-base'}
          `}
        >
          {quote.content}
        </p>

        {showActions && (
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-stone-100">
            <button
              onClick={handleLike}
              disabled={loading === 'like'}
              className={`flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50 ${
                quote.isLiked ? 'text-rose-500 hover:text-rose-600' : 'text-stone-400 hover:text-rose-400'
              }`}
              aria-label={quote.isLiked ? '좋아요 취소' : '좋아요'}
            >
              {quote.isLiked
                ? <HeartFilledIcon className="w-4 h-4" />
                : <HeartIcon className="w-4 h-4" />
              }
              <span>{quote.likeCount}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading === 'save'}
              className={`flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50 ${
                quote.isSaved ? 'text-orange-500 hover:text-orange-600' : 'text-stone-400 hover:text-orange-400'
              }`}
              aria-label={quote.isSaved ? '저장 취소' : '저장하기'}
            >
              {quote.isSaved
                ? <BookmarkFilledIcon className="w-4 h-4" />
                : <BookmarkIcon className="w-4 h-4" />
              }
              <span>{quote.isSaved ? '저장됨' : '저장'}</span>
            </button>
          </div>
        )}
      </div>

      {showModal && <MagicLinkModal onClose={() => setShowModal(false)} returnTo={pathname} />}
    </>
  )
}
