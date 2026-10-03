import { Link } from "react-router-dom"

//* COMPONENTS
import InputPrimary from "../../../components/ui/Input.Primary"
import ButtonPrimary from "../../../components/ui/Button.Primary"
import useRegister from "../hook/useRegister.hook"
import useGoogle from "../hook/useGoogle.hook"
import logo from "../../../assets/images/slotly-icon-mark.svg"
import google from "../../../assets/images/google.svg"
import Otp from "../components/Otp"

const Register = () => {
  const {
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
  } = useRegister()
  const { loading: googleLoading, onGoogleClick } = useGoogle()

  return (
    <>
      <div className="relative w-full max-w-105 overflow-hidden rounded-2xl border border-line bg-surface font-sans shadow-lg">
        <div className="flex flex-col gap-4 px-8 pb-6 pt-7">

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="logo" className="mb-3 h-9 w-9" />
            <h1 className="font-display text-2xl font-semibold leading-tight text-ink">
              Create your account
            </h1>
            <p className="mt-1 text-[13px] leading-snug text-ink-secondary">
              Welcome! Please fill in the details to get started.
            </p>
          </div>

          {/* Google button */}
          <ButtonPrimary
            type="button"
            variant="outline"
            className="h-9.5 gap-2.5"
            onClick={onGoogleClick}
            loading={googleLoading}
            loadingText="Signing in..."
          >
            <img src={google} alt="" className="h-4.5 w-4.5 shrink-0" />
            Continue with Google
          </ButtonPrimary>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[13px] text-ink-tertiary">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Form + OTP overlay */}
          <div className="relative">
            <form
              id="register_form"
              onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
              }}
              className="flex flex-col gap-3.5"
            >
              <div className="grid grid-cols-2 items-start gap-3">
                <InputPrimary
                  label="First name"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={onChange}
                  error={errors?.firstName}
                />
                <InputPrimary
                  label="Last name"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={onChange}
                  error={errors?.lastName}
                />
              </div>

              <InputPrimary
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={onChange}
                error={errors?.email}
              />

              <InputPrimary
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                error={errors?.password}
              />

              <ButtonPrimary
                type="submit"
                loading={submiting}
                loadingText="Creating account..."
                trailingArrow
                className="mt-1"
              >
                Register
              </ButtonPrimary>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-subtle px-8 py-3.5 text-center text-[13px] text-ink-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-ink transition-colors hover:text-accent-600"
          >
            Login
          </Link>
        </div>

        {showOtpBox && (
          <>
            {/* blocks clicks on the form behind, dims + blurs it, no onClose */}
            <div className="absolute inset-0 z-30 bg-ink/15 backdrop-blur-[1px]" />

            <Otp
              email={form.email.trim()}
              onSubmit={onOtpSubmit}
              onResend={onResendOtp}
              onClose={onBackToForm}
              loading={verifying}
              error={otpError}
            />
          </>
        )}
      </div>
    </>
  )
}

export default Register