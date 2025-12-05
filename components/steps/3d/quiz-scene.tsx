"use client"

import React from "react"
import { Suspense } from "react"
import DragIcon from "./drag-icon"
import DropZone from "./drop-zone"

interface DropZoneData {
  id: string
  label: string
  color: string
  position: number[]
}

interface GameItemData {
  id: number
  name: string
  correctZone: string
  color: string
  position: number[]
  originalPosition: number[]
}

interface QuizSceneProps {
  items: GameItemData[]
  placedItems: number[]
  dropZones: DropZoneData[]
  onDrop: (itemId: number, zoneId: string) => void
  onDrag: (itemId: number, position: number[]) => void
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#1a1a2e"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <hemisphereLight
        intensity={0.5}
        groundColor="#1a1a2e"
        color="#ffffff"
      />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ff88" />
    </>
  )
}

function Grid() {
  return (
    <gridHelper
      args={[20, 20, "#2a2a4e", "#2a2a4e"]}
      position={[0, -0.49, 0]}
    />
  )
}

export default function QuizScene({
  items,
  placedItems,
  dropZones = [],
  onDrop,
  onDrag,
}: QuizSceneProps) {
  return (
    <>
      <Lights />
      <Floor />
      <Grid />

      {/* Dynamic Drop Zones from quiz package */}
      {dropZones.map((zone) => (
        <DropZone
          key={zone.id}
          position={zone.position}
          zone={zone.id}
          label={zone.label}
          color={zone.color}
        />
      ))}

      {/* Draggable Icons */}
      {items.map((item) => (
        <DragIcon
          key={item.id}
          item={item}
          isPlaced={placedItems.includes(item.id)}
          dropZones={dropZones}
          onDrop={onDrop}
          onDrag={onDrag}
        />
      ))}
    </>
  )
}
