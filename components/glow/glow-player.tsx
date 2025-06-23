"use client"

import { useState, useRef, useEffect } from "react"
import type { GlowVideo } from "../../types/glow"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Music, Play, Volume2, VolumeX, CheckCircle } from "lucide-react"

interface GlowPlayerProps {
  video: GlowVideo
  isActive: boolean
  onLike: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
  onUserClick: (userId: string) => void
}

export function GlowPlayer({ video, isActive, onLike, onComment, onShare, onUserClick }: GlowPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>

      {/* Left Side - User Info & Description */}
      <div className="absolute bottom-20 left-4 right-20 text-white">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onUserClick(video.user.id)} className="flex items-center gap-3 hover:opacity-80">
            <img
              src={video.user.avatar || "/placeholder.svg"}
              alt={video.user.displayName}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{video.user.displayName}</span>
                {video.user.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />}
              </div>
              <span className="text-white/80 text-sm">@{video.user.username}</span>
            </div>
          </button>
          <Button size="sm" className="bg-white text-black hover:bg-white/90 font-semibold px-6">
            Follow
          </Button>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg mb-2">{video.title}</h3>
        <p className="text-white/90 mb-3 line-clamp-2">{video.description}</p>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {video.moodTags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>

        {/* Music Info */}
        {video.music && (
          <div className="flex items-center gap-2 text-white/80">
            <Music className="w-4 h-4" />
            <span className="text-sm">
              {video.music.title} - {video.music.artist}
            </span>
          </div>
        )}
      </div>

      {/* Right Side - Actions */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-6">
        {/* Like */}
        <div className="flex flex-col items-center">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => onLike(video.id)}
            className={`w-12 h-12 rounded-full ${
              video.isLiked ? "bg-red-500/20 text-red-400" : "bg-white/20 text-white"
            } hover:scale-110 transition-all`}
          >
            <Heart className={`w-6 h-6 ${video.isLiked ? "fill-current" : ""}`} />
          </Button>
          <span className="text-white text-xs mt-1">{formatNumber(video.likes)}</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => onComment(video.id)}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:scale-110 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs mt-1">{formatNumber(video.comments)}</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => onShare(video.id)}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:scale-110 transition-all"
          >
            <Share2 className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs mt-1">{formatNumber(video.shares)}</span>
        </div>

        {/* Volume */}
        <Button
          size="lg"
          variant="ghost"
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/20 text-white hover:scale-110 transition-all"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </Button>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button size="sm" variant="ghost" className="text-white bg-black/20 backdrop-blur-sm">
          Report
        </Button>
      </div>
    </div>
  )
}
