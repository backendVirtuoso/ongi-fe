'use client'

import { useState } from 'react'
import { subscriberApi } from '@/lib/api'
import { useSubscribe } from '@/hooks/useSubscribe'
import Link from 'next/link'
import type { Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { SunIcon, CheckIcon, MailIcon } from '@/components/icons'

type Tab = 'subscribe' | 'unsubscribe'
type UnsubStatus = 'idle' | 'loading' | 'success' | 'error'

const CATEGORIES: Category[] = ['COMFORT', 'CHEER', 'ENCOURAGE', 'SUPPORT', 'CELEBRATE', 'LOVE']

function SubscribeTab() {
  const { subscribe, status, message } = useSubscribe()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([])

  const toggleCategory = (cat: Category) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-8 text-center space-y-3">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <SunIcon className="w-7 h-7 text-orange-400" />
        </div>
        <p className="text-stone-700 font-medium">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); subscribe({ email, name, preferredCategories }) }} className="space-y-4">
      <input
        type="email"
        required
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white transition-shadow"
      />
      <input
        type="text"
        placeholder="이름 (선택)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white transition-shadow"
      />
      <div>
        <p className="text-sm text-stone-500 mb-2">선호 카테고리 (선택)</p>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer ${
                preferredCategories.includes(cat)
                  ? 'bg-orange-400 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>
      {status === 'error' && <p className="text-sm text-red-500">{message}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {status === 'loading' ? '신청 중...' : '하루 두 번 온기 받기'}
      </button>
    </form>
  )
}

function UnsubscribeTab() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<UnsubStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await subscriberApi.unsubscribe(email)
      setStatus('success')
      setMessage('구독이 해지되었습니다. 그동안 온기를 함께해주셔서 감사합니다.')
    } catch (err: unknown) {
      setStatus('error')
      setMessage(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '구독 해지 중 오류가 발생했습니다.'
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
          <MailIcon className="w-7 h-7 text-stone-400" />
        </div>
        <p className="font-semibold text-stone-800">구독 해지 완료</p>
        <p className="text-stone-500 text-sm leading-relaxed">{message}</p>
        <Link
          href="/"
          className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
        >
          홈으로 가기
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        required
        placeholder="구독 이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white transition-shadow"
      />
      {status === 'error' && <p className="text-sm text-red-500">{message}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl bg-stone-700 hover:bg-stone-800 text-white font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '처리 중...' : '구독 해지하기'}
      </button>
    </form>
  )
}

export default function SubscriptionPage() {
  const [tab, setTab] = useState<Tab>('subscribe')

  return (
    <div className="max-w-md mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">구독 설정</h1>
        <p className="text-stone-500">온기 이메일 구독을 신청하거나 해지합니다.</p>
      </div>

      {/* 탭 */}
      <div className="flex bg-stone-100 rounded-xl p-1">
        <button
          onClick={() => setTab('subscribe')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer ${
            tab === 'subscribe'
              ? 'bg-white text-stone-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          구독 신청
        </button>
        <button
          onClick={() => setTab('unsubscribe')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer ${
            tab === 'unsubscribe'
              ? 'bg-white text-stone-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          구독 해지
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
        {tab === 'subscribe' ? <SubscribeTab /> : <UnsubscribeTab />}
      </div>
    </div>
  )
}
