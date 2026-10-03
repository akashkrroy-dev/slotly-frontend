import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"
import { Observer } from "gsap/Observer"

const isBrowser = typeof window !== "undefined"

export const prefersReducedMotion = () =>
  isBrowser &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

if (isBrowser) {
  gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, Observer)

  gsap.config({
    nullTargetWarn: false,
    force3D: true,
  })

  gsap.defaults({
    duration: 0.5,
    ease: "power2.out",
  })
}

export { gsap, ScrollTrigger, Draggable, InertiaPlugin, Observer }