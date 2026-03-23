'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { quoteApi } from '@/lib/api'
import type { AIQuoteResponse, Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import MagicLinkModal from '@/components/MagicLinkModal'

const CATEGORIES: Category[] = ['COMFORT', 'CHEER', 'ENCOURAGE', 'SUPPORT']

const CATEGORY_COLORS: Record<Category, string> = {
  COMFORT: 'border-rose-300 bg-rose-50 text-rose-600',
  CHEER: 'border-amber-300 bg-amber-50 text-amber-600',
  ENCOURAGE: 'border-emerald-300 bg-emerald-50 text-emerald-600',
  SUPPORT: 'border-violet-300 bg-violet-50 text-violet-600',
  CELEBRATE: 'border-yellow-300 bg-yellow-50 text-yellow-600',
  LOVE: 'border-pink-300 bg-pink-50 text-pink-600',
}

export default function AIQuotePage() {
  const { isLoggedIn } = useAuth()
  const pathname = usePathname()
  const [situation, setSituation] = useState('')
  const [category, setCategory] = useState<Category>('COMFORT')
  const [result, setResult] = useState<AIQuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!situation.trim()) return
    if (!isLoggedIn) {
      setShowModal(true)
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await quoteApi.generateAI({ situation, category })
      setResult(res.data)
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'AI 문장 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.quote)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">AI 맞춤 문장</h1>
          <p className="text-stone-500 mt-1">
            지금 상황을 알려주세요. Claude AI가 따뜻한 문장을 만들어 드립니다.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              지금 어떤 상황인가요?
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              maxLength={300}
              rows={4}
              placeholder="예: 오늘 면접에서 떨어졌어요. 많이 속상하고 자신감이 없어졌어요."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <p className="text-xs text-stone-400 text-right mt-1">{situation.length}/300</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    category === cat
                      ? CATEGORY_COLORS[cat]
                      : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !situation.trim()}
            className="w-full py-3.5 rounded-xl bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors disabled:opacity-60"
          >
            {loading ? '문장 생성 중...' : '✨ 문장 생성하기'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        {result && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${CATEGORY_COLORS[result.category]}`}>
                {CATEGORY_LABELS[result.category]}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-600">
                AI
              </span>
            </div>

            <p className="text-stone-700 text-lg leading-relaxed font-medium">
              {result.quote}
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-stone-50">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
              >
                <span>{copied ? '✅' : '📋'}</span>
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
              {!isLoggedIn && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-orange-500 transition-colors"
                >
                  <span>🔖</span>
                  <span>저장하기</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && <MagicLinkModal onClose={() => setShowModal(false)} returnTo={pathname} />}
    </>
  )
}
