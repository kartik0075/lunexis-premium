"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "../lib/supabase"
import type { User, AuthState, LoginCredentials, SignupCredentials, ProfileUpdateData } from "../types/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: ProfileUpdateData) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const defaultMoodStatus = {
  current: "calm" as const,
  emoji: "🌙",
  lastUpdated: new Date().toISOString(),
  ambientColor: "#60A5FA",
  intensity: 5,
  isPublic: true,
}

const defaultAmbientTheme = {
  primary: "#8B5CF6",
  secondary: "#EC4899",
  accent: "#06B6D4",
  name: "Cosmic Purple",
  particles: true,
  effects: ["glow", "particles"],
}

const defaultStats = {
  glowPosts: 0,
  visionVideos: 0,
  orbitStreams: 0,
  totalViews: 0,
  timeCapsules: 0,
  communitiesJoined: 0,
  createdContent: 0,
  totalEngagement: 0,
}

const defaultPreferences = {
  theme: "dark" as const,
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
    profileVisibility: "public" as const,
    showMoodStatus: true,
    showActivity: true,
    allowMessages: "everyone" as const,
    showOnlineStatus: true,
  },
  content: {
    autoplay: true,
    dataUsage: "high" as const,
    contentFilter: "all" as const,
    language: "en",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadUserProfile(session.user.id)
      } else if (event === "SIGNED_OUT") {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error

      if (profile) {
        const user: User = {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          displayName: profile.display_name,
          avatar: profile.avatar_url || undefined,
          bio: profile.bio || undefined,
          moodStatus: profile.mood_status || defaultMoodStatus,
          ambientTheme: profile.ambient_theme || defaultAmbientTheme,
          badges: profile.badges || [],
          stats: profile.stats || defaultStats,
          isVerified: profile.is_verified,
          followers: profile.followers,
          following: profile.following,
          totalLikes: profile.total_likes,
          joinedAt: profile.joined_at,
          lastActive: profile.last_active,
          preferences: profile.preferences || defaultPreferences,
        }

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        // Update last active
        await supabase.from("profiles").update({ last_active: new Date().toISOString() }).eq("id", userId)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load user profile",
      }))
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      if (data.user) {
        await loadUserProfile(data.user.id)
      }
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Login failed",
      }))
      throw error
    }
  }

  const signup = async (credentials: SignupCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if username is available
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", credentials.username)
        .single()

      if (existingUser) {
        throw new Error("Username already taken")
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: credentials.email,
          username: credentials.username,
          display_name: credentials.displayName,
          mood_status: defaultMoodStatus,
          ambient_theme: defaultAmbientTheme,
          badges: [],
          stats: defaultStats,
          is_verified: false,
          followers: 0,
          following: 0,
          total_likes: 0,
          joined_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          preferences: defaultPreferences,
        })

        if (profileError) throw profileError

        await loadUserProfile(data.user.id)
      }
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Signup failed",
      }))
      throw error
    }
  }

  const loginWithGoogle = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Google sign-in failed",
      }))
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (updates: ProfileUpdateData) => {
    if (!authState.user) throw new Error("No user logged in")

    try {
      const updateData: any = {}

      if (updates.displayName) updateData.display_name = updates.displayName
      if (updates.bio !== undefined) updateData.bio = updates.bio
      if (updates.avatar !== undefined) updateData.avatar_url = updates.avatar
      if (updates.moodStatus) {
        updateData.mood_status = { ...authState.user.moodStatus, ...updates.moodStatus }
      }
      if (updates.ambientTheme) {
        updateData.ambient_theme = { ...authState.user.ambientTheme, ...updates.ambientTheme }
      }
      if (updates.preferences) {
        updateData.preferences = { ...authState.user.preferences, ...updates.preferences }
      }

      const { error } = await supabase.from("profiles").update(updateData).eq("id", authState.user.id)

      if (error) throw error

      // Refresh user data
      await loadUserProfile(authState.user.id)
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile")
    }
  }

  const refreshUser = async () => {
    if (authState.user) {
      await loadUserProfile(authState.user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
