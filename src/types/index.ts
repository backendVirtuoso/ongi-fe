export type Category = 'COMFORT' | 'CHEER' | 'ENCOURAGE' | 'SUPPORT' | 'CELEBRATE' | 'LOVE'

export const CATEGORY_LABELS: Record<Category, string> = {
  COMFORT: '위로',
  CHEER: '응원',
  ENCOURAGE: '격려',
  SUPPORT: '지지',
  CELEBRATE: '축하',
  LOVE: '사랑',
}

export interface Quote {
  quoteId: number
  content: string
  category: Category
  sourceType: 'MANUAL' | 'AI'
  likeCount: number
  createdAt: string
}

export interface SubscribeRequest {
  email: string
  name?: string
  preferredCategories?: Category[]
}

export interface SubscribeResponse {
  subscriberId: number
  email: string
  status: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
