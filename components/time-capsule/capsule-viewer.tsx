"use client"

import { useState } from "react"
import type { TimeCapsule, CapsuleContent } from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Users,
  Edit,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Bookmark,
  Flag,
  MoreHorizontal,
} from "lucide-react"

interface CapsuleViewerProps {
  capsule: TimeCapsule
  onBack: () => void
  onEdit: () => void
}

export function CapsuleViewer({ capsule, onBack, onEdit }: CapsuleViewerProps) {
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const isLocked = capsule.scheduledFor && new Date(capsule.scheduledFor) > new Date()
  const timeUntilUnlock = isLocked ? new Date(capsule.scheduledFor!).getTime() - new Date().getTime() : 0

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      nostalgic: "🌅",
      grateful: "🙏",
      excited: "⚡",
      peaceful: "🕊️",
      adventurous: "🚀",
      romantic: "💕",
      reflective: "🌙",
      joyful: "✨",
    }
    return moodEmojis[mood] || "🌙"
  }

  const renderContent = (content: CapsuleContent) => {
    if (isLocked) {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Time Capsule Locked</h3>
              <p className="text-slate-300 mb-4">This memory will unlock in:</p>
              <div className="text-2xl font-bold text-purple-400">{formatTimeRemaining(timeUntilUnlock)}</div>
            </div>
          </div>
          <div className="blur-sm opacity-30">
            {content.type === "image" && (
              <img
                src={content.data || "/placeholder.svg"}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            {content.type === "video" && <video src={content.data} className="w-full h-64 object-cover rounded-lg" />}
            {content.type === "text" && (
              <div className="bg-slate-800/50 p-6 rounded-lg">
                <p className="text-slate-300">{content.data}</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    switch (content.type) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={content.data || "/placeholder.svg"}
              alt={content.title}
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="outline" className="bg-black/50 border-white/20 text-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )

      case "video":
        return (
          <div className="relative">
            <video
              src={content.data}
              className="w-full h-auto max-h-96 rounded-lg"
              controls
              poster={content.metadata?.thumbnail}
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-black/50 border-white/20 text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 border-white/20 text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )

      case "audio":
        return (
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{content.title || "Audio Message"}</h4>
                <p className="text-slate-400 text-sm">
                  {content.metadata?.duration ? `${Math.round(content.metadata.duration / 1000)}s` : "Audio"}
                </p>
              </div>
            </div>
            <audio src={content.data} controls className="w-full" />
          </div>
        )

      case "text":
        return (
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <h4 className="text-white font-medium mb-3">{content.title}</h4>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{content.data}</p>
          </div>
        )

      case "link":
        return (
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <h4 className="text-white font-medium mb-3">{content.title}</h4>
            <a
              href={content.data}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline break-all"
            >
              {content.data}
            </a>
          </div>
        )

      default:
        return (
          <div className="bg-slate-800/50 p-6 rounded-lg text-center">
            <p className="text-slate-400">Unsupported content type: {content.type}</p>
          </div>
        )
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: capsule.theme.colors.background,
        backgroundSize: "400% 400%",
        animation: "gradient-shift 15s ease infinite",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Vault
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit} className="text-white hover:bg-white/10">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Capsule Header */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{capsule.title}</h1>
                <p className="text-white/80 text-lg mb-4">{capsule.description}</p>

                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(capsule.createdAt)}</span>
                  </div>
                  {capsule.scheduledFor && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {isLocked ? "Unlocks" : "Unlocked"} {formatDate(capsule.scheduledFor)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{capsule.views} views</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  {getMoodEmoji(capsule.mood)} {capsule.mood}
                </Badge>
                {capsule.visibility !== "private" && (
                  <Badge variant="outline" className="border-white/30 text-white/80">
                    {capsule.visibility}
                  </Badge>
                )}
              </div>
            </div>

            {/* Tags */}
            {capsule.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {capsule.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-white/30 text-white/80 bg-white/5">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Recipients */}
            {capsule.recipients.length > 0 && (
              <div className="flex items-center gap-2 text-white/70">
                <Users className="w-4 h-4" />
                <span>Shared with {capsule.recipients.length} people</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {capsule.content.map((content, index) => (
            <Card key={content.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                {content.title && <h3 className="text-xl font-semibold text-white mb-4">{content.title}</h3>}
                {renderContent(content)}
                {content.description && <p className="text-white/80 mt-4">{content.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactions */}
        {!isLocked && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <Heart className="w-5 h-5 mr-2" />
                    {capsule.reactions.length} Reactions
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowComments(!showComments)}
                    className="text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Comments
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-center py-8 text-white/60">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
