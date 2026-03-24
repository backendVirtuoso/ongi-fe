'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SunIcon, MenuIcon, XIcon } from '@/components/icons'

const NAV_LINKS = [
  { href: '/gallery', label: '문장 모아보기' },
  { href: '/ai', label: 'AI 문장' },
]

const AUTH_NAV_LINKS = [
  { href: '/saved', label: '저장한 문장' },
  { href: '/mypage', label: '마이페이지' },
]

export default function Header() {
  const { isLoggedIn, isAdmin, email, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const showLoggedIn = mounted && isLoggedIn

  const skipReturnTo = ['/login', '/auth/callback']
  const loginHref = skipReturnTo.includes(pathname)
    ? '/login'
    : `/login?returnTo=${encodeURIComponent(pathname)}`

  const isActive = (href: string) => pathname === href

  const navLinkClass = (href: string) =>
    `transition-colors duration-150 cursor-pointer ${
      isActive(href)
        ? 'text-stone-900 font-semibold'
        : 'text-stone-500 hover:text-stone-900'
    }`

  return (
    <header className="border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 text-orange-400 hover:text-orange-500 transition-colors cursor-pointer">
          <SunIcon className="w-5 h-5" />
          <span className="text-lg font-bold tracking-tight">토닥토닥</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClass(href)}>
              {label}
            </Link>
          ))}
          {showLoggedIn ? (
            <>
              {AUTH_NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className={navLinkClass(href)}>
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" className={navLinkClass('/admin')}>
                  어드민
                </Link>
              )}
              <button
                onClick={logout}
                className="text-stone-400 hover:text-stone-600 transition-colors text-xs cursor-pointer"
                title={email ?? ''}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/subscribe" className={navLinkClass('/subscribe')}>
                구독 설정
              </Link>
              <Link
                href={loginHref}
                className="px-4 py-1.5 rounded-full bg-orange-400 text-white text-xs font-semibold hover:bg-orange-500 transition-colors cursor-pointer"
              >
                로그인
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer rounded-lg hover:bg-stone-50"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {menuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-6 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                isActive(href)
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {label}
            </Link>
          ))}
          {showLoggedIn ? (
            <>
              {AUTH_NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive(href)
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive('/admin')
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  어드민
                </Link>
              )}
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/subscribe"
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive('/subscribe')
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                구독 설정
              </Link>
              <Link
                href={loginHref}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-center bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors cursor-pointer mt-2"
              >
                로그인
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
