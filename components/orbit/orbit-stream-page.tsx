"use client"

import { useState, useEffect } from "react"
import type { OrbitStream, StreamAlert } from "../../types/orbit"
import { OrbitPlayer } from "./orbit-player"
import { OrbitChat } from "./orbit-chat"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Heart, Share2, Crown, Zap, Gift, UserPlus, Star } from "lucide-react"

// Mock stream data
const mockOrbitStream: OrbitStream = {
  id: "orbit_1",
  userId: "user_1",
  title: "Exploring Alien Worlds - Epic Space Adventure! 🚀",
  description: `Join me on an incredible journey through the cosmos as we explore mysterious alien worlds and uncover ancient secrets! 

Tonight's adventure includes:
- Discovering new planetary systems
- Epic space battles with cosmic entities  
- Building our ultimate starship
- Interactive viewer choices that shape our journey

Come hang out in chat and help guide our cosmic expedition! Your suggestions and energy make these streams amazing. Let's explore the unknown together! ✨

#SpaceExploration #Gaming #Interactive #CosmicAdventure`,
  category: {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    color: "#8B5CF6",
  },
  game: {
    id: "cosmic_odyssey",
    name: "Cosmic Odyssey",
    cover: "/placeholder.svg?height=100&width=75",
    genre: ["Adventure", "Sci-Fi"],
    developer: "Stellar Studios",
  },
  streamUrl: "/placeholder-video.mp4",
  thumbnailUrl: "/placeholder.svg?height=720&width=1280",
  isLive: true,
  startedAt: "2024-01-15T20:00:00Z",
  duration: 7320, // 2 hours 2 minutes
  viewerCount: 3421,
  peakViewers: 4567,
  likes: 2156,
  shares: 89,
  isLiked: false,
  moodTags: ["energetic", "interactive", "cosmic", "adventure"],
  streamKey: "live_abc123def456",
  quality: [
    { label: "1080p60", value: "1080p60", bitrate: 6000, resolution: "1920x1080" },
    { label: "720p60", value: "720p60", bitrate: 3500, resolution: "1280x720" },
    { label: "480p", value: "480p", bitrate: 2000, resolution: "854x480" },
  ],
  user: {
    id: "user_1",
    username: "cosmic_gamer",
    displayName: "Cosmic Gamer",
    avatar: "/placeholder.svg?height=50&width=50",
    isVerified: true,
    followers: 125000,
    isPartner: true,
  },
  chatSettings: {
    enabled: true,
    slowMode: 0,
    subscribersOnly: false,
    moderatorsOnly: false,
    allowLinks: true,
    allowEmotes: true,
    bannedWords: [],
  },
  streamSettings: {
    title: "Exploring Alien Worlds - Epic Space Adventure! 🚀",
    category: "gaming",
    game: "cosmic_odyssey",
    isPrivate: false,
    recordStream: true,
    enableChat: true,
    enableDonations: true,
    maturityRating: "everyone",
  },
}

interface OrbitStreamPageProps {
  streamId: string
  onBack: () => void
}

export function OrbitStreamPage({ streamId, onBack }: OrbitStreamPageProps) {
  const [stream] = useState<OrbitStream>(mockOrbitStream)
  const [alerts, setAlerts] = useState<StreamAlert[]>([])
  const [showStreamInfo, setShowStreamInfo] = useState(false)

  useEffect(() => {
    // Simulate stream alerts
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const alertTypes = ["follow", "subscription", "donation"] as const
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

        const newAlert: StreamAlert = {
          id: `alert_${Date.now()}`,
          type: randomType,
          user: {
            username: `user_${Math.floor(Math.random() * 1000)}`,
            displayName: `Cosmic User ${Math.floor(Math.random() * 1000)}`,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          message: randomType === "donation" ? "Thanks for the amazing stream!" : undefined,
          amount: randomType === "donation" ? Math.floor(Math.random() * 50) + 5 : undefined,
          duration: 5000,
        }

        setAlerts((prev) => [...prev, newAlert])

        // Remove alert after duration
        setTimeout(() => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id))
        }, newAlert.duration)
      }
    }, 10000)

    return () => clearInterval(alertInterval)
  }, [])

  const handleLike = (id: string) => {
    console.log("Like stream:", id)
    // TODO: Implement like functionality
  }

  const handleShare = (id: string) => {
    console.log("Share stream:", id)
    // TODO: Implement share functionality
  }

  const handleFollow = (userId: string) => {
    console.log("Follow user:", userId)
    // TODO: Implement follow functionality
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    return `Started ${diffInHours}h ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Orbit Live</span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Stream Player */}
            <OrbitPlayer stream={stream} onLike={handleLike} onShare={handleShare} onFollow={handleFollow} />

            {/* Stream Info */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">{stream.title}</h1>
                    <div className="flex items-center gap-4 text-slate-400 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{formatNumber(stream.viewerCount)} watching</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Peak: {formatNumber(stream.peakViewers)}</span>
                      </div>
                      <div>{formatTimeAgo(stream.startedAt)}</div>
                      <div>{formatDuration(stream.duration)}</div>
                    </div>

                    {/* Category and Game */}
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                        {stream.category.icon} {stream.category.name}
                      </Badge>
                      {stream.game && (
                        <div className="flex items-center gap-2">
                          <img
                            src={stream.game.cover || "/placeholder.svg"}
                            alt={stream.game.name}
                            className="w-6 h-8 object-cover rounded"
                          />
                          <span className="text-slate-300 text-sm">{stream.game.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Mood Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {stream.moodTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-300 cursor-pointer"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Description */}
                    <div className={`text-slate-300 ${showStreamInfo ? "" : "line-clamp-3"}`}>{stream.description}</div>

                    {stream.description.length > 200 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStreamInfo(!showStreamInfo)}
                        className="text-red-400 hover:text-red-300 p-0 h-auto mt-2"
                      >
                        {showStreamInfo ? "Show less" : "Show more"}
                      </Button>
                    )}
                  </div>

                  {/* Engagement Actions */}
                  <div className="flex items-center gap-2 ml-6">
                    <Button
                      variant="outline"
                      onClick={() => handleLike(stream.id)}
                      className={`flex items-center gap-2 ${
                        stream.isLiked
                          ? "bg-red-500/20 text-red-300 border-red-500/50"
                          : "border-slate-600 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${stream.isLiked ? "fill-current" : ""}`} />
                      <span>{formatNumber(stream.likes)}</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleShare(stream.id)}
                      className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                {/* Streamer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={stream.user.avatar || "/placeholder.svg"}
                      alt={stream.user.displayName}
                      className="w-12 h-12 rounded-full border-2 border-slate-600"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{stream.user.displayName}</h3>
                        {stream.user.isVerified && <Crown className="w-4 h-4 text-yellow-400" fill="currentColor" />}
                        {stream.user.isPartner && <Zap className="w-4 h-4 text-purple-400" fill="currentColor" />}
                      </div>
                      <p className="text-slate-400 text-sm">
                        @{stream.user.username} • {formatNumber(stream.user.followers)} followers
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleFollow(stream.user.id)}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Chat */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <OrbitChat
                streamId={stream.id}
                chatSettings={stream.chatSettings}
                viewerCount={stream.viewerCount}
                isStreamer={false}
                isModerator={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stream Alerts Overlay */}
      <div className="fixed top-24 right-6 z-50 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-lg p-4 border border-purple-400/50 animate-in slide-in-from-right duration-500"
          >
            <div className="flex items-center gap-3">
              {alert.type === "follow" && <UserPlus className="w-5 h-5 text-white" />}
              {alert.type === "subscription" && <Star className="w-5 h-5 text-white" />}
              {alert.type === "donation" && <Gift className="w-5 h-5 text-white" />}

              <div className="flex-1">
                <div className="text-white font-semibold text-sm">
                  {alert.type === "follow" && "New Follower!"}
                  {alert.type === "subscription" && "New Subscriber!"}
                  {alert.type === "donation" && `$${alert.amount} Donation!`}
                </div>
                <div className="text-white/90 text-sm">{alert.user.displayName}</div>
                {alert.message && <div className="text-white/80 text-xs mt-1 italic">"{alert.message}"</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
