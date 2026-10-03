import InputPrimary from "../../../components/ui/Input.Primary"
import ButtonPrimary from "../../../components/ui/Button.Primary"
import useLogin from "../hook/useLogin.hook"
import useGoogle from "../hook/useGoogle.hook"
import logo from "../../../assets/images/slotly-icon-mark.svg"
import google from "../../../assets/images/google.svg"
import { Link } from "react-router-dom"

const Login = () => {
  const { form, errors, loading, onChange, onSubmit } = useLogin()
  const { loading: googleLoading, onGoogleClick } = useGoogle()

  return (
    <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-line bg-surface font-sans shadow-lg">

      {/* Main section */}
      <div className="flex flex-col gap-5 px-9 pb-8 pt-9">

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="logo" className="mb-4 h-10 w-10" />
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-secondary">
            Sign in to manage your bookings.
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

        {/* Form */}
        <form
          id="login_form"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="flex flex-col gap-4"
        >
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
            placeholder="Enter your password"
            value={form.password}
            onChange={onChange}
            error={errors?.password}
          />

<div className="-mt-1 flex justify-end">
            <Link
              to="/pass-reset"
              className="text-[13px] font-medium text-accent-600 transition-colors hover:text-accent-700"
            >
              Forgot password?
            </Link>
          </div>

          <ButtonPrimary
            type="submit"
            loading={loading}
            loadingText="Signing in..."
            trailingArrow
            className="mt-1"
          >
            Login
          </ButtonPrimary>
        </form>
      </div>

      {/* Footer */}
      <div className="border-t border-line bg-subtle px-9 py-4 text-center text-[13px] text-ink-secondary">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-ink transition-colors hover:text-accent-600"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default Login