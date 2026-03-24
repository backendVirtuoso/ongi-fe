import axios from 'axios'
import { authStorage } from '@/lib/auth'
import type {
  AIQuoteRequest,
  AIQuoteResponse,
  ApiResponse,
  Category,
  InteractionResponse,
  PageResponse,
  Quote,
  SubscribeRequest,
  SubscribeResponse,
  SubscriberMe,
  TokenResponse,
} from '@/types'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

// JWT를 요청 헤더에 자동으로 첨부
api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const quoteApi = {
  getToday: () =>
    api.get<ApiResponse<Quote>>('/quotes/today').then((r) => r.data),

  getByCategory: (category: Category, page = 0, size = 12) =>
    api
      .get<ApiResponse<PageResponse<Quote>>>(`/quotes?category=${category}&page=${page}&size=${size}`)
      .then((r) => r.data),

  toggleLike: (quoteId: number) =>
    api.post<ApiResponse<InteractionResponse>>(`/quotes/${quoteId}/like`).then((r) => r.data),

  toggleSave: (quoteId: number) =>
    api.post<ApiResponse<InteractionResponse>>(`/quotes/${quoteId}/save`).then((r) => r.data),

  getSaved: () =>
    api.get<ApiResponse<Quote[]>>('/quotes/saved').then((r) => r.data),

  generateAI: (data: AIQuoteRequest) =>
    api.post<ApiResponse<AIQuoteResponse>>('/quotes/ai-generate', data).then((r) => r.data),
}

export const subscriberApi = {
  subscribe: (data: SubscribeRequest) =>
    api.post<ApiResponse<SubscribeResponse>>('/subscribers', data).then((r) => r.data),

  verify: (token: string) =>
    api.get<ApiResponse<SubscribeResponse>>(`/subscribers/verify?token=${token}`).then((r) => r.data),

  unsubscribe: (email: string) =>
    api.delete<ApiResponse<null>>(`/subscribers/${email}`).then((r) => r.data),

  getMe: () =>
    api.get<ApiResponse<SubscriberMe>>('/subscribers/me').then((r) => r.data),

  updatePreferences: (preferredCategories: Category[]) =>
    api
      .patch<ApiResponse<SubscriberMe>>('/subscribers/me/preferences', { preferredCategories })
      .then((r) => r.data),
}

export const authApi = {
  sendMagicLink: (email: string) =>
    api.post<ApiResponse<null>>('/auth/magic-link', { email }).then((r) => r.data),

  verifyMagicLink: (token: string) =>
    api.get<ApiResponse<TokenResponse>>(`/auth/magic-link/verify?token=${token}`).then((r) => r.data),
}

