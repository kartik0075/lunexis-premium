"use client"

import { useState } from "react"
import type { SocialCommunity } from "../../types/social-hub"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Filter, Plus, TrendingUp, Globe, Lock, UserPlus } from "lucide-react"

// Mock communities data
const mockCommunities: SocialCommunity[] = [
  {
    id: "community_1",
    name: "Cosmic Creators",
    description:
      "A vibrant community for digital artists, content creators, and cosmic visionaries. Share your creations, get feedback, and collaborate on stellar projects that push the boundaries of creativity.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    category: "creative",
    tags: ["art", "creativity", "collaboration", "cosmic", "digital"],
    memberCount: 15420,
    postCount: 8934,
    activeMembers: 2341,
    growthRate: 15.7,
    visibility: "public",
    joinRequirement: "open",
    contentModeration: "moderated",
    createdBy: "user_1",
    createdAt: "2023-06-15T10:00:00Z",
    moderators: [
      {
        userId: "user_1",
        role: "owner",
        permissions: ["all"],
        appointedAt: "2023-06-15T10:00:00Z",
        appointedBy: "system",
      },
    ],
    rules: [],
    features: [
      { type: "events", enabled: true, settings: {} },
      { type: "challenges", enabled: true, settings: {} },
      { type: "live_chat", enabled: true, settings: {} },
    ],
    customization: {
      theme: {
        primaryColor: "#8B5CF6",
        secondaryColor: "#EC4899",
        accentColor: "#06B6D4",
      },
      layout: "feed",
      widgets: [],
    },
    recentPosts: [],
    upcomingEvents: [],
    pinnedPosts: [],
    analytics: {
      memberGrowth: [],
      engagement: {
        likes: 45623,
        comments: 12890,
        shares: 3456,
        views: 234567,
        activeUsers: 2341,
        avgSessionTime: 18.5,
      },
      contentStats: {
        totalPosts: 8934,
        postsByType: {
          text: 4567,
          image: 2890,
          video: 1234,
          audio: 243,
          poll: 0,
          event: 0,
          link: 0,
          glow: 0,
          vision: 0,
        },
        topTags: [],
        viralContent: [],
      },
      demographics: {
        ageGroups: {},
        locations: {},
        interests: {},
        devices: {},
      },
      topContributors: [],
    },
  },
  {
    id: "community_2",
    name: "Stellar Wellness",
    description:
      "Find your cosmic balance through mindfulness, meditation, and holistic wellness practices. Join our supportive community for guided sessions, wellness challenges, and peaceful cosmic journeys.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    category: "wellness",
    tags: ["wellness", "meditation", "mindfulness", "health", "cosmic"],
    memberCount: 8934,
    postCount: 5623,
    activeMembers: 1456,
    growthRate: 22.3,
    visibility: "public",
    joinRequirement: "open",
    contentModeration: "moderated",
    createdBy: "user_2",
    createdAt: "2023-08-20T14:30:00Z",
    moderators: [],
    rules: [],
    features: [],
    customization: {
      theme: {
        primaryColor: "#10B981",
        secondaryColor: "#8B5CF6",
        accentColor: "#F59E0B",
      },
      layout: "feed",
      widgets: [],
    },
    recentPosts: [],
    upcomingEvents: [],
    pinnedPosts: [],
    analytics: {
      memberGrowth: [],
      engagement: {
        likes: 23456,
        comments: 7890,
        shares: 1234,
        views: 156789,
        activeUsers: 1456,
        avgSessionTime: 25.2,
      },
      contentStats: {
        totalPosts: 5623,
        postsByType: {
          text: 3456,
          image: 1234,
          video: 789,
          audio: 144,
          poll: 0,
          event: 0,
          link: 0,
          glow: 0,
          vision: 0,
        },
        topTags: [],
        viralContent: [],
      },
      demographics: {
        ageGroups: {},
        locations: {},
        interests: {},
        devices: {},
      },
      topContributors: [],
    },
  },
  {
    id: "community_3",
    name: "Cosmic Gaming Hub",
    description:
      "Level up your gaming experience! Connect with fellow gamers, share epic moments, organize tournaments, and discover new cosmic gaming adventures across all platforms.",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    category: "gaming",
    tags: ["gaming", "esports", "tournaments", "streaming", "cosmic"],
    memberCount: 23567,
    postCount: 15678,
    activeMembers: 4523,
    growthRate: 18.9,
    visibility: "public",
    joinRequirement: "open",
    contentModeration: "open",
    createdBy: "user_3",
    createdAt: "2023-05-10T16:45:00Z",
    moderators: [],
    rules: [],
    features: [],
    customization: {
      theme: {
        primaryColor: "#EF4444",
        secondaryColor: "#F59E0B",
        accentColor: "#8B5CF6",
      },
      layout: "feed",
      widgets: [],
    },
    recentPosts: [],
    upcomingEvents: [],
    pinnedPosts: [],
    analytics: {
      memberGrowth: [],
      engagement: {
        likes: 78901,
        comments: 23456,
        shares: 5678,
        views: 456789,
        activeUsers: 4523,
        avgSessionTime: 32.1,
      },
      contentStats: {
        totalPosts: 15678,
        postsByType: {
          text: 7890,
          image: 3456,
          video: 3234,
          audio: 567,
          poll: 0,
          event: 0,
          link: 0,
          glow: 0,
          vision: 0,
        },
        topTags: [],
        viralContent: [],
      },
      demographics: {
        ageGroups: {},
        locations: {},
        interests: {},
        devices: {},
      },
      topContributors: [],
    },
  },
]

interface CommunityBrowserProps {
  onCommunitySelect?: (community: SocialCommunity) => void
  onCreateCommunity?: () => void
}

export function CommunityBrowser({ onCommunitySelect, onCreateCommunity }: CommunityBrowserProps) {
  const [communities, setCommunities] = useState<SocialCommunity[]>(mockCommunities)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "active" | "trending">("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = [
    { id: "all", name: "All", icon: "🌌" },
    { id: "creative", name: "Creative", icon: "🎨" },
    { id: "gaming", name: "Gaming", icon: "🎮" },
    { id: "music", name: "Music", icon: "🎵" },
    { id: "wellness", name: "Wellness", icon: "🧘" },
    { id: "tech", name: "Tech", icon: "💻" },
    { id: "lifestyle", name: "Lifestyle", icon: "✨" },
    { id: "education", name: "Education", icon: "📚" },
  ]

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || community.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.memberCount - a.memberCount
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "active":
        return b.activeMembers - a.activeMembers
      case "trending":
        return b.growthRate - a.growthRate
      default:
        return 0
    }
  })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category)
    return cat?.icon || "🌌"
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="w-4 h-4" />
      case "private":
        return <Lock className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const handleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId ? { ...community, memberCount: community.memberCount + 1 } : community,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Discover Communities</h2>
          <p className="text-slate-400">Find your cosmic tribe and connect with like-minded creators</p>
        </div>

        <Button
          onClick={onCreateCommunity}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 text-white rounded px-3 py-2 border border-slate-600"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="active">Most Active</option>
            <option value="trending">Trending</option>
          </select>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="border-slate-600 text-slate-300"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                  : "border-slate-600 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div
        className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {sortedCommunities.map((community) => (
          <Card
            key={community.id}
            className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer group"
            onClick={() => onCommunitySelect?.(community)}
          >
            {/* Cover Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={community.coverImage || "/placeholder.svg"}
                alt={community.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Community Avatar */}
              <div className="absolute -bottom-6 left-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-900 overflow-hidden">
                  <img
                    src={community.avatar || "/placeholder.svg"}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Visibility Badge */}
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="border-white/30 text-white bg-black/30 backdrop-blur-sm">
                  {getVisibilityIcon(community.visibility)}
                  <span className="ml-1 capitalize">{community.visibility}</span>
                </Badge>
              </div>
            </div>

            <CardContent className="pt-8 pb-4">
              <div className="space-y-3">
                {/* Community Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                        {community.name}
                      </h3>
                      <span className="text-lg">{getCategoryIcon(community.category)}</span>
                    </div>

                    <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs capitalize">
                      {community.category}
                    </Badge>
                  </div>

                  {community.growthRate > 20 && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{community.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {community.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {community.tags.length > 3 && (
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      +{community.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-700/50">
                  <div className="text-center">
                    <div className="text-white font-semibold">{formatNumber(community.memberCount)}</div>
                    <div className="text-slate-400 text-xs">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{formatNumber(community.postCount)}</div>
                    <div className="text-slate-400 text-xs">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{formatNumber(community.activeMembers)}</div>
                    <div className="text-slate-400 text-xs">Active</div>
                  </div>
                </div>

                {/* Growth Rate */}
                {community.growthRate > 0 && (
                  <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{community.growthRate}% this month</span>
                  </div>
                )}

                {/* Join Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleJoinCommunity(community.id)
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedCommunities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">No communities found</h3>
          <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
          <Button
            onClick={onCreateCommunity}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create the first community
          </Button>
        </div>
      )}
    </div>
  )
}
