"use client"

import { useState, useRef, useEffect } from "react"
import type { OrbitStream } from "../../types/orbit"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Users,
  Heart,
  Share2,
  Radio,
  Zap,
  Crown,
} from "lucide-react"

interface OrbitPlayerProps {
  stream: OrbitStream
  onLike: (id: string) => void
  onShare: (id: string) => void
  onFollow: (userId: string) => void
}

export function OrbitPlayer({ stream, onLike, onShare, onFollow }: OrbitPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState("1080p")
  const [showSettings, setShowSettings] = useState(false)
  const [latency, setLatency] = useState(2.3)
  const [isFollowing, setIsFollowing] = useState(false)

  let controlsTimeout: NodeJS.Timeout

  useEffect(() => {
    // Simulate live stream latency updates
    const latencyInterval = setInterval(() => {
      setLatency(Math.random() * 3 + 1)
    }, 5000)

    return () => clearInterval(latencyInterval)
  }, [])

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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    onFollow(stream.user.id)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}:${minutes.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout)
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={stream.streamUrl}
        poster={stream.thumbnailUrl}
        className="w-full aspect-video object-cover"
        autoPlay
        onClick={togglePlay}
      />

      {/* Live Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-white text-sm font-semibold">LIVE</span>
        </div>
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          <Users className="w-4 h-4 inline mr-1" />
          {formatNumber(stream.viewerCount)}
        </div>
      </div>

      {/* Stream Info Overlay */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {formatDuration(stream.duration)}
        </div>
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {latency.toFixed(1)}s delay
        </div>
      </div>

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Center Play Button */}
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

        {/* Stream Title */}
        <div className="absolute bottom-20 left-4 right-4">
          <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{stream.title}</h3>

          {/* Streamer Info */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={stream.user.avatar || "/placeholder.svg"}
              alt={stream.user.displayName}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{stream.user.displayName}</span>
                {stream.user.isVerified && <Crown className="w-4 h-4 text-yellow-400" fill="currentColor" />}
                {stream.user.isPartner && <Zap className="w-4 h-4 text-purple-400" fill="currentColor" />}
              </div>
              <div className="text-white/80 text-sm">
                {formatNumber(stream.user.followers)} followers • {stream.category.name}
              </div>
            </div>
            <Button
              onClick={handleFollow}
              size="sm"
              className={`${
                isFollowing
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Game Info */}
          {stream.game && (
            <div className="flex items-center gap-2 mb-3">
              <img
                src={stream.game.cover || "/placeholder.svg"}
                alt={stream.game.name}
                className="w-8 h-8 rounded object-cover"
              />
              <span className="text-white/90 text-sm">{stream.game.name}</span>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(stream.id)}
                className={`text-white hover:bg-white/20 ${stream.isLiked ? "text-red-400" : ""}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${stream.isLiked ? "fill-current" : ""}`} />
                {formatNumber(stream.likes)}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(stream.id)}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 min-w-48">
          <div className="space-y-3">
            <div>
              <label className="text-white text-sm font-medium">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full mt-1 bg-slate-800 text-white text-sm rounded px-2 py-1 border border-slate-600"
              >
                {stream.quality.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label} ({q.resolution})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white text-sm font-medium">Latency Mode</label>
              <select className="w-full mt-1 bg-slate-800 text-white text-sm rounded px-2 py-1 border border-slate-600">
                <option value="low">Low Latency</option>
                <option value="normal">Normal</option>
                <option value="ultra">Ultra Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stream Offline Overlay */}
      {!stream.isLive && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center">
            <Radio className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Stream Offline</h3>
            <p className="text-slate-400">This stream has ended</p>
          </div>
        </div>
      )}
    </div>
  )
}
