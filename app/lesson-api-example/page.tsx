"use client"

import React, { useState } from "react"
import { Stepper, StepMetadata, StepNavigation } from "@/components/ui/stepper"
import { NameStep } from "@/components/steps/name-step"
import { QCMStep } from "@/components/steps/qcm-step"
import { LabStep } from "@/components/steps/lab-step"
import { MatchGameStep } from "@/components/steps/match-game-step"
import type { LessonApiResponse } from "@/types/lesson-api"
import { transformLessonData } from "@/lib/transformers"

// Sample API data (this would come from your MongoDB)
const sampleApiData: LessonApiResponse = {
  _id: { $oid: "6932710889913e73a061c1db" },
  role: "student",
  lesson: "Bureautique et documents",
  qcm: [
    {
      question: "Quelle suite bureautique open source remplace Microsoft Office ?",
      answers: ["Google Docs", "LibreOffice", "OpenAI"],
      correctAnswer: { $numberInt: "1" },
    },
    {
      question: "Avec quel logiciel peux-tu éditer des documents gratuitement sans compte cloud ?",
      answers: ["Photoshop", "LibreOffice Writer", "Office 365"],
      correctAnswer: { $numberInt: "1" },
    },
    {
      question: "Quel format de fichier garantit ta liberté d'édition ?",
      answers: [".docx propriétaire", ".odt open source", ".pdf verrouillé"],
      correctAnswer: { $numberInt: "1" },
    },
    {
      question: "Lequel est un avantage de l'open source pour les devoirs ?",
      answers: ["Paiement obligatoire", "Fonctionne hors ligne", "Données vendues"],
      correctAnswer: { $numberInt: "1" },
    },
    {
      question: "Quel logiciel open source pour les présentations ?",
      answers: ["PowerPoint", "Impress (LibreOffice)", "Canva Pro"],
      correctAnswer: { $numberInt: "1" },
    },
  ],
  lab: "Installe LibreOffice sur ton ordinateur. Crée un document texte avec images, un tableau et un graphique, puis exporte au format PDF. Compare le résultat avec un éditeur propriétaire.",
  game: {
    id: "bureautique",
    name: "Match les logiciels",
    description: "Associe chaque tâche à son équivalent open source",
    icon: "📝",
    difficulty: "easy",
    role: "student",
    dropZones: [
      {
        id: "opensource",
        label: "Open Source",
        color: "#4CAF50",
        position: [{ $numberInt: "-3" }, { $numberInt: "0" }, { $numberInt: "-2" }],
      },
      {
        id: "proprietary",
        label: "Propriétaire",
        color: "#F44336",
        position: [{ $numberInt: "3" }, { $numberInt: "0" }, { $numberInt: "-2" }],
      },
    ],
    items: [
      { id: { $numberInt: "1" }, name: "LibreOffice Calc", correctZone: "opensource", color: "#4CAF50" },
      { id: { $numberInt: "2" }, name: "Excel", correctZone: "proprietary", color: "#F44336" },
      { id: { $numberInt: "3" }, name: "GIMP", correctZone: "opensource", color: "#4CAF50" },
      { id: { $numberInt: "4" }, name: "Photoshop", correctZone: "proprietary", color: "#F44336" },
      { id: { $numberInt: "5" }, name: "Firefox", correctZone: "opensource", color: "#4CAF50" },
      { id: { $numberInt: "6" }, name: "Chrome", correctZone: "proprietary", color: "#F44336" },
    ],
  },
}

export default function ApiStepperPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Transform API data using the transformer
  const lessonData = transformLessonData(sampleApiData)

  const steps: StepMetadata[] = [
    {
      id: 1,
      label: "Learn",
      title: lessonData.lesson,
      completed: completedSteps.has(0),
    },
    {
      id: 2,
      label: "QCM",
      title: "Test Your Knowledge",
      locked: !completedSteps.has(0),
      completed: completedSteps.has(1),
    },
    {
      id: 3,
      label: "Lab",
      title: "Hands-on Practice",
      locked: !completedSteps.has(1),
      completed: completedSteps.has(2),
    },
    {
      id: 4,
      label: "Game",
      title: lessonData.gameStep.title,
      locked: !completedSteps.has(2),
      completed: completedSteps.has(3),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(new Set([...completedSteps, currentStep]))
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setCompletedSteps(new Set([...completedSteps, currentStep]))
    alert("🎉 Félicitations! Tu as terminé toutes les étapes!")
  }

  const handleQCMComplete = (score: number) => {
    console.log("QCM Score:", score)
    if (score >= lessonData.qcmStep.passingScore) {
      setCompletedSteps(new Set([...completedSteps, currentStep]))
    }
  }

  const handleLabComplete = () => {
    setCompletedSteps(new Set([...completedSteps, currentStep]))
  }

  const handleGameComplete = (score: number) => {
    console.log("Game Score:", score)
    if (score >= 70) {
      setCompletedSteps(new Set([...completedSteps, currentStep]))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">{lessonData.icon}</div>
            <div>
              <h1 className="text-4xl font-bold text-white">{lessonData.lesson}</h1>
              <p className="text-slate-400 text-lg">
                Apprends les alternatives open source aux logiciels propriétaires
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {lessonData.role}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {lessonData.difficulty}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep}>
          {/* Step 1: Theory */}
          <NameStep metadata={lessonData.nameStep} />

          {/* Step 2: QCM */}
          <QCMStep metadata={lessonData.qcmStep} onComplete={handleQCMComplete} />

          {/* Step 3: Lab */}
          <LabStep metadata={lessonData.labStep} onComplete={handleLabComplete} />

          {/* Step 4: Match Game */}
          <MatchGameStep
            title={lessonData.gameStep.title}
            description={lessonData.gameStep.description}
            icon={lessonData.gameStep.icon}
            difficulty={lessonData.gameStep.difficulty}
            dropZones={lessonData.gameStep.dropZones}
            items={lessonData.gameStep.items}
            onComplete={handleGameComplete}
          />
        </Stepper>

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onComplete={handleComplete}
          isNextDisabled={false}
        />
      </div>
    </div>
  )
}
