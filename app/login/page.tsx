"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { RoboticHead } from "@/components/3d/robotic-head"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <nav className="sticky top-0 z-40 border-b border-cyan-500/10 bg-gradient-to-b from-slate-950/90 to-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/education-quest-logo.png"
                alt="Education Quest Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">Education Quest</span>
          </Link>
          <Link href="/register" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
            Don't have an account? Register
          </Link>
        </div>
      </nav>

      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl mx-auto flex-1 flex items-center justify-center px-4">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 3D Robotic Head Section */}
            <div className="hidden lg:flex h-full min-h-[500px] rounded-2xl overflow-hidden border border-blue-500/20 backdrop-blur-sm bg-gradient-to-br from-blue-950/20 to-slate-950/20 shadow-2xl shadow-blue-500/20">
              <RoboticHead />
            </div>

            {/* Login Form Section */}
            <div className="flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Welcome Back</h1>
                  <p className="text-blue-400/80 text-lg">Continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-blue-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-blue-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-blue-500" />
                      <span className="text-slate-300">Remember me</span>
                    </label>
                    <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 transition-all duration-300 neon-glow"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </form>

                {/* Social Login */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="px-4 py-2 rounded-lg border border-blue-500/30 bg-slate-900/50 text-white hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Google</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-blue-500/30 bg-slate-900/50 text-white hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Discord</span>
                  </button>
                </div>

                {/* Register Link */}
                <p className="text-center text-slate-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
