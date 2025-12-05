"use client"

import React, { useState } from "react"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { StepContent } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

interface QCMQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QCMStepMetadata {
  title: string
  description?: string
  questions: QCMQuestion[]
  passingScore?: number
}

interface QCMStepProps {
  metadata: QCMStepMetadata
  onComplete?: (score: number) => void
}

export function QCMStep({ metadata, onComplete }: QCMStepProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showExplanations, setShowExplanations] = useState(false)

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: optionIndex })
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setShowExplanations(true)
    
    // Calculate score
    const correctAnswers = metadata.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length
    const score = (correctAnswers / metadata.questions.length) * 100

    if (onComplete) {
      onComplete(score)
    }
  }

  const calculateScore = () => {
    const correctAnswers = metadata.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length
    return {
      correct: correctAnswers,
      total: metadata.questions.length,
      percentage: Math.round((correctAnswers / metadata.questions.length) * 100),
    }
  }

  const score = submitted ? calculateScore() : null
  const allAnswered = metadata.questions.every((q) => answers[q.id] !== undefined)

  return (
    <StepContent title={metadata.title} description={metadata.description}>
      <div className="space-y-6">
        {/* Score Display */}
        {submitted && score && (
          <div
            className={cn(
              "p-6 rounded-xl border-2",
              score.percentage >= (metadata.passingScore || 70)
                ? "bg-green-500/10 border-green-500"
                : "bg-red-500/10 border-red-500"
            )}
          >
            <div className="flex items-center gap-4">
              {score.percentage >= (metadata.passingScore || 70) ? (
                <CheckCircle className="w-12 h-12 text-green-400" />
              ) : (
                <XCircle className="w-12 h-12 text-red-400" />
              )}
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Your Score: {score.percentage}%
                </h3>
                <p className="text-slate-300">
                  {score.correct} out of {score.total} correct answers
                </p>
                {score.percentage >= (metadata.passingScore || 70) ? (
                  <p className="text-green-400 mt-1">🎉 Great job! You passed!</p>
                ) : (
                  <p className="text-red-400 mt-1">Keep practicing. You need {metadata.passingScore || 70}% to pass.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {metadata.questions.map((question, qIndex) => {
            const userAnswer = answers[question.id]
            const isCorrect = submitted && userAnswer === question.correctAnswer
            const isWrong = submitted && userAnswer !== undefined && userAnswer !== question.correctAnswer

            return (
              <div
                key={question.id}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all duration-300",
                  submitted && isCorrect && "border-green-500 bg-green-500/5",
                  submitted && isWrong && "border-red-500 bg-red-500/5",
                  !submitted && "border-slate-700 bg-slate-900/50"
                )}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-semibold text-sm">
                    {qIndex + 1}
                  </span>
                  <p className="text-lg text-white font-medium">{question.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-3 ml-11">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = userAnswer === optionIndex
                    const isCorrectOption = optionIndex === question.correctAnswer
                    const showCorrect = submitted && isCorrectOption
                    const showWrong = submitted && isSelected && !isCorrectOption

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                        disabled={submitted}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all duration-300",
                          "disabled:cursor-not-allowed",
                          !submitted && !isSelected && "border-slate-700 bg-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800",
                          !submitted && isSelected && "border-cyan-500 bg-cyan-500/10",
                          showCorrect && "border-green-500 bg-green-500/10",
                          showWrong && "border-red-500 bg-red-500/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                              !submitted && !isSelected && "border-slate-600",
                              !submitted && isSelected && "border-cyan-500 bg-cyan-500",
                              showCorrect && "border-green-500 bg-green-500",
                              showWrong && "border-red-500 bg-red-500"
                            )}
                          >
                            {isSelected && !submitted && <div className="w-2 h-2 rounded-full bg-white" />}
                            {showCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                            {showWrong && <XCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className={cn(
                            "text-sm",
                            showCorrect && "text-green-300 font-medium",
                            showWrong && "text-red-300",
                            !submitted && "text-slate-300"
                          )}>
                            {option}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {submitted && showExplanations && question.explanation && (
                  <div className="mt-4 ml-11 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-300 mb-1">Explanation</p>
                        <p className="text-sm text-slate-300">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={cn(
              "w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300",
              "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
              "hover:shadow-lg hover:shadow-cyan-500/50",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            )}
          >
            {allAnswered ? "Submit Answers" : `Answer all questions (${Object.keys(answers).length}/${metadata.questions.length})`}
          </button>
        )}
      </div>
    </StepContent>
  )
}
