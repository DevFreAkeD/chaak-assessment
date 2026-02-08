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
           <div className="relative z-20 flex items-center justify-center h-full">
             <Hero onExplore={handleExplore} />
           </div>
      </section>

      {/* Scene 3D */}
      <section className="h-screen flex items-center justify-center">
           <div className="absolute inset-0 z-10">
             <Scene3D />
           </div>
      </section>
    </main>
  )
}