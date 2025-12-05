# Stepper Component System

A complete, flexible stepper component system with 4 specialized step types for educational content.

## 📦 Components

### Core Components

1. **Stepper** - Main stepper container with progress bar
2. **StepContent** - Wrapper for step content
3. **StepNavigation** - Navigation buttons for steps

### Step Components

1. **NameStep** - Theory/learning content
2. **QCMStep** - Multiple choice quiz
3. **LabStep** - Hands-on coding lab
4. **GameStep** - Interactive game challenge

## 🚀 Usage

### Basic Example

```tsx
import { Stepper, StepMetadata } from "@/components/ui/stepper"
import { NameStep } from "@/components/steps/name-step"
import { QCMStep } from "@/components/steps/qcm-step"
import { LabStep } from "@/components/steps/lab-step"
import { GameStep } from "@/components/steps/game-step"

const [currentStep, setCurrentStep] = useState(0)

const steps: StepMetadata[] = [
  { id: 1, label: "Learn", title: "Introduction", completed: false },
  { id: 2, label: "QCM", title: "Quiz", locked: false, completed: false },
  { id: 3, label: "Lab", title: "Practice", locked: true, completed: false },
  { id: 4, label: "Game", title: "Challenge", locked: true, completed: false },
]

<Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep}>
  <NameStep metadata={nameMetadata} />
  <QCMStep metadata={qcmMetadata} onComplete={handleQCMComplete} />
  <LabStep metadata={labMetadata} onComplete={handleLabComplete} />
  <GameStep metadata={gameMetadata} onComplete={handleGameComplete} />
</Stepper>
```

## 📋 Metadata Interfaces

### 1. NameStep (Theory/Learning)

```tsx
interface NameStepMetadata {
  title: string
  description?: string
  content: string                    // Main learning content
  objectives?: string[]              // Learning objectives
  duration?: string                  // e.g., "15 min"
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert"
}
```

**Example:**
```tsx
const nameMetadata = {
  title: "Introduction to Linux",
  description: "Learn the basics",
  content: "Linux is a powerful open-source operating system...",
  objectives: [
    "Understand what Linux is",
    "Learn basic commands",
    "Master file operations"
  ],
  duration: "15 min",
  difficulty: "Easy"
}
```

### 2. QCMStep (Quiz)

```tsx
interface QCMStepMetadata {
  title: string
  description?: string
  questions: Array<{
    id: number
    question: string
    options: string[]              // Array of answer options
    correctAnswer: number          // Index of correct answer
    explanation?: string           // Show after submission
  }>
  passingScore?: number           // Default: 70%
}
```

**Example:**
```tsx
const qcmMetadata = {
  title: "Linux Commands Quiz",
  description: "Test your knowledge",
  questions: [
    {
      id: 1,
      question: "Which command shows your current directory?",
      options: ["cd", "ls", "pwd", "mkdir"],
      correctAnswer: 2,
      explanation: "pwd (Print Working Directory) displays your current location."
    }
  ],
  passingScore: 75
}
```

### 3. LabStep (Hands-on Practice)

```tsx
interface LabStepMetadata {
  title: string
  description?: string
  instructions: string              // Lab instructions
  tasks: Array<{
    id: number
    title: string
    description: string
    hint?: string                   // Optional hint for students
    validation?: (code: string) => boolean  // Check if task is completed
  }>
  starterCode?: string             // Pre-filled code
  language?: string                // e.g., "Bash", "Python"
}
```

**Example:**
```tsx
const labMetadata = {
  title: "Linux Lab",
  description: "Practice commands",
  instructions: "Complete the tasks using Linux commands",
  language: "Bash",
  starterCode: "# Task 1: Print current directory\n\n",
  tasks: [
    {
      id: 1,
      title: "Print current directory",
      description: "Use pwd command",
      hint: "Think about 'print working directory'",
      validation: (code: string) => code.includes("pwd")
    }
  ]
}
```

### 4. GameStep (Challenge)

```tsx
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
  timeLimit?: number               // Seconds
  pointsToWin?: number
}
```

**Example:**
```tsx
const gameMetadata = {
  title: "Linux Command Challenge",
  description: "Test your skills!",
  gameType: "quiz",
  instructions: "Answer questions correctly. You have 3 lives and 60 seconds!",
  timeLimit: 60,
  questions: [
    {
      question: "Which command removes a file?",
      answer: "rm",
      options: ["rm", "delete", "del", "remove"]
    }
  ]
}
```

## 🎨 Features

### Stepper Features
- ✅ Visual progress bar
- ✅ Step completion tracking
- ✅ Locked/unlocked states
- ✅ Click navigation (for unlocked steps)
- ✅ Responsive design

### NameStep Features
- ✅ Rich text content display
- ✅ Learning objectives list
- ✅ Duration and difficulty indicators
- ✅ Clean, readable layout

### QCMStep Features
- ✅ Multiple choice questions
- ✅ Real-time answer selection
- ✅ Score calculation
- ✅ Pass/fail feedback
- ✅ Answer explanations
- ✅ Visual feedback (correct/incorrect)

### LabStep Features
- ✅ Code editor
- ✅ Task checklist
- ✅ Task validation
- ✅ Hints system
- ✅ Run code button
- ✅ Output console
- ✅ Progress tracking

### GameStep Features
- ✅ Interactive game UI
- ✅ Timer countdown
- ✅ Lives system
- ✅ Score tracking
- ✅ Win/lose conditions
- ✅ Play again functionality
- ✅ Real-time stats

## 📍 Navigation

Use the `StepNavigation` component for consistent navigation:

```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={steps.length}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onComplete={handleComplete}
  isNextDisabled={!completedSteps.has(currentStep)}
  nextLabel="Next Step"
  previousLabel="Previous"
  completeLabel="Complete"
/>
```

## 🎯 Complete Flow

1. **Learn** (NameStep) - Student reads theory
2. **Quiz** (QCMStep) - Test understanding
3. **Practice** (LabStep) - Hands-on coding
4. **Challenge** (GameStep) - Fun reinforcement

## 📁 File Structure

```
components/
├── ui/
│   └── stepper.tsx              # Core stepper component
└── steps/
    ├── name-step.tsx            # Theory/learning step
    ├── qcm-step.tsx             # Quiz step
    ├── lab-step.tsx             # Lab/practice step
    └── game-step.tsx            # Game challenge step

app/
└── stepper-example/
    └── page.tsx                 # Example implementation
```

## 🎨 Customization

All components use Tailwind CSS and can be customized via:
- `className` prop
- Tailwind classes
- `cn()` utility for conditional classes

## 🔄 Step State Management

```tsx
const [currentStep, setCurrentStep] = useState(0)
const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

// Mark step as completed
setCompletedSteps(new Set([...completedSteps, currentStep]))

// Check if step is completed
const isCompleted = completedSteps.has(stepIndex)
```

## 📱 Responsive Design

All components are fully responsive:
- Mobile-first design
- Adaptive layouts
- Touch-friendly interactions

## 🚀 Demo

Visit `/stepper-example` to see a complete working example with all 4 step types!

## 💡 Tips

1. **Lock steps** until previous ones are completed
2. **Validate completion** before allowing progression
3. **Provide feedback** at each step
4. **Use hints** in lab steps for struggling students
5. **Set appropriate time limits** for games
6. **Write clear explanations** for QCM answers

## 🎓 Best Practices

- Keep theory content concise and engaging
- Use 4-6 questions per QCM
- Make lab tasks progressively harder
- Balance game difficulty (not too easy, not impossible)
- Provide clear success criteria
- Give meaningful feedback

---

**Status**: ✅ Fully functional and ready to use!
