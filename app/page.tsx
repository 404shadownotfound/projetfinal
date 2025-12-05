"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Gamepad2, Trophy, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChainAnimation } from "@/components/3d/chain-animation"
import { CubeNetwork } from "@/components/3d/cube-network"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-cyan-500/10 bg-gradient-to-b from-slate-950/90 to-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <Link href="#home" className="hover:text-cyan-400 transition-colors duration-300">
              Home
            </Link>
            <Link href="#leaderboard" className="hover:text-cyan-400 transition-colors duration-300">
              Leaderboard
            </Link>
            <Link href="#about" className="hover:text-cyan-400 transition-colors duration-300">
              About Us
            </Link>
          </div>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-full px-6 shadow-lg shadow-cyan-500/30 transition-all duration-300">
              Play Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative max-w-7xl mx-auto px-6 py-20 min-h-screen flex items-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                Master Tech Skills for{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-pulse">
                  Free
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Learn modern tech solutions that replace expensive Windows software. Play, learn, and compete with users
                worldwide—all completely free.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/play">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50">
                  Start Learning Now
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-6 rounded-lg bg-transparent hover:border-cyan-400 transition-all duration-300"
              >
                View Leaderboard
              </Button>
            </div>
          </div>

          {/* Right Column - 3D Animation */}
          <div className="relative h-96 lg:h-full min-h-96">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm">
              <ChainAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Why Learn Section */}
      <section id="why" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-cyan-500/10">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -bottom-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 text-balance">
            Why Learn With <span className="text-cyan-400">Education Quest?</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Unlock free access to modern tech alternatives and build valuable skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "100% Free",
              description: "No hidden fees or subscriptions required",
            },
            {
              icon: Users,
              title: "Community Driven",
              description: "Learn alongside thousands of users",
            },
            {
              icon: Gamepad2,
              title: "Gamified Learning",
              description: "Earn points and achievements while learning",
            },
            {
              icon: Trophy,
              title: "Compete Globally",
              description: "Climb the leaderboard and win rewards",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 hover:from-cyan-500/10 hover:to-blue-500/10 rounded-xl p-6 transition-all duration-300 overflow-hidden backdrop-blur-sm hover:border-cyan-400/60"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300 -z-10"></div>
              <feature.icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="works" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-cyan-500/10">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white text-balance">
              How <span className="text-cyan-400">Education Quest</span> Works
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Choose from curated lessons on free alternatives to Windows software. Complete challenges, earn XP points,
              unlock achievements, and climb the global leaderboard. Learn at your own pace while competing with friends
              and developers worldwide.
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300">
              Learn More
            </Button>
          </div>

          <div className="relative h-96">
            <div className="absolute inset-0 rounded-xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm">
              <CubeNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-cyan-500/10">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 text-balance">
            See <span className="text-cyan-400">Education Quest</span> in Action
          </h2>
          <p className="text-slate-400 text-lg">
            Watch how players master free tech alternatives and climb the global leaderboard.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-300 -z-10"></div>
          <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center group cursor-pointer">
            <video src="/placeholder.mp4" controls className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 bg-gradient-to-b from-slate-950/50 to-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/education-quest-logo.png"
                    alt="Education Quest"
                    width={32}
                    height={32}
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white">Education Quest</h3>
              </div>
              <p className="text-slate-400 text-sm">Master free tech alternatives and build valuable skills.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Learn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 Education Quest. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
