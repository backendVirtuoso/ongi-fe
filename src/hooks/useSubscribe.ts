'use client'

import { useState } from 'react'
import { subscriberApi } from '@/lib/api'
import type { Category, SubscribeRequest } from '@/types'

interface SubscribeForm {
  email: string
  name: string
  preferredCategories: Category[]
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useSubscribe() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const subscribe = async (form: SubscribeForm) => {
    setStatus('loading')
    try {
      const payload: SubscribeRequest = {
        email: form.email,
        name: form.name || undefined,
        preferredCategories: form.preferredCategories.length > 0 ? form.preferredCategories : undefined,
      }
      const res = await subscriberApi.subscribe(payload)
      setMessage(res.data.message)
      setStatus('success')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '구독 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      setMessage(msg)
      setStatus('error')
    }
  }

  return { subscribe, status, message }
}
