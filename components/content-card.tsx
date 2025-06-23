"use client"

import { useState } from "react"
import type { FeedContent, ContentType } from "../types/feed"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Play, Users, Clock, CheckCircle } from "lucide-react"

interface ContentCardProps {
  content: FeedContent
  onLike: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
}

const contentTypeConfig: Record<ContentType, { label: string; color: string; icon: string }> = {
  glow: { label: "Glow", color: "bg-gradient-to-r from-pink-500 to-purple-500", icon: "✨" },
  vision: { label: "Vision", color: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: "🎬" },
  orbit: { label: "Orbit", color: "bg-gradient-to-r from-red-500 to-orange-500", icon: "🚀" },
}

export function ContentCard({ content, onLike, onComment, onShare }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const typeConfig = contentTypeConfig[content.type]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div
      className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-slate-600/70 hover:shadow-2xl hover:shadow-purple-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content Type Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className={`${typeConfig.color} px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1`}
        >
          <span>{typeConfig.icon}</span>
          {typeConfig.label}
        </div>
      </div>

      {/* Live Badge for Orbit */}
      {content.type === "orbit" && content.isLive && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 px-2 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            LIVE
          </div>
        </div>
      )}

      {/* Thumbnail/Video Area */}
      <div className="relative aspect-[4/5] bg-slate-800 overflow-hidden group">
        <img
          src={content.thumbnail || "/placeholder.svg"}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
            <Play className="w-6 h-6 text-white" fill="white" />
          </Button>
        </div>

        {/* Duration/Viewer Count */}
        <div className="absolute bottom-4 right-4">
          {content.type === "orbit" && content.isLive ? (
            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatNumber(content.viewerCount)}
            </div>
          ) : (
            content.duration && (
              <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {content.duration}
              </div>
            )
          )}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={content.user.avatar || "/placeholder.svg"}
            alt={content.user.displayName}
            className="w-10 h-10 rounded-full border-2 border-slate-600"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h4 className="text-white font-semibold text-sm">{content.user.displayName}</h4>
              {content.user.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />}
            </div>
            <p className="text-slate-400 text-xs">
              @{content.user.username} • {content.createdAt}
            </p>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{content.title}</h3>
        <p className="text-slate-300 text-sm mb-3 line-clamp-2">{content.description}</p>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {content.moodTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(content.id)}
              className={`flex items-center gap-2 transition-colors ${
                content.isLiked ? "text-red-400 hover:text-red-300" : "text-slate-400 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${content.isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{formatNumber(content.likes)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(content.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{formatNumber(content.comments)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(content.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">{formatNumber(content.shares)}</span>
            </Button>
          </div>

          <div className="text-slate-500 text-xs">{formatNumber(content.viewCount)} views</div>
        </div>
      </div>
    </div>
  )
}
