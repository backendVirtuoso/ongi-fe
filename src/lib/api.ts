import axios from 'axios'
import type { ApiResponse, Category, PageResponse, Quote, SubscribeRequest, SubscribeResponse } from '@/types'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

export const quoteApi = {
  getToday: () =>
    api.get<ApiResponse<Quote>>('/quotes/today').then((r) => r.data),

  getByCategory: (category: Category, page = 0, size = 12) =>
    api
      .get<ApiResponse<PageResponse<Quote>>>(`/quotes?category=${category}&page=${page}&size=${size}`)
      .then((r) => r.data),
}

export const subscriberApi = {
  subscribe: (data: SubscribeRequest) =>
    api.post<ApiResponse<SubscribeResponse>>('/subscribers', data).then((r) => r.data),

  verify: (token: string) =>
    api.get<ApiResponse<SubscribeResponse>>(`/subscribers/verify?token=${token}`).then((r) => r.data),

  unsubscribe: (email: string) =>
    api.delete<ApiResponse<null>>(`/subscribers/${email}`).then((r) => r.data),
}
