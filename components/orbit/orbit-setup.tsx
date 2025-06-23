"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { OrbitUploadData, StreamCategory, GameInfo } from "../../types/orbit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Radio,
  Camera,
  Gamepad2,
  Eye,
  EyeOff,
  MessageCircle,
  Gift,
  Monitor,
  Mic,
  Video,
  Sparkles,
  Search,
} from "lucide-react"

// Mock categories and games
const streamCategories: StreamCategory[] = [
  { id: "gaming", name: "Gaming", icon: "🎮", color: "#8B5CF6" },
  { id: "creative", name: "Creative", icon: "🎨", color: "#EC4899" },
  { id: "music", name: "Music", icon: "🎵", color: "#06B6D4" },
  { id: "chatting", name: "Just Chatting", icon: "💬", color: "#10B981" },
  { id: "education", name: "Education", icon: "📚", color: "#F59E0B" },
  { id: "fitness", name: "Fitness", icon: "💪", color: "#EF4444" },
  { id: "cooking", name: "Cooking", icon: "👨‍🍳", color: "#84CC16" },
  { id: "travel", name: "Travel", icon: "✈️", color: "#6366F1" },
]

const popularGames: GameInfo[] = [
  {
    id: "cosmic_odyssey",
    name: "Cosmic Odyssey",
    cover: "/placeholder.svg?height=100&width=75",
    genre: ["Adventure", "Sci-Fi"],
    developer: "Stellar Studios",
  },
  {
    id: "galaxy_wars",
    name: "Galaxy Wars",
    cover: "/placeholder.svg?height=100&width=75",
    genre: ["Action", "Multiplayer"],
    developer: "Nebula Games",
  },
  {
    id: "star_builder",
    name: "Star Builder",
    cover: "/placeholder.svg?height=100&width=75",
    genre: ["Simulation", "Strategy"],
    developer: "Cosmic Craft",
  },
]

interface OrbitSetupProps {
  onBack: () => void
  onGoLive: (data: OrbitUploadData) => void
}

export function OrbitSetup({ onBack, onGoLive }: OrbitSetupProps) {
  const [setupData, setSetupData] = useState<OrbitUploadData>({
    title: "",
    description: "",
    category: "",
    game: "",
    thumbnail: "",
    moodTags: [],
    settings: {
      title: "",
      category: "",
      game: "",
      isPrivate: false,
      recordStream: true,
      enableChat: true,
      enableDonations: true,
      maturityRating: "everyone",
    },
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [gameSearch, setGameSearch] = useState("")
  const [isTestingStream, setIsTestingStream] = useState(false)
  const [streamHealth, setStreamHealth] = useState({
    bitrate: 2500,
    fps: 60,
    resolution: "1920x1080",
    status: "good",
  })

  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const moodOptions = [
    "energetic",
    "chill",
    "competitive",
    "educational",
    "creative",
    "funny",
    "relaxing",
    "intense",
    "cosmic",
  ]

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setSetupData((prev) => ({ ...prev, thumbnail: url }))
    }
  }

  const handleMoodToggle = (mood: string) => {
    setSetupData((prev) => ({
      ...prev,
      moodTags: prev.moodTags.includes(mood) ? prev.moodTags.filter((m) => m !== mood) : [...prev.moodTags, mood],
    }))
  }

  const handleCategorySelect = (categoryId: string) => {
    setSetupData((prev) => ({
      ...prev,
      category: categoryId,
      settings: { ...prev.settings, category: categoryId },
    }))
  }

  const handleGameSelect = (gameId: string) => {
    setSetupData((prev) => ({
      ...prev,
      game: gameId,
      settings: { ...prev.settings, game: gameId },
    }))
  }

  const testStream = () => {
    setIsTestingStream(true)
    // Simulate stream test
    setTimeout(() => {
      setIsTestingStream(false)
      setStreamHealth({
        bitrate: 2800 + Math.random() * 400,
        fps: 58 + Math.random() * 4,
        resolution: "1920x1080",
        status: Math.random() > 0.2 ? "good" : "warning",
      })
    }, 3000)
  }

  const handleGoLive = () => {
    if (!setupData.title || !setupData.category) {
      alert("Please fill in the required fields")
      return
    }

    const finalData = {
      ...setupData,
      settings: {
        ...setupData.settings,
        title: setupData.title,
      },
    }

    onGoLive(finalData)
  }

  const filteredGames = popularGames.filter((game) => game.name.toLowerCase().includes(gameSearch.toLowerCase()))

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
              <Radio className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Go Live</span>
          </div>

          <Button
            onClick={handleGoLive}
            disabled={!setupData.title || !setupData.category}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            Start Stream
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Stream Preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stream Preview */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Stream Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative">
                  {setupData.thumbnail ? (
                    <img
                      src={setupData.thumbnail || "/placeholder.svg"}
                      alt="Stream thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">No preview available</p>
                      </div>
                    </div>
                  )}

                  {/* Live Indicator */}
                  <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded text-white text-xs font-semibold">
                    LIVE
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                    0 viewers
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    onClick={testStream}
                    disabled={isTestingStream}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300"
                  >
                    {isTestingStream ? "Testing..." : "Test Stream"}
                  </Button>

                  {/* Stream Health */}
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status</span>
                      <span
                        className={`font-semibold ${
                          streamHealth.status === "good"
                            ? "text-green-400"
                            : streamHealth.status === "warning"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {streamHealth.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Bitrate</span>
                      <span className="text-white">{Math.round(streamHealth.bitrate)} kbps</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">FPS</span>
                      <span className="text-white">{Math.round(streamHealth.fps)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Resolution</span>
                      <span className="text-white">{streamHealth.resolution}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">Camera</span>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">Microphone</span>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">Screen Capture</span>
                  </div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Stream Settings */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="category">Category</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Basic Stream Info */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Stream Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-slate-300">
                        Stream Title *
                      </Label>
                      <Input
                        id="title"
                        value={setupData.title}
                        onChange={(e) => setSetupData((prev) => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white"
                        placeholder="What's your stream about?"
                        maxLength={100}
                      />
                      <div className="text-xs text-slate-500 mt-1">{setupData.title.length}/100 characters</div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-slate-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={setupData.description}
                        onChange={(e) => setSetupData((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white resize-none"
                        placeholder="Tell viewers what to expect..."
                        rows={4}
                        maxLength={500}
                      />
                      <div className="text-xs text-slate-500 mt-1">{setupData.description.length}/500 characters</div>
                    </div>

                    {/* Custom Thumbnail */}
                    <div>
                      <Label className="text-slate-300">Custom Thumbnail</Label>
                      <div className="mt-2">
                        {!setupData.thumbnail ? (
                          <div
                            className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-red-500 transition-colors aspect-video"
                            onClick={() => thumbnailInputRef.current?.click()}
                          >
                            <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-300 text-sm">Upload stream thumbnail</p>
                            <p className="text-slate-500 text-xs">JPG, PNG (16:9 ratio recommended)</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <img
                              src={setupData.thumbnail || "/placeholder.svg"}
                              alt="Thumbnail preview"
                              className="w-full aspect-video object-cover rounded-lg"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => thumbnailInputRef.current?.click()}
                              className="border-slate-600 text-slate-300"
                            >
                              Change Thumbnail
                            </Button>
                          </div>
                        )}
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailSelect}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mood Tags */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Stream Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {moodOptions.map((mood) => (
                        <Badge
                          key={mood}
                          variant="outline"
                          className={`cursor-pointer transition-all capitalize ${
                            setupData.moodTags.includes(mood)
                              ? "bg-red-500/20 text-red-300 border-red-500/50"
                              : "border-slate-600 text-slate-400 hover:border-slate-500"
                          }`}
                          onClick={() => handleMoodToggle(mood)}
                        >
                          #{mood}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="category" className="space-y-6">
                {/* Stream Category */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Choose Category *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {streamCategories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            setupData.category === category.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-slate-600 hover:border-slate-500 bg-slate-800/30"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{category.icon}</div>
                            <div className="text-white font-medium text-sm">{category.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Game Selection */}
                {setupData.category === "gaming" && (
                  <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5" />
                        Select Game
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={gameSearch}
                          onChange={(e) => setGameSearch(e.target.value)}
                          className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                          placeholder="Search for a game..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {filteredGames.map((game) => (
                          <div
                            key={game.id}
                            onClick={() => handleGameSelect(game.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              setupData.game === game.id
                                ? "border-red-500 bg-red-500/10"
                                : "border-slate-600 hover:border-slate-500 bg-slate-800/30"
                            }`}
                          >
                            <img
                              src={game.cover || "/placeholder.svg"}
                              alt={game.name}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">{game.name}</div>
                              <div className="text-slate-400 text-xs">{game.developer}</div>
                              <div className="text-slate-500 text-xs">{game.genre.join(", ")}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {/* Stream Quality */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Stream Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Resolution</Label>
                        <select className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600">
                          <option value="1920x1080">1080p (1920x1080)</option>
                          <option value="1280x720">720p (1280x720)</option>
                          <option value="854x480">480p (854x480)</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-slate-300">Frame Rate</Label>
                        <select className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600">
                          <option value="60">60 FPS</option>
                          <option value="30">30 FPS</option>
                          <option value="24">24 FPS</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Bitrate</Label>
                      <select className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600">
                        <option value="6000">6000 kbps (High)</option>
                        <option value="3500">3500 kbps (Medium)</option>
                        <option value="2000">2000 kbps (Low)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Audio Settings */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Audio Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Audio Bitrate</Label>
                      <select className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600">
                        <option value="320">320 kbps</option>
                        <option value="256">256 kbps</option>
                        <option value="128">128 kbps</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-slate-300">Sample Rate</Label>
                      <select className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600">
                        <option value="48000">48 kHz</option>
                        <option value="44100">44.1 kHz</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Privacy & Features */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Stream Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {setupData.settings.isPrivate ? (
                          <EyeOff className="w-5 h-5 text-slate-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-slate-400" />
                        )}
                        <div>
                          <div className="text-white font-medium">Visibility</div>
                          <div className="text-slate-400 text-sm">
                            {setupData.settings.isPrivate ? "Private stream" : "Public stream"}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={!setupData.settings.isPrivate}
                        onCheckedChange={(checked) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, isPrivate: !checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-medium">Record Stream</div>
                          <div className="text-slate-400 text-sm">Save stream for later viewing</div>
                        </div>
                      </div>
                      <Switch
                        checked={setupData.settings.recordStream}
                        onCheckedChange={(checked) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, recordStream: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-medium">Enable Chat</div>
                          <div className="text-slate-400 text-sm">Allow viewers to chat</div>
                        </div>
                      </div>
                      <Switch
                        checked={setupData.settings.enableChat}
                        onCheckedChange={(checked) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, enableChat: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-medium">Enable Donations</div>
                          <div className="text-slate-400 text-sm">Allow viewer donations</div>
                        </div>
                      </div>
                      <Switch
                        checked={setupData.settings.enableDonations}
                        onCheckedChange={(checked) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, enableDonations: checked },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">Maturity Rating</Label>
                      <select
                        value={setupData.settings.maturityRating}
                        onChange={(e) =>
                          setSetupData((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, maturityRating: e.target.value as any },
                          }))
                        }
                        className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600"
                      >
                        <option value="everyone">Everyone</option>
                        <option value="teen">Teen (13+)</option>
                        <option value="mature">Mature (18+)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
