"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { CreatorProject } from "../../types/creator-studio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Save,
  Download,
  Share2,
  Settings,
  Layers,
  Wand2,
  Music,
  ImageIcon,
  Video,
  Type,
  Sparkles,
  Clock,
  Eye,
  Filter,
  Plus,
  Trash2,
  Scissors,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
} from "lucide-react"

// Mock project data
const mockProject: CreatorProject = {
  id: "project_1",
  userId: "user_1",
  title: "Cosmic Journey - Glow Video",
  description: "An immersive journey through the cosmos with stunning visual effects",
  type: "glow",
  status: "in_progress",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T14:30:00Z",
  lastEditedAt: "2024-01-15T14:30:00Z",
  thumbnail: "/placeholder.svg?height=200&width=300",
  duration: 45,
  settings: {
    resolution: { width: 1080, height: 1920, label: "1080x1920 (9:16)" },
    frameRate: 60,
    aspectRatio: "9:16",
    colorSpace: "sRGB",
    bitrate: 8000,
    quality: "high",
    autoSave: true,
    backupEnabled: true,
    collaborationEnabled: false,
    versionControl: true,
  },
  assets: [],
  timeline: [],
  effects: [],
  transitions: [],
  audio: [],
  collaborators: [],
  versions: [],
  metadata: {
    totalDuration: 45,
    totalAssets: 12,
    totalEffects: 8,
    totalTracks: 4,
    exportCount: 0,
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    performance: {
      renderSpeed: 1.2,
      memoryUsage: 2.4,
      gpuUsage: 65,
      previewQuality: 85,
      realTimePlayback: true,
    },
  },
  exportSettings: {
    format: "mp4",
    resolution: { width: 1080, height: 1920, label: "1080x1920" },
    frameRate: 60,
    bitrate: 8000,
    quality: 90,
    codec: "H.264",
    audioCodec: "AAC",
    audioBitrate: 320,
    includeAlpha: false,
    colorSpace: "sRGB",
    destination: ["glow"],
    metadata: {
      title: "Cosmic Journey",
      description: "An immersive cosmic experience",
      tags: ["cosmic", "journey", "effects"],
      category: "creative",
      mood: "dreamy",
      visibility: "public",
      allowComments: true,
      allowDownload: false,
    },
  },
  tags: ["cosmic", "effects", "creative"],
  category: "creative",
  isPublic: false,
}

interface CreatorStudioInterfaceProps {
  project: CreatorProject
  onBack: () => void
  onSave: (project: CreatorProject) => void
  onExport: (project: CreatorProject) => void
}

export function CreatorStudioInterface({ project, onBack, onSave, onExport }: CreatorStudioInterfaceProps) {
  const [currentProject, setCurrentProject] = useState<CreatorProject>(project)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100)
  const [zoom, setZoom] = useState(100)
  const [selectedTool, setSelectedTool] = useState<string>("select")
  const [activePanel, setActivePanel] = useState("timeline")
  const [previewSize, setPreviewSize] = useState<"small" | "medium" | "large">("medium")

  const timelineRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)

  // Playback controls
  const handlePlay = useCallback(() => {
    setIsPlaying(!isPlaying)
    if (previewRef.current) {
      if (isPlaying) {
        previewRef.current.pause()
      } else {
        previewRef.current.play()
      }
    }
  }, [isPlaying])

  const handleStop = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (previewRef.current) {
      previewRef.current.pause()
      previewRef.current.currentTime = 0
    }
  }, [])

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time)
    if (previewRef.current) {
      previewRef.current.currentTime = time
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (currentProject.settings.autoSave) {
      const interval = setInterval(() => {
        onSave(currentProject)
      }, 30000) // Auto-save every 30 seconds

      return () => clearInterval(interval)
    }
  }, [currentProject, onSave])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const tools = [
    { id: "select", name: "Select", icon: MousePointer },
    { id: "move", name: "Move", icon: Move },
    { id: "cut", name: "Cut", icon: Scissors },
    { id: "text", name: "Text", icon: Type },
    { id: "effects", name: "Effects", icon: Wand2 },
    { id: "zoom", name: "Zoom", icon: ZoomIn },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold">{currentProject.title}</h1>
              <p className="text-slate-400 text-sm">{currentProject.type.toUpperCase()} Project</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
            {currentProject.status.replace("_", " ").toUpperCase()}
          </Badge>

          <Button variant="outline" onClick={() => onSave(currentProject)} className="border-slate-600 text-slate-300">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button onClick={() => onExport(currentProject)} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Assets & Effects */}
        <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 m-2">
              <TabsTrigger value="assets" className="text-xs">
                <ImageIcon className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">
                <Wand2 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-xs">
                <Music className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs">
                <Type className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="assets" className="h-full p-2 space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Input placeholder="Search assets..." className="bg-slate-800/50 border-slate-600 text-white" />
                  <Button variant="outline" size="sm" className="border-slate-600">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-slate-300 font-medium text-sm">Project Assets</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card
                        key={i}
                        className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-colors"
                      >
                        <CardContent className="p-2">
                          <div className="aspect-video bg-slate-700 rounded mb-2 flex items-center justify-center">
                            <Video className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-slate-300 text-xs truncate">Asset {i}</p>
                          <p className="text-slate-500 text-xs">00:05</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Media
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="h-full p-2 space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Input placeholder="Search effects..." className="bg-slate-800/50 border-slate-600 text-white" />
                </div>

                <div className="space-y-4">
                  {[
                    "Cosmic Glow",
                    "Stellar Particles",
                    "Nebula Blur",
                    "Aurora Waves",
                    "Galaxy Spin",
                    "Stardust Trail",
                  ].map((effect) => (
                    <Card
                      key={effect}
                      className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-colors"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-slate-300 font-medium text-sm">{effect}</h4>
                            <p className="text-slate-500 text-xs">Visual Effect</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="audio" className="h-full p-2 space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Input placeholder="Search audio..." className="bg-slate-800/50 border-slate-600 text-white" />
                </div>

                <div className="space-y-2">
                  {["Cosmic Ambient", "Stellar Beats", "Nebula Sounds", "Aurora Melody"].map((audio) => (
                    <Card
                      key={audio}
                      className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-colors"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-slate-300 font-medium text-sm">{audio}</h4>
                            <p className="text-slate-500 text-xs">02:30</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-slate-400">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="text" className="h-full p-2 space-y-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-slate-300 font-medium text-sm mb-2">Text Styles</h3>
                    <div className="space-y-2">
                      {["Cosmic Title", "Stellar Subtitle", "Nebula Caption", "Aurora Quote"].map((style) => (
                        <Card
                          key={style}
                          className="bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-colors"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Type className="w-5 h-5 text-purple-400" />
                              <span className="text-slate-300 text-sm">{style}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Center - Preview & Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 bg-black/20 flex items-center justify-center p-4">
            <div className="relative">
              <div
                className={`bg-black rounded-lg overflow-hidden ${
                  previewSize === "small"
                    ? "w-64 h-[456px]"
                    : previewSize === "medium"
                      ? "w-80 h-[570px]"
                      : "w-96 h-[684px]"
                }`}
              >
                <video
                  ref={previewRef}
                  className="w-full h-full object-cover"
                  poster={currentProject.thumbnail}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />

                {/* Preview Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-white text-xs">
                    {formatTime(currentTime)} / {formatTime(currentProject.duration || 0)}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-white text-xs">
                    {zoom}%
                  </div>
                </div>
              </div>

              {/* Preview Controls */}
              <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewSize("small")}
                  className="border-slate-600"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewSize("medium")}
                  className="border-slate-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewSize("large")}
                  className="border-slate-600"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className={
                      selectedTool === tool.id ? "bg-purple-500 hover:bg-purple-600" : "border-slate-600 text-slate-300"
                    }
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Zoom:</span>
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={25}
                    max={400}
                    step={25}
                    className="w-20"
                  />
                  <span className="text-slate-300 text-sm w-12">{zoom}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-slate-600">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600">
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 flex flex-col">
            {/* Playback Controls */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePlay} className="border-slate-600">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleStop} className="border-slate-600">
                  <Square className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2 ml-4">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <Slider value={[volume]} onValueChange={([value]) => setVolume(value)} max={100} className="w-20" />
                  <span className="text-slate-300 text-sm w-8">{volume}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(currentProject.duration || 0)}</span>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 overflow-auto" ref={timelineRef}>
              <div className="p-2 space-y-1">
                {/* Video Track */}
                <div className="flex items-center gap-2 h-12 bg-slate-800/50 rounded border border-slate-700/50">
                  <div className="w-16 flex items-center justify-center text-slate-400 text-xs font-medium">VIDEO</div>
                  <div className="flex-1 relative h-8 bg-slate-700/30 rounded">
                    <div className="absolute left-2 top-0 bottom-0 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Main Video</span>
                    </div>
                  </div>
                </div>

                {/* Audio Track */}
                <div className="flex items-center gap-2 h-12 bg-slate-800/50 rounded border border-slate-700/50">
                  <div className="w-16 flex items-center justify-center text-slate-400 text-xs font-medium">AUDIO</div>
                  <div className="flex-1 relative h-8 bg-slate-700/30 rounded">
                    <div className="absolute left-8 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Music</span>
                    </div>
                  </div>
                </div>

                {/* Effects Track */}
                <div className="flex items-center gap-2 h-12 bg-slate-800/50 rounded border border-slate-700/50">
                  <div className="w-16 flex items-center justify-center text-slate-400 text-xs font-medium">FX</div>
                  <div className="flex-1 relative h-8 bg-slate-700/30 rounded">
                    <div className="absolute left-4 top-0 bottom-0 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Glow</span>
                    </div>
                    <div className="absolute left-24 top-0 bottom-0 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Particles</span>
                    </div>
                  </div>
                </div>

                {/* Text Track */}
                <div className="flex items-center gap-2 h-12 bg-slate-800/50 rounded border border-slate-700/50">
                  <div className="w-16 flex items-center justify-center text-slate-400 text-xs font-medium">TEXT</div>
                  <div className="flex-1 relative h-8 bg-slate-700/30 rounded">
                    <div className="absolute left-12 top-0 bottom-0 w-28 bg-gradient-to-r from-indigo-500 to-purple-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Title</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700/50 p-4 overflow-auto">
          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="properties">Props</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Transform</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 text-xs">X Position</label>
                      <Input className="bg-slate-700/50 border-slate-600 text-white h-8" defaultValue="0" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs">Y Position</label>
                      <Input className="bg-slate-700/50 border-slate-600 text-white h-8" defaultValue="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 text-xs">Width</label>
                      <Input className="bg-slate-700/50 border-slate-600 text-white h-8" defaultValue="1080" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs">Height</label>
                      <Input className="bg-slate-700/50 border-slate-600 text-white h-8" defaultValue="1920" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">Rotation</label>
                    <Slider defaultValue={[0]} min={-180} max={180} className="mt-2" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">Opacity</label>
                    <Slider defaultValue={[100]} max={100} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-xs">Blur</label>
                    <Slider defaultValue={[0]} max={100} className="mt-2" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">Brightness</label>
                    <Slider defaultValue={[100]} max={200} className="mt-2" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">Contrast</label>
                    <Slider defaultValue={[100]} max={200} className="mt-2" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">Saturation</label>
                    <Slider defaultValue={[100]} max={200} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layers" className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Layers</h3>
                <Button variant="outline" size="sm" className="border-slate-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {["Main Video", "Background Music", "Cosmic Glow Effect", "Particle System", "Title Text"].map(
                  (layer, index) => (
                    <div
                      key={layer}
                      className="flex items-center gap-2 p-2 bg-slate-800/50 rounded border border-slate-700/50 hover:border-purple-500/30 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 text-sm">{layer}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-2">
              <div className="space-y-1">
                {[
                  "Added cosmic glow effect",
                  "Adjusted particle intensity",
                  "Modified title text",
                  "Changed background music",
                  "Applied color correction",
                ].map((action, index) => (
                  <div
                    key={action}
                    className="flex items-center gap-2 p-2 bg-slate-800/50 rounded border border-slate-700/50 text-sm"
                  >
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 flex-1">{action}</span>
                    <span className="text-slate-500 text-xs">{index + 1}m ago</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
