"use client"

import React from "react"
import { Book } from "lucide-react"
import { StepContent } from "@/components/ui/stepper"

interface NameStepMetadata {
  title: string
  description?: string
  content: string
  objectives?: string[]
  duration?: string
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert"
}

interface NameStepProps {
  metadata: NameStepMetadata
}

export function NameStep({ metadata }: NameStepProps) {
  return (
    <StepContent title={metadata.title} description={metadata.description}>
      <div className="space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metadata.duration && (
            <div className="p-4 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <p className="text-xs text-slate-400 mb-1">Duration</p>
              <p className="text-lg font-semibold text-white">{metadata.duration}</p>
            </div>
          )}
          {metadata.difficulty && (
            <div className="p-4 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <p className="text-xs text-slate-400 mb-1">Difficulty</p>
              <p className="text-lg font-semibold text-white">{metadata.difficulty}</p>
            </div>
          )}
          <div className="p-4 rounded-lg bg-slate-900/50 border border-cyan-500/20">
            <p className="text-xs text-slate-400 mb-1">Type</p>
            <p className="text-lg font-semibold text-white">Theory</p>
          </div>
        </div>

        {/* Learning Objectives */}
        {metadata.objectives && metadata.objectives.length > 0 && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-cyan-400" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {metadata.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700">
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{metadata.content}</div>
          </div>
        </div>
      </div>
    </StepContent>
  )
}
