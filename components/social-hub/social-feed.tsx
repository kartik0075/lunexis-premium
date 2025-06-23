"use client"

import { useState } from "react"
import type { SocialPost } from "../../types/social-hub"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImageIcon,
  Video,
  Mic,
  MapPin,
  Users,
  Sparkles,
  Send,
  Smile,
  Globe,
  Lock,
  UserCheck,
  CheckCircle,
  Star,
  TrendingUp,
  Eye,
} from "lucide-react"

// Mock social posts data
const mockSocialPosts: SocialPost[] = [
  {
    id: "post_1",
    authorId: "user_1",
    content:
      "Just finished creating my first cosmic Glow video! ✨ The particle effects in the new Creator Studio are absolutely mind-blowing. Can't wait to share more stellar content with you all! 🌌\n\n#CosmicCreator #GlowVideo #LUNEXIS",
    type: "text",
    attachments: [
      {
        id: "att_1",
        type: "image",
        url: "/placeholder.svg?height=400&width=600",
        thumbnail: "/placeholder.svg?height=200&width=300",
        metadata: { width: 600, height: 400 },
      },
    ],
    likes: 1247,
    comments: 89,
    shares: 34,
    views: 5623,
    createdAt: "2024-01-15T14:30:00Z",
    isEdited: false,
    isPinned: false,
    isReported: false,
    moderationStatus: "approved",
    visibility: "public",
    tags: ["CosmicCreator", "GlowVideo", "LUNEXIS"],
    mentions: [],
    reactions: [
      { id: "r1", userId: "user_2", emoji: "✨", timestamp: "2024-01-15T14:31:00Z" },
      { id: "r2", userId: "user_3", emoji: "🚀", timestamp: "2024-01-15T14:32:00Z" },
      { id: "r3", userId: "user_4", emoji: "🌟", timestamp: "2024-01-15T14:33:00Z" },
    ],
    comments: [],
    shares: [],
  },
  {
    id: "post_2",
    authorId: "user_2",
    communityId: "community_1",
    content:
      "Hosting a live cosmic meditation session in the Stellar Wellness community tonight at 8 PM PST! 🧘‍♀️ We'll be exploring mindfulness techniques while surrounded by beautiful nebula visuals. All levels welcome! 💜",
    type: "event",
    attachments: [
      {
        id: "att_2",
        type: "image",
        url: "/placeholder.svg?height=300&width=500",
        thumbnail: "/placeholder.svg?height=150&width=250",
        metadata: { eventId: "event_1" },
      },
    ],
    likes: 892,
    comments: 156,
    shares: 67,
    views: 3421,
    createdAt: "2024-01-15T12:15:00Z",
    isEdited: false,
    isPinned: true,
    isReported: false,
    moderationStatus: "approved",
    visibility: "public",
    tags: ["Meditation", "Wellness", "Community"],
    mentions: ["@StellarWellness"],
    reactions: [
      { id: "r4", userId: "user_1", emoji: "🧘", timestamp: "2024-01-15T12:16:00Z" },
      { id: "r5", userId: "user_5", emoji: "💜", timestamp: "2024-01-15T12:17:00Z" },
    ],
    comments: [],
    shares: [],
  },
  {
    id: "post_3",
    authorId: "user_3",
    content:
      "Check out this incredible Vision video I just discovered! The storytelling and cosmic visuals are absolutely breathtaking. This is why I love the LUNEXIS community - so much talent and creativity! 🎬✨",
    type: "video",
    attachments: [
      {
        id: "att_3",
        type: "video",
        url: "/placeholder-video.mp4",
        thumbnail: "/placeholder.svg?height=360&width=640",
        metadata: { duration: 180, quality: "1080p" },
      },
    ],
    likes: 2156,
    comments: 234,
    shares: 89,
    views: 8934,
    createdAt: "2024-01-15T10:45:00Z",
    isEdited: false,
    isPinned: false,
    isReported: false,
    moderationStatus: "approved",
    visibility: "public",
    tags: ["Vision", "Storytelling", "Community"],
    mentions: [],
    reactions: [
      { id: "r6", userId: "user_1", emoji: "🎬", timestamp: "2024-01-15T10:46:00Z" },
      { id: "r7", userId: "user_2", emoji: "🔥", timestamp: "2024-01-15T10:47:00Z" },
    ],
    comments: [],
    shares: [],
  },
]

// Mock user data for posts
const mockUsers = {
  user_1: {
    id: "user_1",
    displayName: "Luna Starweaver",
    username: "starweaver",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    cosmicTitle: "Nebula Creator",
    badges: [
      { name: "Early Adopter", icon: "🌟", color: "#FFD700" },
      { name: "Content Creator", icon: "🎨", color: "#8B5CF6" },
    ],
  },
  user_2: {
    id: "user_2",
    displayName: "Cosmic Sage",
    username: "cosmic_sage",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    cosmicTitle: "Stellar Guide",
    badges: [
      { name: "Community Leader", icon: "👑", color: "#10B981" },
      { name: "Wellness Expert", icon: "🧘", color: "#EC4899" },
    ],
  },
  user_3: {
    id: "user_3",
    displayName: "Galaxy Explorer",
    username: "galaxy_explorer",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    cosmicTitle: "Void Wanderer",
    badges: [{ name: "Video Curator", icon: "🎬", color: "#3B82F6" }],
  },
}

interface SocialFeedProps {
  feedType?: "home" | "following" | "trending" | "community"
  communityId?: string
}

export function SocialFeed({ feedType = "home", communityId }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>(mockSocialPosts)
  const [newPost, setNewPost] = useState("")
  const [postVisibility, setPostVisibility] = useState<"public" | "friends" | "private">("public")
  const [isPosting, setIsPosting] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

  const handleLike = (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleReaction = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: [
                ...post.reactions,
                {
                  id: `r_${Date.now()}`,
                  userId: "current_user",
                  emoji,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : post,
      ),
    )
  }

  const handleShare = (postId: string) => {
    console.log("Share post:", postId)
    // TODO: Implement share functionality
  }

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId)
    // TODO: Open comment modal
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    setIsPosting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const post: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: "current_user",
      content: newPost,
      type: "text",
      attachments: [],
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      isEdited: false,
      isPinned: false,
      isReported: false,
      moderationStatus: "approved",
      visibility: postVisibility,
      tags: [],
      mentions: [],
      reactions: [],
      comments: [],
      shares: [],
    }

    setPosts((prev) => [post, ...prev])
    setNewPost("")
    setIsPosting(false)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="w-3 h-3" />
      case "friends":
        return <UserCheck className="w-3 h-3" />
      case "private":
        return <Lock className="w-3 h-3" />
      default:
        return <Globe className="w-3 h-3" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your cosmic thoughts... ✨"
                className="bg-slate-800/50 border-slate-600 text-white resize-none"
                rows={3}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <MapPin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={postVisibility}
                    onChange={(e) => setPostVisibility(e.target.value as any)}
                    className="bg-slate-800 text-white text-sm rounded px-2 py-1 border border-slate-600"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="private">Private</option>
                  </select>

                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || isPosting}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isPosting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Filter */}
      <div className="flex items-center gap-2 px-1">
        <Button
          variant={feedType === "home" ? "default" : "ghost"}
          size="sm"
          className={feedType === "home" ? "bg-purple-500/20 text-purple-300" : "text-slate-400"}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Home
        </Button>
        <Button
          variant={feedType === "following" ? "default" : "ghost"}
          size="sm"
          className={feedType === "following" ? "bg-purple-500/20 text-purple-300" : "text-slate-400"}
        >
          <Users className="w-4 h-4 mr-1" />
          Following
        </Button>
        <Button
          variant={feedType === "trending" ? "default" : "ghost"}
          size="sm"
          className={feedType === "trending" ? "bg-purple-500/20 text-purple-300" : "text-slate-400"}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Trending
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => {
          const author = mockUsers[post.authorId as keyof typeof mockUsers]
          if (!author) return null

          return (
            <Card key={post.id} className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{author.displayName[0]}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{author.displayName}</span>
                        {author.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />}
                        <Badge
                          variant="outline"
                          className="border-purple-500/50 text-purple-300 bg-purple-500/10 text-xs"
                        >
                          {author.cosmicTitle}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span>@{author.username}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {getVisibilityIcon(post.visibility)}
                          <span className="capitalize">{post.visibility}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isPinned && <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />}
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Post Content */}
                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{post.content}</div>

                {/* Post Attachments */}
                {post.attachments.length > 0 && (
                  <div className="space-y-2">
                    {post.attachments.map((attachment) => (
                      <div key={attachment.id} className="rounded-lg overflow-hidden">
                        {attachment.type === "image" && (
                          <img
                            src={attachment.url || "/placeholder.svg"}
                            alt="Post attachment"
                            className="w-full max-h-96 object-cover"
                          />
                        )}
                        {attachment.type === "video" && (
                          <video
                            src={attachment.url}
                            poster={attachment.thumbnail}
                            controls
                            className="w-full max-h-96 object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-300 cursor-pointer text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center gap-4 text-slate-400 text-sm border-t border-slate-700/50 pt-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(post.views)} views</span>
                  </div>
                  {post.reactions.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {post.reactions.slice(0, 3).map((reaction, index) => (
                          <span key={index} className="text-sm">
                            {reaction.emoji}
                          </span>
                        ))}
                      </div>
                      <span>{post.reactions.length} reactions</span>
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{formatNumber(post.likes)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComment(post.id)}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{formatNumber(post.comments)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post.id)}
                      className="text-slate-400 hover:text-green-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      <span>{formatNumber(post.shares)}</span>
                    </Button>
                  </div>

                  {/* Quick Reactions */}
                  <div className="flex items-center gap-1">
                    {["✨", "🚀", "💜", "🔥", "👏"].map((emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(post.id, emoji)}
                        className="text-slate-400 hover:text-white transition-colors p-1 h-8 w-8"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
