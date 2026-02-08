interface HeroProps {
  onExplore: () => void
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none select-none">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">3D Experience</h1>
      <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl mx-auto drop-shadow">
        Explore a smooth, interactive 3D scene powered by Three.js and GSAP. Scroll or click below to begin your journey.
      </p>
      <button
        className="pointer-events-auto px-8 py-3 rounded-full bg-white text-black font-semibold text-lg shadow-lg hover:bg-gray-200 transition"
        onClick={onExplore}
      >
        Explore
      </button>
    </section>
  )
}