"use client"

import { useState } from "react"
import { CapsuleCreator } from "./capsule-creator"
import { CapsuleViewer } from "./capsule-viewer"
import { MemoryVault } from "./memory-vault"
import { MemoryTimeline } from "./memory-timeline"
import type { TimeCapsule, MemoryVault as MemoryVaultType } from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Clock,
  Archive,
  TimerIcon as Timeline,
  Sparkles,
  Calendar,
  Users,
  Heart,
  Eye,
  Search,
  Grid,
  List,
  Zap,
} from "lucide-react"
import { MemoryTriggersModule } from "../memory-triggers/memory-triggers-module"

// Mock data
const mockCapsules: TimeCapsule[] = [
  {
    id: "capsule_1",
    userId: "user_1",
    title: "College Graduation Memories",
    description: "Capturing the joy and excitement of graduating from university",
    content: [
      {
        id: "content_1",
        type: "text",
        data: "Today I graduated! Four years of hard work finally paid off. I'm so grateful for all the friends I made and the experiences I had.",
        title: "Graduation Day Reflection",
        timestamp: "2024-05-15T14:30:00Z",
      },
      {
        id: "content_2",
        type: "image",
        data: "/placeholder.svg?height=400&width=600",
        title: "Graduation Photo",
        timestamp: "2024-05-15T15:00:00Z",
      },
    ],
    createdAt: "2024-05-15T14:00:00Z",
    scheduledFor: "2029-05-15T14:00:00Z",
    status: "scheduled",
    visibility: "friends",
    recipients: [
      {
        id: "recipient_1",
        name: "Mom",
        email: "mom@example.com",
        relationship: "family",
        deliveryMethod: "email",
        hasOpened: false,
      },
    ],
    vault: "vault_1",
    tags: ["graduation", "milestone", "education"],
    mood: "excited",
    theme: {
      id: "cosmic_purple",
      name: "Cosmic Purple",
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
        accent: "#F59E0B",
        background: "linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)",
      },
      fonts: { heading: "Inter", body: "Inter" },
      effects: [],
    },
    settings: {
      allowComments: true,
      allowReactions: true,
      allowSharing: true,
      requirePassword: false,
      autoArchive: true,
      notifyOnOpen: true,
      trackViews: true,
    },
    metadata: {
      creationDevice: "iPhone",
      emotionalState: {
        primary: "excited",
        intensity: 9,
        secondary: ["grateful", "nostalgic"],
      },
    },
    reactions: [{ id: "reaction_1", userId: "user_2", type: "love", emoji: "❤️", timestamp: "2024-05-16T10:00:00Z" }],
    views: 12,
    isLocked: false,
  },
  {
    id: "capsule_2",
    userId: "user_1",
    title: "First Day at New Job",
    description: "Starting my dream career in tech",
    content: [
      {
        id: "content_3",
        type: "text",
        data: "First day at the new job! I'm nervous but excited. The office is amazing and everyone seems really friendly.",
        title: "First Day Thoughts",
        timestamp: "2024-06-01T09:00:00Z",
      },
    ],
    createdAt: "2024-06-01T09:00:00Z",
    status: "sealed",
    visibility: "private",
    recipients: [],
    vault: "vault_2",
    tags: ["career", "milestone", "tech"],
    mood: "excited",
    theme: {
      id: "sunset_glow",
      name: "Sunset Glow",
      colors: {
        primary: "#F59E0B",
        secondary: "#EF4444",
        accent: "#EC4899",
        background: "linear-gradient(135deg, #FED7AA 0%, #F59E0B 100%)",
      },
      fonts: { heading: "Inter", body: "Inter" },
      effects: [],
    },
    settings: {
      allowComments: false,
      allowReactions: true,
      allowSharing: false,
      requirePassword: false,
      autoArchive: true,
      notifyOnOpen: true,
      trackViews: true,
    },
    metadata: {
      creationDevice: "MacBook",
      emotionalState: {
        primary: "excited",
        intensity: 8,
        secondary: ["nervous", "hopeful"],
      },
    },
    reactions: [],
    views: 1,
    isLocked: false,
  },
]

const mockVaults: MemoryVaultType[] = [
  {
    id: "vault_1",
    userId: "user_1",
    name: "Life Milestones",
    description: "Major achievements and life-changing moments",
    theme: {
      id: "cosmic_purple",
      name: "Cosmic Purple",
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
        accent: "#F59E0B",
        background: "linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)",
      },
      fonts: { heading: "Inter", body: "Inter" },
      effects: [],
    },
    capsules: ["capsule_1"],
    collaborators: [],
    settings: {
      allowPublicContributions: false,
      requireApproval: true,
      autoOrganize: true,
      backupEnabled: true,
      encryptionEnabled: false,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-05-15T14:00:00Z",
    isPublic: false,
    category: "milestones",
    tags: ["achievements", "personal"],
    stats: {
      totalCapsules: 1,
      totalContent: 2,
      totalViews: 12,
      totalReactions: 1,
      oldestCapsule: "2024-05-15T14:00:00Z",
      newestCapsule: "2024-05-15T14:00:00Z",
      mostViewedCapsule: "capsule_1",
    },
  },
  {
    id: "vault_2",
    userId: "user_1",
    name: "Career Journey",
    description: "Professional growth and career highlights",
    theme: {
      id: "sunset_glow",
      name: "Sunset Glow",
      colors: {
        primary: "#F59E0B",
        secondary: "#EF4444",
        accent: "#EC4899",
        background: "linear-gradient(135deg, #FED7AA 0%, #F59E0B 100%)",
      },
      fonts: { heading: "Inter", body: "Inter" },
      effects: [],
    },
    capsules: ["capsule_2"],
    collaborators: [],
    settings: {
      allowPublicContributions: false,
      requireApproval: true,
      autoOrganize: true,
      backupEnabled: true,
      encryptionEnabled: false,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T09:00:00Z",
    isPublic: false,
    category: "professional",
    tags: ["career", "work"],
    stats: {
      totalCapsules: 1,
      totalContent: 1,
      totalViews: 1,
      totalReactions: 0,
      oldestCapsule: "2024-06-01T09:00:00Z",
      newestCapsule: "2024-06-01T09:00:00Z",
      mostViewedCapsule: "capsule_2",
    },
  },
]

interface TimeCapsuleModuleProps {
  onBack: () => void
}

export function TimeCapsuleModule({ onBack }: TimeCapsuleModuleProps) {
  const [activeTab, setActiveTab] = useState("capsules")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showCreator, setShowCreator] = useState(false)
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null)
  const [capsules, setCapsules] = useState<TimeCapsule[]>(mockCapsules)
  const [vaults, setVaults] = useState<MemoryVaultType[]>(mockVaults)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showTriggers, setShowTriggers] = useState(false)

  const handleCreateCapsule = (capsuleData: Partial<TimeCapsule>) => {
    const newCapsule: TimeCapsule = {
      id: `capsule_${Date.now()}`,
      userId: "user_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vault: "vault_1",
      reactions: [],
      views: 0,
      isLocked: false,
      metadata: {
        creationDevice: "Web",
        emotionalState: {
          primary: capsuleData.mood || "nostalgic",
          intensity: 7,
        },
      },
      ...capsuleData,
    } as TimeCapsule

    setCapsules([newCapsule, ...capsules])
    setShowCreator(false)
  }

  const handleUpdateCapsule = (capsuleData: Partial<TimeCapsule>) => {
    if (selectedCapsule) {
      const updatedCapsule = { ...selectedCapsule, ...capsuleData, updatedAt: new Date().toISOString() }
      setCapsules(capsules.map((c) => (c.id === selectedCapsule.id ? updatedCapsule : c)))
      setSelectedCapsule(null)
      setShowCreator(false)
    }
  }

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch =
      capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter = filterStatus === "all" || capsule.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-500/20 text-slate-300"
      case "scheduled":
        return "bg-blue-500/20 text-blue-300"
      case "sealed":
        return "bg-purple-500/20 text-purple-300"
      case "delivered":
        return "bg-green-500/20 text-green-300"
      case "opened":
        return "bg-yellow-500/20 text-yellow-300"
      default:
        return "bg-slate-500/20 text-slate-300"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (showCreator) {
    return (
      <CapsuleCreator
        onSave={selectedCapsule ? handleUpdateCapsule : handleCreateCapsule}
        onCancel={() => {
          setShowCreator(false)
          setSelectedCapsule(null)
        }}
        editingCapsule={selectedCapsule || undefined}
      />
    )
  }

  if (selectedCapsule && !showCreator) {
    return (
      <CapsuleViewer
        capsule={selectedCapsule}
        onBack={() => setSelectedCapsule(null)}
        onEdit={() => setShowCreator(true)}
      />
    )
  }

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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Time Capsule Vault</span>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreator(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="w-4 h-4 mr-2" />
              New Capsule
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="capsules" className="data-[state=active]:bg-purple-500/20">
              <Archive className="w-4 h-4 mr-2" />
              Capsules
            </TabsTrigger>
            <TabsTrigger value="vaults" className="data-[state=active]:bg-purple-500/20">
              <Archive className="w-4 h-4 mr-2" />
              Vaults
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-500/20">
              <Timeline className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="triggers" className="data-[state=active]:bg-purple-500/20">
              <Zap className="w-4 h-4 mr-2" />
              Triggers
            </TabsTrigger>
          </TabsList>

          {/* Capsules Tab */}
          <TabsContent value="capsules" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search capsules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-800/50 border border-slate-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sealed">Sealed</option>
                  <option value="delivered">Delivered</option>
                  <option value="opened">Opened</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-purple-500" : "border-slate-600"}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-purple-500" : "border-slate-600"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Capsules Grid/List */}
            {filteredCapsules.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredCapsules.map((capsule) => (
                  <Card
                    key={capsule.id}
                    className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedCapsule(capsule)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-1">{capsule.title}</CardTitle>
                          <p className="text-slate-400 text-sm line-clamp-2">{capsule.description}</p>
                        </div>
                        <Badge className={`ml-2 ${getStatusColor(capsule.status)}`}>{capsule.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Content Preview */}
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Archive className="w-4 h-4" />
                            {capsule.content.length} items
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {capsule.views} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {capsule.reactions.length}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {capsule.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {tag}
                            </Badge>
                          ))}
                          {capsule.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              +{capsule.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {formatDate(capsule.createdAt)}
                          </div>
                          {capsule.scheduledFor && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(capsule.scheduledFor) > new Date() ? "Opens" : "Opened"}{" "}
                              {formatDate(capsule.scheduledFor)}
                            </div>
                          )}
                        </div>

                        {/* Recipients */}
                        {capsule.recipients.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Users className="w-3 h-3" />
                            {capsule.recipients.length} recipient{capsule.recipients.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Time Capsules Found</h3>
                <p className="text-slate-400 mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first time capsule to preserve memories for the future"}
                </p>
                <Button onClick={() => setShowCreator(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Time Capsule
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Vaults Tab */}
          <TabsContent value="vaults">
            <MemoryVault
              vaults={vaults}
              onSelectVault={(vault) => console.log("Selected vault:", vault)}
              onCreateVault={() => console.log("Create new vault")}
            />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <MemoryTimeline
              capsules={capsules}
              onSelectCapsule={setSelectedCapsule}
              onCreateTimeline={() => console.log("Create timeline")}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Capsules</p>
                      <p className="text-2xl font-bold text-white">{capsules.length}</p>
                    </div>
                    <Archive className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold text-white">
                        {capsules.reduce((sum, capsule) => sum + capsule.views, 0)}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Reactions</p>
                      <p className="text-2xl font-bold text-white">
                        {capsules.reduce((sum, capsule) => sum + capsule.reactions.length, 0)}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Memory Vaults</p>
                      <p className="text-2xl font-bold text-white">{vaults.length}</p>
                    </div>
                    <Archive className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Distribution */}
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Capsule Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["draft", "scheduled", "sealed", "delivered", "opened"].map((status) => {
                    const count = capsules.filter((c) => c.status === status).length
                    const percentage = capsules.length > 0 ? (count / capsules.length) * 100 : 0

                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                          <span className="text-slate-300">{count} capsules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-sm w-12 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(capsules.flatMap((c) => c.tags)))
                    .map((tag) => ({
                      tag,
                      count: capsules.filter((c) => c.tags.includes(tag)).length,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
                    .map(({ tag, count }) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 bg-purple-500/10"
                      >
                        {tag} ({count})
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Memory Triggers Tab */}
          <TabsContent value="triggers">
            <MemoryTriggersModule
              onBack={() => setActiveTab("capsules")}
              onCreateMemory={(suggestion) => {
                if (suggestion) {
                  // Pre-fill capsule creator with suggestion data
                  setShowCreator(true)
                } else {
                  setShowCreator(true)
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
