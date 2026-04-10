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
  withCredentials: true, // Refresh Token 쿠키 자동 전송
})

// JWT를 요청 헤더에 자동으로 첨부
api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Silent Refresh: 401 응답 시 Refresh Token으로 Access Token 갱신 후 재시도
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const is401 = error.response?.status === 401
    const isRefreshUrl = originalRequest?.url?.includes('/auth/refresh')
    const isRetry = originalRequest?._retry

    if (!is401 || isRefreshUrl || isRetry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const res = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
      const newToken = res.data.data.accessToken
      authStorage.saveToken(newToken)
      processQueue(null, newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      authStorage.clear()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

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

  refresh: () =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh').then((r) => r.data),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),
}

