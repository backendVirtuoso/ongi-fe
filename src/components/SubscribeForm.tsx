'use client'

import { useState } from 'react'
import { useSubscribe } from '@/hooks/useSubscribe'
import type { Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'

const CATEGORIES: Category[] = ['COMFORT', 'CHEER', 'ENCOURAGE', 'SUPPORT']

export default function SubscribeForm() {
  const { subscribe, status, message } = useSubscribe()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([])

  const toggleCategory = (cat: Category) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await subscribe({ email, name, preferredCategories })
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-8 text-center">
        <p className="text-2xl mb-2">🌤</p>
        <p className="text-stone-700 font-medium">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          required
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="이름 (선택)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
      </div>

      <div>
        <p className="text-sm text-stone-500 mb-2">선호 카테고리 (선택)</p>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  preferredCategories.includes(cat)
                    ? 'bg-orange-400 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }
              `}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-semibold text-base transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? '신청 중...' : '하루 두 번 온기 받기'}
      </button>
    </form>
  )
}
