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

      <GalleryGrid quotes={quotes} loading={loading} />

      {!loading && totalPages > 1 && (() => {
        const PAGE_WINDOW = 10
        const half = Math.floor(PAGE_WINDOW / 2)
        const startPage = Math.max(0, Math.min(page - half, totalPages - PAGE_WINDOW))
        const endPage = Math.min(totalPages - 1, startPage + PAGE_WINDOW - 1)
        return (
          <div className="flex justify-center items-center gap-2 pt-4">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="이전 페이지"
            >
              ‹
            </button>
            {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
              const pageIndex = startPage + i
              return (
                <button
                  key={pageIndex}
                  onClick={() => setPage(pageIndex)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    page === pageIndex
                      ? 'bg-orange-400 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {pageIndex + 1}
                </button>
              )
            })}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="다음 페이지"
            >
              ›
            </button>
          </div>
        )
      })()}
    </div>
  )
}
