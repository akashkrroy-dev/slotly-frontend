import axios from "axios"
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "")
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!BASE_URL) throw new Error("VITE_API_URL is not set")
if (!GOOGLE_CLIENT_ID) throw new Error("VITE_GOOGLE_CLIENT_ID is not set")

const LOGIN_PATH = "/login"
const REFRESH_PATH = "/auth/refresh"
const AUTH_CHANGE_EVENT = "auth:change"

export type ApiResponse<T> = {
  statusCode: number
  success: boolean
  message: string
  data: T | null
}

type QueuedRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const REFRESH_CONFLICT_LIMIT = 1
const REFRESH_CONFLICT_DELAY_MS = 250

let accessToken: string | null = null
let refreshConflicts = 0

const notifyAuthChange = () => {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGE_EVENT, { detail: { token: accessToken } })
  )
}

export const getAccessToken = () => accessToken

export const setAccessToken = (token: string | null) => {
  accessToken = token
  notifyAuthChange()
}

export const clearAccessToken = () => setAccessToken(null)

export const subscribeToAuthChanges = (callback: (token: string | null) => void) => {
  if (typeof window === "undefined") return () => {}

  const handleChange = () => callback(accessToken)
  window.addEventListener(AUTH_CHANGE_EVENT, handleChange)

  return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleChange)
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: QueuedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token as string)
  })
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const isRefreshCall = Boolean(originalRequest.url?.includes(REFRESH_PATH))

    /* Two tabs refresh with the same cookie at once. The loser gets 409 and no
       cookie, while the winner's Set-Cookie already replaced it, so one retry
       succeeds. A 403 means real token theft and is never retried. */
    if (error.response?.status === 409 && isRefreshCall) {
      if (refreshConflicts >= REFRESH_CONFLICT_LIMIT) {
        return Promise.reject(error)
      }

      refreshConflicts += 1
      await new Promise((resolve) => setTimeout(resolve, REFRESH_CONFLICT_DELAY_MS))

      try {
        const { data } = await api.post<ApiResponse<string>>(REFRESH_PATH)
        const rotated = data.data
        if (!rotated) return Promise.reject(error)

        refreshConflicts = 0
        setAccessToken(rotated)
        return api(originalRequest)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    const isTokenFault = error.response?.status === 401

    if (
      !isTokenFault ||
      originalRequest._retry ||
      isRefreshCall
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await api.post<ApiResponse<string>>(REFRESH_PATH)
      const newToken = data.data

      if (!newToken) throw error

      refreshConflicts = 0
      setAccessToken(newToken)
      processQueue(null, newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      clearAccessToken()

      if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PATH) {
        window.location.assign(LOGIN_PATH)
      }

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

/* ERRORS
   errorHandler always sends { success, message, error }, so `message` is the one
   string safe to show a user. Validation failures arrive as "Validation Failed"
   with a zod flatten() blob under `error` — not display-ready, so those are left
   to the caller's own client-side schema. */
export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback
  }
  return fallback
}

export default api
