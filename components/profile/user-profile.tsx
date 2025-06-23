"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, CheckCircle, Calendar, Heart, Users, Sparkles, Video, Archive } from "lucide-react"

export function UserProfile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) return null

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center md:text-left">
                <div className="relative">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.displayName}
                    className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-purple-500 to-pink-500 p-1"
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-slate-900"
                    style={{ backgroundColor: user.moodStatus.ambientColor }}
                  ></div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
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
                <p className="text-slate-300 mb-4">{user.bio}</p>

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
                    <Badge key={badge.id} className="bg-slate-800/50 text-slate-300 border-slate-600/50">
                      <span className="mr-1">{badge.icon}</span>
                      {badge.name}
                    </Badge>
                  ))}
                </div>

                {/* Current Mood */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: user.moodStatus.ambientColor }}></div>
                  <span className="text-slate-300 capitalize">Currently feeling {user.moodStatus.current}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Stats</h3>
                  <div className="space-y-3">
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
                  </div>
                </CardContent>
              </Card>

              {/* Mood History */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Mood Journey</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Inspired (Current)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-400 text-sm">Calm (Yesterday)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-slate-400 text-sm">Energetic (2 days ago)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="text-slate-300">
                      <span className="text-purple-400">Posted</span> a new Glow • 2h ago
                    </div>
                    <div className="text-slate-300">
                      <span className="text-blue-400">Uploaded</span> Vision video • 1d ago
                    </div>
                    <div className="text-slate-300">
                      <span className="text-pink-400">Created</span> Time Capsule • 3d ago
                    </div>
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
