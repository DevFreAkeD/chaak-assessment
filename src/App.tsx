import Scene3D from "./components/three/Scene3D"
import Hero from "./components/Hero"

export default function App() {
  const handleExplore = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <main className="relative w-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <Scene3D />
        <Hero onExplore={handleExplore} />
      </section>

      {/* Scene 3D */}
      <section className="h-screen flex items-center justify-center">
        <Scene3D />
      </section>
    </main>
  )
}