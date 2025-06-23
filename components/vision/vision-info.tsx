"use client"

import { useState } from "react"
import type { VisionVideo } from "../../types/vision"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Flag,
  CheckCircle,
  Calendar,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface VisionInfoProps {
  video: VisionVideo
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onShare: (id: string) => void
  onSubscribe: (userId: string) => void
}

export function VisionInfo({ video, onLike, onDislike, onShare, onSubscribe }: VisionInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
    onSubscribe(video.user.id)
  }

  return (
    <div className="space-y-4">
      {/* Title and Basic Info */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(video.views)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onLike(video.id)}
            className={`flex items-center gap-2 ${
              video.isLiked
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${video.isLiked ? "fill-current" : ""}`} />
            <span>{formatNumber(video.likes)}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => onDislike(video.id)}
            className={`flex items-center gap-2 ${
              video.isDisliked
                ? "bg-red-500/20 text-red-300 border-red-500/50"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${video.isDisliked ? "fill-current" : ""}`} />
            <span>{formatNumber(video.dislikes)}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => onShare(video.id)}
            className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </Button>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </Button>
      </div>

      {/* Creator Info */}
      <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={video.user.avatar || "/placeholder.svg"}
                alt={video.user.displayName}
                className="w-12 h-12 rounded-full border-2 border-slate-600"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{video.user.displayName}</h3>
                  {video.user.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />}
                </div>
                <p className="text-slate-400 text-sm">
                  @{video.user.username} • {formatNumber(video.user.subscribers)} subscribers
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubscribe}
              className={`${
                isSubscribed
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </div>

          {/* Description */}
          <div className="mt-4">
            <div className={`text-slate-300 ${showFullDescription ? "" : "line-clamp-3"}`}>{video.description}</div>

            {video.description.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-2"
              >
                {showFullDescription ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show more
                  </>
                )}
              </Button>
            )}

            {/* Mood Tags */}
            {video.moodTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {video.moodTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-300 cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chapters */}
      {video.chapters.length > 0 && (
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Chapters</h3>
            <div className="space-y-2">
              {video.chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <img
                    src={chapter.thumbnail || "/placeholder.svg"}
                    alt={chapter.title}
                    className="w-16 h-9 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-purple-400 text-sm font-medium">
                      {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-white text-sm">{chapter.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
