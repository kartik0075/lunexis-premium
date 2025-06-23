"use client"

import { useState, useEffect, useRef } from "react"
import type { GlowVideo } from "../../types/glow"
import { GlowPlayer } from "./glow-player"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

// Mock data for Glow videos
const mockGlowVideos: GlowVideo[] = [
  {
    id: "glow_1",
    userId: "user_1",
    videoUrl: "/placeholder-video.mp4",
    thumbnailUrl: "/placeholder.svg?height=800&width=450",
    title: "Cosmic Dance Vibes ✨",
    description:
      "Lost in the rhythm of the universe! This beat just hits different when you're feeling the cosmic energy flow through you 🌌 #CosmicVibes",
    duration: 45,
    createdAt: "2024-01-15T10:30:00Z",
    likes: 12847,
    comments: 892,
    shares: 234,
    views: 45623,
    isLiked: false,
    moodTags: ["energetic", "inspired", "cosmic"],
    effects: [
      { id: "effect_1", name: "Galaxy Glow", type: "filter", intensity: 0.7, color: "#8B5CF6" },
      { id: "effect_2", name: "Stardust", type: "overlay", intensity: 0.5 },
    ],
    music: {
      id: "music_1",
      title: "Cosmic Waves",
      artist: "Nebula Sounds",
      duration: 180,
      url: "/placeholder-audio.mp3",
      coverArt: "/placeholder.svg?height=100&width=100",
    },
    user: {
      id: "user_1",
      username: "starweaver",
      displayName: "Luna Starweaver",
      avatar: "/placeholder.svg?height=50&width=50",
      isVerified: true,
    },
  },
  {
    id: "glow_2",
    userId: "user_2",
    videoUrl: "/placeholder-video.mp4",
    thumbnailUrl: "/placeholder.svg?height=800&width=450",
    title: "Midnight Reflections 🌙",
    description: "Sometimes the quiet moments speak the loudest. Finding peace in the cosmic silence.",
    duration: 72,
    createdAt: "2024-01-14T22:15:00Z",
    likes: 8934,
    comments: 456,
    shares: 123,
    views: 23456,
    isLiked: true,
    moodTags: ["calm", "nostalgic", "dreamy"],
    effects: [{ id: "effect_3", name: "Moonlight", type: "filter", intensity: 0.8, color: "#60A5FA" }],
    user: {
      id: "user_2",
      username: "aurora_dreams",
      displayName: "Aurora Dreams",
      avatar: "/placeholder.svg?height=50&width=50",
      isVerified: false,
    },
  },
  {
    id: "glow_3",
    userId: "user_3",
    videoUrl: "/placeholder-video.mp4",
    thumbnailUrl: "/placeholder.svg?height=800&width=450",
    title: "Hyper Energy Burst! ⚡",
    description: "When the beat drops and your soul ignites! Can't contain this cosmic energy! 🔥🚀",
    duration: 38,
    createdAt: "2024-01-14T18:45:00Z",
    likes: 15623,
    comments: 1234,
    shares: 567,
    views: 67890,
    isLiked: false,
    moodTags: ["hyper", "energetic"],
    effects: [
      { id: "effect_4", name: "Lightning", type: "overlay", intensity: 0.9, color: "#F59E0B" },
      { id: "effect_5", name: "Neon Glow", type: "filter", intensity: 0.6, color: "#EF4444" },
    ],
    music: {
      id: "music_2",
      title: "Electric Storm",
      artist: "Voltage Collective",
      duration: 195,
      url: "/placeholder-audio.mp3",
      coverArt: "/placeholder.svg?height=100&width=100",
    },
    user: {
      id: "user_3",
      username: "cosmic_energy",
      displayName: "Cosmic Energy",
      avatar: "/placeholder.svg?height=50&width=50",
      isVerified: true,
    },
  },
]

interface GlowFeedProps {
  onBack: () => void
  onCreateGlow: () => void
}

export function GlowFeed({ onBack, onCreateGlow }: GlowFeedProps) {
  const [videos, setVideos] = useState<GlowVideo[]>(mockGlowVideos)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle scroll to change videos
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      if (isScrolling) return

      const scrollTop = container.scrollTop
      const videoHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / videoHeight)

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
        setCurrentIndex(newIndex)
      }

      // Prevent rapid scrolling
      isScrolling = true
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 100)
    }

    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [currentIndex, videos.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentIndex > 0) {
        const newIndex = currentIndex - 1
        setCurrentIndex(newIndex)
        containerRef.current?.scrollTo({
          top: newIndex * window.innerHeight,
          behavior: "smooth",
        })
      } else if (e.key === "ArrowDown" && currentIndex < videos.length - 1) {
        const newIndex = currentIndex + 1
        setCurrentIndex(newIndex)
        containerRef.current?.scrollTo({
          top: newIndex * window.innerHeight,
          behavior: "smooth",
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, videos.length])

  const handleLike = (id: string) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video,
      ),
    )
  }

  const handleComment = (id: string) => {
    console.log("Comment on Glow:", id)
    // TODO: Open comment modal
  }

  const handleShare = (id: string) => {
    console.log("Share Glow:", id)
    // TODO: Open share modal
  }

  const handleUserClick = (userId: string) => {
    console.log("View user profile:", userId)
    // TODO: Navigate to user profile
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-white font-semibold">Glow</span>
        </div>

        <Button variant="ghost" size="sm" onClick={onCreateGlow} className="text-white hover:bg-white/20">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="h-screen snap-start">
            <GlowPlayer
              video={video}
              isActive={index === currentIndex}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onUserClick={handleUserClick}
            />
          </div>
        ))}
      </div>

      {/* Video Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  )
}
