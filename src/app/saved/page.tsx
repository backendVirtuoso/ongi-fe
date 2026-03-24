'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { quoteApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import QuoteCard from '@/components/QuoteCard'
import SkeletonCard from '@/components/SkeletonCard'
import type { Quote } from '@/types'
import { InboxIcon } from '@/components/icons'

export default function SavedPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = useCallback(async () => {
    try {
      const res = await quoteApi.getSaved()
      setQuotes(res.data)
    } catch {
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/')
      return
    }
    fetchSaved()
  }, [isLoggedIn, router, fetchSaved])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">저장한 문장</h1>
          <p className="text-stone-500 mt-1">마음에 담아둔 문장들이에요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">저장한 문장</h1>
        <p className="text-stone-500 mt-1">마음에 담아둔 문장들이에요.</p>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <InboxIcon className="w-12 h-12 mx-auto mb-4 text-stone-300" />
          <p className="font-medium text-stone-500">아직 저장한 문장이 없어요.</p>
          <p className="text-sm mt-1 mb-5">마음에 드는 문장을 저장해보세요.</p>
          <button
            onClick={() => router.push('/gallery')}
            className="px-5 py-2.5 rounded-xl bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            문장 둘러보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((q) => (
            <QuoteCard key={q.quoteId} quote={q} showActions />
          ))}
        </div>
      )}
    </div>
  )
}
