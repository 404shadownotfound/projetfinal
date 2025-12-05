"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function CubeNetwork() {
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
    camera.position.z = 8
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create cube network
    const cubesGroup = new THREE.Group()
    const positions = [
      [-2, -2, 0],
      [0, -2, 0],
      [2, -2, 0],
      [-2, 0, 0],
      [0, 0, 0],
      [2, 0, 0],
      [-2, 2, 0],
      [0, 2, 0],
      [2, 2, 0],
    ]

    const cubes: THREE.Mesh[] = []

    positions.forEach((pos, idx) => {
      const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.55 + idx * 0.01, 0.9, 0.6),
        emissive: new THREE.Color().setHSL(0.55 + idx * 0.01, 0.9, 0.4),
        metalness: 0.7,
        roughness: 0.2,
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(pos[0], pos[1], pos[2])
      cubesGroup.add(cube)
      cubes.push(cube)
    })

    scene.add(cubesGroup)

    // Draw lines between cubes
    const lineGeometry = new THREE.BufferGeometry()
    const points: THREE.Vector3[] = []

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = Math.hypot(positions[i][0] - positions[j][0], positions[i][1] - positions[j][1])
        if (dist <= 2.1) {
          points.push(new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]))
          points.push(new THREE.Vector3(positions[j][0], positions[j][1], positions[j][2]))
        }
      }
    }

    lineGeometry.setFromPoints(points)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.4 })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00aaff, 1.5)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

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

      cubesGroup.rotation.x += 0.003
      cubesGroup.rotation.y += 0.005
      cubesGroup.rotation.z += 0.002

      cubes.forEach((cube, idx) => {
        cube.position.z = Math.sin(Date.now() * 0.001 + idx) * 0.5
      })

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
