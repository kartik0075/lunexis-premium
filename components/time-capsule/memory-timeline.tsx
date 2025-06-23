"use client"

import { useState } from "react"
import type { TimeCapsule } from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Heart, Eye, Plus, Filter, TimerIcon as TimelineIcon, Sparkles } from "lucide-react"

interface MemoryTimelineProps {
  capsules: TimeCapsule[]
  onSelectCapsule: (capsule: TimeCapsule) => void
  onCreateTimeline: () => void
}

export function MemoryTimeline({ capsules, onSelectCapsule, onCreateTimeline }: MemoryTimelineProps) {
  const [filterMood, setFilterMood] = useState<string>("all")
  const [timelineView, setTimelineView] = useState<"vertical" | "horizontal">("vertical")

  const sortedCapsules = [...capsules].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const filteredCapsules =
    filterMood === "all" ? sortedCapsules : sortedCapsules.filter((capsule) => capsule.mood === filterMood)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      nostalgic: "🌅",
      grateful: "🙏",
      excited: "⚡",
      peaceful: "🕊️",
      adventurous: "🚀",
      romantic: "💕",
      reflective: "🌙",
      joyful: "✨",
    }
    return moodEmojis[mood] || "🌙"
  }

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      nostalgic: "border-orange-500/50 bg-orange-500/10",
      grateful: "border-green-500/50 bg-green-500/10",
      excited: "border-yellow-500/50 bg-yellow-500/10",
      peaceful: "border-blue-500/50 bg-blue-500/10",
      adventurous: "border-purple-500/50 bg-purple-500/10",
      romantic: "border-pink-500/50 bg-pink-500/10",
      reflective: "border-indigo-500/50 bg-indigo-500/10",
      joyful: "border-cyan-500/50 bg-cyan-500/10",
    }
    return colors[mood] || "border-slate-500/50 bg-slate-500/10"
  }

  const uniqueMoods = Array.from(new Set(capsules.map((c) => c.mood)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Memory Timeline</h2>
          <p className="text-slate-400">Journey through your preserved moments in time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={onCreateTimeline} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Timeline
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg text-white px-3 py-2"
          >
            <option value="all">All Moods</option>
            {uniqueMoods.map((mood) => (
              <option key={mood} value={mood}>
                {getMoodEmoji(mood)} {mood}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={timelineView === "vertical" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimelineView("vertical")}
            className={timelineView === "vertical" ? "bg-purple-500" : "border-slate-600"}
          >
            <TimelineIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={timelineView === "horizontal" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimelineView("horizontal")}
            className={timelineView === "horizontal" ? "bg-purple-500" : "border-slate-600"}
          >
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {filteredCapsules.length > 0 ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500"></div>

          <div className="space-y-8">
            {filteredCapsules.map((capsule, index) => (
              <div key={capsule.id} className="relative flex items-start gap-6">
                {/* Timeline Node */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full border-4 ${getMoodColor(capsule.mood)} flex items-center justify-center backdrop-blur-sm`}
                  >
                    <span className="text-2xl">{getMoodEmoji(capsule.mood)}</span>
                  </div>
                  {/* Connecting Line to Card */}
                  <div className="absolute top-8 left-16 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                </div>

                {/* Timeline Card */}
                <Card
                  className="flex-1 bg-slate-900/80 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 cursor-pointer transition-all duration-200 group"
                  onClick={() => onSelectCapsule(capsule)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
                          {capsule.title}
                        </h3>
                        <p className="text-slate-400 line-clamp-2">{capsule.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getMoodColor(capsule.mood)}>
                          {getMoodEmoji(capsule.mood)} {capsule.mood}
                        </Badge>
                        {capsule.status === "scheduled" && (
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                            <Clock className="w-3 h-3 mr-1" />
                            Scheduled
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(capsule.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(capsule.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{capsule.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{capsule.reactions.length} reactions</span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-slate-400 text-sm">
                        {capsule.content.length} item{capsule.content.length !== 1 ? "s" : ""}
                      </div>
                      <div className="flex gap-1">
                        {capsule.content.slice(0, 3).map((content) => (
                          <div
                            key={content.id}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          ></div>
                        ))}
                        {capsule.content.length > 3 && (
                          <div className="text-slate-500 text-xs">+{capsule.content.length - 3}</div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {capsule.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {capsule.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            #{tag}
                          </Badge>
                        ))}
                        {capsule.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            +{capsule.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Memories Found</h3>
          <p className="text-slate-400 mb-6">
            {filterMood !== "all"
              ? `No time capsules found with ${filterMood} mood`
              : "Create your first time capsule to start your memory timeline"}
          </p>
          <Button onClick={onCreateTimeline} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Timeline
          </Button>
        </div>
      )}
    </div>
  )
}
