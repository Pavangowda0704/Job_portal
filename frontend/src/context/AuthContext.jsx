import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/index.js'

// 1. Create the context
const AuthContext = createContext()

// 2. Create the Provider — wraps the whole app
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with backend and get fresh user data
      getMe()
        .then(({ data }) => setUser(data))
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Login — save token and user
  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user',  JSON.stringify(userData))
    setUser(userData)
  }

  // Logout — clear everything
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — easy way to use auth in any component
export function useAuth() {
  return useContext(AuthContext)
}