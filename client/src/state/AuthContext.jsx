import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/users/profile')
      .then(res => setUser(res.data))
      .catch(async (err) => {
        // Try refresh on failure
        try {
          const refreshed = await api.post('/users/refresh')
          const newToken = refreshed.data.token
          localStorage.setItem('token', newToken)
          setToken(newToken)
          const profile = await api.get('/users/profile')
          setUser(profile.data)
        } catch (_) {
          logout()
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password })
    const newToken = res.data.token
    localStorage.setItem('token', newToken)
    setToken(newToken)
    const profile = await api.get('/users/profile')
    setUser(profile.data)
  }

  const register = async (payload) => {
    const res = await api.post('/users/register', payload)
    const newToken = res.data.token
    localStorage.setItem('token', newToken)
    setToken(newToken)
    const profile = await api.get('/users/profile')
    setUser(profile.data)
  }

  const refresh = async () => {
    const res = await api.post('/users/refresh')
    const newToken = res.data.token
    localStorage.setItem('token', newToken)
    setToken(newToken)
    return newToken
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, loading, login, register, refresh, logout }), [token, user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


