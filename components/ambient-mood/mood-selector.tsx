"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Zap,
  Waves,
  Sparkles,
  Moon,
  Star,
  Palette,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Activity,
} from "lucide-react"
import type { MoodState, UserMoodStatus, AmbientSettings } from "../../types/ambient-mood"

const MOOD_STATES: MoodState[] = [
  {
    id: "cosmic_bliss",
    name: "Cosmic Bliss",
    emoji: "✨",
    color: "#8B5CF6",
    gradient: ["#8B5CF6", "#EC4899", "#06B6D4"],
    description: "Feeling connected to the universe",
    intensity: 8,
    category: "creative",
    effects: [
      {
        type: "particles",
        config: {
          colors: ["#8B5CF6", "#EC4899", "#06B6D4"],
          speed: 2,
          size: 3,
          opacity: 0.7,
        },
        intensity: 8,
      },
    ],
    soundscape: "cosmic_ambient",
    particles: {
      count: 50,
      size: { min: 2, max: 6 },
      speed: { min: 1, max: 3 },
      colors: ["#8B5CF6", "#EC4899", "#06B6D4"],
      shapes: ["star", "circle"],
      behavior: "float",
    },
  },
  {
    id: "stellar_energy",
    name: "Stellar Energy",
    emoji: "⚡",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#EF4444", "#EC4899"],
    description: "Bursting with creative energy",
    intensity: 9,
    category: "energetic",
    effects: [
      {
        type: "pulse",
        config: {
          colors: ["#F59E0B", "#EF4444"],
          speed: 4,
          size: 5,
          opacity: 0.8,
        },
        intensity: 9,
      },
    ],
    soundscape: "energetic_beats",
    particles: {
      count: 75,
      size: { min: 3, max: 8 },
      speed: { min: 2, max: 5 },
      colors: ["#F59E0B", "#EF4444", "#EC4899"],
      shapes: ["star", "diamond"],
      behavior: "dance",
    },
  },
  {
    id: "lunar_calm",
    name: "Lunar Calm",
    emoji: "🌙",
    color: "#06B6D4",
    gradient: ["#06B6D4", "#8B5CF6", "#1E293B"],
    description: "Peaceful and serene like moonlight",
    intensity: 4,
    category: "calm",
    effects: [
      {
        type: "wave",
        config: {
          colors: ["#06B6D4", "#8B5CF6"],
          speed: 1,
          size: 2,
          opacity: 0.5,
        },
        intensity: 4,
      },
    ],
    soundscape: "lunar_meditation",
    particles: {
      count: 25,
      size: { min: 1, max: 4 },
      speed: { min: 0.5, max: 1.5 },
      colors: ["#06B6D4", "#8B5CF6"],
      shapes: ["circle"],
      behavior: "float",
    },
  },
  {
    id: "nebula_dreams",
    name: "Nebula Dreams",
    emoji: "🌌",
    color: "#EC4899",
    gradient: ["#EC4899", "#8B5CF6", "#3B82F6"],
    description: "Lost in cosmic daydreams",
    intensity: 6,
    category: "introspective",
    effects: [
      {
        type: "constellation",
        config: {
          colors: ["#EC4899", "#8B5CF6", "#3B82F6"],
          speed: 1.5,
          size: 4,
          opacity: 0.6,
        },
        intensity: 6,
      },
    ],
    soundscape: "dreamy_ambient",
    particles: {
      count: 40,
      size: { min: 2, max: 5 },
      speed: { min: 1, max: 2 },
      colors: ["#EC4899", "#8B5CF6", "#3B82F6"],
      shapes: ["star", "circle"],
      behavior: "orbit",
    },
  },
  {
    id: "solar_joy",
    name: "Solar Joy",
    emoji: "☀️",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#FBBF24", "#FCD34D"],
    description: "Radiating warmth and happiness",
    intensity: 8,
    category: "social",
    effects: [
      {
        type: "glow",
        config: {
          colors: ["#F59E0B", "#FBBF24"],
          speed: 3,
          size: 6,
          opacity: 0.7,
        },
        intensity: 8,
      },
    ],
    soundscape: "uplifting_melody",
    particles: {
      count: 60,
      size: { min: 3, max: 7 },
      speed: { min: 2, max: 4 },
      colors: ["#F59E0B", "#FBBF24", "#FCD34D"],
      shapes: ["star", "heart"],
      behavior: "burst",
    },
  },
  {
    id: "void_contemplation",
    name: "Void Contemplation",
    emoji: "🕳️",
    color: "#1E293B",
    gradient: ["#1E293B", "#374151", "#4B5563"],
    description: "Deep in thought and reflection",
    intensity: 3,
    category: "introspective",
    effects: [
      {
        type: "gradient",
        config: {
          colors: ["#1E293B", "#374151"],
          speed: 0.5,
          size: 1,
          opacity: 0.3,
        },
        intensity: 3,
      },
    ],
    soundscape: "deep_meditation",
    particles: {
      count: 15,
      size: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      colors: ["#4B5563", "#6B7280"],
      shapes: ["circle"],
      behavior: "float",
    },
  },
  {
    id: "aurora_romance",
    name: "Aurora Romance",
    emoji: "💖",
    color: "#EC4899",
    gradient: ["#EC4899", "#F472B6", "#FBBF24"],
    description: "Love flowing like northern lights",
    intensity: 7,
    category: "romantic",
    effects: [
      {
        type: "wave",
        config: {
          colors: ["#EC4899", "#F472B6", "#FBBF24"],
          speed: 2,
          size: 4,
          opacity: 0.6,
          pattern: "wave",
        },
        intensity: 7,
      },
    ],
    soundscape: "romantic_ambient",
    particles: {
      count: 45,
      size: { min: 2, max: 6 },
      speed: { min: 1, max: 3 },
      colors: ["#EC4899", "#F472B6", "#FBBF24"],
      shapes: ["heart", "star"],
      behavior: "dance",
    },
  },
  {
    id: "stardust_nostalgia",
    name: "Stardust Nostalgia",
    emoji: "🌟",
    color: "#A855F7",
    gradient: ["#A855F7", "#8B5CF6", "#6366F1"],
    description: "Remembering beautiful moments",
    intensity: 5,
    category: "nostalgic",
    effects: [
      {
        type: "particles",
        config: {
          colors: ["#A855F7", "#8B5CF6", "#6366F1"],
          speed: 1,
          size: 2,
          opacity: 0.4,
          pattern: "spiral",
        },
        intensity: 5,
      },
    ],
    soundscape: "nostalgic_melody",
    particles: {
      count: 35,
      size: { min: 1, max: 4 },
      speed: { min: 0.5, max: 1.5 },
      colors: ["#A855F7", "#8B5CF6", "#6366F1"],
      shapes: ["star", "diamond"],
      behavior: "cascade",
    },
  },
]

interface MoodSelectorProps {
  currentMood?: UserMoodStatus
  onMoodChange: (mood: UserMoodStatus) => void
  onClose: () => void
}

export function MoodSelector({ currentMood, onMoodChange, onClose }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodState>(currentMood?.currentMood || MOOD_STATES[0])
  const [intensity, setIntensity] = useState(currentMood?.intensity || 5)
  const [customMessage, setCustomMessage] = useState(currentMood?.customMessage || "")
  const [location, setLocation] = useState(currentMood?.location || "")
  const [activity, setActivity] = useState(currentMood?.activity || "")
  const [isPrivate, setIsPrivate] = useState(currentMood?.isPrivate || false)
  const [expiresIn, setExpiresIn] = useState<number>(0) // 0 = no expiry
  const [ambientSettings, setAmbientSettings] = useState<AmbientSettings>(
    currentMood?.ambientSettings || {
      enableEffects: true,
      effectIntensity: 7,
      enableSoundscape: false,
      soundscapeVolume: 50,
      enableParticles: true,
      particleCount: 50,
      autoMoodDetection: false,
      shareWithFriends: true,
      showInProfile: true,
    },
  )

  const handleSaveMood = () => {
    const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString() : undefined

    const newMoodStatus: UserMoodStatus = {
      userId: "current_user",
      currentMood: selectedMood,
      intensity,
      customMessage: customMessage || undefined,
      location: location || undefined,
      activity: activity || undefined,
      isPrivate,
      expiresAt,
      createdAt: new Date().toISOString(),
      ambientSettings,
    }

    onMoodChange(newMoodStatus)
    onClose()
  }

  const getMoodIcon = (mood: MoodState) => {
    switch (mood.category) {
      case "energetic":
        return <Zap className="w-5 h-5" />
      case "calm":
        return <Waves className="w-5 h-5" />
      case "creative":
        return <Palette className="w-5 h-5" />
      case "social":
        return <Heart className="w-5 h-5" />
      case "introspective":
        return <Moon className="w-5 h-5" />
      case "romantic":
        return <Heart className="w-5 h-5" />
      case "nostalgic":
        return <Star className="w-5 h-5" />
      default:
        return <Sparkles className="w-5 h-5" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Set Your Cosmic Mood</h2>
            <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
              ✕
            </Button>
          </div>

          {/* Mood Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {MOOD_STATES.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300 text-center
                  ${
                    selectedMood.id === mood.id
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-slate-600/50 bg-slate-800/50 hover:border-slate-500"
                  }
                `}
                style={{
                  background:
                    selectedMood.id === mood.id ? `linear-gradient(135deg, ${mood.gradient.join(", ")})` : undefined,
                  backgroundSize: "200% 200%",
                  animation: selectedMood.id === mood.id ? "gradient-shift 3s ease infinite" : undefined,
                }}
              >
                <div className="text-2xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium text-white">{mood.name}</div>
                <div className="text-xs text-slate-300 mt-1">{mood.description}</div>
              </button>
            ))}
          </div>

          {/* Selected Mood Details */}
          <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                {getMoodIcon(selectedMood)}
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMood.name}</h3>
                  <p className="text-slate-400 text-sm">{selectedMood.description}</p>
                </div>
                <Badge className="ml-auto" style={{ backgroundColor: selectedMood.color }}>
                  {selectedMood.category}
                </Badge>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Intensity</label>
                  <span className="text-sm text-slate-400">{intensity}/10</span>
                </div>
                <Slider
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Custom Message */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-slate-300">Custom Message (Optional)</label>
                <Input
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                />
              </div>

              {/* Context Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where are you?"
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Activity
                  </label>
                  <Input
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="What are you doing?"
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ambient Settings */}
          <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Ambient Effects</h4>

              <div className="space-y-4">
                {/* Visual Effects */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Visual Effects</span>
                  </div>
                  <Switch
                    checked={ambientSettings.enableEffects}
                    onCheckedChange={(checked) => setAmbientSettings((prev) => ({ ...prev, enableEffects: checked }))}
                  />
                </div>

                {ambientSettings.enableEffects && (
                  <div className="space-y-2 ml-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Effect Intensity</span>
                      <span className="text-sm text-slate-400">{ambientSettings.effectIntensity}/10</span>
                    </div>
                    <Slider
                      value={[ambientSettings.effectIntensity]}
                      onValueChange={(value) => setAmbientSettings((prev) => ({ ...prev, effectIntensity: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Particles */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Particles</span>
                  </div>
                  <Switch
                    checked={ambientSettings.enableParticles}
                    onCheckedChange={(checked) => setAmbientSettings((prev) => ({ ...prev, enableParticles: checked }))}
                  />
                </div>

                {/* Soundscape */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ambientSettings.enableSoundscape ? (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-slate-300">Ambient Soundscape</span>
                  </div>
                  <Switch
                    checked={ambientSettings.enableSoundscape}
                    onCheckedChange={(checked) =>
                      setAmbientSettings((prev) => ({ ...prev, enableSoundscape: checked }))
                    }
                  />
                </div>

                {ambientSettings.enableSoundscape && (
                  <div className="space-y-2 ml-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Volume</span>
                      <span className="text-sm text-slate-400">{ambientSettings.soundscapeVolume}%</span>
                    </div>
                    <Slider
                      value={[ambientSettings.soundscapeVolume]}
                      onValueChange={(value) => setAmbientSettings((prev) => ({ ...prev, soundscapeVolume: value[0] }))}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Duration */}
          <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Privacy & Duration</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPrivate ? (
                      <EyeOff className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-slate-300">Private Mood</span>
                  </div>
                  <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <label className="text-slate-300">Auto-expire after</label>
                  </div>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(Number(e.target.value))}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-md text-white"
                  >
                    <option value={0}>Never</option>
                    <option value={1}>1 hour</option>
                    <option value={4}>4 hours</option>
                    <option value={8}>8 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={168}>1 week</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Share with friends</span>
                  <Switch
                    checked={ambientSettings.shareWithFriends}
                    onCheckedChange={(checked) =>
                      setAmbientSettings((prev) => ({ ...prev, shareWithFriends: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Show in profile</span>
                  <Switch
                    checked={ambientSettings.showInProfile}
                    onCheckedChange={(checked) => setAmbientSettings((prev) => ({ ...prev, showInProfile: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveMood}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Set Cosmic Mood
            </Button>
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
