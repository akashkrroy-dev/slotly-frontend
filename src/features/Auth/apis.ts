import api, { clearAccessToken, setAccessToken } from "../../config/api"
import type { ApiResponse } from "../../config/api"

const send = async <T>(request: Promise<{ data: ApiResponse<T> }>) => {
  const res = await request
  return res.data
}

const sendSession = async <T extends string>(
  request: Promise<{ data: ApiResponse<T> }>
) => {
  const res = await request
  if (res.data.data) setAccessToken(res.data.data)
  return res
}

export type RegisterPayload = {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type VerifyOtpPayload = {
  email: string
  otp: string
}

/* "v" = account verification (sign-up), "p" = password reset */
export type ResendOtpPayload = {
  email: string
  type?: "v" | "p"
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  email: string
  otp: string
  password: string
}

export type GoogleAuthPayload = {
  idToken: string
}

/* AUTH APIS */

export const registerAccount = (body: RegisterPayload) => send<unknown>(api.post("/auth/register", body))
export const verifyOtp = (body: VerifyOtpPayload) => sendSession<string>(api.post("/auth/verify-otp", body))
export const resendOtp = (body: ResendOtpPayload) => send<null>(api.post("/auth/resend-otp", body))
export const login = (body: LoginPayload) => sendSession<string>(api.post("/auth/login", body))
export const googleLogin = (body: GoogleAuthPayload) => sendSession<string>(api.post("/auth/google", body))
export const forgotPassword = (body: ForgotPasswordPayload) => send<null>(api.post("/auth/password/forgot", body))
export const resetPassword = (body: ResetPasswordPayload) => send<null>(api.post("/auth/password/reset", body))

export const logout = async () => {
  try {
    return await send<null>(api.post("/auth/logout"))
  } finally {
    clearAccessToken()
  }
}

export const logoutAllDevices = async () => {
  try {
    return await send<null>(api.post("/auth/logout-all"))
  } finally {
    clearAccessToken()
  }
}
