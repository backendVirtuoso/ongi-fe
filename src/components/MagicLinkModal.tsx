'use client'

import { useState } from 'react'
import { authApi } from '@/lib/api'
import { authStorage } from '@/lib/auth'

interface Props {
  onClose(): void
  returnTo?: string
}

export default function MagicLinkModal({ onClose, returnTo }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        {status !== 'sent' ? (
          <>
            <h2 className="text-lg font-bold text-stone-800 mb-2">로그인하기</h2>
            <p className="text-sm text-stone-500 mb-6">
              이메일로 로그인 링크를 보내드립니다. 구독 시 사용한 이메일을 입력해주세요.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {status === 'error' && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 py-3 rounded-xl bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition-colors disabled:opacity-60"
                >
                  {status === 'loading' ? '발송 중...' : '링크 받기'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-3xl">📬</p>
            <h2 className="text-lg font-bold text-stone-800">이메일을 확인해주세요</h2>
            <p className="text-sm text-stone-500">
              <strong>{email}</strong>로 로그인 링크를 발송했습니다.<br />
              링크는 15분간 유효합니다.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
