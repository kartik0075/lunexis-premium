"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import { Loader2, Sparkles } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/auth?error=callback_failed")
          return
        }

        if (data.session?.user) {
          // Check if this is a new user (first time Google sign-in)
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single()

          if (!profile) {
            // Create profile for new Google user
            const userData = data.session.user
            const username = userData.email?.split("@")[0] || `user_${userData.id.slice(0, 8)}`

            await supabase.from("profiles").insert({
              id: userData.id,
              email: userData.email,
              username: username.toLowerCase(),
              display_name: userData.user_metadata?.full_name || userData.email?.split("@")[0] || "Cosmic User",
              avatar_url: userData.user_metadata?.avatar_url,
              mood_status: {
                current: "cosmic",
                emoji: "✨",
                lastUpdated: new Date().toISOString(),
                ambientColor: "#8B5CF6",
                intensity: 5,
                isPublic: true,
              },
              ambient_theme: {
                primary: "#8B5CF6",
                secondary: "#EC4899",
                accent: "#06B6D4",
                name: "Cosmic Purple",
                particles: true,
                effects: ["glow", "particles"],
              },
              badges: [],
              stats: {
                glowPosts: 0,
                visionVideos: 0,
                orbitStreams: 0,
                totalViews: 0,
                timeCapsules: 0,
                communitiesJoined: 0,
                createdContent: 0,
                totalEngagement: 0,
              },
              is_verified: false,
              followers: 0,
              following: 0,
              total_likes: 0,
              joined_at: new Date().toISOString(),
              last_active: new Date().toISOString(),
              preferences: {
                theme: "dark",
                notifications: {
                  likes: true,
                  comments: true,
                  follows: true,
                  mentions: true,
                  liveStreams: true,
                  communityUpdates: true,
                  email: true,
                  push: true,
                },
                privacy: {
                  profileVisibility: "public",
                  showMoodStatus: true,
                  showActivity: true,
                  allowMessages: "everyone",
                  showOnlineStatus: true,
                },
                content: {
                  autoplay: true,
                  dataUsage: "high",
                  contentFilter: "all",
                  language: "en",
                },
              },
            })
          }

          // Redirect to home page
          router.push("/")
        } else {
          router.push("/auth?error=no_session")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/auth?error=callback_failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Entering the Cosmos</h1>
          <p className="text-slate-400">Setting up your cosmic identity...</p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="text-slate-300">Please wait</span>
        </div>
      </div>
    </div>
  )
}
