"use client"

import { useState } from "react"
import { Users, MessageCircle, Calendar, Trophy, Sparkles, Heart, UserPlus, Home, Star } from "lucide-react"

type SocialView = "feed" | "communities" | "messages" | "events" | "challenges" | "profile"

export function SocialHubModule() {
  const [currentView, setCurrentView] = useState<SocialView>("feed")
  const [feedType, setFeedType] = useState<"home" | "following" | "trending">("home")

  const navigationItems = [
    { id: "feed", label: "Feed", icon: Home, count: 0 },
    { id: "communities", label: "Communities", icon: Users, count: 0 },
    { id: "messages", label: "Messages", icon: MessageCircle, count: 3 },
    { id: "events", label: "Events", icon: Calendar, count: 2 },
    { id: "challenges", label: "Challenges", icon: Trophy, count: 1 },
    { id: "profile", label: "Profile", icon: Star, count: 0 }
  ]

  const quickStats = [
    { label: "Following", value: "1,247", change: "+12", icon: UserPlus, color: "text-blue-400" },
    { label: "Followers", value: "3,891", change: "+89", icon: Users, color: "text-green-400" },
    { label: "Total Likes", value: "15.2K", change: "+234", icon: Heart, color: "text-red-400" },
    { label: "Communities", value: "23", change: "+2", icon: Sparkles, color: "text-purple-400" }
  ]

  const trendingTopics = [
    { tag: "CosmicCreators", posts: "2.3K", growth: "+15%" },
    { tag: "NebulaArt", posts: "1.8K", growth: "+23%" },
    { tag: "StellarMusic", posts: "1.2K", growth: "+8%" },
    { tag: "GalaxyGaming", posts: "956", growth: "+31%" },
    { tag: "CosmicWellness", posts: "743", growth: "+12%" }
  ]

  const upcomingEvents = [
    {
      id: "event_1",
      title: "Cosmic Creator Showcase",
      time: "Today, 8:00 PM",
      attendees: 234,\
      type: "showcase
