import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Ref for the car model group
  const modelRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xcccccc)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Object
    /*const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.2,
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)*/

    // Load GLB model
    let model: THREE.Group | null = null
    const loader = new GLTFLoader()
    loader.load(
      "/bmw_m5_cs.glb",
      (gltf) => {
        const car = gltf.scene
        const box = new THREE.Box3().setFromObject(car)
        const center = box.getCenter(new THREE.Vector3())
        car.position.sub(center)
        // Responsive scale
        let scale = 1.2
        const width = window.innerWidth
        if (width >= 1200) {
          scale = 1.4 // large screens
        } else if (width >= 768) {
          scale = 1.3 // mid screens
        } else {
          scale = 1.1 // mobile
        }
        car.scale.set(scale, scale, scale)
        // Create group and add car
        model = new THREE.Group()
        model.add(car)
        scene.add(model)
        modelRef.current = model
        const size = box.getSize(new THREE.Vector3()).length()
        camera.position.set(0, 0, size * 2.3)
        camera.lookAt(0, 0, 0)

        // GSAP pop-up animation
        model.scale.set(0.01, 0.01, 0.01)
        gsap.to(model.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 1.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
            onLeaveBack: () => {
              // Reset scale to tiny so it can pop again
              if (model) model.scale.set(0.01, 0.01, 0.01)
            },
          },
        })
      },
      undefined,
      (error) => {
        console.error("Error loading GLB:", error)
      }
    )

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Animation state
    let frameId: number

    // Animation loop
    const animate = () => {
      /*if (isAnimating) {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        if (isAnimating && model) {
          model.rotation.y += 0.03 // Faster rotation
        }
      renderer.render(scene, camera)
    }*/
      frameId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // User interaction: click, hold, and move to rotate model
    let isDragging = false
    let lastX = 0
    let lastY = 0

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true
      lastX = event.clientX
      lastY = event.clientY
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging || !modelRef.current) return;
      const deltaX = event.clientX - lastX
      const deltaY = event.clientY - lastY
      modelRef.current.rotation.y += deltaX * 0.01
      modelRef.current.rotation.x += deltaY * 0.01
      lastX = event.clientX
      lastY = event.clientY
    }

    const handlePointerUp = () => {
      isDragging = false;
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      if (modelRef.current) {
        scene.remove(modelRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
    />
  )
}
