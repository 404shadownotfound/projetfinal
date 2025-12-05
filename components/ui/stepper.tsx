"use client"

import React, { useState } from "react"
import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepMetadata {
  id: number
  label: string
  title: string
  description?: string
  icon?: React.ReactNode
  locked?: boolean
  completed?: boolean
}

interface StepperProps {
  steps: StepMetadata[]
  currentStep: number
  onStepChange?: (step: number) => void
  children: React.ReactNode[]
  className?: string
}

export function Stepper({ steps, currentStep, onStepChange, children, className }: StepperProps) {
  const handleStepClick = (stepIndex: number) => {
    const step = steps[stepIndex]
    // Don't allow clicking on locked or future steps
    if (!step.locked && stepIndex <= currentStep && onStepChange) {
      onStepChange(stepIndex)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = step.completed || index < currentStep
            const isLocked = step.locked

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={isLocked || index > currentStep}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2",
                    "border-2 font-semibold text-sm",
                    isActive &&
                      "border-cyan-500 bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-110",
                    isCompleted &&
                      !isActive &&
                      "border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30 cursor-pointer",
                    !isActive &&
                      !isCompleted &&
                      !isLocked &&
                      "border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500 cursor-pointer",
                    isLocked && "border-slate-700 bg-slate-900 text-slate-600 cursor-not-allowed"
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : isCompleted && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </button>

                {/* Step Label */}
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors duration-300",
                      isActive ? "text-cyan-400" : isCompleted ? "text-green-400" : "text-slate-500"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {children[currentStep] || (
          <div className="text-center text-slate-400 py-12">
            <p>No content available for this step</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Individual Step Content Wrapper
interface StepContentProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function StepContent({ title, description, children, className }: StepContentProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {description && <p className="text-slate-400 text-lg">{description}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

// Step Navigation Buttons
interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onPrevious?: () => void
  onComplete?: () => void
  isNextDisabled?: boolean
  nextLabel?: string
  previousLabel?: string
  completeLabel?: string
  className?: string
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onComplete,
  isNextDisabled = false,
  nextLabel = "Next Step",
  previousLabel = "Previous",
  completeLabel = "Complete",
  className,
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1
  const isFirstStep = currentStep === 0

  return (
    <div className={cn("flex items-center justify-between mt-8 pt-6 border-t border-slate-800", className)}>
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={cn(
          "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
          "border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
      >
        {previousLabel}
      </button>

      <button
        onClick={isLastStep ? onComplete : onNext}
        disabled={isNextDisabled}
        className={cn(
          "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
          "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
          "hover:shadow-lg hover:shadow-cyan-500/50",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        )}
      >
        {isLastStep ? completeLabel : nextLabel}
      </button>
    </div>
  )
}
