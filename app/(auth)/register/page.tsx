"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { ChevronRight, Trophy, Award, Star, Lock } from "lucide-react"
import { FloatingSphere } from "@/components/3d/floating-sphere"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null)
  const [error, setError] = useState("")

  const badges = [
    {
      id: 1,
      name: "Founder",
      description: "Early adopter of TechQuest",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      unlocked: true,
    },
    {
      id: 2,
      name: "Tech Learner",
      description: "Complete 5 tech lessons",
      icon: Award,
      color: "from-blue-500 to-cyan-500",
      unlocked: true,
    },
    {
      id: 3,
      name: "First Victory",
      description: "Win your first challenge",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      unlocked: false,
    },
    {
      id: 4,
      name: "Leaderboard Hero",
      description: "Reach top 100 globally",
      icon: Trophy,
      color: "from-red-500 to-pink-500",
      unlocked: false,
    },
    {
      id: 5,
      name: "Master Coder",
      description: "Complete all advanced lessons",
      icon: Award,
      color: "from-green-500 to-emerald-500",
      unlocked: false,
    },
    {
      id: 6,
      name: "Community Star",
      description: "Help 10 users in community",
      icon: Star,
      color: "from-indigo-500 to-blue-500",
      unlocked: false,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
          selectedBadge,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/play",
      })

      if (signInResult?.error) {
        throw new Error("Registration successful but login failed. Please login manually.")
      }
      // If successful, NextAuth will automatically redirect to /play
      // Middleware will also prevent accessing register page if authenticated
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Failed to register")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">Join Education Quest</h1>
            <p className="text-lg text-slate-400">Start your journey and unlock exclusive badges</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* 3D Animation Section - Mobile */}
              <div className="lg:hidden h-96 rounded-2xl overflow-hidden border border-blue-500/20 backdrop-blur-sm bg-gradient-to-br from-blue-950/20 to-slate-950/20 shadow-2xl shadow-blue-500/20">
                <FloatingSphere />
              </div>

              {/* Register Form */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Username Input */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-white">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose your username"
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-cyan-500 mt-1" required />
                    <span className="text-sm text-slate-300">
                      I agree to the{" "}
                      <Link href="#" className="text-cyan-400 hover:text-cyan-300">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-cyan-400 hover:text-cyan-300">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition-all duration-300"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                {/* Social Signup */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-400">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="px-4 py-2 rounded-lg border border-cyan-500/30 bg-slate-900/50 text-white hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Google</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-cyan-500/30 bg-slate-900/50 text-white hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Discord</span>
                  </button>
                </div>

                {/* Login Link */}
                <p className="text-center text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            {/* 3D Animation Section - Desktop */}
            <div className="hidden lg:flex h-[600px] rounded-2xl overflow-hidden border border-cyan-500/20 backdrop-blur-sm bg-gradient-to-br from-cyan-950/20 to-slate-950/20 shadow-2xl shadow-cyan-500/20 sticky top-20">
              <FloatingSphere />
            </div>
          </div>

          {/* Badges Section */}
          <div className="mt-20 border-t border-cyan-500/10 pt-20">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 text-balance">
                Unlock <span className="text-cyan-400">Exclusive Badges</span>
              </h2>
              <p className="text-slate-400 text-lg">Earn achievements as you learn and climb the leaderboard</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {badges.map((badge) => {
                const IconComponent = badge.icon
                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                    className="group relative"
                  >
                    <div
                      className={`relative h-32 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer ${
                        badge.unlocked
                          ? `border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30`
                          : "border-slate-700/50 bg-slate-900/30 hover:border-slate-600"
                      }`}
                    >
                      {!badge.unlocked && <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-500" />}

                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          badge.unlocked ? `bg-gradient-to-br ${badge.color}` : "bg-slate-700"
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 ${badge.unlocked ? "text-white" : "text-slate-600"}`} />
                      </div>

                      <h3
                        className={`text-xs font-semibold text-center ${badge.unlocked ? "text-white" : "text-slate-500"}`}
                      >
                        {badge.name}
                      </h3>
                    </div>

                    {/* Tooltip */}
                    {selectedBadge === badge.id && (
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 bg-slate-800 border border-cyan-500/50 rounded-lg p-3 w-48 shadow-xl">
                        <p className="text-sm text-white font-semibold mb-1">{badge.name}</p>
                        <p className="text-xs text-slate-300">{badge.description}</p>
                        {!badge.unlocked && (
                          <p className="text-xs text-cyan-400 mt-2">Complete the requirements to unlock</p>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
