"use client"

import React, { useState, useEffect } from "react"
import { Gamepad2, Trophy, Star, Heart, Zap } from "lucide-react"
import { StepContent } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

interface GameStepMetadata {
  title: string
  description?: string
  gameType: "quiz" | "match" | "puzzle" | "challenge"
  instructions: string
  questions?: Array<{
    question: string
    answer: string
    options?: string[]
  }>
  timeLimit?: number
  pointsToWin?: number
}

interface GameStepProps {
  metadata: GameStepMetadata
  onComplete?: (score: number) => void
}

export function GameStep({ metadata, onComplete }: GameStepProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(metadata.timeLimit || 60)
  const [gameOver, setGameOver] = useState(false)
  const [isWinner, setIsWinner] = useState(false)

  // Timer
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      endGame(false)
    }
  }, [gameStarted, timeLeft, gameOver])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setLives(3)
    setCurrentQuestion(0)
    setTimeLeft(metadata.timeLimit || 60)
    setGameOver(false)
    setIsWinner(false)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const newScore = score + 100
      setScore(newScore)
      
      // Check win condition
      if (metadata.questions && currentQuestion + 1 >= metadata.questions.length) {
        endGame(true)
      } else {
        setCurrentQuestion(currentQuestion + 1)
      }
    } else {
      const newLives = lives - 1
      setLives(newLives)
      
      if (newLives <= 0) {
        endGame(false)
      } else if (metadata.questions && currentQuestion + 1 < metadata.questions.length) {
        setCurrentQuestion(currentQuestion + 1)
      }
    }
  }

  const endGame = (won: boolean) => {
    setGameOver(true)
    setIsWinner(won)
    if (onComplete) {
      onComplete(score)
    }
  }

  // Pre-game screen
  if (!gameStarted) {
    return (
      <StepContent title={metadata.title} description={metadata.description}>
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Play?</h2>
              <p className="text-slate-300 text-lg">{metadata.instructions}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4">
              {metadata.timeLimit && (
                <div className="p-4 rounded-lg bg-slate-900/50 border border-purple-500/30">
                  <p className="text-xs text-slate-400 mb-1">Time Limit</p>
                  <p className="text-2xl font-bold text-white">{metadata.timeLimit}s</p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-slate-900/50 border border-purple-500/30">
                <p className="text-xs text-slate-400 mb-1">Lives</p>
                <p className="text-2xl font-bold text-white">3 ❤️</p>
              </div>
              {metadata.questions && (
                <div className="p-4 rounded-lg bg-slate-900/50 border border-purple-500/30">
                  <p className="text-xs text-slate-400 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-white">{metadata.questions.length}</p>
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Start Game 🎮
            </button>
          </div>
        </div>
      </StepContent>
    )
  }

  // Game over screen
  if (gameOver) {
    return (
      <StepContent title={metadata.title}>
        <div className="max-w-2xl mx-auto">
          <div
            className={cn(
              "p-8 rounded-2xl border-2 text-center space-y-6",
              isWinner
                ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500"
                : "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500"
            )}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              {isWinner ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <Gamepad2 className="w-10 h-10 text-white" />
              )}
            </div>

            <div>
              <h2 className="text-4xl font-bold text-white mb-3">
                {isWinner ? "🎉 You Won!" : "Game Over"}
              </h2>
              <p className="text-slate-300 text-lg mb-4">
                {isWinner ? "Congratulations! You completed the challenge!" : "Don't worry, try again!"}
              </p>
              <div className="text-5xl font-bold text-cyan-400">{score} Points</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Questions Answered</p>
                <p className="text-xl font-bold text-white">{currentQuestion + 1}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Lives Remaining</p>
                <p className="text-xl font-bold text-white">{lives} ❤️</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      </StepContent>
    )
  }

  // Active game screen
  const question = metadata.questions?.[currentQuestion]

  return (
    <StepContent title={metadata.title}>
      <div className="space-y-6">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/50 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-slate-400">Score</p>
            </div>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-900/50 border border-red-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-red-400" />
              <p className="text-xs text-slate-400">Lives</p>
            </div>
            <p className="text-2xl font-bold text-white">{"❤️".repeat(lives)}</p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-900/50 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-slate-400">Time</p>
            </div>
            <p className="text-2xl font-bold text-white">{timeLeft}s</p>
          </div>
        </div>

        {/* Progress */}
        {metadata.questions && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Question {currentQuestion + 1} of {metadata.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / metadata.questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / metadata.questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        {question && (
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-2 border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">{question.question}</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option === question.answer)}
                  className="p-6 rounded-xl bg-slate-900/50 border-2 border-slate-700 hover:border-purple-500 hover:bg-purple-500/10 text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </StepContent>
  )
}
