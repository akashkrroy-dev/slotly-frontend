import { gsap } from "../utils/gsap"

export const openPopupAnimation = (
  sheet: HTMLElement | null,
  { onComplete }: { onComplete?: () => void } = {},
) => {
  if (!sheet) return null

  return gsap.fromTo(
    sheet,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration: 0.5,
      ease: "power3.out",
      onComplete,
    }
  )
}

export default openPopupAnimation