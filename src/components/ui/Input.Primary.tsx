import { useId, useState } from "react"
import Icon from "../global/Icon"

type InputProps = React.ComponentProps<"input"> & {
  label: string
  error?: string
}

const InputPrimary = ({
  label,
  error,
  type = "text",
  className = "",
  disabled,
  ...props
}: InputProps) => {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const isPassword = type === "password"
  const [showPassword, setShowPassword] = useState(false)

  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="w-full flex flex-col gap-1 font-sans">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-ink select-none"
      >
        {label}
      </label>

      <div className="relative w-full flex items-center">
        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
          className={`
            w-full rounded-[10px] border bg-surface px-3.5 py-2 text-sm text-ink
            shadow-xs transition-all duration-150
            placeholder:text-ink-tertiary
            focus:outline-none focus:ring-4
            disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-disabled disabled:shadow-none
            ${isPassword ? "pr-10" : ""}
            ${
              error
                ? "border-danger focus:border-danger focus:ring-danger-bg"
                : "border-line hover:border-line-strong focus:border-line-focus focus:ring-accent-100"
            }
            ${className}
          `}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="absolute right-3 p-1 text-ink-tertiary hover:text-ink-secondary focus:outline-none disabled:opacity-50"
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-xs font-medium text-danger"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default InputPrimary