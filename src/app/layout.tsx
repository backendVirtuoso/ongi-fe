import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '온기 (Ongi)',
  description: '하루 두 번, 따뜻한 말 한마디. 위로·격려·응원 문장을 이메일로 받아보세요.',
  openGraph: {
    title: '온기 (Ongi)',
    description: '하루 두 번, 따뜻한 말 한마디',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-stone-50 text-stone-900 min-h-screen`}>
        <header className="border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-orange-400 tracking-tight">
              🌤 온기
            </Link>
            <nav className="flex gap-6 text-sm text-stone-500">
              <Link href="/gallery" className="hover:text-stone-900 transition-colors">
                문장 모아보기
              </Link>
              <Link href="/unsubscribe" className="hover:text-stone-900 transition-colors">
                구독 해지
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>

        <footer className="border-t border-stone-100 mt-20">
          <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-stone-400">
            © 2025 온기 (Ongi) · 하루 두 번, 따뜻한 말 한마디
          </div>
        </footer>
      </body>
    </html>
  )
}
