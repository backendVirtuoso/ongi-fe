'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { quoteApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import QuoteCard from '@/components/QuoteCard'
import type { Quote } from '@/types'

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
      <div className="text-center py-20 text-stone-400">불러오는 중...</div>
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
          <p className="text-4xl mb-4">📄</p>
          <p>아직 저장한 문장이 없어요.</p>
          <button
            onClick={() => router.push('/gallery')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
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
