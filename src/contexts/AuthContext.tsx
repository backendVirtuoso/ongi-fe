'use client'

import { createContext, useContext, useCallback, useMemo, useEffect, useState, ReactNode } from 'react'
import { authStorage } from '@/lib/auth'

interface AuthState {
  isLoggedIn: boolean
  subscriberId: number | null
  email: string | null
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
      return { isLoggedIn: false, subscriberId: null, email: null }
    }
    // js-cache-storage: localStorage를 한 번만 읽어 캐싱
    if (!authStorage.isLoggedIn()) {
      return { isLoggedIn: false, subscriberId: null, email: null }
    }
    return {
      isLoggedIn: true,
      subscriberId: authStorage.getSubscriberId(),
      email: authStorage.getEmail(),
    }
  })

  // 하이드레이션 후 서버/클라이언트 상태 동기화
  useEffect(() => {
    if (authStorage.isLoggedIn() && !state.isLoggedIn) {
      setState({
        isLoggedIn: true,
        subscriberId: authStorage.getSubscriberId(),
        email: authStorage.getEmail(),
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // rerender-memo: useCallback으로 안정적인 함수 참조 유지
  const login = useCallback((accessToken: string, subscriberId: number, email: string) => {
    authStorage.save(accessToken, subscriberId, email)
    setState({ isLoggedIn: true, subscriberId, email })
  }, [])

  const logout = useCallback(() => {
    authStorage.clear()
    setState({ isLoggedIn: false, subscriberId: null, email: null })
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
