"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function RoboticHead() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const headRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x020617)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 3

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rendererRef.current = renderer
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Neon lights
    const purpleLight = new THREE.PointLight(0xff00ff, 1.5)
    purpleLight.position.set(2, 1, 2)
    scene.add(purpleLight)

    const cyanLight = new THREE.PointLight(0x00ffff, 1.5)
    cyanLight.position.set(-2, -1, 2)
    scene.add(cyanLight)

    const blueLight = new THREE.PointLight(0x0099ff, 1)
    blueLight.position.set(0, 2, -2)
    scene.add(blueLight)

    // Create robotic head group
    const head = new THREE.Group()
    headRef.current = head
    scene.add(head)

    // Main head structure (sphere)
    const headGeometry = new THREE.IcosahedronGeometry(1, 4)
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a2e,
      emissive: 0x0f0f1e,
      wireframe: false,
      shininess: 100,
    })
    const headMesh = new THREE.Mesh(headGeometry, headMaterial)
    head.add(headMesh)

    // Add neon wireframe
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.02, 4)
    const wireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      wireframe: true,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
    })
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    head.add(wireframeMesh)

    // Create glowing particles around the head
    const particleCount = 100
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleVelocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4
      particlePositions[i + 1] = (Math.random() - 0.5) * 4
      particlePositions[i + 2] = (Math.random() - 0.5) * 4

      particleVelocities[i] = (Math.random() - 0.5) * 0.02
      particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      sizeAttenuation: true,
      emissive: 0x00ffff,
      emissiveIntensity: 0.8,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate head
      if (headRef.current) {
        headRef.current.rotation.x += 0.002
        headRef.current.rotation.y += 0.005
        headRef.current.rotation.z += 0.001
      }

      // Pulse effect
      headMesh.scale.set(
        1 + Math.sin(Date.now() * 0.001) * 0.05,
        1 + Math.sin(Date.now() * 0.001) * 0.05,
        1 + Math.sin(Date.now() * 0.001) * 0.05,
      )

      // Update particles
      const positions = particlesGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += particleVelocities[i]
        positions[i + 1] += particleVelocities[i + 1]
        positions[i + 2] += particleVelocities[i + 2]

        // Wrap particles around
        if (positions[i] > 2) positions[i] = -2
        if (positions[i] < -2) positions[i] = 2
        if (positions[i + 1] > 2) positions[i + 1] = -2
        if (positions[i + 1] < -2) positions[i + 1] = 2
        if (positions[i + 2] > 2) positions[i + 2] = -2
        if (positions[i + 2] < -2) positions[i + 2] = 2
      }
      ;(particlesGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true

      // Rotate lights
      purpleLight.position.x = Math.sin(Date.now() * 0.0005) * 3
      cyanLight.position.x = Math.cos(Date.now() * 0.0005) * 3

      renderer.render(scene, camera)
    }

    animate()

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

    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      headGeometry.dispose()
      headMaterial.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
