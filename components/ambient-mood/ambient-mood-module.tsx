"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, BarChart3, Users, Settings, Palette, Volume2, Eye, Clock, Heart } from "lucide-react"
import { MoodSelector } from "./mood-selector"
import { MoodAnalytics } from "./mood-analytics"
import { MoodCommunity } from "./mood-community"
import { AmbientEffects } from "./ambient-effects"
import type { UserMoodStatus } from "../../types/ambient-mood"

interface AmbientMoodModuleProps {
  onBack: () => void
}

export function AmbientMoodModule({ onBack }: AmbientMoodModuleProps) {
  const [currentMood, setCurrentMood] = useState<UserMoodStatus | null>(null)
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [activeTab, setActiveTab] = useState("status")
  const [effectsEnabled, setEffectsEnabled] = useState(true)

  useEffect(() => {
    // Load saved mood status
    const savedMood = localStorage.getItem("lunexis_mood_status")
    if (savedMood) {
      try {
        const parsed = JSON.parse(savedMood)
        // Check if mood has expired
        if (!parsed.expiresAt || new Date(parsed.expiresAt) > new Date()) {
          setCurrentMood(parsed)
        }
      } catch (error) {
        console.error("Failed to parse saved mood:", error)
      }
    }
  }, [])

  const handleMoodChange = (newMood: UserMoodStatus) => {
    setCurrentMood(newMood)
    localStorage.setItem("lunexis_mood_status", JSON.stringify(newMood))
  }

  const handleJoinCommunity = (communityId: string) => {
    console.log("Joining community:", communityId)
    // Implement community joining logic
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Ambient Effects */}
      {currentMood && (
        <AmbientEffects
          moodStatus={currentMood}
          isActive={effectsEnabled && currentMood.ambientSettings.enableEffects}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Ambient Mood</h1>
                  <p className="text-sm text-slate-400">Express your cosmic energy</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEffectsEnabled(!effectsEnabled)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Eye className="w-4 h-4 mr-2" />
                {effectsEnabled ? "Hide Effects" : "Show Effects"}
              </Button>
              <Button
                onClick={() => setShowMoodSelector(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Palette className="w-4 h-4 mr-2" />
                Set Mood
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* Current Mood Status */}
        {currentMood && (
          <Card className="mb-6 bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${currentMood.currentMood.gradient.join(", ")})`,
                    }}
                  >
                    {currentMood.currentMood.emoji}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentMood.currentMood.name}</h2>
                    <p className="text-slate-300">{currentMood.currentMood.description}</p>
                    {currentMood.customMessage && (
                      <p className="text-slate-400 text-sm mt-1">"{currentMood.customMessage}"</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-slate-400">Intensity:</div>
                        <Badge variant="outline">{currentMood.intensity}/10</Badge>
                      </div>
                      {currentMood.location && <div className="text-sm text-slate-400">📍 {currentMood.location}</div>}
                      {currentMood.activity && <div className="text-sm text-slate-400">🎯 {currentMood.activity}</div>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {currentMood.ambientSettings.enableEffects && (
                      <Badge className="bg-purple-500/20 text-purple-400">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Effects
                      </Badge>
                    )}
                    {currentMood.ambientSettings.enableSoundscape && (
                      <Badge className="bg-blue-500/20 text-blue-400">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Audio
                      </Badge>
                    )}
                    {currentMood.isPrivate && <Badge className="bg-orange-500/20 text-orange-400">Private</Badge>}
                  </div>
                  {currentMood.expiresAt && (
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      {formatTimeRemaining(currentMood.expiresAt)}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">
                    Set {new Date(currentMood.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Mood Set */}
        {!currentMood && (
          <Card className="mb-6 bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Express Your Cosmic Energy</h2>
              <p className="text-slate-400 mb-6">
                Set your ambient mood to share your current emotional state with the universe
              </p>
              <Button
                onClick={() => setShowMoodSelector(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Set Your First Mood
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border-slate-700/50">
            <TabsTrigger value="status" className="data-[state=active]:bg-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Mood Status
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-purple-500/20">
              <Users className="w-4 h-4 mr-2" />
              Communities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Mood Actions */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowMoodSelector(true)}
                      className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-600/50"
                    >
                      <Palette className="w-4 h-4 mr-3" />
                      Change Mood
                    </Button>
                    <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-600/50">
                      <Settings className="w-4 h-4 mr-3" />
                      Ambient Settings
                    </Button>
                    <Button className="w-full justify-start bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-600/50">
                      <Users className="w-4 h-4 mr-3" />
                      Share Mood
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mood History Preview */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Moods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-lg">✨</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">Cosmic Bliss</div>
                        <div className="text-xs text-slate-400">2 hours ago</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        8/10
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-lg">🌙</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">Lunar Calm</div>
                        <div className="text-xs text-slate-400">Yesterday</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        6/10
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-lg">⚡</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">Stellar Energy</div>
                        <div className="text-xs text-slate-400">2 days ago</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        9/10
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <MoodAnalytics userId="current_user" period="week" />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            {currentMood ? (
              <MoodCommunity currentMood={currentMood} onJoinCommunity={handleJoinCommunity} />
            ) : (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Set Your Mood First</h3>
                  <p className="text-slate-400 mb-4">
                    Set your ambient mood to discover communities that match your energy
                  </p>
                  <Button onClick={() => setShowMoodSelector(true)} className="bg-purple-500 hover:bg-purple-600">
                    Set Mood
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Mood Selector Modal */}
      {showMoodSelector && (
        <MoodSelector
          currentMood={currentMood}
          onMoodChange={handleMoodChange}
          onClose={() => setShowMoodSelector(false)}
        />
      )}
    </div>
  )
}
