"use client"

import { useState } from "react"
import type { VisionComment } from "../../types/vision"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, MessageCircle, MoreVertical, Pin, CheckCircle, Send } from "lucide-react"

// Mock comments data
const mockComments: VisionComment[] = [
  {
    id: "comment_1",
    userId: "user_1",
    user: {
      username: "cosmic_explorer",
      displayName: "Cosmic Explorer",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
    },
    content:
      "This is absolutely mesmerizing! The way you captured the cosmic energy in this video is incredible. The editing and effects are on another level! ✨🌌",
    createdAt: "2024-01-15T10:30:00Z",
    likes: 234,
    replies: [
      {
        id: "reply_1",
        userId: "user_2",
        user: {
          username: "starweaver",
          displayName: "Luna Starweaver",
          avatar: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        },
        content: "Thank you so much! It took hours to get the cosmic effects just right. Glad you enjoyed it! 💜",
        createdAt: "2024-01-15T11:00:00Z",
        likes: 45,
        replies: [],
        isLiked: false,
        isPinned: false,
      },
    ],
    isLiked: false,
    isPinned: true,
  },
  {
    id: "comment_2",
    userId: "user_3",
    user: {
      username: "nebula_dreamer",
      displayName: "Nebula Dreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
    },
    content:
      "The chapter on digital galaxies really resonated with me. As someone who's been exploring AI art, this gives me so much inspiration for my next project!",
    createdAt: "2024-01-15T09:45:00Z",
    likes: 89,
    replies: [],
    isLiked: true,
    isPinned: false,
  },
  {
    id: "comment_3",
    userId: "user_4",
    user: {
      username: "cosmic_vibes",
      displayName: "Cosmic Vibes",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
    },
    content:
      "Love the ambient soundscape in the background! What music did you use? It perfectly complements the visuals 🎵",
    createdAt: "2024-01-15T08:20:00Z",
    likes: 67,
    replies: [],
    isLiked: false,
    isPinned: false,
  },
]

interface VisionCommentsProps {
  videoId: string
  totalComments: number
}

export function VisionComments({ videoId, totalComments }: VisionCommentsProps) {
  const [comments, setComments] = useState<VisionComment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "popular">("popular")

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

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

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return

    const comment: VisionComment = {
      id: `comment_${Date.now()}`,
      userId: "current_user",
      user: {
        username: "you",
        displayName: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
      isPinned: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) return

    const reply: VisionComment = {
      id: `reply_${Date.now()}`,
      userId: "current_user",
      user: {
        username: "you",
        displayName: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      },
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
      isPinned: false,
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )

    setReplyText("")
    setReplyingTo(null)
  }

  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        isLiked: !reply.isLiked,
                        likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      }
                    : reply,
                ),
              }
            : comment,
        ),
      )
    } else {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              }
            : comment,
        ),
      )
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {formatNumber(totalComments)} Comments
          </CardTitle>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "popular")}
            className="bg-slate-800 text-white text-sm rounded px-3 py-1 border border-slate-600"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Comment */}
        <div className="flex gap-3">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="Your avatar"
            className="w-10 h-10 rounded-full border-2 border-slate-600"
          />
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a cosmic comment..."
              className="bg-slate-800/50 border-slate-600 text-white resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <img
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.displayName}
                  className="w-10 h-10 rounded-full border-2 border-slate-600"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{comment.user.displayName}</span>
                    {comment.user.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" fill="currentColor" />}
                    <span className="text-slate-400 text-sm">@{comment.user.username}</span>
                    <span className="text-slate-500 text-sm">•</span>
                    <span className="text-slate-500 text-sm">{formatTimeAgo(comment.createdAt)}</span>
                    {comment.isPinned && (
                      <>
                        <span className="text-slate-500 text-sm">•</span>
                        <div className="flex items-center gap-1 text-purple-400 text-sm">
                          <Pin className="w-3 h-3" />
                          <span>Pinned</span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-slate-300">{comment.content}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 h-auto p-1 ${
                        comment.isLiked ? "text-purple-400" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm">{formatNumber(comment.likes)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-slate-400 hover:text-white h-auto p-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Reply</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-auto p-1">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="ml-13 flex gap-3">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full border-2 border-slate-600"
                  />
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to @${comment.user.username}...`}
                      className="bg-slate-800/50 border-slate-600 text-white resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Reply
                      </Button>
                      <Button
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyText("")
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-13 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <img
                        src={reply.user.avatar || "/placeholder.svg"}
                        alt={reply.user.displayName}
                        className="w-8 h-8 rounded-full border-2 border-slate-600"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{reply.user.displayName}</span>
                          {reply.user.isVerified && (
                            <CheckCircle className="w-3 h-3 text-blue-400" fill="currentColor" />
                          )}
                          <span className="text-slate-400 text-xs">@{reply.user.username}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-slate-500 text-xs">{formatTimeAgo(reply.createdAt)}</span>
                        </div>

                        <p className="text-slate-300 text-sm">{reply.content}</p>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(reply.id, true, comment.id)}
                            className={`flex items-center gap-1 h-auto p-1 ${
                              reply.isLiked ? "text-purple-400" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${reply.isLiked ? "fill-current" : ""}`} />
                            <span className="text-xs">{formatNumber(reply.likes)}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
