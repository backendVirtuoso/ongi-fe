'use client'

import { useState } from 'react'
import { quoteApi } from '@/lib/api'
import type { Quote } from '@/types'

export function useQuoteInteraction(initial: Quote) {
  const [quote, setQuote] = useState(initial)

  async function toggleLike() {
    const res = await quoteApi.toggleLike(quote.quoteId)
    setQuote((q) => ({
      ...q,
      isLiked: res.data.isLiked,
      likeCount: res.data.likeCount,
    }))
  }

  async function toggleSave() {
    const res = await quoteApi.toggleSave(quote.quoteId)
    setQuote((q) => ({ ...q, isSaved: res.data.isSaved }))
  }

  return { quote, toggleLike, toggleSave }
}
