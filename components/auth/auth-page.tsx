"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/auth-context"
import { LoginForm } from "./login-form"
import SignupForm from './signup-form';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"

export function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [urlError, setUrlError] = useState("")
  const [isClient, setIsClient] = useState(false) // ⬅️ to track hydration
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams?.get("error")
    if (error) {
      switch (error) {
        case "callback_failed":
          setUrlError("Authentication failed. Please try again.")
          break
        case "no_session":
          setUrlError("Session not found. Please sign in again.")
          break
        default:
          setUrlError("An error occurred during authentication.")
      }
    }

    setIsClient(true) // ⬅️ set after mount
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse mx-auto">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-400">Loading your cosmic realm...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect via layout
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative">
      {/* Background Effects - deferred to client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

          {/* Network constellation effect */}
          <div className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
                style={{
                  left: `${10 + i * 7}%`,
                  top: `${20 + i * 5}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6 relative z-10">
        {urlError && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-400">{urlError}</AlertDescription>
          </Alert>
        )}

        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}
