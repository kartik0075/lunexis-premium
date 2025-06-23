"use client"

import { useState } from "react"
import type { CreatorProject, ProjectType } from "../../types/creator-studio"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  Play,
  Edit,
  Trash2,
  Copy,
  Folder,
  Star,
  Sparkles,
  Video,
  Radio,
  Archive,
  Palette,
} from "lucide-react"

// Mock projects data
const mockProjects: CreatorProject[] = [
  {
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
      resolution: { width: 1080, height: 1920, label: "1080x1920" },
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
      exportCount: 2,
      viewCount: 1250,
      likeCount: 89,
      shareCount: 23,
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
    isPublic: true,
  },
  {
    id: "project_2",
    userId: "user_1",
    title: "Stellar Meditation Guide",
    description: "A calming vision video for meditation and relaxation",
    type: "vision",
    status: "completed",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    lastEditedAt: "2024-01-12T16:45:00Z",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: 600,
    settings: {
      resolution: { width: 1920, height: 1080, label: "1920x1080" },
      frameRate: 30,
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      bitrate: 5000,
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
      totalDuration: 600,
      totalAssets: 8,
      totalEffects: 5,
      totalTracks: 3,
      exportCount: 1,
      viewCount: 3420,
      likeCount: 156,
      shareCount: 67,
      performance: {
        renderSpeed: 0.8,
        memoryUsage: 1.8,
        gpuUsage: 45,
        previewQuality: 90,
        realTimePlayback: true,
      },
    },
    exportSettings: {
      format: "mp4",
      resolution: { width: 1920, height: 1080, label: "1920x1080" },
      frameRate: 30,
      bitrate: 5000,
      quality: 95,
      codec: "H.264",
      audioCodec: "AAC",
      audioBitrate: 256,
      includeAlpha: false,
      colorSpace: "sRGB",
      destination: ["vision"],
      metadata: {
        title: "Stellar Meditation Guide",
        description: "Find peace among the stars",
        tags: ["meditation", "relaxation", "stellar"],
        category: "wellness",
        mood: "calm",
        visibility: "public",
        allowComments: true,
        allowDownload: true,
      },
    },
    tags: ["meditation", "wellness", "calm"],
    category: "wellness",
    isPublic: true,
  },
  {
    id: "project_3",
    userId: "user_1",
    title: "Gaming Stream Setup",
    description: "Professional streaming setup for cosmic gaming sessions",
    type: "orbit_setup",
    status: "draft",
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-01-18T11:30:00Z",
    lastEditedAt: "2024-01-18T11:30:00Z",
    thumbnail: "/placeholder.svg?height=200&width=300",
    settings: {
      resolution: { width: 1920, height: 1080, label: "1920x1080" },
      frameRate: 60,
      aspectRatio: "16:9",
      colorSpace: "sRGB",
      bitrate: 6000,
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
      totalDuration: 0,
      totalAssets: 15,
      totalEffects: 12,
      totalTracks: 6,
      exportCount: 0,
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      performance: {
        renderSpeed: 1.5,
        memoryUsage: 3.2,
        gpuUsage: 75,
        previewQuality: 80,
        realTimePlayback: true,
      },
    },
    exportSettings: {
      format: "mp4",
      resolution: { width: 1920, height: 1080, label: "1920x1080" },
      frameRate: 60,
      bitrate: 6000,
      quality: 85,
      codec: "H.264",
      audioCodec: "AAC",
      audioBitrate: 320,
      includeAlpha: false,
      colorSpace: "sRGB",
      destination: ["orbit"],
      metadata: {
        title: "Gaming Stream Setup",
        description: "Professional cosmic gaming experience",
        tags: ["gaming", "stream", "setup"],
        category: "gaming",
        mood: "energetic",
        visibility: "private",
        allowComments: true,
        allowDownload: false,
      },
    },
    tags: ["gaming", "streaming", "setup"],
    category: "gaming",
    isPublic: false,
  },
]

interface ProjectManagerProps {
  onSelectProject: (project: CreatorProject) => void
  onCreateProject: (type: ProjectType) => void
}

export function ProjectManager({ onSelectProject, onCreateProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<CreatorProject[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("updated")

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = filterStatus === "all" || project.status === filterStatus
      const matchesType = filterType === "all" || project.type === filterType

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "views":
          return b.metadata.viewCount - a.metadata.viewCount
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-500/20 text-slate-300 border-slate-500/50"
      case "in_progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50"
      case "review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/50"
      case "published":
        return "bg-purple-500/20 text-purple-300 border-purple-500/50"
      case "archived":
        return "bg-gray-500/20 text-gray-300 border-gray-500/50"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/50"
    }
  }

  const getTypeIcon = (type: ProjectType) => {
    switch (type) {
      case "glow":
        return <Sparkles className="w-4 h-4" />
      case "vision":
        return <Video className="w-4 h-4" />
      case "orbit_setup":
        return <Radio className="w-4 h-4" />
      case "time_capsule":
        return <Archive className="w-4 h-4" />
      case "ambient_mood":
        return <Palette className="w-4 h-4" />
      default:
        return <Folder className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "Setup"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const projectTypes: { id: ProjectType; name: string; description: string; icon: any }[] = [
    {
      id: "glow",
      name: "Glow Video",
      description: "Short-form vertical videos with cosmic effects",
      icon: Sparkles,
    },
    {
      id: "vision",
      name: "Vision Content",
      description: "Long-form horizontal videos for deep storytelling",
      icon: Video,
    },
    {
      id: "orbit_setup",
      name: "Orbit Stream",
      description: "Live streaming setup with interactive features",
      icon: Radio,
    },
    {
      id: "time_capsule",
      name: "Time Capsule",
      description: "Memory preservation with multimedia content",
      icon: Archive,
    },
    {
      id: "ambient_mood",
      name: "Ambient Experience",
      description: "Mood-based atmospheric content creation",
      icon: Palette,
    },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Creator Studio</h1>
            <p className="text-slate-400">Manage your cosmic content creation projects</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="border-slate-600 text-slate-300"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="published">Published</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="glow">Glow</option>
            <option value="vision">Vision</option>
            <option value="orbit_setup">Orbit</option>
            <option value="time_capsule">Time Capsule</option>
            <option value="ambient_mood">Ambient</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800/50 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
            <option value="views">Views</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="projects" className="h-full">
          <div className="px-6 pt-4">
            <TabsList className="bg-slate-800/50">
              <TabsTrigger value="projects">My Projects ({filteredProjects.length})</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects" className="p-6 pt-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-slate-400 mb-6">
                  {searchQuery || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first cosmic content project"}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer group"
                    onClick={() => onSelectProject(project)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={project.thumbnail || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2 flex items-center gap-2">
                          <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                          <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
                            {getTypeIcon(project.type)}
                            <span className="text-white text-xs">{project.type.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="sm" className="text-white hover:bg-black/40">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                          <span className="text-white text-xs">{formatDuration(project.duration || 0)}</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 truncate">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span>Updated {formatDate(project.updatedAt)}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{project.metadata.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{project.metadata.likeCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer"
                    onClick={() => onSelectProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={project.thumbnail || "/placeholder.svg"}
                          alt={project.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{project.title}</h3>
                            <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                            <div className="flex items-center gap-1 text-slate-400">
                              {getTypeIcon(project.type)}
                              <span className="text-xs">{project.type.toUpperCase()}</span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Updated {formatDate(project.updatedAt)}</span>
                            <span>{formatDuration(project.duration || 0)}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{project.metadata.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{project.metadata.likeCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Cosmic Intro Template",
                  description: "Professional intro with stellar effects",
                  type: "glow",
                  thumbnail: "/placeholder.svg?height=200&width=300",
                  rating: 4.8,
                  uses: 1250,
                },
                {
                  name: "Meditation Journey",
                  description: "Calming vision template for wellness content",
                  type: "vision",
                  thumbnail: "/placeholder.svg?height=200&width=300",
                  rating: 4.9,
                  uses: 890,
                },
                {
                  name: "Gaming Stream Overlay",
                  description: "Complete streaming setup with cosmic theme",
                  type: "orbit_setup",
                  thumbnail: "/placeholder.svg?height=200&width=300",
                  rating: 4.7,
                  uses: 2100,
                },
              ].map((template, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 left-2">
                        <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
                          {getTypeIcon(template.type as ProjectType)}
                          <span className="text-white text-xs">{template.type.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-xs">{template.rating}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                      <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">{template.uses} uses</span>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="p-6 pt-4">
            <div className="max-w-4xl">
              <h2 className="text-xl font-semibold text-white mb-6">Create New Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectTypes.map((type) => (
                  <Card
                    key={type.id}
                    className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer group"
                    onClick={() => onCreateProject(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <type.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">{type.name}</h3>
                      <p className="text-slate-400 text-sm">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
