import { Link } from "react-router-dom"

//* COMPONENTS
import InputPrimary from "../../../components/ui/Input.Primary"
import ButtonPrimary from "../../../components/ui/Button.Primary"
import Otp from "../components/Otp"
import usePasswordReset from "../hook/usePasswordReset.hook"
import logo from "../../../assets/images/slotly-icon-mark.svg"

const Passreset = () => {
  const {
    step,
    email,
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
  } = usePasswordReset()

  return (
    <div className="relative flex min-h-125 w-full max-w-105 flex-col overflow-hidden rounded-2xl border border-line bg-surface font-sans shadow-lg">
      <div className="flex flex-1 flex-col justify-center gap-4 px-8 pb-6 pt-7">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="logo" className="mb-3 h-9 w-9" />
          <h1 className="font-display text-xl font-semibold leading-tight text-ink">
            {step === 3 ? "Set a new password" : "Reset your password"}
          </h1>
          <p className="mt-1 text-[13px] leading-snug text-ink-secondary">
            {step === 3
              ? "Choose a new password for your account."
              : "Enter your email and we'll send you a code."}
          </p>
        </div>

        {/* Step 1 - email (stays mounted under the step 2 popup) */}
        {step !== 3 && (
          <form
            id="forgot_form"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmitEmail()
            }}
            className="flex flex-col gap-3.5"
          >
            <InputPrimary
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={onEmailChange}
              error={errors?.email}
              disabled={step === 2}
            />

            <ButtonPrimary
              type="submit"
              loading={submiting}
              loadingText="Sending code..."
              trailingArrow
              className="mt-1"
            >
              Send code
            </ButtonPrimary>
          </form>
        )}

        {/* Step 3 - new password */}
        {step === 3 && (
          <form
            id="reset_form"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmitPassword()
            }}
            className="flex flex-col gap-3.5"
          >
            <InputPrimary
              label="New password"
              name="password"
              type="password"
              placeholder="Create a new password"
              value={passwords.password}
              onChange={onPasswordChange}
              error={errors?.password}
            />

            <InputPrimary
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your new password"
              value={passwords.confirmPassword}
              onChange={onPasswordChange}
              error={errors?.confirmPassword}
            />

            <ButtonPrimary
              type="submit"
              loading={updating}
              loadingText="Updating password..."
              trailingArrow
              className="mt-1"
            >
              Reset password
            </ButtonPrimary>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-line bg-subtle px-8 py-3.5 text-center text-[13px] text-ink-secondary">
        Remembered it?{" "}
        <Link
          to="/login"
          className="font-medium text-ink transition-colors hover:text-accent-600"
        >
          Login
        </Link>
      </div>

      {/* Step 2 - otp popup */}
      {step === 2 && (
        <>
          {/* blocks clicks on the form behind, dims + blurs it */}
          <div className="absolute inset-0 z-30 bg-ink/15 backdrop-blur-[1px]" />

          <Otp
            email={email}
            onSubmit={onOtpSubmit}
            onResend={onResendOtp}
            onClose={onBackToEmail}
            error={otpError}
          />
        </>
      )}
    </div>
  )
}

export default Passreset