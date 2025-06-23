"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  CheckCircle,
  Calendar,
  Heart,
  Sparkles,
  Video,
  Archive,
  Edit3,
  Save,
  X,
  Camera,
  Loader2,
  Crown,
  Star,
  Zap,
} from "lucide-react"

interface UserProfilePageProps {
  username?: string
}

export function UserProfilePage({ username }: UserProfilePageProps) {
  const { user, updateProfile, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
    moodStatus: "",
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setEditData({
        displayName: user.displayName,
        bio: user.bio || "",
        moodStatus: user.moodStatus.current,
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-slate-400">This user profile doesn't exist or is private.</p>
        </div>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      calm: "🌙",
      hyper: "⚡",
      inspired: "✨",
      dreamy: "💭",
      energetic: "🔥",
      nostalgic: "🌅",
      cosmic: "🌌",
      love: "💖",
      sad: "💙",
    }
    return moodEmojis[mood] || "🌙"
  }

  const handleSaveProfile = async () => {
    setUpdateLoading(true)
    setUpdateError("")
    setUpdateSuccess(false)

    try {
      await updateProfile({
        displayName: editData.displayName,
        bio: editData.bio,
        moodStatus: {
          current: editData.moodStatus as any,
          emoji: getMoodEmoji(editData.moodStatus),
          lastUpdated: new Date().toISOString(),
        },
      })
      setIsEditing(false)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (error: any) {
      setUpdateError(error.message || "Failed to update profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      displayName: user.displayName,
      bio: user.bio || "",
      moodStatus: user.moodStatus.current,
    })
    setUpdateError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Success Alert */}
        {updateSuccess && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 mb-6 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center md:text-left">
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={user.avatar || "/placeholder.svg?height=128&width=128"}
                      alt={user.displayName}
                      className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-purple-500 to-pink-500 p-1 shadow-lg"
                    />
                    <div
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-slate-900 shadow-lg"
                      style={{ backgroundColor: user.moodStatus.ambientColor }}
                      title={`Currently feeling ${user.moodStatus.current}`}
                    >
                      <div className="w-full h-full rounded-full flex items-center justify-center text-xs">
                        {getMoodEmoji(user.moodStatus.current)}
                      </div>
                    </div>
                  </div>

                  {/* Edit Avatar Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute inset-0 w-full h-full rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    {isEditing ? (
                      <Input
                        value={editData.displayName}
                        onChange={(e) => setEditData((prev) => ({ ...prev, displayName: e.target.value }))}
                        className="text-xl font-bold bg-slate-800/50 border-slate-600 text-white text-center md:text-left"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                    )}
                    {user.isVerified && <CheckCircle className="w-6 h-6 text-blue-400" fill="currentColor" />}
                  </div>
                  <p className="text-slate-400">@{user.username}</p>
                  <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(user.joinedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Stats and Bio */}
              <div className="flex-1">
                {/* Bio */}
                <div className="mb-4">
                  {isEditing ? (
                    <Textarea
                      value={editData.bio}
                      onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell the universe about yourself..."
                      className="bg-slate-800/50 border-slate-600 text-white resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-slate-300">{user.bio || "No bio yet..."}</p>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatNumber(user.followers)}</div>
                    <div className="text-slate-400 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatNumber(user.following)}</div>
                    <div className="text-slate-400 text-sm">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatNumber(user.totalLikes)}</div>
                    <div className="text-slate-400 text-sm">Total Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatNumber(user.stats.totalViews)}</div>
                    <div className="text-slate-400 text-sm">Total Views</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.badges.map((badge) => (
                    <Badge
                      key={badge.id}
                      className="bg-slate-800/50 text-slate-300 border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                      title={badge.description}
                    >
                      <span className="mr-1">{badge.icon}</span>
                      {badge.name}
                      {badge.rarity === "legendary" && <Crown className="w-3 h-3 ml-1 text-yellow-400" />}
                      {badge.rarity === "epic" && <Star className="w-3 h-3 ml-1 text-purple-400" />}
                      {badge.rarity === "rare" && <Zap className="w-3 h-3 ml-1 text-blue-400" />}
                    </Badge>
                  ))}
                </div>

                {/* Current Mood */}
                <div className="flex items-center gap-2 mb-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Label className="text-slate-300">Mood:</Label>
                      <select
                        value={editData.moodStatus}
                        onChange={(e) => setEditData((prev) => ({ ...prev, moodStatus: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white rounded px-2 py-1"
                      >
                        <option value="calm">🌙 Calm</option>
                        <option value="hyper">⚡ Hyper</option>
                        <option value="inspired">✨ Inspired</option>
                        <option value="dreamy">💭 Dreamy</option>
                        <option value="energetic">🔥 Energetic</option>
                        <option value="nostalgic">🌅 Nostalgic</option>
                        <option value="cosmic">🌌 Cosmic</option>
                        <option value="love">💖 Love</option>
                        <option value="sad">💙 Sad</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: user.moodStatus.ambientColor }}
                      ></div>
                      <span className="text-slate-300 capitalize">
                        Currently feeling {user.moodStatus.current} {getMoodEmoji(user.moodStatus.current)}
                      </span>
                    </>
                  )}
                </div>

                {/* Error Alert */}
                {updateError && (
                  <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{updateError}</AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={updateLoading}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={updateLoading}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-500/20">
              <Video className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="capsules" className="data-[state=active]:bg-purple-500/20">
              <Archive className="w-4 h-4 mr-2" />
              Time Capsules
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500/20">
              <Heart className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content Stats */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Content Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Glow Posts</span>
                    <span className="text-white font-semibold">{user.stats.glowPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vision Videos</span>
                    <span className="text-white font-semibold">{user.stats.visionVideos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Orbit Streams</span>
                    <span className="text-white font-semibold">{user.stats.orbitStreams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Capsules</span>
                    <span className="text-white font-semibold">{user.stats.timeCapsules}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Mood History */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Mood Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-300 text-sm capitalize">{user.moodStatus.current} (Current)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm">Calm (Yesterday)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm">Energetic (2 days ago)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="text-slate-300">
                    <span className="text-purple-400">Posted</span> a new Glow • 2h ago
                  </div>
                  <div className="text-slate-300">
                    <span className="text-blue-400">Uploaded</span> Vision video • 1d ago
                  </div>
                  <div className="text-slate-300">
                    <span className="text-pink-400">Created</span> Time Capsule • 3d ago
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Content Gallery</h3>
                  <p className="text-slate-400">User's Glow, Vision, and Orbit content will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capsules" className="mt-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Archive className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Time Capsule Vault</h3>
                  <p className="text-slate-400">Preserved memories and moments will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Activity Feed</h3>
                  <p className="text-slate-400">Likes, comments, and interactions will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
