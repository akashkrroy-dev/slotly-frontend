import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { getErrorMessage } from "../../../config/api"
import { registerAccount, resendOtp, verifyOtp } from "../apis"
import { validateForm } from "../../../utils/validate"
import { emailSchema, passwordSchema } from "../validation/auth.schema"

const nameRule = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} must be at least 2 letters`)
    .max(30, `${label} must be at most 30 letters`)
    .regex(/^[A-Za-z]+$/, `${label} can only contain letters`)

const registerSchema = z.object({
  firstName: nameRule("First name"),
  lastName: nameRule("Last name"),
  email: emailSchema,
  password: passwordSchema,
})

type RegisterForm = z.infer<typeof registerSchema>

const useRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submiting, setSubmiting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otpError, setOtpError] = useState("")

  function validate() {
    const result = validateForm(registerSchema, form)
    if (!result.success) {
      setErrors(result.errors)
      toast.error(result.firstMessage)
      return null
    }
    setErrors({})
    return result.data
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev))
  }

  async function onSubmit() {
    const data = validate()
    if (!data) return

    try {
      setSubmiting(true)
      await registerAccount(data)
      toast.success("Check your inbox — if this email is new, a code is on its way")
      setShowOtpBox(true)
    } catch (error) {
      toast.error(getErrorMessage(error, "Register failed. Please try again."))
    } finally {
      setSubmiting(false)
    }
  }

  async function onOtpSubmit(otp: string) {
    if (verifying) return

    try {
      setVerifying(true)
      setOtpError("")
      await verifyOtp({ email: form.email.trim(), otp })
      toast.success("Account verified")
      setShowOtpBox(false)
      navigate("/dashboard/workspace", { replace: true })
    } catch (error) {
      setOtpError(getErrorMessage(error, "Invalid or expired code"))
    } finally {
      setVerifying(false)
    }
  }

  async function onResendOtp() {
    try {
      setOtpError("")
      await resendOtp({ email: form.email.trim() })
      toast.success("If the account exists, we've sent a fresh code")
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not resend the code"))
    }
  }

  function onBackToForm() {
    setOtpError("")
    setShowOtpBox(false)
  }

  return {
    form,
    errors,
    submiting,
    verifying,
    showOtpBox,
    otpError,
    onChange,
    onSubmit,
    onOtpSubmit,
    onResendOtp,
    onBackToForm,
  }
}

export default useRegister