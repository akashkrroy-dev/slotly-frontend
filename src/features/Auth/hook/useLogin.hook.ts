import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { getErrorMessage } from "../../../config/api"
import { login } from "../apis"
import { validateForm } from "../../../utils/validate"

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Email is too long")
    .email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

const useLogin = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const result = validateForm(loginSchema, form)
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
      setLoading(true)
      await login(data)
      toast.success("Welcome back!")
      navigate("/member/workspace", { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, onChange, onSubmit }
}

export default useLogin