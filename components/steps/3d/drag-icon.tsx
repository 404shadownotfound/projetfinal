"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface GameItemData {
  id: number
  name: string
  correctZone: string
  color: string
  position: number[]
  originalPosition: number[]
}

interface DropZoneData {
  id: string
  label: string
  color: string
  position: number[]
}

interface DragIconProps {
  item: GameItemData
  isPlaced: boolean
  dropZones: DropZoneData[]
  onDrop: (itemId: number, zoneId: string) => void
  onDrag: (itemId: number, position: number[]) => void
}

// Create procedural texture with text
function createProceduralTexture(text: string, bgColor: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")!

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 256, 256)
  gradient.addColorStop(0, bgColor)
  gradient.addColorStop(1, adjustColor(bgColor, -30))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  // Add pattern
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
  ctx.lineWidth = 2
  for (let i = 0; i < 256; i += 20) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 256)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(256, i)
    ctx.stroke()
  }

  // Add border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
  ctx.lineWidth = 8
  ctx.strokeRect(4, 4, 248, 248)

  // Add text
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 36px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Add text shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
  ctx.shadowBlur = 4
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  // Word wrap if needed
  if (text.length > 8) {
    ctx.font = "bold 28px Arial"
  }
  if (text.length > 12) {
    ctx.font = "bold 22px Arial"
  }
  ctx.fillText(text, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Helper function to adjust color brightness
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))
  return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export default function DragIcon({
  item,
  isPlaced,
  dropZones = [],
  onDrop,
  onDrag,
}: DragIconProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { camera, gl, raycaster } = useThree()

  // Create procedural texture
  const texture = useMemo(() => {
    if (typeof document !== "undefined") {
      return createProceduralTexture(item.name, item.color)
    }
    return null
  }, [item.name, item.color])

  // Hover animation
  useFrame((state) => {
    if (!meshRef.current) return

    if (hovered && !isDragging && !isPlaced) {
      meshRef.current.rotation.y += 0.02
      meshRef.current.position.y =
        item.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1
    } else if (!isDragging) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        0,
        0.1
      )
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        item.position[1],
        0.1
      )
    }

    // Smooth position update
    if (!isDragging) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        item.position[0],
        0.1
      )
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        item.position[2],
        0.1
      )
    }

    // Scale animation
    const targetScale = hovered && !isPlaced ? 1.1 : 1
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    )
  })

  // Handle pointer down (start drag)
  const handlePointerDown = (e: any) => {
    if (isPlaced) return
    e.stopPropagation()
    setIsDragging(true)
    gl.domElement.style.cursor = "grabbing"
  }

  // Check if position is inside a drop zone
  const checkDropZone = (position: THREE.Vector3): string | null => {
    for (const zone of dropZones) {
      const zonePos = zone.position
      const zoneSize = 2 // Half the zone width

      if (
        position.x >= zonePos[0] - zoneSize &&
        position.x <= zonePos[0] + zoneSize &&
        position.z >= zonePos[2] - zoneSize &&
        position.z <= zonePos[2] + zoneSize
      ) {
        return zone.id
      }
    }
    return null
  }

  // Handle pointer up (end drag)
  const handlePointerUp = (e: any) => {
    if (!isDragging) return
    setIsDragging(false)
    gl.domElement.style.cursor = "auto"

    // Check if dropped on a zone
    const position = meshRef.current!.position
    const droppedZone = checkDropZone(position)

    if (droppedZone) {
      onDrop(item.id, droppedZone)
    } else {
      // Return to original position if not dropped on zone
      onDrag(item.id, [...item.originalPosition])
    }
  }

  // Handle pointer move (dragging)
  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return

    // Calculate position on the floor plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const mouse = new THREE.Vector2(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersection)

    if (intersection && meshRef.current) {
      meshRef.current.position.x = intersection.x
      meshRef.current.position.z = intersection.z
      meshRef.current.position.y = 1.5 // Lift while dragging
    }
  }

  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e: PointerEvent) => handlePointerMove(e)
      const handleGlobalUp = (e: PointerEvent) => handlePointerUp(e)

      window.addEventListener("pointermove", handleGlobalMove as EventListener)
      window.addEventListener("pointerup", handleGlobalUp as EventListener)

      return () => {
        window.removeEventListener(
          "pointermove",
          handleGlobalMove as EventListener
        )
        window.removeEventListener("pointerup", handleGlobalUp as EventListener)
      }
    }
  }, [isDragging])

  return (
    <mesh
      ref={meshRef}
      position={item.position}
      onPointerOver={() => {
        if (!isPlaced) {
          setHovered(true)
          gl.domElement.style.cursor = "grab"
        }
      }}
      onPointerOut={() => {
        setHovered(false)
        if (!isDragging) {
          gl.domElement.style.cursor = "auto"
        }
      }}
      onPointerDown={handlePointerDown}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.1}
        emissive={hovered && !isPlaced ? (item.color as any) : "#000000"}
        emissiveIntensity={hovered && !isPlaced ? 0.3 : 0}
        transparent={isPlaced}
        opacity={isPlaced ? 0.8 : 1}
      />
    </mesh>
  )
}
