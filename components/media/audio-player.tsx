"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Download,
  Share2,
  Heart,
  MoreHorizontal,
} from "lucide-react"

interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  album?: string
  artwork?: string
  autoPlay?: boolean
  loop?: boolean
  showWaveform?: boolean
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
}

export function AudioPlayer({
  src,
  title = "Unknown Track",
  artist = "Unknown Artist",
  album,
  artwork,
  autoPlay = false,
  loop = false,
  showWaveform = false,
  onTimeUpdate,
  onEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(loop)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [buffered, setBuffered] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime, audio.duration)

      // Update buffered progress
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
        setBuffered((bufferedEnd / audio.duration) * 100)
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleVolumeChange = () => {
      setVolume(audio.volume)
      setIsMuted(audio.muted)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("volumechange", handleVolumeChange)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("volumechange", handleVolumeChange)
    }
  }, [onTimeUpdate, onEnded])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0] / 100
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
  }

  const toggleLoop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = !isLooping
    setIsLooping(!isLooping)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={isLooping} preload="metadata" />

        <div className="flex items-center gap-4">
          {/* Artwork */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {artwork ? (
              <img src={artwork || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            ) : (
              <Volume2 className="w-8 h-8 text-white" />
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{title}</h3>
            <p className="text-slate-400 text-sm truncate">{artist}</p>
            {album && <p className="text-slate-500 text-xs truncate">{album}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? "text-red-400" : "text-slate-400"} hover:text-red-300`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="relative">
            {/* Buffered Progress */}
            <div className="absolute inset-0 bg-slate-700 rounded-full h-2">
              <div
                className="bg-slate-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${buffered}%` }}
              />
            </div>

            {/* Seek Bar */}
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="relative z-10"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Waveform Visualization */}
        {showWaveform && (
          <div className="mt-4 h-16 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="flex items-end gap-1 h-12">
              {Array.from({ length: 50 }, (_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-purple-500 to-pink-500 w-1 rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.random() * 100}%`,
                    opacity: i / 50 < progressPercentage / 100 ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffled(!isShuffled)}
              className={`${isShuffled ? "text-purple-400" : "text-slate-400"} hover:text-purple-300`}
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => skip(-10)} className="text-slate-400 hover:text-white">
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => skip(10)} className="text-slate-400 hover:text-white">
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLoop}
              className={`${isLooping ? "text-purple-400" : "text-slate-400"} hover:text-purple-300`}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleMute} className="text-slate-400 hover:text-white">
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
      </CardContent>
    </Card>
  )
}
