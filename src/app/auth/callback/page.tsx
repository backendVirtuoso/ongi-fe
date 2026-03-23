'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { authStorage } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { Suspense } from 'react'

function AuthCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('유효하지 않은 링크입니다.')
      return
    }

    authApi
      .verifyMagicLink(token)
      .then((res) => {
        const { accessToken, subscriberId, email } = res.data
        login(accessToken, subscriberId, email)
        const returnTo = authStorage.getReturnTo() ?? '/mypage'
        authStorage.clearReturnTo()
        setStatus('success')
        setMessage('로그인되었습니다.')
        setTimeout(() => router.replace(returnTo), 800)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err?.response?.data?.message ?? '링크가 만료되었거나 이미 사용된 링크입니다.'
        )
      })
  }, [token])

  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-6">
      {status === 'loading' && (
        <>
          <p className="text-5xl">🌤</p>
          <p className="text-stone-500">로그인 처리 중...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <p className="text-5xl">✨</p>
          <h1 className="text-2xl font-bold text-stone-800">로그인 완료!</h1>
          <p className="text-stone-500">{message}</p>
          <p className="text-stone-400 text-sm">이전 페이지로 이동합니다...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="text-5xl">😔</p>
          <h1 className="text-2xl font-bold text-stone-800">로그인 실패</h1>
          <p className="text-stone-500">{message}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold hover:bg-stone-300 transition-colors"
          >
            홈으로 가기
          </button>
        </>
      )}
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  )
}
