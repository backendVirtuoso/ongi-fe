'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { isLoggedIn, email, logout } = useAuth()
  const pathname = usePathname()
  const skipReturnTo = ['/login', '/auth/callback']
  const loginHref = skipReturnTo.includes(pathname)
    ? '/login'
    : `/login?returnTo=${encodeURIComponent(pathname)}`

  return (
    <header className="border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-orange-400 tracking-tight">
          🌤 온기
        </Link>
        <nav className="flex items-center gap-6 text-sm text-stone-500">
          <Link href="/gallery" className="hover:text-stone-900 transition-colors">
            문장 모아보기
          </Link>
          <Link href="/ai-quote" className="hover:text-stone-900 transition-colors">
            AI 문장
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/saved" className="hover:text-stone-900 transition-colors">
                저장한 문장
              </Link>
              <Link href="/mypage" className="hover:text-stone-900 transition-colors">
                마이페이지
              </Link>
              <button
                onClick={logout}
                className="text-stone-400 hover:text-stone-600 transition-colors text-xs"
                title={email ?? ''}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/unsubscribe" className="hover:text-stone-900 transition-colors">
                구독 설정
              </Link>
              <Link
                href={loginHref}
                className="px-4 py-1.5 rounded-full bg-orange-400 text-white text-xs font-semibold hover:bg-orange-500 transition-colors"
              >
                로그인
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
