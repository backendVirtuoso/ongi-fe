'use client'

import { useEffect, useState } from 'react'
import { quoteApi } from '@/lib/api'
import QuoteCard from '@/components/QuoteCard'
import SkeletonCard from '@/components/SkeletonCard'
import { CloudSunIcon } from '@/components/icons'
import type { Quote } from '@/types'
import Link from 'next/link'

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchToday() {
      try {
        const res = await quoteApi.getToday()
        setQuote(res.data)
      } catch {
        setQuote(null)
      } finally {
        setLoading(false)
      }
    }
    fetchToday()
  }, [])

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-56px-6rem)]">
      {/* Hero */}
      <section className="text-center space-y-4 pt-4">
        <p className="text-sm font-semibold text-orange-400 tracking-widest uppercase">
          Daily Warmth
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight">
          하루 두 번, 따뜻한 말 한마디
        </h1>
        <p className="text-stone-500 text-lg mx-auto leading-relaxed">
          위로·격려·응원 문장을 매일 아침 7시, 저녁 7시에 이메일로 전달해드려요.
        </p>
      </section>

      {/* 오늘의 문장 */}
      <section className="max-w-2xl mx-auto w-full">
        <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-4 text-center">
          오늘의 문장
        </h2>
        {loading ? (
          <SkeletonCard featured />
        ) : quote ? (
          <QuoteCard quote={quote} featured showActions />
        ) : (
          <div className="rounded-2xl bg-white border border-stone-100 p-12 text-center">
            <CloudSunIcon className="w-12 h-12 mx-auto mb-3 text-stone-300" />
            <p className="text-stone-500 font-medium">오늘의 문장을 불러올 수 없어요.</p>
            <p className="text-sm text-stone-400 mt-1">백엔드 서버가 실행 중인지 확인해주세요.</p>
          </div>
        )}
      </section>

      {/* 구독 CTA */}
      <section className="text-center space-y-4">
        <p className="text-stone-500">매일 아침·저녁, 따뜻한 문장을 이메일로 받아보세요.</p>
        <Link
          href="/subscribe"
          className="inline-block px-8 py-3.5 rounded-xl bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors duration-150 cursor-pointer shadow-sm hover:shadow-md"
        >
          이메일 구독 신청하기
        </Link>
      </section>
    </div>
  )
}
