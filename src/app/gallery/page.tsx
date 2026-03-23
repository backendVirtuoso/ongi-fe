'use client'

import { useState, useEffect, useCallback } from 'react'
import { quoteApi } from '@/lib/api'
import GalleryGrid from '@/components/GalleryGrid'
import CategoryFilter from '@/components/CategoryFilter'
import type { Category, Quote } from '@/types'

export default function GalleryPage() {
  const [category, setCategory] = useState<Category>('COMFORT')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [category])

  // async-api-routes: useCallback으로 안정적인 fetch 함수 참조 유지
  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await quoteApi.getByCategory(category, page)
      setQuotes(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [category, page])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">문장 모아보기</h1>
        <p className="text-stone-500">카테고리별로 따뜻한 문장들을 둘러보세요.</p>
      </div>

      <CategoryFilter selected={category} onChange={setCategory} />

      {loading ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-4xl mb-3">🌤</p>
          <p>불러오는 중...</p>
        </div>
      ) : (
        <GalleryGrid quotes={quotes} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                page === i
                  ? 'bg-orange-400 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
