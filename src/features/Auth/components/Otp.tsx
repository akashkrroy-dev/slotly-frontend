import { useRef } from "react"
import { Link } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import ButtonPrimary from "../../../components/ui/Button.Primary"
import { openPopupAnimation } from "../../../animations/openPopup.animation"
import { useDragToClose } from "../../../animations/dragToClose.animation"
import useOtp, { OTP_LENGTH } from "../hook/useOtp.hook"

type OtpProps = {
  email: string
  onSubmit: (otp: string) => void
  onResend?: () => void
  onClose: () => void
  loading?: boolean
  error?: string
}

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

const Otp = ({
  email,
  onSubmit,
  onResend,
  onClose,
  loading = false,
  error = "",
}: OtpProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const {
    digits,
    value,
    isComplete,
    secondsLeft,
    setInputRef,
    onValueChange,
    onKeyDown,
    onPaste,
    onResendClick,
  } = useOtp({ onResend })

  useGSAP(() => {
    openPopupAnimation(sheetRef.current)
  }, { scope: rootRef })

  const dragHandlers = useDragToClose({ sheetRef, onClose })

  return (
    <div ref={rootRef} className="absolute inset-0 z-40">
      {/* sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Enter verification code"
        {...dragHandlers}
        className="
          absolute inset-x-0 bottom-0 z-10 flex w-full touch-none flex-col items-center gap-5
          rounded-t-2xl bg-surface px-6 pb-6 pt-5 font-sans select-none
          shadow-[0_-8px_30px_rgba(15,23,42,0.12)]
        "
      >
        {/* drag handle */}
        <span className="h-1 w-10 rounded-full bg-line-strong" />

        {/* header */}
        <div className="flex w-full flex-col items-center gap-1 text-center">
          <h2 className="font-display text-xl font-semibold leading-tight text-ink">
            Enter verification code
          </h2>
          <p className="text-[13px] leading-snug text-ink-secondary">
            If this email is new to us, we sent a code to{" "}
            <span className="font-medium text-ink">{email}</span>. If you already
            have an account, sign in instead.
          </p>
        </div>

        {/* inputs */}
        <div className="flex items-center justify-center gap-2.5">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={setInputRef(index)}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              disabled={loading}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
              onChange={(e) => onValueChange(e, index)}
              onKeyDown={(e) => onKeyDown(e, index)}
              onPaste={onPaste}
              onFocus={(e) => e.target.select()}
              className={`
                h-12 w-10 rounded-[10px] border bg-subtle text-center
                text-lg font-semibold text-ink
                transition-all duration-150
                focus:outline-none focus:ring-4
                disabled:cursor-not-allowed disabled:text-ink-disabled
                ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger-bg"
                    : "border-line focus:border-line-focus focus:ring-accent-100"
                }
              `}
            />
          ))}
        </div>

        {/* error */}
        <div className="-mt-3 flex min-h-4 items-center justify-center">
          {error && <p className="text-xs font-medium text-danger">{error}</p>}
        </div>

        {/* submit */}
        <div className="w-full">
          <ButtonPrimary
            type="button"
            onClick={() => onSubmit(value)}
            disabled={!isComplete}
            loading={loading}
            loadingText="Verifying..."
          >
            Submit
          </ButtonPrimary>
        </div>

        {/* resend */}
        <div className="-mt-3 flex items-center justify-center">
          {secondsLeft > 0 ? (
            <p className="text-[13px] text-ink-secondary">
              Resend code in{" "}
              <span className="font-medium text-ink">{formatTime(secondsLeft)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={onResendClick}
              disabled={loading}
              className="
                text-[13px] font-medium text-ink-secondary underline underline-offset-2
                transition-colors duration-150 hover:text-ink
                focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-100
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              Resend code
            </button>
          )}
        </div>

        {/* escape hatch */}
        <div className="-mt-2 flex items-center justify-center">
          <Link
            to="/login"
            className="
              text-[13px] font-medium text-ink underline underline-offset-2
              transition-colors duration-150 hover:text-ink-secondary
              focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-100
            "
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Otp