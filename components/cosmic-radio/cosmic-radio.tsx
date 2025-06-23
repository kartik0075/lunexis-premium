"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Minimize2,
  Maximize2,
  Heart,
  Share2,
  List,
  Shuffle,
  Repeat,
  Settings,
} from "lucide-react"

interface CosmicTrack {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  url: string
  artwork?: string
  mood: string
  genre: string
  bpm?: number
}

interface CosmicRadioProps {
  currentMood?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

const COSMIC_TRACKS: CosmicTrack[] = [
  {
    id: "1",
    title: "Stellar Drift",
    artist: "Cosmic Waves",
    album: "Nebula Dreams",
    duration: 240,
    url: "/audio/stellar-drift.mp3",
    artwork: "/images/stellar-drift.jpg",
    mood: "calm",
    genre: "Ambient",
    bpm: 60,
  },
  {
    id: "2",
    title: "Galaxy Pulse",
    artist: "Void Echoes",
    album: "Deep Space",
    duration: 180,
    url: "/audio/galaxy-pulse.mp3",
    artwork: "/images/galaxy-pulse.jpg",
    mood: "energetic",
    genre: "Electronic",
    bpm: 128,
  },
  {
    id: "3",
    title: "Lunar Meditation",
    artist: "Astral Sounds",
    album: "Moonlight Sessions",
    duration: 300,
    url: "/audio/lunar-meditation.mp3",
    artwork: "/images/lunar-meditation.jpg",
    mood: "peaceful",
    genre: "Meditation",
    bpm: 45,
  },
  {
    id: "4",
    title: "Cosmic Love",
    artist: "Stardust Romance",
    album: "Hearts in Space",
    duration: 210,
    url: "/audio/cosmic-love.mp3",
    artwork: "/images/cosmic-love.jpg",
    mood: "romantic",
    genre: "Ambient Pop",
    bpm: 75,
  },
  {
    id: "5",
    title: "Supernova Energy",
    artist: "Quantum Beats",
    album: "High Energy Cosmos",
    duration: 195,
    url: "/audio/supernova-energy.mp3",
    artwork: "/images/supernova-energy.jpg",
    mood: "excited",
    genre: "Synthwave",
    bpm: 140,
  },
]

export function CosmicRadio({ currentMood = "calm", isMinimized = false, onToggleMinimize }: CosmicRadioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<CosmicTrack>(COSMIC_TRACKS[0])
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [playlist, setPlaylist] = useState<CosmicTrack[]>(COSMIC_TRACKS)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0
        audio.play()
      } else {
        playNext()
      }
    }

    const handleLoadedMetadata = () => {
      audio.volume = volume
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [isLooping, volume])

  useEffect(() => {
    // Filter tracks based on current mood
    const moodTracks = COSMIC_TRACKS.filter(
      (track) =>
        track.mood === currentMood ||
        (currentMood === "nostalgic" && track.mood === "calm") ||
        (currentMood === "joyful" && track.mood === "energetic"),
    )

    if (moodTracks.length > 0) {
      setPlaylist(moodTracks)
      if (!isPlaying) {
        setCurrentTrack(moodTracks[0])
        setCurrentIndex(0)
      }
    }
  }, [currentMood, isPlaying])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  const playNext = () => {
    let nextIndex

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length)
    } else {
      nextIndex = (currentIndex + 1) % playlist.length
    }

    setCurrentIndex(nextIndex)
    setCurrentTrack(playlist[nextIndex])

    // Auto-play next track if currently playing
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play()
      }, 100)
    }
  }

  const playPrevious = () => {
    let prevIndex

    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length)
    } else {
      prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    }

    setCurrentIndex(prevIndex)
    setCurrentTrack(playlist[prevIndex])

    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play()
      }, 100)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * currentTrack.duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)

    const audio = audioRef.current
    if (audio) {
      audio.volume = newVolume
    }

    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0

  const getMoodColor = (mood: string) => {
    const colors = {
      calm: "from-blue-500 to-cyan-500",
      energetic: "from-red-500 to-orange-500",
      peaceful: "from-green-500 to-teal-500",
      romantic: "from-pink-500 to-rose-500",
      excited: "from-yellow-500 to-orange-500",
      nostalgic: "from-purple-500 to-indigo-500",
    }
    return colors[mood as keyof typeof colors] || "from-purple-500 to-pink-500"
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50 w-80">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                {currentTrack.artwork ? (
                  <img
                    src={currentTrack.artwork || "/placeholder.svg"}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getMoodColor(currentTrack.mood)} flex items-center justify-center`}
                  >
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{currentTrack.title}</h4>
                <p className="text-slate-400 text-xs truncate">{currentTrack.artist}</p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimize}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-2">
              <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getMoodColor(currentTrack.mood)} transition-all duration-300`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <audio ref={audioRef} src={currentTrack.url} />
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50 w-96">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getMoodColor(currentTrack.mood)} flex items-center justify-center`}
              >
                <Radio className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Cosmic Radio</h3>
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 capitalize">
                  {currentMood} vibes
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current Track */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              {currentTrack.artwork ? (
                <img
                  src={currentTrack.artwork || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${getMoodColor(currentTrack.mood)} flex items-center justify-center`}
                >
                  <Radio className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold truncate">{currentTrack.title}</h4>
              <p className="text-slate-400 text-sm truncate">{currentTrack.artist}</p>
              {currentTrack.album && <p className="text-slate-500 text-xs truncate">{currentTrack.album}</p>}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                  {currentTrack.genre}
                </Badge>
                {currentTrack.bpm && (
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                    {currentTrack.bpm} BPM
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`h-8 w-8 p-0 ${isLiked ? "text-red-400" : "text-slate-400"} hover:text-red-300`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <Slider value={[progressPercentage]} onValueChange={handleSeek} max={100} step={0.1} className="w-full" />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`h-8 w-8 p-0 ${isShuffled ? "text-purple-400" : "text-slate-400"} hover:text-purple-300`}
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={playPrevious}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${getMoodColor(currentTrack.mood)} hover:opacity-90`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={playNext}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLooping(!isLooping)}
                className={`h-8 w-8 p-0 ${isLooping ? "text-purple-400" : "text-slate-400"} hover:text-purple-300`}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              className="flex-1"
            />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Playlist */}
          {showPlaylist && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <h4 className="text-white font-medium mb-2">Current Playlist ({playlist.length})</h4>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {playlist.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrack(track)
                      setCurrentIndex(index)
                      if (isPlaying) {
                        setTimeout(() => audioRef.current?.play(), 100)
                      }
                    }}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      track.id === currentTrack.id
                        ? "bg-purple-500/20 border border-purple-500/30"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                      {track.artwork ? (
                        <img
                          src={track.artwork || "/placeholder.svg"}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getMoodColor(track.mood)} flex items-center justify-center`}
                        >
                          <Radio className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{track.title}</p>
                      <p className="text-slate-400 text-xs truncate">{track.artist}</p>
                    </div>
                    <span className="text-slate-500 text-xs">{formatTime(track.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <audio ref={audioRef} src={currentTrack.url} />
    </div>
  )
}
