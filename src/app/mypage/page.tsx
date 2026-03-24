'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { subscriberApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import type { Category, SubscriberMe } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { CheckIcon } from '@/components/icons'
import SkeletonCard from '@/components/SkeletonCard'

const ALL_CATEGORIES: Category[] = ['COMFORT', 'CHEER', 'ENCOURAGE', 'SUPPORT', 'CELEBRATE', 'LOVE']

const CATEGORY_COLORS: Record<Category, string> = {
  COMFORT: 'border-rose-300 bg-rose-50 text-rose-600',
  CHEER: 'border-amber-300 bg-amber-50 text-amber-600',
  ENCOURAGE: 'border-emerald-300 bg-emerald-50 text-emerald-600',
  SUPPORT: 'border-violet-300 bg-violet-50 text-violet-600',
  CELEBRATE: 'border-yellow-300 bg-yellow-50 text-yellow-600',
  LOVE: 'border-pink-300 bg-pink-50 text-pink-600',
}

export default function MyPage() {
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const [me, setMe] = useState<SubscriberMe | null>(null)
  const [selected, setSelected] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!isLoggedIn) { router.replace('/'); return }
    async function fetchMe() {
      const res = await subscriberApi.getMe()
      setMe(res.data)
      setSelected(res.data.preferredCategories as Category[])
    }
    fetchMe()
  }, [isLoggedIn, router])

  // rerender-memo: useCallback으로 안정적인 핸들러 참조 유지
  const toggleCategory = useCallback((cat: Category) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaveStatus('idle')
    try {
      await subscriberApi.updatePreferences(selected)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (!me) {
    return (
      <div className="max-w-lg mx-auto space-y-8">
        <div>
          <div className="skeleton h-7 w-28 rounded-lg mb-2" />
          <div className="skeleton h-4 w-48 rounded-md" />
        </div>
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">마이페이지</h1>
        <p className="text-stone-500 mt-1">{me.email}</p>
      </div>

      <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
        <h2 className="font-semibold text-stone-700">선호 카테고리</h2>
        <p className="text-sm text-stone-500">
          선택한 카테고리의 문장을 이메일로 받아보세요. 여러 개 선택 가능합니다.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? CATEGORY_COLORS[cat]
                    : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <CheckIcon className="w-4 h-4" />
              저장되었습니다.
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-sm text-red-500">저장에 실패했습니다.</span>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-3">
        <h2 className="font-semibold text-stone-700">계정</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push('/saved')}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors cursor-pointer"
          >
            저장한 문장 보기
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </section>
    </div>
  )
}
