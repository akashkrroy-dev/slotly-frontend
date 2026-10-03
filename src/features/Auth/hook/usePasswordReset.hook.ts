import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { getErrorMessage } from "../../../config/api"
import { forgotPassword, resendOtp, resetPassword } from "../apis"
import { validateForm } from "../../../utils/validate"
import { emailSchema, passwordSchema } from "../validation/auth.schema"

const emailStepSchema = z.object({ email: emailSchema })

const passwordStepSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

/* 1 = email, 2 = otp popup, 3 = new password */
type Step = 1 | 2 | 3

const usePasswordReset = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpError, setOtpError] = useState("")
  const [submiting, setSubmiting] = useState(false)
  const [updating, setUpdating] = useState(false)

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setEmail(value)
    setErrors((prev) => (prev.email ? { ...prev, email: "" } : prev))
  }

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setPasswords((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev))
  }

  // * step 1 -> 2: request the code
  async function onSubmitEmail() {
    const result = validateForm(emailStepSchema, { email })
    if (!result.success) {
      setErrors(result.errors)
      toast.error(result.firstMessage)
      return
    }
    setErrors({})

    try {
      setSubmiting(true)
      const res = await forgotPassword({ email: result.data.email })

      if (res.message.toLowerCase().includes("google")) {
        toast.error("This account uses Google. Sign in with Google instead.")
        return
      }

      setEmail(result.data.email)
      setOtpError("")
      toast.success("We sent a code to your email")
      setStep(2)
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send the code. Please try again."))
    } finally {
      setSubmiting(false)
    }
  }

  // * step 2 -> 3: hold the code, no request needed.
  function onOtpSubmit(value: string) {
    setOtpError("")
    setOtp(value)
    setStep(3)
  }

  async function onResendOtp() {
    try {
      setOtpError("")
      await resendOtp({ email, type: "p" })
      toast.success("A new code was sent")
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not resend the code"))
    }
  }

  function onBackToEmail() {
    setOtpError("")
    setStep(1)
  }

  // * step 3: trade the code + new password for a reset
  async function onSubmitPassword() {
    const result = validateForm(passwordStepSchema, passwords)
    if (!result.success) {
      setErrors(result.errors)
      toast.error(result.firstMessage)
      return
    }
    setErrors({})

    try {
      setUpdating(true)
      await resetPassword({ email, otp, password: result.data.password })
      setPasswords({ password: "", confirmPassword: "" })
      setOtp("")
      toast.success("Password updated. Please login again.")
      navigate("/login", { replace: true })
    } catch (error) {
      const message = getErrorMessage(error, "Could not reset the password.")
      setOtpError(message)
      setStep(2)
      toast.error(message)
    } finally {
      setUpdating(false)
    }
  }

  return {
    step,
    email,
    otp,
    passwords,
    errors,
    otpError,
    submiting,
    updating,
    onEmailChange,
    onPasswordChange,
    onSubmitEmail,
    onOtpSubmit,
    onResendOtp,
    onBackToEmail,
    onSubmitPassword,
  }
}

export default usePasswordReset