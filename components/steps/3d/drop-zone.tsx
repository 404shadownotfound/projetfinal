"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"

interface DropZoneProps {
  position: number[]
  zone: string
  label: string
  color: string
}

// Create procedural texture for drop zone
function createZoneTexture(color: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null

  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  // Semi-transparent background
  ctx.fillStyle = color
  ctx.globalAlpha = 0.3
  ctx.fillRect(0, 0, 512, 512)

  // Border
  ctx.globalAlpha = 0.8
  ctx.strokeStyle = color
  ctx.lineWidth = 16
  ctx.strokeRect(8, 8, 496, 496)

  // Corner decorations
  ctx.fillStyle = color
  ctx.globalAlpha = 0.6
  const cornerSize = 60

  // Top-left
  ctx.fillRect(0, 0, cornerSize, 8)
  ctx.fillRect(0, 0, 8, cornerSize)

  // Top-right
  ctx.fillRect(512 - cornerSize, 0, cornerSize, 8)
  ctx.fillRect(504, 0, 8, cornerSize)

  // Bottom-left
  ctx.fillRect(0, 504, cornerSize, 8)
  ctx.fillRect(0, 512 - cornerSize, 8, cornerSize)

  // Bottom-right
  ctx.fillRect(512 - cornerSize, 504, cornerSize, 8)
  ctx.fillRect(504, 512 - cornerSize, 8, cornerSize)

  // Grid pattern
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.2
  ctx.lineWidth = 2
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 512)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(512, i)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function DropZone({
  position,
  zone,
  label,
  color,
}: DropZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => createZoneTexture(color), [color])

  // Subtle animation for the glow effect
  useFrame((state: any) => {
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position as any}>
      {/* Base platform */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0] as any}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          map={texture!}
          transparent
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Glow effect */}
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0] as any}
        position={[0, 0.02, 0]}
      >
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Border walls */}
      <mesh position={[0, 0.15, -2]} castShadow>
        <boxGeometry args={[4, 0.3, 0.1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.15, 2]} castShadow>
        <boxGeometry args={[4, 0.3, 0.1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[-2, 0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[2, 0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0.5, -2.5] as any}
        rotation={[-Math.PI / 6, 0, 0] as any}
        fontSize={0.6}
        color={color}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>

      {/* Icon indicator */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}
