import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { subscribeToAuthChanges, getAccessToken, clearAccessToken } from "../config/api"
import api from "../config/api"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  businessId?: string
  emailVerified: boolean
  phoneVerified: boolean
  provider: string
  avatarUrl?: string
}

type Business = {
  id: string
  name: string
  slug: string
  businessType: string
  phone?: string
  address?: string
} | null

type AuthContextType = {
  user: User | null
  business: Business
  loading: boolean
  refresh: () => Promise<void>
  login: (token: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await api.get<{ data: { user: User; business: Business } }>("/auth/me")
      if (res.data && res.data.data) {
        setUser(res.data.data.user)
        setBusiness(res.data.data.business)
      }
    } catch (err) {
      clearAccessToken()
      setUser(null)
      setBusiness(null)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchMe()
  }

  const login = (_token: string) => {
    // Token is already set via api interceptors
    fetchMe()
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // ignore
    } finally {
      clearAccessToken()
      setUser(null)
      setBusiness(null)
    }
  }

  useEffect(() => {
    fetchMe()

    const unsubscribe = subscribeToAuthChanges((token) => {
      if (!token) {
        setUser(null)
        setBusiness(null)
      } else {
        fetchMe()
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, business, loading, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}