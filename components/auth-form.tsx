"use client"

import React, { useState } from "react"
import { auth } from "@/lib/firebase"
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc" // Google icon
import { SignupForm } from "./signup-form"

interface AuthFormProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [showSignup, setShowSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      alert("Logged in successfully 🎉")
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      alert("Logged in with Google 🎉")
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (showSignup) {
    return <SignupForm onSuccess={onSuccess} onBack={() => setShowSignup(false)} />
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-muted-foreground">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-muted"></div>
            <span className="mx-3 text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-muted"></div>
          </div>

          {/* Google Login */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11 flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          {/* Switch to Signup */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setShowSignup(true)}
              >
                Create Account
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
