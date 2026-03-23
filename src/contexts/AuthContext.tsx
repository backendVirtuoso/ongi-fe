'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    subscriberId: null,
    email: null,
  })

  useEffect(() => {
    if (authStorage.isLoggedIn()) {
      setState({
        isLoggedIn: true,
        subscriberId: authStorage.getSubscriberId(),
        email: authStorage.getEmail(),
      })
    }
  }, [])

  function login(accessToken: string, subscriberId: number, email: string) {
    authStorage.save(accessToken, subscriberId, email)
    setState({ isLoggedIn: true, subscriberId, email })
  }

  function logout() {
    authStorage.clear()
    setState({ isLoggedIn: false, subscriberId: null, email: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
