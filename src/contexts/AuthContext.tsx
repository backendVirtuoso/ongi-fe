'use client'

import { createContext, useContext, useCallback, useMemo, useEffect, useState, ReactNode } from 'react'
import { authStorage } from '@/lib/auth'
import { subscriberApi } from '@/lib/api'

interface AuthState {
  isLoggedIn: boolean
  subscriberId: number | null
  email: string | null
  isAdmin: boolean | null
}

interface AuthContextValue extends AuthState {
  login(accessToken: string, subscriberId: number, email: string): void
  logout(): void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // rerender-lazy-state-init: localStorage를 초기값으로 읽어 불필요한 리렌더 방지
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window === 'undefined') {
      return { isLoggedIn: false, subscriberId: null, email: null, isAdmin: null }
    }
    // js-cache-storage: localStorage를 한 번만 읽어 캐싱
    if (!authStorage.isLoggedIn()) {
      return { isLoggedIn: false, subscriberId: null, email: null, isAdmin: null }
    }
    return {
      isLoggedIn: true,
      subscriberId: authStorage.getSubscriberId(),
      email: authStorage.getEmail(),
      isAdmin: null,
    }
  })

  // 하이드레이션 후 서버/클라이언트 상태 동기화
  useEffect(() => {
    if (authStorage.isLoggedIn() && !state.isLoggedIn) {
      setState({
        isLoggedIn: true,
        subscriberId: authStorage.getSubscriberId(),
        email: authStorage.getEmail(),
        isAdmin: null,
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 로그인 상태가 되면 /subscribers/me를 호출해 isAdmin 세팅
  useEffect(() => {
    if (!state.isLoggedIn || state.isAdmin !== null) return
    subscriberApi.getMe()
      .then((res) => setState((prev) => ({ ...prev, isAdmin: res.data.isAdmin })))
      .catch(() => {
        authStorage.clear()
        setState({ isLoggedIn: false, subscriberId: null, email: null, isAdmin: null })
      })
  }, [state.isLoggedIn]) // eslint-disable-line react-hooks/exhaustive-deps

  // 다른 탭에서 로그인/로그아웃 시 상태 동기화
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'ongi_access_token') {
        if (e.newValue) {
          setState({
            isLoggedIn: true,
            subscriberId: authStorage.getSubscriberId(),
            email: authStorage.getEmail(),
            isAdmin: null,
          })
        } else {
          setState({ isLoggedIn: false, subscriberId: null, email: null, isAdmin: null })
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // rerender-memo: useCallback으로 안정적인 함수 참조 유지
  const login = useCallback((accessToken: string, subscriberId: number, email: string) => {
    authStorage.save(accessToken, subscriberId, email)
    setState({ isLoggedIn: true, subscriberId, email, isAdmin: null })
  }, [])

  const logout = useCallback(() => {
    authStorage.clear()
    setState({ isLoggedIn: false, subscriberId: null, email: null, isAdmin: null })
  }, [])

  // rerender-memo: 컨텍스트 값을 메모이제이션해 불필요한 하위 컴포넌트 리렌더 방지
  const value = useMemo(
    () => ({ ...state, login, logout }),
    [state, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
