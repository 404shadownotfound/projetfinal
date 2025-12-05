"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Lock, Trophy, Zap, Star, X, LogOut } from "lucide-react"
import ApiStepperPage from "@/app/lesson-api-example/page"

const INITIAL_LEVELS = [
  {
    id: 1,
    title: "Basics",
    description: "Learn fundamentals of free tech",
    difficulty: "Easy",
    xp: 100,
    completed: false,
    icon: "📚",
    row: 0,
    col: 1,
  },
  {
    id: 2,
    title: "Web Design",
    description: "Master free design tools",
    difficulty: "Medium",
    xp: 250,
    completed: false,
    icon: "🎨",
    row: 1,
    col: 0,
  },
  {
    id: 3,
    title: "Video Editing",
    description: "Edit like a pro for free",
    difficulty: "Medium",
    xp: 300,
    completed: false,
    icon: "🎬",
    row: 1,
    col: 2,
  },
  {
    id: 4,
    title: "Code Editor",
    description: "Advanced coding tutorials",
    difficulty: "Hard",
    xp: 500,
    completed: false,
    icon: "💻",
    row: 2,
    col: 1,
  },
  {
    id: 5,
    title: "Music Production",
    description: "Create soundtracks free",
    difficulty: "Hard",
    xp: 400,
    completed: false,
    icon: "🎵",
    row: 3,
    col: 0,
  },
  {
    id: 6,
    title: "Game Dev",
    description: "Build games with free tools",
    difficulty: "Expert",
    xp: 750,
    completed: false,
    icon: "🎮",
    row: 3,
    col: 2,
  },
  {
    id: 7,
    title: "3D Modeling",
    description: "Model & render for free",
    difficulty: "Expert",
    xp: 600,
    completed: false,
    icon: "🔲",
    row: 4,
    col: 1,
  },
  {
    id: 8,
    title: "AI & ML",
    description: "Master free AI tools",
    difficulty: "Expert",
    xp: 800,
    completed: false,
    icon: "🤖",
    row: 5,
    col: 1,
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400"
    case "Medium":
      return "text-yellow-400"
    case "Hard":
      return "text-orange-400"
    case "Expert":
      return "text-red-400"
    default:
      return "text-cyan-400"
  }
}

const isLevelLocked = (levelId: number, completedLevels: number[]) => {
  // Level 1 is always unlocked
  if (levelId === 1) return false
  // Other levels unlock only after completing the previous level
  return !completedLevels.includes(levelId - 1)
}

const drawConnections = (canvas: HTMLCanvasElement, completedLevels: number[]) => {
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const levelPositions: Record<number, [number, number]> = {
    1: [canvas.width / 2, 60],
    2: [canvas.width / 2, 150],
    3: [canvas.width / 2, 240],
    4: [canvas.width / 2, 330],
    5: [canvas.width / 2, 420],
    6: [canvas.width / 2, 510],
    7: [canvas.width / 2, 600],
    8: [canvas.width / 2, 690],
  }

  const drawCurvedLine = (from: number, to: number, isCompleted: boolean) => {
    const [x1, y1] = levelPositions[from]
    const [x2, y2] = levelPositions[to]

    // Alternate curve directions for winding effect
    const curveDirection = from % 2 === 0 ? 1 : -1
    const curveAmount = 80 * curveDirection

    if (isCompleted) {
      ctx.strokeStyle = "rgba(34, 211, 238, 0.8)"
      ctx.lineWidth = 4
      ctx.shadowColor = "rgba(34, 211, 238, 0.6)"
      ctx.shadowBlur = 15
    } else {
      ctx.strokeStyle = "rgba(34, 211, 238, 0.3)"
      ctx.lineWidth = 2
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
    }

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.bezierCurveTo(x1 + curveAmount, y1 + (y2 - y1) / 2, x2 + curveAmount, y1 + (y2 - y1) / 2, x2, y2)
    ctx.stroke()
    ctx.shadowColor = "transparent"
  }

  // Draw lines between sequential levels
  for (let i = 1; i < 8; i++) {
    const isCompleted = completedLevels.includes(i)
    drawCurvedLine(i, i + 1, isCompleted)
  }
}

export default function PlayPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // All hooks must be called before any conditional returns
  const levels = INITIAL_LEVELS.map((level) => ({
    ...level,
    locked: isLevelLocked(level.id, completedLevels),
    completed: completedLevels.includes(level.id),
  }))

  // Draw connections effect
  React.useEffect(() => {
    if (canvasRef.current && status === "authenticated") {
      drawConnections(canvasRef.current, completedLevels)
      const handleResize = () => {
        if (canvasRef.current) {
          drawConnections(canvasRef.current, completedLevels)
        }
      }
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [completedLevels, status])

  const handleCompleteLevel = (levelId: number) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId])
    }
    setSelectedLevel(null)
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Middleware ensures we have a session, but check just in case
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 relative overflow-hidden">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 border-b border-cyan-500/10 bg-gradient-to-b from-slate-950/90 to-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/education-quest-logo.png"
                alt="Education Quest Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">Education Quest</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-400">Welcome back,</p>
              <p className="text-white font-semibold">{session.user?.name || session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-60 animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 text-balance">
            Tech Learning{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Space Journey
            </span>
          </h1>
          <p className="text-lg text-slate-400">
            Progress through levels like a cosmic adventure. Each completed level lights up your path to mastery!
          </p>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-semibold text-slate-300">Level</h3>
            </div>
            <p className="text-2xl font-bold text-white">{completedLevels.length}</p>
            <p className="text-xs text-slate-400">{8 - completedLevels.length} levels remaining</p>
          </div>

          <div className="border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Completed</h3>
            </div>
            <p className="text-2xl font-bold text-white">{completedLevels.length} / 8</p>
            <p className="text-xs text-slate-400">
              {completedLevels.length === 8 ? "Master achieved!" : "Keep going!"}
            </p>
          </div>

          <div className="border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-cyan-300" />
              <h3 className="text-sm font-semibold text-slate-300">Next Unlock</h3>
            </div>
            <p className="text-2xl font-bold text-white">Level {Math.min(completedLevels.length + 2, 8)}</p>
            <p className="text-xs text-slate-400">Complete current to unlock</p>
          </div>
        </div>

        {/* Level Map */}
        <div className="relative border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl p-8 backdrop-blur-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            width={400}
            height={800}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center gap-20 py-12">
            {levels.map((level) => (
              <LevelNode
                key={level.id}
                level={level}
                isSelected={selectedLevel === level.id}
                onClick={() => !level.locked && setSelectedLevel(level.id)}
              />
            ))}
          </div>
        </div>

        {/* Level Details Modal */}
        {selectedLevel && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 backdrop-blur-sm h-[95%] overflow-scroll w-full">
              {(() => {
                const level = levels.find((l) => l.id === selectedLevel)
                return (
                  <div  >
                    <ApiStepperPage/>
                    <button
                      onClick={() => handleCompleteLevel(selectedLevel)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50"
                    >
                      {level?.completed ? "Completed ✓" : "Complete Level"}
                    </button>
                  </ div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LevelNode({ level, isSelected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-full border-2 transition-all duration-300 ${level.locked ? "cursor-not-allowed" : "cursor-pointer"} w-20 h-20 flex flex-col items-center justify-center ${
        level.locked
          ? "border-slate-700/50 bg-slate-900/20 opacity-60"
          : level.completed
            ? "border-green-500/70 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/30"
            : isSelected
              ? "border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/50"
              : "border-cyan-500/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/30"
      }`}
    >
      {level.locked ? (
        <Lock className="w-6 h-6 text-slate-500" />
      ) : (
        <>
          <div className="text-2xl mb-1">{level.icon}</div>
          <span className="text-xs font-bold text-white text-center leading-tight">
            {level.completed ? "✓" : `L${level.id}`}
          </span>
        </>
      )}
    </div>
  )
}
