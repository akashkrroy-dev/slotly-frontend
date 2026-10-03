import { useRef } from "react"
import { gsap } from "../utils/gsap"

const DRAG_ZONE_HEIGHT = 80

const CLOSE_THRESHOLD = 0.6

type UseDragToCloseArgs = {
  sheetRef: React.RefObject<HTMLElement | null>
  onClose: () => void
  dragZoneHeight?: number
  closeThreshold?: number
}

export const useDragToClose = ({
  sheetRef,
  onClose,
  dragZoneHeight = DRAG_ZONE_HEIGHT,
  closeThreshold = CLOSE_THRESHOLD,
}: UseDragToCloseArgs) => {
  const startY = useRef(0)
  const grabOffset = useRef(0)
  const dragging = useRef(false)

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const sheet = sheetRef.current
    if (!sheet || dragging.current) return
    if (e.clientY - sheet.getBoundingClientRect().top > dragZoneHeight) return

    e.stopPropagation()
    gsap.killTweensOf(sheet)

    const y = Number(gsap.getProperty(sheet, "y")) || 0
    const yPercent = Number(gsap.getProperty(sheet, "yPercent")) || 0
    grabOffset.current = y + (sheet.offsetHeight * yPercent) / 100

    gsap.set(sheet, { yPercent: 0, y: grabOffset.current })

    startY.current = e.clientY
    dragging.current = true
    sheet.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const sheet = sheetRef.current
    if (!sheet || !dragging.current) return

    const deltaY = e.clientY - startY.current
    if (deltaY < 0) return

    gsap.set(sheet, { y: grabOffset.current + deltaY })
  }

  const onPointerEnd = (e: React.PointerEvent<HTMLElement>) => {
    const sheet = sheetRef.current
    if (!sheet || !dragging.current) return
    dragging.current = false

    const deltaY = e.clientY - startY.current
    const height = sheet.offsetHeight

    if (height > 0 && deltaY / height >= closeThreshold) {
      gsap.to(sheet, {
        y: height,
        duration: 0.3,
        ease: "power3.in",
        onComplete: onClose,
      })
      return
    }

    gsap.to(sheet, { y: 0, duration: 0.4, ease: "power3.out" })
  }

  return {
    onPointerDownCapture: onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
  }
}

export default useDragToClose