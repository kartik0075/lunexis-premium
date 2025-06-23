"use client"

import { useState } from "react"
import type { NovaWorkspace, NovaConversation } from "../../types/nova"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Star,
  Archive,
  Users,
  MessageSquare,
  Clock,
  Trash2,
  Download,
  Upload,
} from "lucide-react"

// Mock workspaces and conversations
const mockWorkspaces: NovaWorkspace[] = [
  {
    id: "workspace_1",
    name: "Content Creation Hub",
    description: "All my cosmic content creation projects and AI conversations",
    conversations: ["conv_1", "conv_2", "conv_3"],
    templates: ["cosmic-content", "story-weaver"],
    collaborators: [
      { userId: "user_2", role: "editor", permissions: ["read", "write"], addedAt: "2024-01-10T00:00:00Z" },
    ],
    settings: {
      isPublic: false,
      allowCollaboration: true,
      defaultModel: "nova-cosmic",
      autoBackup: true,
      retentionDays: 90,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "workspace_2",
    name: "Code & Development",
    description: "Programming assistance, code reviews, and technical discussions",
    conversations: ["conv_4", "conv_5"],
    templates: ["code-reviewer"],
    collaborators: [],
    settings: {
      isPublic: false,
      allowCollaboration: false,
      defaultModel: "nova-code",
      autoBackup: true,
      retentionDays: 30,
    },
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-14T15:20:00Z",
  },
]

const mockConversations: NovaConversation[] = [
  {
    id: "conv_1",
    userId: "user_1",
    title: "Cosmic Social Media Strategy",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    type: "content_creation",
    messages: [],
    settings: {
      model: {
        id: "nova-cosmic",
        name: "Nova Cosmic",
        provider: "LUNEXIS",
        description: "",
        capabilities: [],
        pricing: { inputTokens: 0, outputTokens: 0, currency: "USD" },
        limits: { maxTokens: 0, maxImages: 0, rateLimitPerMinute: 0 },
      },
      temperature: 0.7,
      maxTokens: 2000,
      enableVision: true,
      enableCodeExecution: false,
      enableWebSearch: true,
      autoSave: true,
    },
    metadata: {
      tokenUsage: 1247,
      estimatedCost: 0.045,
      tags: ["social-media", "strategy"],
      isStarred: true,
      isArchived: false,
    },
  },
  {
    id: "conv_2",
    userId: "user_1",
    title: "Galaxy Exploration Story",
    createdAt: "2024-01-14T16:00:00Z",
    updatedAt: "2024-01-14T18:45:00Z",
    type: "creative_writing",
    messages: [],
    settings: {
      model: {
        id: "nova-cosmic",
        name: "Nova Cosmic",
        provider: "LUNEXIS",
        description: "",
        capabilities: [],
        pricing: { inputTokens: 0, outputTokens: 0, currency: "USD" },
        limits: { maxTokens: 0, maxImages: 0, rateLimitPerMinute: 0 },
      },
      temperature: 0.9,
      maxTokens: 3000,
      enableVision: false,
      enableCodeExecution: false,
      enableWebSearch: false,
      autoSave: true,
    },
    metadata: {
      tokenUsage: 2834,
      estimatedCost: 0.089,
      tags: ["creative-writing", "story"],
      isStarred: false,
      isArchived: false,
    },
  },
  {
    id: "conv_3",
    userId: "user_1",
    title: "React Component Help",
    createdAt: "2024-01-13T14:30:00Z",
    updatedAt: "2024-01-13T16:15:00Z",
    type: "code_assistance",
    messages: [],
    settings: {
      model: {
        id: "nova-code",
        name: "Nova Code",
        provider: "LUNEXIS",
        description: "",
        capabilities: [],
        pricing: { inputTokens: 0, outputTokens: 0, currency: "USD" },
        limits: { maxTokens: 0, maxImages: 0, rateLimitPerMinute: 0 },
      },
      temperature: 0.3,
      maxTokens: 2000,
      enableVision: false,
      enableCodeExecution: true,
      enableWebSearch: true,
      autoSave: true,
    },
    metadata: {
      tokenUsage: 1567,
      estimatedCost: 0.034,
      tags: ["react", "coding", "help"],
      isStarred: false,
      isArchived: false,
    },
  },
]

interface NovaWorkspaceProps {
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
  onNewWorkspace: () => void
}

export function NovaWorkspaceComponent({
  onSelectConversation,
  onNewConversation,
  onNewWorkspace,
}: NovaWorkspaceProps) {
  const [workspaces] = useState<NovaWorkspace[]>(mockWorkspaces)
  const [conversations] = useState<NovaConversation[]>(mockConversations)
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(workspaces[0]?.id)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("conversations")

  const currentWorkspace = workspaces.find((w) => w.id === selectedWorkspace)
  const workspaceConversations = conversations.filter(
    (c) =>
      currentWorkspace?.conversations.includes(c.id) &&
      (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getConversationTypeIcon = (type: string) => {
    switch (type) {
      case "content_creation":
        return "✨"
      case "code_assistance":
        return "💻"
      case "creative_writing":
        return "📝"
      case "chat":
        return "💬"
      default:
        return "🤖"
    }
  }

  const getConversationTypeColor = (type: string) => {
    switch (type) {
      case "content_creation":
        return "border-purple-500/50 text-purple-300 bg-purple-500/10"
      case "code_assistance":
        return "border-blue-500/50 text-blue-300 bg-blue-500/10"
      case "creative_writing":
        return "border-pink-500/50 text-pink-300 bg-pink-500/10"
      case "chat":
        return "border-green-500/50 text-green-300 bg-green-500/10"
      default:
        return "border-slate-500/50 text-slate-300 bg-slate-500/10"
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Nova Workspace</h1>
            <p className="text-slate-400">Organize your AI conversations and projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onNewWorkspace} className="border-slate-600 text-slate-300">
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
            <Button
              onClick={onNewConversation}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="flex items-center gap-4 mb-4">
          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="bg-slate-800 text-white rounded px-3 py-2 border border-slate-600 min-w-48"
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>

          {currentWorkspace && (
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{currentWorkspace.conversations.length} conversations</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{currentWorkspace.collaborators.length + 1} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Updated {formatTimeAgo(currentWorkspace.updatedAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-slate-800/50 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 mb-6">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            {workspaceConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No conversations yet</h3>
                <p className="text-slate-400 mb-4">Start your first AI conversation in this workspace</p>
                <Button
                  onClick={onNewConversation}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chatting
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspaceConversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/70 transition-all cursor-pointer group"
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getConversationTypeIcon(conversation.type)}</span>
                          <Badge variant="outline" className={`text-xs ${getConversationTypeColor(conversation.type)}`}>
                            {conversation.type.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1">
                          {conversation.metadata.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <CardTitle className="text-white group-hover:text-purple-300 transition-colors text-base">
                        {conversation.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {conversation.metadata.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            #{tag}
                          </Badge>
                        ))}
                        {conversation.metadata.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            +{conversation.metadata.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>{conversation.metadata.tokenUsage} tokens</span>
                          <span>${conversation.metadata.estimatedCost.toFixed(3)}</span>
                        </div>
                        <span>{formatTimeAgo(conversation.updatedAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Workspace Templates</h3>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </div>

            {currentWorkspace?.templates.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No templates added</h3>
                <p className="text-slate-400 mb-4">Add templates to this workspace for quick access</p>
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  Browse Templates
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentWorkspace?.templates.map((templateId) => (
                  <Card key={templateId} className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{templateId}</h4>
                          <p className="text-slate-400 text-sm">Template description...</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {currentWorkspace && (
              <>
                {/* Workspace Info */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Workspace Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm font-medium">Name</label>
                      <Input
                        value={currentWorkspace.name}
                        className="mt-1 bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm font-medium">Description</label>
                      <Input
                        value={currentWorkspace.description}
                        className="mt-1 bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Collaboration */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Allow Collaboration</div>
                        <div className="text-slate-400 text-sm">Let others join and edit this workspace</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={currentWorkspace.settings.allowCollaboration}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Public Workspace</div>
                        <div className="text-slate-400 text-sm">Make this workspace discoverable</div>
                      </div>
                      <input type="checkbox" checked={currentWorkspace.settings.isPublic} className="rounded" />
                    </div>

                    {currentWorkspace.collaborators.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Collaborators</h4>
                        <div className="space-y-2">
                          {currentWorkspace.collaborators.map((collaborator) => (
                            <div
                              key={collaborator.userId}
                              className="flex items-center justify-between p-2 bg-slate-800/50 rounded"
                            >
                              <div>
                                <div className="text-white text-sm">User {collaborator.userId}</div>
                                <div className="text-slate-400 text-xs">{collaborator.role}</div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Data Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Auto Backup</div>
                        <div className="text-slate-400 text-sm">Automatically backup conversations</div>
                      </div>
                      <input type="checkbox" checked={currentWorkspace.settings.autoBackup} className="rounded" />
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm font-medium">Data Retention (days)</label>
                      <Input
                        type="number"
                        value={currentWorkspace.settings.retentionDays}
                        className="mt-1 bg-slate-800/50 border-slate-600 text-white w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <Button variant="outline" className="border-slate-600 text-slate-300">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="border-slate-600 text-slate-300">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-red-500/50">
                  <CardHeader>
                    <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Archive Workspace</div>
                        <div className="text-slate-400 text-sm">Hide this workspace from your list</div>
                      </div>
                      <Button variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Delete Workspace</div>
                        <div className="text-slate-400 text-sm">Permanently delete this workspace and all data</div>
                      </div>
                      <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
