import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { GOOGLE_CLIENT_ID, getErrorMessage } from "../../../config/api"
import { googleLogin } from "../apis"

const GSI_SRC = "https://accounts.google.com/gsi/client"

type CredentialResponse = { credential?: string }

type PromptMomentNotification = {
  isDisplayMoment: () => boolean
  isDisplayed: () => boolean
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
}

type IdApi = {
  initialize: (config: {
    client_id: string
    ux_mode: "popup" | "redirect"
    callback: (response: CredentialResponse) => void
  }) => void
  prompt: (notification?: (n: PromptMomentNotification) => void) => void
  cancel: () => void
}

declare global {
  interface Window {
    google?: { accounts?: { id?: IdApi } }
  }
}

const CANCEL_REASONS = new Set([
  "user_cancel",
  "tap_outside",
  "auto_cancel",
  "suppressed_by_user",
  "opt_out_or_no_session",
])

const REASON_MESSAGES: Record<string, string> = {
  invalid_client:
    "Google rejected this app. Check that the OAuth client is type 'Web application' and that this page's origin is listed under 'Authorized JavaScript origins'.",
  unregistered_origin:
    "This page's address is not an authorised origin for this app.",
  missing_client_id: "No Google client id was configured.",
  browser_not_supported: "This browser can't do Google sign-in.",
  secure_http_required:
    "Google sign-in needs HTTPS. localhost is exempt from this.",
  issuing_failed: "Google could not issue a credential. Please try again.",
}

let loadPromise: Promise<void> | null = null
let isInitialized = false
let resolveCredential: ((idToken: string) => void) | null = null

const loadGsi = () => {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = GSI_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      loadPromise = null
      reject(new Error("Could not load Google sign-in"))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

const initializeOnce = () => {
  if (isInitialized) return

  window.google!.accounts!.id!.initialize({
    client_id: GOOGLE_CLIENT_ID,
    ux_mode: "popup",
    callback: ({ credential }) => {
      if (credential) resolveCredential?.(credential)
    },
  })

  isInitialized = true
}

const useGoogle = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleCredential(idToken: string) {
    try {
      await googleLogin({ idToken })

      toast.success("Signed in with Google")
      navigate("/member/workspace", { replace: true })
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Google sign-in failed. Please try again.")
      )
      setLoading(false)
    }
  }

  async function onGoogleClick() {
    if (loading) return

    try {
      setLoading(true)
      await loadGsi()
      initializeOnce()

      resolveCredential = (idToken) => {
        resolveCredential = null
        void handleCredential(idToken)
      }

      window.google!.accounts!.id!.prompt((notification) => {
        const reason = notification.isSkippedMoment()
          ? notification.getSkippedReason()
          : notification.isDismissedMoment()
            ? notification.getDismissedReason()
            : notification.getNotDisplayedReason()

        if (reason === "credential_returned") return

        resolveCredential = null
        setLoading(false)

        if (CANCEL_REASONS.has(reason)) return

        console.warn("[google] prompt returned no credential:", reason)

        toast.error(
          REASON_MESSAGES[reason] ??
            "Google sign-in was not completed. Please try again."
        )
      })
    } catch {
      setLoading(false)
      toast.error("Google sign-in is unavailable right now.")
    }
  }

  return { loading, onGoogleClick }
}

export default useGoogle
