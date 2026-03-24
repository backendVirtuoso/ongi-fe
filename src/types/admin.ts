export interface AdminStats {
  totalSubscribers: number
  activeSubscribers: number
  pendingVerification: number
  unsubscribed: number
  dailyGrowth: { date: string; count: number }[]
  sendStats: {
    last7Days: Record<string, number>
    byType: Record<string, Record<string, number>>
  }
}

export interface AdminSubscriber {
  subscriberId: number
  email: string
  name: string | null
  status: string
  subscribedAt: string
  verifiedAt: string | null
}

export interface AdminSendHistory {
  historyId: number
  email: string
  quoteContent: string
  sendType: string
  sendStatus: string
  sentAt: string
  errorMessage: string | null
}
