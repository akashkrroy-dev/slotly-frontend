import Icon from "../global/Icon"

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "outline"
  loading?: boolean
  loadingText?: string
  trailingArrow?: boolean
  fullWidth?: boolean
}

const variants = {
  primary: `
    bg-accent-600 text-ink-on-accent
    shadow-accent ring-1 ring-inset ring-white/15
    hover:bg-accent-700
    focus-visible:ring-accent-200
  `,
  outline: `
    border border-line bg-surface text-ink-secondary
    shadow-xs
    hover:border-line-strong hover:bg-app
    focus-visible:ring-accent-100
  `,
} as const

const ButtonPrimary = ({
  variant = "primary",
  loading = false,
  loadingText,
  trailingArrow = false,
  fullWidth = true,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    {...props}
    className={`
      group flex h-10 items-center justify-center gap-2 rounded-[10px] px-3.5
      text-sm font-medium
      transition-all duration-150
      active:scale-[0.98]
      focus:outline-none focus-visible:ring-4
      disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:active:scale-100
      ${fullWidth ? "w-full" : ""}
      ${variants[variant]}
      ${className}
    `}
  >
    {loading ? (
      <>
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-25"
          />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        {loadingText ?? children}
      </>
    ) : (
      <>
        {children}
        {trailingArrow && (
          <Icon
            name="arrowRight"
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
          />
        )}
      </>
    )}
  </button>
)

export default ButtonPrimary