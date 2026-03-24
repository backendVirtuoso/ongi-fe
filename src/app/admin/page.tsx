'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { adminApiClient } from '@/lib/adminApi'
import type { AdminSendHistory, AdminStats, AdminSubscriber } from '@/types/admin'
import type { PageResponse } from '@/types'

// recharts는 대용량이므로 지연 로딩
const LineChart = dynamic(() => import('recharts').then((m) => m.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((m) => m.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then((m) => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false })

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PENDING_VERIFICATION: 'bg-amber-100 text-amber-700',
  UNSUBSCRIBED: 'bg-stone-100 text-stone-500',
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-600',
}

export default function AdminPage() {
  const router = useRouter()
  const { isLoggedIn, isAdmin } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [subscribers, setSubscribers] = useState<PageResponse<AdminSubscriber> | null>(null)
  const [history, setHistory] = useState<PageResponse<AdminSendHistory> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'overview' | 'subscribers' | 'history'>('overview')

  // 접근 가드: 비로그인 또는 어드민이 아닌 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAdmin === null) return // 아직 조회 중
    if (!isLoggedIn || isAdmin === false) {
      router.replace('/')
    }
  }, [isLoggedIn, isAdmin, router])

  useEffect(() => {
    async function load() {
      try {
        const [s, sub, hist] = await Promise.all([
          adminApiClient.getStats(),
          adminApiClient.getSubscribers(),
          adminApiClient.getSendHistory(),
        ])
        setStats(s)
        setSubscribers(sub)
        setHistory(hist)
      } catch (e) {
        setError('데이터를 불러오지 못했습니다. API 키를 확인하세요.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // isAdmin 조회 중이거나 권한 없는 경우 빈 화면 (리다이렉트 대기)
  if (isAdmin === null || !isAdmin) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-stone-400 text-sm">
        확인 중...
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-stone-800">어드민</h1>
        <p className="text-stone-500 text-sm">데이터 로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-stone-800">어드민</h1>
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</div>
      </div>
    )
  }

  const successCount = stats?.sendStats.last7Days['SUCCESS'] ?? 0
  const failedCount = stats?.sendStats.last7Days['FAILED'] ?? 0
  const totalSent = successCount + failedCount
  const successRate = totalSent > 0 ? ((successCount / totalSent) * 100).toFixed(1) : '—'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">어드민 대시보드</h1>
          <p className="text-stone-500 mt-1 text-sm">토닥토닥 서비스 운영 현황</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          새로고침
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {(['overview', 'subscribers', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === t ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t === 'overview' ? '개요' : t === 'subscribers' ? '구독자' : '발송 이력'}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '전체 구독자', value: stats.totalSubscribers.toLocaleString(), color: 'text-stone-800' },
              { label: '활성 구독자', value: stats.activeSubscribers.toLocaleString(), color: 'text-emerald-600' },
              { label: '인증 대기', value: stats.pendingVerification.toLocaleString(), color: 'text-amber-600' },
              { label: '7일 발송 성공률', value: `${successRate}%`, color: successRate !== '—' && parseFloat(successRate) >= 95 ? 'text-emerald-600' : 'text-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-stone-100 p-5">
                <p className="text-xs text-stone-500 font-medium">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* 일별 신규 구독자 차트 */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">일별 신규 구독자 (최근 14일)</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyGrowth} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: '#78716c' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                    formatter={(v) => [v, '신규 구독자']}
                  />
                  <Line type="monotone" dataKey="count" stroke="#fb923c" strokeWidth={2} dot={{ r: 3, fill: '#fb923c' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 발송 유형별 통계 */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">발송 통계 (최근 7일)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stats.sendStats.byType).map(([type, statusMap]) => {
                const s = statusMap['SUCCESS'] ?? 0
                const f = statusMap['FAILED'] ?? 0
                return (
                  <div key={type} className="bg-stone-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-stone-600 mb-2">{type === 'MORNING' ? '아침 발송' : '저녁 발송'}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-emerald-600 font-semibold">성공 {s.toLocaleString()}</span>
                      <span className="text-red-500 font-semibold">실패 {f.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'subscribers' && subscribers && (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-700">구독자 목록</h2>
            <span className="text-xs text-stone-400">{subscribers.totalElements.toLocaleString()}명</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-wide">
                  <th className="px-5 py-3">이메일</th>
                  <th className="px-5 py-3">이름</th>
                  <th className="px-5 py-3">상태</th>
                  <th className="px-5 py-3">구독일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {subscribers.content.map((sub) => (
                  <tr key={sub.subscriberId} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3 text-stone-700">{sub.email}</td>
                    <td className="px-5 py-3 text-stone-500">{sub.name ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] ?? 'bg-stone-100 text-stone-500'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-400 text-xs">{sub.subscribedAt.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'history' && history && (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-700">최근 발송 이력</h2>
            <span className="text-xs text-stone-400">{history.totalElements.toLocaleString()}건</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-wide">
                  <th className="px-5 py-3">이메일</th>
                  <th className="px-5 py-3">문장</th>
                  <th className="px-5 py-3">유형</th>
                  <th className="px-5 py-3">상태</th>
                  <th className="px-5 py-3">발송 시각</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {history.content.map((h) => (
                  <tr key={h.historyId} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3 text-stone-600 text-xs">{h.email}</td>
                    <td className="px-5 py-3 text-stone-500 text-xs max-w-xs truncate">{h.quoteContent}</td>
                    <td className="px-5 py-3 text-stone-400 text-xs">{h.sendType}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[h.sendStatus] ?? 'bg-stone-100 text-stone-500'}`}>
                        {h.sendStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-400 text-xs">{h.sentAt.slice(0, 16).replace('T', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
