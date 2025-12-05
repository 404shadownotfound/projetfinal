/**
 * Transformer utilities to convert backend MongoDB format to frontend component format
 */

import type { LessonApiResponse } from "@/types/lesson-api"

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts MongoDB $numberInt format to JavaScript number
 */
function parseMongoInt(value: { $numberInt: string } | number | string): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return parseInt(value, 10)
  return parseInt(value.$numberInt, 10)
}

/**
 * Converts MongoDB $oid format to string ID
 */
function parseMongoId(value: { $oid: string } | string): string {
  if (typeof value === "string") return value
  return value.$oid
}

/**
 * Parses MongoDB position array to number array
 */
function parsePosition(position: Array<{ $numberInt: string } | number>): number[] {
  return position.map((p) => parseMongoInt(p))
}

// ============================================================================
// NAME STEP TRANSFORMER
// ============================================================================

export interface NameStepMetadata {
  title: string
  description: string
  content: string
  objectives: string[]
  duration: string
  difficulty: "Easy" | "Medium" | "Hard"
}

/**
 * Transforms API data to NameStep format
 * You can customize the content based on the lesson topic
 */
export function transformToNameStep(apiData: LessonApiResponse): NameStepMetadata {
  return {
    title: apiData.lesson,
    description: `Découvre ${apiData.lesson.toLowerCase()}`,
    content: `# ${apiData.lesson}

Ce module t'aidera à comprendre les concepts essentiels de ${apiData.lesson.toLowerCase()}.

## Objectifs d'apprentissage
À la fin de ce module, tu seras capable de :
- Comprendre les bases
- Appliquer les concepts en pratique
- Résoudre des problèmes réels

## Contexte
Cette leçon est conçue pour les ${apiData.role === "student" ? "étudiants" : "professionnels"} qui souhaitent approfondir leurs connaissances.

**Prêt à commencer ?** Passe à l'étape suivante pour tester tes connaissances !`,
    objectives: [
      `Comprendre ${apiData.lesson}`,
      "Identifier les concepts clés",
      "Appliquer les connaissances en pratique",
      "Maîtriser les outils essentiels",
    ],
    duration: "10 min",
    difficulty: apiData.game.difficulty === "easy" ? "Easy" : apiData.game.difficulty === "medium" ? "Medium" : "Hard",
  }
}

// ============================================================================
// QCM STEP TRANSFORMER
// ============================================================================

export interface QCMQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface QCMStepMetadata {
  title: string
  description: string
  questions: QCMQuestion[]
  passingScore: number
}

/**
 * Transforms API QCM data to QCMStep format
 */
export function transformToQCMStep(apiData: LessonApiResponse): QCMStepMetadata {
  return {
    title: `Quiz: ${apiData.lesson}`,
    description: "Teste tes connaissances avec ce questionnaire",
    questions: apiData.qcm.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.answers,
      correctAnswer: parseMongoInt(q.correctAnswer),
      explanation: undefined, // Backend can add explanations later
    })),
    passingScore: 60, // Default passing score (can be made configurable)
  }
}

// ============================================================================
// LAB STEP TRANSFORMER
// ============================================================================

export interface LabTask {
  id: number
  title: string
  description: string
  hint?: string
  validation: (code: string) => boolean
}

export interface LabStepMetadata {
  title: string
  description: string
  instructions: string
  language: string
  starterCode: string
  tasks: LabTask[]
}

/**
 * Transforms API lab data to LabStep format
 */
export function transformToLabStep(apiData: LessonApiResponse): LabStepMetadata {
  // Parse the lab instructions to create tasks
  const instructions = apiData.lab
  const tasks: LabTask[] = []

  // Auto-generate tasks from instructions (you can customize this logic)
  const sentences = instructions.split(". ")
  sentences.forEach((sentence, index) => {
    if (sentence.trim()) {
      tasks.push({
        id: index + 1,
        title: `Tâche ${index + 1}`,
        description: sentence.trim(),
        hint: "Suis les instructions étape par étape",
        validation: (code: string) => {
          // Simple validation: check if code mentions key words from the sentence
          const keywords = sentence.toLowerCase().split(" ").filter((w) => w.length > 4)
          return keywords.some((keyword) => code.toLowerCase().includes(keyword))
        },
      })
    }
  })

  return {
    title: `Lab: ${apiData.lesson}`,
    description: "Pratique ce que tu as appris",
    instructions: apiData.lab,
    language: "Instructions",
    starterCode: `# Checklist des tâches à accomplir:

${tasks.map((task, i) => `☐ ${i + 1}. ${task.description}`).join("\n")}

Notes:
`,
    tasks,
  }
}

// ============================================================================
// GAME STEP TRANSFORMER
// ============================================================================

export interface GameDropZone {
  id: string
  label: string
  color: string
  position?: number[]
}

export interface GameItem {
  id: number
  name: string
  correctZone: string
  color: string
}

export interface GameStepMetadata {
  title: string
  description: string
  icon: string
  difficulty: string
  dropZones: GameDropZone[]
  items: GameItem[]
}

/**
 * Transforms API game data to GameStep format
 */
export function transformToGameStep(apiData: LessonApiResponse): GameStepMetadata {
  return {
    title: apiData.game.name,
    description: apiData.game.description,
    icon: apiData.game.icon,
    difficulty: apiData.game.difficulty,
    dropZones: apiData.game.dropZones.map((zone) => ({
      id: zone.id,
      label: zone.label,
      color: zone.color,
      position: zone.position ? parsePosition(zone.position) : undefined,
    })),
    items: apiData.game.items.map((item) => ({
      id: parseMongoInt(item.id),
      name: item.name,
      correctZone: item.correctZone,
      color: item.color,
    })),
  }
}

// ============================================================================
// ALL-IN-ONE TRANSFORMER
// ============================================================================

export interface TransformedLessonData {
  lessonId: string
  role: string
  lesson: string
  icon: string
  difficulty: string
  nameStep: NameStepMetadata
  qcmStep: QCMStepMetadata
  labStep: LabStepMetadata
  gameStep: GameStepMetadata
}

/**
 * Main transformer: converts complete API response to all step formats
 */
export function transformLessonData(apiData: LessonApiResponse): TransformedLessonData {
  return {
    lessonId: parseMongoId(apiData._id),
    role: apiData.role,
    lesson: apiData.lesson,
    icon: apiData.game.icon,
    difficulty: apiData.game.difficulty,
    nameStep: transformToNameStep(apiData),
    qcmStep: transformToQCMStep(apiData),
    labStep: transformToLabStep(apiData),
    gameStep: transformToGameStep(apiData),
  }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
// In your component or API route:

import { transformLessonData } from '@/lib/transformers'

// Fetch data from backend
const apiResponse = await fetch('/api/lessons/123').then(res => res.json())

// Transform to frontend format
const lessonData = transformLessonData(apiResponse)

// Now use in your components:
<NameStep metadata={lessonData.nameStep} />
<QCMStep metadata={lessonData.qcmStep} />
<LabStep metadata={lessonData.labStep} />
<MatchGameStep {...lessonData.gameStep} />
*/
