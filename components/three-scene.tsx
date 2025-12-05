"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const chainRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0a1628)

    // Camera setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 4
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create blockchain chain (rings)
    const chainGroup = new THREE.Group()
    chainRef.current = chainGroup
    scene.add(chainGroup)

    for (let i = 0; i < 3; i++) {
      const torusGeometry = new THREE.TorusGeometry(2 - i * 0.5, 0.15, 32, 100)
      const torusMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.55 + i * 0.1, 0.8, 0.5),
        emissive: new THREE.Color().setHSL(0.55 + i * 0.1, 0.8, 0.4),
        wireframe: false,
      })
      const torus = new THREE.Mesh(torusGeometry, torusMaterial)
      torus.position.z = -i * 0.5
      torus.rotation.x = Math.random() * Math.PI
      chainGroup.add(torus)
    }

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 1000
    const positionArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positionArray[i] = (Math.random() - 0.5) * 10
      positionArray[i + 1] = (Math.random() - 0.5) * 10
      positionArray[i + 2] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00d4ff,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    particlesRef.current = particles
    scene.add(particles)

    // Add lights
    const light1 = new THREE.PointLight(0x00d4ff, 1, 100)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x6366f1, 0.5, 100)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Rotate chain
      if (chainGroup) {
        chainGroup.rotation.x += 0.001
        chainGroup.rotation.y += 0.003
      }

      // Rotate particles
      if (particles) {
        particles.rotation.x += 0.0001
        particles.rotation.y += 0.0002
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      containerRef.current?.removeChild(renderer.domElement)
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" style={{ minHeight: "400px" }} />
}
