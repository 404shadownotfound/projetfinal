/**
 * API Types for Stepper Lesson Data
 */

// Main Lesson API Response
export interface LessonApiResponse {
  _id: {
    $oid: string
  }
  role: "student" | "teacher" | "admin"
  lesson: string
  qcm: QCMQuestion[]
  lab: string
  game: GameData
}

// QCM Question from API
export interface QCMQuestion {
  question: string
  answers: string[]
  correctAnswer: {
    $numberInt: string
  }
}

// Game Data from API
export interface GameData {
  id: string
  name: string
  description: string
  icon: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  role: string
  dropZones: DropZone[]
  items: GameItem[]
}

export interface DropZone {
  id: string
  label: string
  color: string
  position: Array<{ $numberInt: string }>
}

export interface GameItem {
  id: {
    $numberInt: string
  }
  name: string
  correctZone: string
  color: string
}

// Transformed types for component usage

export interface TransformedQCMQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface TransformedGameData {
  title: string
  description: string
  gameType: "match" | "quiz" | "puzzle" | "challenge"
  instructions: string
  icon?: string
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert"
  dropZones?: DropZone[]
  items?: GameItem[]
  questions?: Array<{
    question: string
    answer: string
    options?: string[]
  }>
  timeLimit?: number
}

// Helper function to transform API data to component format
export function transformLessonData(apiData: LessonApiResponse) {
  // Transform QCM questions
  const transformedQCM: TransformedQCMQuestion[] = apiData.qcm.map((q, index) => ({
    id: index + 1,
    question: q.question,
    options: q.answers,
    correctAnswer: parseInt(q.correctAnswer.$numberInt),
    explanation: undefined, // Can be added later
  }))

  // Transform Game data
  const transformedGame: TransformedGameData = {
    title: apiData.game.name,
    description: apiData.game.description,
    gameType: "match",
    instructions: `Match each item to the correct category. ${apiData.game.description}`,
    icon: apiData.game.icon,
    difficulty: capitalize(apiData.game.difficulty) as "Easy" | "Medium" | "Hard" | "Expert",
    dropZones: apiData.game.dropZones,
    items: apiData.game.items,
  }

  return {
    lessonId: apiData._id.$oid,
    role: apiData.role,
    lessonTitle: apiData.lesson,
    qcm: transformedQCM,
    lab: apiData.lab,
    game: transformedGame,
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Metadata for Name Step (theory content)
export interface NameStepFromAPI {
  title: string
  description?: string
  content: string
  objectives?: string[]
  duration?: string
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert"
}

// Complete lesson structure
export interface CompleteLessonData {
  lessonId: string
  role: string
  lessonTitle: string
  nameStep: NameStepFromAPI
  qcmStep: {
    title: string
    description?: string
    questions: TransformedQCMQuestion[]
    passingScore?: number
  }
  labStep: {
    title: string
    description?: string
    instructions: string
    tasks: Array<{
      id: number
      title: string
      description: string
      hint?: string
      validation?: (code: string) => boolean
    }>
    starterCode?: string
    language?: string
  }
  gameStep: TransformedGameData
}
