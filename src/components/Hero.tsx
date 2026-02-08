import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface HeroProps {
  onExplore: () => void
}

export default function Hero({ onExplore }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const headlineRef = useRef<HTMLHeadingElement | null>(null)
  const subtextRef = useRef<HTMLParagraphElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      // Animated headline, subtext, and button in sequence on scroll
      gsap.set([headlineRef.current, subtextRef.current], { opacity: 0, y: 40 })
      gsap.set(buttonRef.current, { opacity: 0, scale: 0.8 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom top",
        onEnter: () => {
          gsap.to(headlineRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0 })
          gsap.to(subtextRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.5 })
          gsap.to(buttonRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out", delay: 1 })
        },
        onLeaveBack: () => {
          gsap.to([headlineRef.current, subtextRef.current], { y: 40, opacity: 0, duration: 0.5, ease: "power2.in" })
          gsap.to(buttonRef.current, { scale: 0.8, opacity: 0, duration: 0.4, ease: "power2.in" })
        },
        onLeave: () => {
          gsap.to([headlineRef.current, subtextRef.current], { y: -40, opacity: 0, duration: 0.5, ease: "power2.in" })
          gsap.to(buttonRef.current, { scale: 0.8, opacity: 0, duration: 0.4, ease: "power2.in" })
        },
        onEnterBack: () => {
          gsap.to(headlineRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0 })
          gsap.to(subtextRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.5 })
          gsap.to(buttonRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out", delay: 1 })
        },
      })

      // Button with pulse animation
      const btnPulse = gsap.to(buttonRef.current, {
        scale: 1.08,
        repeat: -1,
        yoyo: true,
        duration: 0.7,
        ease: "power1.inOut",
        paused: false,
      })

      return () => {
        btnPulse.kill()
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
    }, [])

  return (
    <section ref={sectionRef} className="bg-black/30 absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none select-none">
      <h1 ref={headlineRef} className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
        3D Experience
      </h1>
      <p ref={subtextRef} className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl mx-auto drop-shadow">
        Explore a smooth, interactive 3D scene powered by Three.js and GSAP. Scroll or click explore to begin your journey.
      </p>
      <button
        ref={buttonRef}
        className="pointer-events-auto px-8 py-3 rounded-full bg-white text-black font-semibold text-lg shadow-lg hover:bg-gray-200 transition"
        onClick={onExplore}
      >
        Explore
      </button>
    </section>
  )
}