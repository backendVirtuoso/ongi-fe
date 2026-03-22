import { quoteApi } from '@/lib/api'
import QuoteCard from '@/components/QuoteCard'
import SubscribeForm from '@/components/SubscribeForm'
import type { Quote } from '@/types'

async function getTodayQuote(): Promise<Quote | null> {
  try {
    const res = await quoteApi.getToday()
    return res.data
  } catch {
    return null
  }
}

export default async function Home() {
  const quote = await getTodayQuote()

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center space-y-4 pt-8">
        <p className="text-sm font-medium text-orange-400 tracking-widest uppercase">
          Daily Warmth
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight">
          하루 두 번,<br />따뜻한 말 한마디
        </h1>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          위로·격려·응원 문장을 매일 아침 8시, 저녁 9시에 이메일로 전달해드려요.
        </p>
      </section>

      {/* 오늘의 문장 */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-4 text-center">
          오늘의 문장
        </h2>
        {quote ? (
          <QuoteCard quote={quote} featured />
        ) : (
          <div className="rounded-2xl bg-white border border-stone-100 p-12 text-center text-stone-400">
            <p className="text-4xl mb-3">🌤</p>
            <p>오늘의 문장을 불러오는 중이에요...</p>
            <p className="text-sm mt-1">백엔드 서버가 실행 중인지 확인해주세요.</p>
          </div>
        )}
      </section>

      {/* 구독 폼 */}
      <section className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">이메일 구독 신청</h2>
          <p className="text-stone-500">매일 아침·저녁, 따뜻한 문장을 받아보세요.</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <SubscribeForm />
        </div>
      </section>
    </div>
  )
}
