'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { authStorage } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { MailIcon } from '@/components/icons'

function LoginContent() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? undefined
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (isLoggedIn) {
    router.replace('/mypage')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMessage('')
    try {
      if (returnTo) authStorage.saveReturnTo(returnTo)
      await authApi.sendMagicLink(email)
      setStatus('sent')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '이메일 발송에 실패했습니다.'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-sm mx-auto py-20">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 space-y-6">
        {status !== 'sent' ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">로그인</h1>
              <p className="text-sm text-stone-500 mt-2">
                구독 시 사용한 이메일로 로그인 링크를 받으세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
              />
              {status === 'error' && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {status === 'loading' ? '발송 중...' : '로그인 링크 받기'}
              </button>
            </form>

            <p className="text-xs text-stone-400 text-center">
              아직 구독 전이라면?{' '}
              <Link href="/unsubscribe" className="text-orange-400 hover:underline cursor-pointer">
                구독 신청하기
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
              <MailIcon className="w-7 h-7 text-orange-400" />
            </div>
            <h2 className="text-lg font-bold text-stone-800">이메일을 확인해주세요</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              <strong className="text-stone-700">{email}</strong>로<br />
              로그인 링크를 발송했습니다.<br />
              링크는 15분간 유효합니다.
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail('') }}
              className="w-full py-3 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
            >
              다른 이메일로 다시 받기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
