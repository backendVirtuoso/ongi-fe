'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { subscriberApi } from '@/lib/api'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('유효하지 않은 인증 링크입니다.')
      return
    }

    subscriberApi
      .verify(token)
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err?.response?.data?.message ?? '인증에 실패했습니다. 링크가 만료되었을 수 있어요.'
        )
      })
  }, [token])

  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-6">
      {status === 'loading' && (
        <>
          <p className="text-5xl">🌤</p>
          <p className="text-stone-500">인증 처리 중...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <p className="text-5xl">🎉</p>
          <h1 className="text-2xl font-bold text-stone-800">인증 완료!</h1>
          <p className="text-stone-500">{message}</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors"
          >
            홈으로 가기
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <p className="text-5xl">😔</p>
          <h1 className="text-2xl font-bold text-stone-800">인증 실패</h1>
          <p className="text-stone-500">{message}</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold hover:bg-stone-300 transition-colors"
          >
            홈으로 가기
          </Link>
        </>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
