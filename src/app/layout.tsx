import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Link from 'next/link'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '토닥토닥',
  description: '하루 두 번, 따뜻한 말 한마디. 위로·격려·응원 문장을 이메일로 받아보세요.',
  openGraph: {
    title: '토닥토닥',
    description: '하루 두 번, 따뜻한 말 한마디',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-stone-50 text-stone-900 min-h-screen`}>
        <Providers>
          <Header />
          <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
          <footer className="border-t border-stone-100 mt-20">
            <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-stone-400">
              © 2026 토닥토닥 · 하루 두 번, 따뜻한 말 한마디
              <br /><br />
              <Link href="https://forms.gle/qBFE5oEABh1NQAqeA" className="hover:underline">
                서비스 문의하기
              </Link>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
