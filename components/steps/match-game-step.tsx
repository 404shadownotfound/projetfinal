"use client"

import React, { useState } from "react"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { StepContent } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"
import { Trophy, RotateCcw } from "lucide-react"
import QuizScene from "./3d/quiz-scene"

interface DropZone {
  id: string
  label: string
  color: string
  position?: number[]
}

interface GameItem {
  id: number
  name: string
  correctZone: string
  color: string
}

interface MatchGameStepProps {
  title: string
  description: string
  icon?: string
  difficulty?: string
  dropZones: DropZone[]
  items: GameItem[]
  onComplete?: (score: number) => void
}

export function MatchGameStep({
  title,
  description,
  icon,
  difficulty,
  dropZones,
  items,
  onComplete,
}: MatchGameStepProps) {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const handleDrop = (itemId: number, zoneId: string) => {
    setPlacements((prev) => ({
      ...prev,
      [String(itemId)]: zoneId,
    }))
  }

  const handleDrag = (itemId: number, position: number[]) => {
    setPlacements((prev) => {
      const newPlacements = { ...prev }
      delete newPlacements[String(itemId)]
      return newPlacements
    })
  }

  const handleSubmit = () => {
    if (Object.keys(placements).length !== items.length) {
      alert("Please place all items before submitting!")
      return
    }

    let correct = 0
    items.forEach((item) => {
      const placedZone = placements[String(item.id)]
      if (placedZone === item.correctZone) {
        correct++
      }
    })

    const finalScore = Math.round((correct / items.length) * 100)
    setScore(finalScore)
    setCompleted(true)

    if (onComplete) {
      onComplete(finalScore)
    }
  }

  const handleReset = () => {
    setPlacements({})
    setCompleted(false)
    setScore(0)
  }

  const placedItemIds = Object.keys(placements).map((id) => parseInt(id))

  return (
    <StepContent title={title} description={description}>
      <div className="space-y-6">
        {/* Game Info */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-purple-500/30">
          <div className="flex items-center gap-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <div>
              <h3 className="text-white font-semibold">{title}</h3>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          </div>
          {difficulty && (
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {difficulty}
            </span>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-cyan-300">
            💡 <strong>Drag and drop</strong> each item into the correct zone. Rotate the view with your mouse to see all zones.
          </p>
        </div>

        {/* 3D Game Canvas */}
        <div
          className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-slate-800"
          style={{ height: "600px" }}
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <div className="animate-spin mb-4">⚙️</div>
                  <p>Loading 3D scene...</p>
                </div>
              </div>
            }
          >
            <Canvas
              shadows
              camera={{ position: [0, 8, 10], fov: 50 }}
              style={{ background: "transparent" }}
            >
              <QuizScene
                items={items.map((item) => ({
                  ...item,
                  position: [
                    (Math.random() - 0.5) * 8,
                    1.5,
                    (Math.random() - 0.5) * 8,
                  ],
                  originalPosition: [
                    (Math.random() - 0.5) * 8,
                    1.5,
                    (Math.random() - 0.5) * 8,
                  ],
                }))}
                placedItems={placedItemIds}
                dropZones={dropZones.map((zone) => ({
                  ...zone,
                  position: zone.position || [0, 0, 0],
                }))}
                onDrop={handleDrop}
                onDrag={handleDrag}
              />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.5}
                minDistance={8}
                maxDistance={20}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Placed: <span className="text-white font-semibold">{Object.keys(placements).length}</span> / {items.length}
          </div>
          {completed && (
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold">
                <span className="text-yellow-400">Score: {score}%</span>
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!completed ? (
            <button
              onClick={handleSubmit}
              className={cn(
                "flex-1 px-6 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
                "hover:from-cyan-600 hover:to-blue-600",
                Object.keys(placements).length === items.length
                  ? "opacity-100"
                  : "opacity-50 cursor-not-allowed"
              )}
              disabled={Object.keys(placements).length !== items.length}
            >
              Submit Answer
            </button>
          ) : (
            <div className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-center">
              ✓ Completed!
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-all border border-slate-600"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </StepContent>
  )
}
