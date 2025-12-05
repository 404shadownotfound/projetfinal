# Backend API Integration

## Transformer System

This project includes a robust transformer system to convert MongoDB/backend API responses into the format needed by the frontend components.

### The Problem

Your backend returns data in MongoDB's JSON format with special fields:
- `{ $oid: "..." }` for ObjectIds
- `{ $numberInt: "..." }` for integers

Your frontend components need clean, simple JavaScript types like:
- `string` for IDs
- `number` for integers

### The Solution

The `lib/transformers.ts` file provides transformation functions that handle this conversion automatically.

## Files Structure

```
lib/
  transformers.ts          # Main transformer functions
types/
  lesson-api.ts           # API response type definitions
components/steps/
  name-step.tsx           # Theory/learning step
  qcm-step.tsx           # Multiple choice quiz step
  lab-step.tsx           # Hands-on coding step
  match-game-step.tsx    # Drag-and-drop game step
app/
  lesson-api-example/
    page.tsx             # Complete working example
```

## How to Use

### Step 1: Define your API response type

In `types/lesson-api.ts`, your backend response type is already defined:

\`\`\`typescript
export interface LessonApiResponse {
  _id: { $oid: string }
  role: string
  lesson: string
  qcm: Array<{
    question: string
    answers: string[]
    correctAnswer: { $numberInt: string }
  }>
  lab: string
  game: {
    id: string
    name: string
    description: string
    icon: string
    difficulty: string
    role: string
    dropZones: Array<{
      id: string
      label: string
      color: string
      position: Array<{ $numberInt: string }>
    }>
    items: Array<{
      id: { $numberInt: string }
      name: string
      correctZone: string
      color: string
    }>
  }
}
\`\`\`

### Step 2: Fetch data from your backend

\`\`\`typescript
// In your component or API route
const apiResponse: LessonApiResponse = await fetch('/api/lessons/123')
  .then(res => res.json())
\`\`\`

### Step 3: Transform the data

\`\`\`typescript
import { transformLessonData } from '@/lib/transformers'

const lessonData = transformLessonData(apiResponse)

// Now you have clean, typed data:
// lessonData.lessonId       -> string (not { $oid: string })
// lessonData.nameStep       -> NameStepMetadata
// lessonData.qcmStep        -> QCMStepMetadata
// lessonData.labStep        -> LabStepMetadata
// lessonData.gameStep       -> GameStepMetadata
\`\`\`

### Step 4: Use in your components

\`\`\`typescript
<Stepper steps={steps} currentStep={currentStep}>
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
\`\`\`

## Available Transformer Functions

### Main Transformer

**`transformLessonData(apiData: LessonApiResponse): TransformedLessonData`**

Transforms the complete API response into all step formats at once.

Returns:
\`\`\`typescript
{
  lessonId: string           // Converted from { $oid: string }
  role: string
  lesson: string
  icon: string
  difficulty: string
  nameStep: NameStepMetadata
  qcmStep: QCMStepMetadata
  labStep: LabStepMetadata
  gameStep: GameStepMetadata
}
\`\`\`

### Individual Transformers

If you need to transform individual sections:

**`transformToNameStep(apiData: LessonApiResponse): NameStepMetadata`**
- Converts lesson data to theory/learning step format
- Generates objectives, duration, and difficulty level

**`transformToQCMStep(apiData: LessonApiResponse): QCMStepMetadata`**
- Converts QCM questions to quiz format
- Handles `{ $numberInt: string }` → `number` conversion for answers
- Sets passing score (default: 60%)

**`transformToLabStep(apiData: LessonApiResponse): LabStepMetadata`**
- Converts lab instructions to hands-on practice format
- Auto-generates tasks from instructions
- Creates starter code with checklist

**`transformToGameStep(apiData: LessonApiResponse): GameStepMetadata`**
- Converts game data to drag-and-drop format
- Handles position arrays and item IDs
- Transforms MongoDB integers to JavaScript numbers

## Example: Full Integration

See `/app/lesson-api-example/page.tsx` for a complete working example.

\`\`\`typescript
"use client"

import { transformLessonData } from "@/lib/transformers"
import type { LessonApiResponse } from "@/types/lesson-api"

// Your backend API response
const apiData: LessonApiResponse = {
  _id: { $oid: "6932710889913e73a061c1db" },
  role: "student",
  lesson: "Bureautique et documents",
  qcm: [...],
  lab: "...",
  game: {...}
}

export default function LessonPage() {
  // Transform once
  const lessonData = transformLessonData(apiData)
  
  // Use everywhere
  return (
    <div>
      <h1>{lessonData.lesson}</h1>
      <NameStep metadata={lessonData.nameStep} />
      <QCMStep metadata={lessonData.qcmStep} />
      {/* etc */}
    </div>
  )
}
\`\`\`

## Creating Your Own API Route

Create `/app/api/lessons/[id]/route.ts`:

\`\`\`typescript
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB()
  
  // Fetch from MongoDB
  const lesson = await db.collection("lessons").findOne({ 
    _id: new ObjectId(params.id) 
  })
  
  // Return raw MongoDB data - transformer will handle it
  return NextResponse.json(lesson)
}
\`\`\`

Then in your component:

\`\`\`typescript
"use client"

import { use, useState, useEffect } from "react"
import { transformLessonData } from "@/lib/transformers"

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lessonData, setLessonData] = useState(null)
  
  useEffect(() => {
    fetch(\`/api/lessons/\${params.id}\`)
      .then(res => res.json())
      .then(apiData => {
        const transformed = transformLessonData(apiData)
        setLessonData(transformed)
      })
  }, [params.id])
  
  if (!lessonData) return <div>Loading...</div>
  
  return <Stepper>{/* use lessonData */}</Stepper>
}
\`\`\`

## Customizing Transformations

You can customize how data is transformed by modifying `lib/transformers.ts`:

### Custom Name Step Content

\`\`\`typescript
export function transformToNameStep(apiData: LessonApiResponse): NameStepMetadata {
  // Add custom logic here
  const customContent = generateRichContent(apiData.lesson)
  
  return {
    title: apiData.lesson,
    description: \`Custom description for \${apiData.lesson}\`,
    content: customContent,
    objectives: generateObjectives(apiData),
    duration: calculateDuration(apiData),
    difficulty: mapDifficulty(apiData.game.difficulty),
  }
}
\`\`\`

### Custom Lab Task Generation

\`\`\`typescript
export function transformToLabStep(apiData: LessonApiResponse): LabStepMetadata {
  // Parse instructions more intelligently
  const tasks = parseInstructionsToTasks(apiData.lab)
  
  return {
    title: \`Lab: \${apiData.lesson}\`,
    tasks: tasks,
    // ... rest of the transformation
  }
}
\`\`\`

## Benefits

✅ **Type Safety**: Full TypeScript support from backend to frontend
✅ **Single Source of Truth**: Backend structure defines frontend automatically
✅ **Easy Maintenance**: Change backend format? Update transformer once
✅ **Reusable**: Transform once, use in multiple components
✅ **Clean Code**: Components don't need to know about MongoDB formats
✅ **Testable**: Easy to unit test transformation logic

## Testing

You can test transformers independently:

\`\`\`typescript
import { transformLessonData } from '@/lib/transformers'
import { mockApiData } from './fixtures'

describe('transformLessonData', () => {
  it('should convert MongoDB format to component format', () => {
    const result = transformLessonData(mockApiData)
    
    expect(result.lessonId).toBe('6932710889913e73a061c1db')
    expect(result.qcmStep.questions[0].correctAnswer).toBe(1) // number, not object
    expect(result.gameStep.items[0].id).toBe(1) // number, not object
  })
})
\`\`\`

## Next Steps

1. **Create your API routes** - Connect to your MongoDB database
2. **Fetch real data** - Replace hardcoded examples with API calls
3. **Add caching** - Use React Query or SWR for better performance
4. **Error handling** - Add try/catch and error states
5. **Loading states** - Show skeletons while data loads
6. **Customize transformers** - Adjust to your specific needs

## Questions?

Check `/app/lesson-api-example/page.tsx` for a complete working example that shows everything in action!
