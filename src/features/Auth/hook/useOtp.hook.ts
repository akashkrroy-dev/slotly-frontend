import { useEffect, useRef, useState } from "react"

export const OTP_LENGTH = 6
const OTP_VALID_SECONDS = 60

type UseOtpProps = {
  onResend?: () => void
}

const useOtp = ({ onResend }: UseOtpProps = {}) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [secondsLeft, setSecondsLeft] = useState(OTP_VALID_SECONDS)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el
  }

  const focusInput = (index: number) => {
    inputsRef.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus()
  }

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "")
    if (!value) return

    const next = [...digits]
    next[index] = value.slice(-1)
    setDigits(next)

    if (index < OTP_LENGTH - 1) focusInput(index + 1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const next = [...digits]
      if (digits[index]) {
        next[index] = ""
      } else if (index > 0) {
        next[index - 1] = ""
        focusInput(index - 1)
      }
      setDigits(next)
    } else if (e.key === "ArrowLeft") {
      focusInput(index - 1)
    } else if (e.key === "ArrowRight") {
      focusInput(index + 1)
    }
  }

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (!pasted) return

    const next = Array(OTP_LENGTH).fill("")
    pasted.split("").forEach((char, i) => (next[i] = char))
    setDigits(next)
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1))
  }

  const onResendClick = () => {
    setDigits(Array(OTP_LENGTH).fill(""))
    setSecondsLeft(OTP_VALID_SECONDS)
    focusInput(0)
    onResend?.()
  }

  return {
    digits,
    value: digits.join(""),
    isComplete: digits.every((d) => d !== ""),
    secondsLeft,
    setInputRef,
    onValueChange,
    onKeyDown,
    onPaste,
    onResendClick,
  }
}

export default useOtp