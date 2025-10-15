"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { AuthForm } from "@/components/auth-form"
import { FcGoogle } from "react-icons/fc"

interface LandingPageProps {
  onEnterPlatform: () => void
}

export default function LandingPage({ onEnterPlatform }: LandingPageProps) {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) return <AuthForm onSuccess={onEnterPlatform} />

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-emerald-900/20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10">
        <header className="flex items-center justify-between p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold">Socials</span>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-white/80 mb-6 sm:mb-8">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Connect with India's brightest minds</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Connect.{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Compete.{" "}
              </span>
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Grow.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              The ultimate platform for students across premier institutions. Build connections, compete in
              leaderboards, and grow together.
            </p>

            <div className="flex flex-col items-center gap-3">
              <Button 
                onClick={() => setShowAuth(true)} 
                className="px-6 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Get Started
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-xs sm:text-sm text-white/60">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">1.2L+</div>
                <div className="text-xs sm:text-sm text-white/60">Students</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
