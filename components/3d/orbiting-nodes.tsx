"use client"

import { useEffect, useRef } from "react"

export function OrbittingNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(2, 6, 23, 0.1)")
      gradient.addColorStop(1, "rgba(10, 15, 31, 0.1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      // Draw orbiting nodes
      const orbitRadius = 100
      const numNodes = 6

      for (let i = 0; i < numNodes; i++) {
        const angle = time + (i / numNodes) * Math.PI * 2
        const x = centerX + Math.cos(angle) * orbitRadius
        const y = centerY + Math.sin(angle) * orbitRadius

        // Draw orbit line
        if (i === 0) {
          ctx.strokeStyle = "rgba(0, 170, 255, 0.1)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Draw nodes
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
        gradient.addColorStop(0, "rgba(0, 170, 255, 0.8)")
        gradient.addColorStop(1, "rgba(0, 170, 255, 0.2)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw glow
        ctx.strokeStyle = `rgba(0, 170, 255, ${0.3 + Math.sin(time * 2) * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw center circle
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15)
      centerGradient.addColorStop(0, "rgba(0, 170, 255, 0.6)")
      centerGradient.addColorStop(1, "rgba(0, 170, 255, 0)")
      ctx.fillStyle = centerGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
}
