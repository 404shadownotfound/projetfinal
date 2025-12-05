"use client"

import React, { useState } from "react"
import { Terminal, Play, CheckCircle, XCircle, Code } from "lucide-react"
import { StepContent } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

interface LabTask {
  id: number
  title: string
  description: string
  hint?: string
  validation?: (code: string) => boolean
}

interface LabStepMetadata {
  title: string
  description?: string
  instructions: string
  tasks: LabTask[]
  starterCode?: string
  language?: string
}

interface LabStepProps {
  metadata: LabStepMetadata
  onComplete?: () => void
}

export function LabStep({ metadata, onComplete }: LabStepProps) {
  const [code, setCode] = useState(metadata.starterCode || "")
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())
  const [showHints, setShowHints] = useState<Set<number>>(new Set())

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("Running code...\n")

    // Simulate code execution
    setTimeout(() => {
      // Validate tasks
      const newCompleted = new Set(completedTasks)
      metadata.tasks.forEach((task) => {
        if (task.validation && task.validation(code)) {
          newCompleted.add(task.id)
        }
      })
      setCompletedTasks(newCompleted)

      // Mock output
      setOutput(`Executed successfully!\n\nCompleted tasks: ${newCompleted.size}/${metadata.tasks.length}`)
      setIsRunning(false)

      // Check if all tasks are completed
      if (newCompleted.size === metadata.tasks.length && onComplete) {
        onComplete()
      }
    }, 1500)
  }

  const toggleHint = (taskId: number) => {
    const newHints = new Set(showHints)
    if (newHints.has(taskId)) {
      newHints.delete(taskId)
    } else {
      newHints.add(taskId)
    }
    setShowHints(newHints)
  }

  const allTasksCompleted = completedTasks.size === metadata.tasks.length

  return (
    <StepContent title={metadata.title} description={metadata.description}>
      <div className="space-y-6">
        {/* Instructions */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Instructions
          </h3>
          <p className="text-slate-300 leading-relaxed">{metadata.instructions}</p>
        </div>

        {/* Tasks Checklist */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">Tasks to Complete</h3>
          {metadata.tasks.map((task) => {
            const isCompleted = completedTasks.has(task.id)
            const showHint = showHints.has(task.id)

            return (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-300",
                  isCompleted ? "border-green-500 bg-green-500/5" : "border-slate-700 bg-slate-900/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      isCompleted ? "bg-green-500" : "bg-slate-700"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs text-white">{task.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-semibold", isCompleted ? "text-green-400" : "text-white")}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                    
                    {/* Hint Button */}
                    {task.hint && !isCompleted && (
                      <button
                        onClick={() => toggleHint(task.id)}
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {showHint ? "Hide Hint" : "Show Hint 💡"}
                      </button>
                    )}
                    
                    {/* Hint Content */}
                    {showHint && task.hint && (
                      <div className="mt-2 p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                        <p className="text-sm text-yellow-200">{task.hint}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Code Editor */}
        <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300 font-medium">
                {metadata.language || "Code Editor"}
              </span>
            </div>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={cn(
                "px-4 py-1.5 rounded text-sm font-semibold transition-all duration-300",
                "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
                "hover:shadow-lg hover:shadow-cyan-500/50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-3 h-3" />
                  Run Code
                </span>
              )}
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {/* Output Console */}
        {output && (
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
              <span className="text-sm text-slate-300 font-medium">Output</span>
            </div>
            <pre className="p-4 text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {/* Completion Message */}
        {allTasksCompleted && (
          <div className="p-6 rounded-xl bg-green-500/10 border-2 border-green-500">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <div>
                <h3 className="text-xl font-bold text-white">All Tasks Completed! 🎉</h3>
                <p className="text-green-300">Great work! You can now proceed to the next step.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepContent>
  )
}
