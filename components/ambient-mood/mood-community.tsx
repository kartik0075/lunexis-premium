"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle, Heart, Share2, Plus, Search, Crown, Sparkles } from "lucide-react"
import type { MoodCommunity, CommunityActivity, UserMoodStatus } from "../../types/ambient-mood"

// Mock data
const mockCommunities: MoodCommunity[] = [
  {
    id: "cosmic_creators",
    name: "Cosmic Creators",
    description: "A space for artists and creators feeling inspired by the universe",
    mood: {
      id: "cosmic_bliss",
      name: "Cosmic Bliss",
      emoji: "✨",
      color: "#8B5CF6",
      gradient: ["#8B5CF6", "#EC4899"],
      description: "Feeling connected",
      intensity: 8,
      category: "creative",
      effects: [],
    },
    memberCount: 1247,
    isPublic: true,
    activities: [
      {
        id: "daily_inspiration",
        type: "share",
        title: "Daily Inspiration Share",
        description: "Share what's inspiring you today",
        participants: 89,
        startTime: "2024-01-15T09:00:00Z",
      },
      {
        id: "creative_challenge",
        type: "challenge",
        title: "Cosmic Art Challenge",
        description: "Create art inspired by your current mood",
        participants: 156,
        startTime: "2024-01-15T12:00:00Z",
        endTime: "2024-01-22T12:00:00Z",
      },
    ],
    moderators: ["user_1", "user_2"],
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: "stellar_energy",
    name: "Stellar Energy Hub",
    description: "High-energy community for motivation and achievement",
    mood: {
      id: "stellar_energy",
      name: "Stellar Energy",
      emoji: "⚡",
      color: "#F59E0B",
      gradient: ["#F59E0B", "#EF4444"],
      description: "Bursting with energy",
      intensity: 9,
      category: "energetic",
      effects: [],
    },
    memberCount: 892,
    isPublic: true,
    activities: [
      {
        id: "morning_boost",
        type: "chat",
        title: "Morning Energy Boost",
        description: "Start your day with positive energy",
        participants: 45,
        startTime: "2024-01-15T07:00:00Z",
      },
    ],
    moderators: ["user_3"],
    createdAt: "2023-11-15T00:00:00Z",
  },
  {
    id: "lunar_calm",
    name: "Lunar Calm Circle",
    description: "Peaceful community for meditation and mindfulness",
    mood: {
      id: "lunar_calm",
      name: "Lunar Calm",
      emoji: "🌙",
      color: "#06B6D4",
      gradient: ["#06B6D4", "#8B5CF6"],
      description: "Peaceful and serene",
      intensity: 4,
      category: "calm",
      effects: [],
    },
    memberCount: 634,
    isPublic: true,
    activities: [
      {
        id: "evening_meditation",
        type: "support",
        title: "Evening Meditation Session",
        description: "Guided meditation for inner peace",
        participants: 78,
        startTime: "2024-01-15T20:00:00Z",
      },
    ],
    moderators: ["user_4", "user_5"],
    createdAt: "2023-10-20T00:00:00Z",
  },
]

interface MoodCommunityProps {
  currentMood: UserMoodStatus
  onJoinCommunity: (communityId: string) => void
}

export function MoodCommunity({ currentMood, onJoinCommunity }: MoodCommunityProps) {
  const [communities, setCommunities] = useState<MoodCommunity[]>(mockCommunities)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    isPublic: true,
  })

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood =
      selectedMoodFilter === "all" ||
      community.mood.category === selectedMoodFilter ||
      community.mood.id === currentMood.currentMood.id
    return matchesSearch && matchesMood
  })

  const handleCreateCommunity = () => {
    if (!newCommunity.name.trim()) return

    const community: MoodCommunity = {
      id: `community_${Date.now()}`,
      name: newCommunity.name,
      description: newCommunity.description,
      mood: currentMood.currentMood,
      memberCount: 1,
      isPublic: newCommunity.isPublic,
      activities: [],
      moderators: ["current_user"],
      createdAt: new Date().toISOString(),
    }

    setCommunities((prev) => [community, ...prev])
    setNewCommunity({ name: "", description: "", isPublic: true })
    setShowCreateForm(false)
  }

  const getActivityIcon = (type: CommunityActivity["type"]) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="w-4 h-4" />
      case "challenge":
        return <Sparkles className="w-4 h-4" />
      case "share":
        return <Share2 className="w-4 h-4" />
      case "support":
        return <Heart className="w-4 h-4" />
    }
  }

  const formatMemberCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
    return count.toString()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mood Communities</h2>
          <p className="text-slate-400">Connect with others sharing your cosmic energy</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Current Mood Match */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{currentMood.currentMood.emoji}</div>
            <div>
              <h3 className="font-semibold text-white">You're feeling {currentMood.currentMood.name}</h3>
              <p className="text-slate-300 text-sm">Find communities that match your current cosmic energy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search communities..."
            className="pl-10 bg-slate-800/50 border-slate-600/50 text-white"
          />
        </div>
        <select
          value={selectedMoodFilter}
          onChange={(e) => setSelectedMoodFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-md text-white"
        >
          <option value="all">All Moods</option>
          <option value="energetic">Energetic</option>
          <option value="calm">Calm</option>
          <option value="creative">Creative</option>
          <option value="social">Social</option>
          <option value="introspective">Introspective</option>
          <option value="romantic">Romantic</option>
          <option value="nostalgic">Nostalgic</option>
        </select>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <Card
            key={community.id}
            className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${community.mood.gradient.join(", ")})`,
                    }}
                  >
                    {community.mood.emoji}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{community.name}</CardTitle>
                    <Badge
                      className="mt-1 capitalize text-xs"
                      style={{ backgroundColor: community.mood.color + "20", color: community.mood.color }}
                    >
                      {community.mood.category}
                    </Badge>
                  </div>
                </div>
                {community.mood.id === currentMood.currentMood.id && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Match</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">{community.description}</p>

              {/* Community Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{formatMemberCount(community.memberCount)} members</span>
                </div>
                <div className="text-slate-400">Created {formatTimeAgo(community.createdAt)}</div>
              </div>

              {/* Active Activities */}
              {community.activities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Active Now:</h4>
                  {community.activities.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{activity.title}</div>
                        <div className="text-xs text-slate-400">{activity.participants} participating</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Moderators */}
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <div className="flex -space-x-2">
                  {community.moderators.slice(0, 3).map((moderator, index) => (
                    <Avatar key={moderator} className="w-6 h-6 border-2 border-slate-900">
                      <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                      <AvatarFallback className="text-xs">M{index + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {community.moderators.length} moderator{community.moderators.length !== 1 ? "s" : ""}
                </span>
              </div>

              <Button
                onClick={() => onJoinCommunity(community.id)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Join Community
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No communities found</h3>
          <p className="text-slate-400 mb-4">Try adjusting your search or create a new community</p>
          <Button onClick={() => setShowCreateForm(true)} className="bg-purple-500 hover:bg-purple-600">
            Create New Community
          </Button>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Create New Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Community Name</label>
                <Input
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter community name..."
                  className="bg-slate-800/50 border-slate-600/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <Textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your community..."
                  className="bg-slate-800/50 border-slate-600/50 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newCommunity.isPublic}
                  onChange={(e) => setNewCommunity((prev) => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-300">
                  Make community public
                </label>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl">{currentMood.currentMood.emoji}</div>
                  <div>
                    <div className="text-sm font-medium text-white">Mood: {currentMood.currentMood.name}</div>
                    <div className="text-xs text-slate-400">
                      This community will be associated with your current mood
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateCommunity}
                  disabled={!newCommunity.name.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Community
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
