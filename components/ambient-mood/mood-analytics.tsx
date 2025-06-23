"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Calendar, Clock, Target, Lightbulb, Users, Activity, Heart, Brain, Zap } from "lucide-react"
import type { MoodAnalytics, MoodHistory } from "../../types/ambient-mood"

// Mock data for demonstration
const mockMoodHistory: MoodHistory[] = [
  {
    id: "1",
    userId: "user_1",
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
    intensity: 8,
    timestamp: "2024-01-15T10:00:00Z",
    duration: 120,
    triggers: ["morning_coffee", "creative_work"],
    context: {
      timeOfDay: "morning",
      dayOfWeek: "Monday",
      activity: "working",
      socialContext: "alone",
    },
  },
  // Add more mock data...
]

const mockAnalytics: MoodAnalytics = {
  userId: "user_1",
  period: "week",
  dominantMoods: [
    { mood: mockMoodHistory[0].mood, percentage: 35 },
    { mood: { ...mockMoodHistory[0].mood, name: "Stellar Energy", color: "#F59E0B" }, percentage: 25 },
    { mood: { ...mockMoodHistory[0].mood, name: "Lunar Calm", color: "#06B6D4" }, percentage: 20 },
    { mood: { ...mockMoodHistory[0].mood, name: "Nebula Dreams", color: "#EC4899" }, percentage: 20 },
  ],
  moodPatterns: [
    {
      type: "daily",
      pattern: "Morning energy peaks, afternoon creativity, evening calm",
      confidence: 85,
      description: "You tend to be most energetic in the morning",
    },
    {
      type: "weekly",
      pattern: "Higher creativity on weekdays, more social on weekends",
      confidence: 78,
      description: "Work days boost your creative moods",
    },
  ],
  triggers: [
    { trigger: "morning_coffee", frequency: 15 },
    { trigger: "creative_work", frequency: 12 },
    { trigger: "music", frequency: 10 },
    { trigger: "nature", frequency: 8 },
  ],
  averageIntensity: 6.8,
  moodStability: 7.2,
  socialInfluence: 6.5,
  recommendations: [
    {
      type: "activity",
      title: "Morning Creative Sessions",
      description: "Schedule creative work in the morning when your energy peaks",
      action: "Set morning creative time",
      confidence: 85,
    },
    {
      type: "wellness",
      title: "Afternoon Calm Breaks",
      description: "Take short meditation breaks in the afternoon",
      action: "Add calm reminders",
      confidence: 72,
    },
  ],
}

const weeklyMoodData = [
  { day: "Mon", cosmic: 8, stellar: 6, lunar: 4, nebula: 5 },
  { day: "Tue", cosmic: 7, stellar: 8, lunar: 3, nebula: 6 },
  { day: "Wed", cosmic: 9, stellar: 5, lunar: 6, nebula: 4 },
  { day: "Thu", cosmic: 6, stellar: 7, lunar: 5, nebula: 7 },
  { day: "Fri", cosmic: 8, stellar: 9, lunar: 4, nebula: 5 },
  { day: "Sat", cosmic: 5, stellar: 6, lunar: 8, nebula: 6 },
  { day: "Sun", cosmic: 7, stellar: 4, lunar: 9, nebula: 8 },
]

const intensityData = [
  { time: "6AM", intensity: 4 },
  { time: "9AM", intensity: 7 },
  { time: "12PM", intensity: 8 },
  { time: "3PM", intensity: 6 },
  { time: "6PM", intensity: 5 },
  { time: "9PM", intensity: 7 },
  { time: "12AM", intensity: 3 },
]

interface MoodAnalyticsProps {
  userId: string
  period: "day" | "week" | "month" | "year"
}

export function MoodAnalytics({ userId, period }: MoodAnalyticsProps) {
  const [analytics, setAnalytics] = useState<MoodAnalytics>(mockAnalytics)
  const [selectedPeriod, setSelectedPeriod] = useState(period)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate loading analytics data
    setIsLoading(true)
    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }, 1000)
  }, [selectedPeriod, userId])

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Mood Analytics</h2>
        <div className="flex gap-2">
          {(["day", "week", "month", "year"] as const).map((p) => (
            <Button
              key={p}
              variant={selectedPeriod === p ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(p)}
              className={
                selectedPeriod === p
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "border-slate-600 text-slate-300 hover:bg-slate-800"
              }
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{analytics.averageIntensity.toFixed(1)}</div>
                <div className="text-sm text-slate-400">Avg Intensity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{analytics.moodStability.toFixed(1)}</div>
                <div className="text-sm text-slate-400">Stability Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{analytics.socialInfluence.toFixed(1)}</div>
                <div className="text-sm text-slate-400">Social Impact</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{analytics.triggers.length}</div>
                <div className="text-sm text-slate-400">Active Triggers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border-slate-700/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
            Overview
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-500/20">
            Patterns
          </TabsTrigger>
          <TabsTrigger value="triggers" className="data-[state=active]:bg-purple-500/20">
            Triggers
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-500/20">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Mood Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  Dominant Moods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.dominantMoods}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="percentage"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {analytics.dominantMoods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.mood.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Daily Intensity Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={intensityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Area type="monotone" dataKey="intensity" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Mood Trends */}
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                Weekly Mood Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyMoodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="cosmic" fill="#8B5CF6" name="Cosmic Bliss" />
                    <Bar dataKey="stellar" fill="#F59E0B" name="Stellar Energy" />
                    <Bar dataKey="lunar" fill="#06B6D4" name="Lunar Calm" />
                    <Bar dataKey="nebula" fill="#EC4899" name="Nebula Dreams" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Discovered Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.moodPatterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="capitalize" variant="outline">
                      {pattern.type.replace("-", " ")}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-400">Confidence:</div>
                      <div className="text-sm font-semibold text-white">{pattern.confidence}%</div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{pattern.pattern}</h4>
                  <p className="text-slate-400 text-sm">{pattern.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Mood Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.triggers.map((trigger, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-white capitalize">{trigger.trigger.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-400">Frequency:</div>
                      <Badge variant="outline">{trigger.frequency}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="capitalize" variant="outline">
                      {rec.type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <div className="text-sm text-slate-400">{rec.confidence}% match</div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                  <p className="text-slate-400 text-sm mb-3">{rec.description}</p>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
