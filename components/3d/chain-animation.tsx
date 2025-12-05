"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ChainAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create chain links
    const chainGroup = new THREE.Group()
    const linkCount = 8

    for (let i = 0; i < linkCount; i++) {
      const geometry = new THREE.TorusGeometry(1, 0.3, 16, 32)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.55 + i * 0.02, 0.8, 0.6),
        emissive: new THREE.Color().setHSL(0.55 + i * 0.02, 0.8, 0.4),
        metalness: 0.8,
        roughness: 0.2,
      })
      const torus = new THREE.Mesh(geometry, material)
      torus.position.y = i * 1.5 - (linkCount - 1) * 0.75
      torus.rotation.x = Math.PI / 4 + i * 0.1
      chainGroup.add(torus)
    }

    scene.add(chainGroup)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00aaff, 2)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positionArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positionArray[i] = (Math.random() - 0.5) * 10
      positionArray[i + 1] = (Math.random() - 0.5) * 10
      positionArray[i + 2] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x00aaff,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      chainGroup.rotation.x += 0.002
      chainGroup.rotation.y += 0.01
      chainGroup.rotation.z += 0.001

      particles.rotation.y += 0.0001

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      renderer.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
