"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function FloatingSphere() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 2

    // Create main sphere with gradient material
    const geometry = new THREE.IcosahedronGeometry(1, 8)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 color1 = vec3(0.0, 0.7, 1.0);
          vec3 color2 = vec3(0.5, 0.2, 1.0);
          vec3 finalColor = mix(color1, color2, sin(vPosition.y * 3.0) * 0.5 + 0.5);
          
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          finalColor += fresnel * 0.5;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
    })

    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // Add particles
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4
      positions[i + 1] = (Math.random() - 0.5) * 4
      positions[i + 2] = (Math.random() - 0.5) * 4

      velocities[i] = (Math.random() - 0.5) * 0.02
      velocities[i + 1] = (Math.random() - 0.5) * 0.02
      velocities[i + 2] = (Math.random() - 0.5) * 0.02
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00aaff,
      size: 0.05,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Lighting
    const light1 = new THREE.PointLight(0x00aaff, 1, 100)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xff00ff, 0.5, 100)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    // Animation loop
    let frameCount = 0
    const animate = () => {
      frameCount++
      sphere.rotation.x += 0.001
      sphere.rotation.y += 0.002

      // Update particles
      const posArray = particleGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] += velocities[i]
        posArray[i + 1] += velocities[i + 1]
        posArray[i + 2] += velocities[i + 2]

        // Wrap around
        if (Math.abs(posArray[i]) > 2) velocities[i] *= -1
        if (Math.abs(posArray[i + 1]) > 2) velocities[i + 1] *= -1
        if (Math.abs(posArray[i + 2]) > 2) velocities[i + 2] *= -1
      }
      ;(particleGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
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
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
