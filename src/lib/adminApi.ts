import axios from 'axios'
import { authStorage } from '@/lib/auth'
import type { AdminSendHistory, AdminStats, AdminSubscriber } from '@/types/admin'
import type { ApiResponse, PageResponse } from '@/types'

const adminApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// JWT를 요청 헤더에 자동으로 첨부 (api.ts와 동일한 패턴)
adminApi.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const adminApiClient = {
  getStats: () =>
    adminApi.get<ApiResponse<AdminStats>>('/stats').then((r) => r.data.data),

  getSubscribers: (page = 0, size = 20) =>
    adminApi
      .get<ApiResponse<PageResponse<AdminSubscriber>>>(`/subscribers?page=${page}&size=${size}`)
      .then((r) => r.data.data),

  getSendHistory: (page = 0, size = 50) =>
    adminApi
      .get<ApiResponse<PageResponse<AdminSendHistory>>>(`/send-history?page=${page}&size=${size}`)
      .then((r) => r.data.data),
}
