'use client'

import { useState } from 'react'
import { subscriberApi } from '@/lib/api'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await subscriberApi.unsubscribe(email)
      setStatus('success')
      setMessage('구독이 해지되었습니다. 그동안 온기를 함께해주셔서 감사합니다.')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '구독 해지 중 오류가 발생했습니다.'
      setStatus('error')
      setMessage(msg)
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <p className="text-5xl">🍂</p>
        <h1 className="text-2xl font-bold text-stone-800">구독 해지 완료</h1>
        <p className="text-stone-500">{message}</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold hover:bg-stone-300 transition-colors"
        >
          홈으로 가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">구독 해지</h1>
        <p className="text-stone-500">이메일 주소를 입력하면 구독을 해지합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 space-y-4">
        <input
          type="email"
          required
          placeholder="구독 이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
        />

        {status === 'error' && (
          <p className="text-sm text-red-500">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 rounded-xl bg-stone-700 hover:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? '처리 중...' : '구독 해지하기'}
        </button>
      </form>
    </div>
  )
}
