"use client"

import { useState } from "react"
import type { NovaAnalytics } from "../../types/nova"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, MessageSquare, Zap, DollarSign, Brain, Star, Activity } from "lucide-react"

// Mock analytics data
const mockAnalytics: NovaAnalytics = {
  totalConversations: 247,
  totalMessages: 1834,
  totalTokensUsed: 156789,
  totalCost: 23.45,
  averageResponseTime: 2.3,
  mostUsedModels: [
    { modelId: "nova-cosmic", modelName: "Nova Cosmic", usage: 145, percentage: 58.7 },
    { modelId: "nova-code", modelName: "Nova Code", usage: 67, percentage: 27.1 },
    { modelId: "nova-vision", modelName: "Nova Vision", usage: 35, percentage: 14.2 },
  ],
  conversationsByType: {
    content_creation: 89,
    code_assistance: 67,
    creative_writing: 45,
    chat: 34,
    image_generation: 12,
    video_editing: 0,
    music_composition: 0,
    cosmic_guidance: 0,
  },
  dailyUsage: [
    { date: "2024-01-09", conversations: 12, messages: 89, tokens: 7234, cost: 1.23 },
    { date: "2024-01-10", conversations: 15, messages: 112, tokens: 8967, cost: 1.67 },
    { date: "2024-01-11", conversations: 18, messages: 134, tokens: 10234, cost: 2.01 },
    { date: "2024-01-12", conversations: 22, messages: 156, tokens: 12456, cost: 2.34 },
    { date: "2024-01-13", conversations: 19, messages: 142, tokens: 11234, cost: 2.12 },
    { date: "2024-01-14", conversations: 25, messages: 178, tokens: 13567, cost: 2.67 },
    { date: "2024-01-15", conversations: 28, messages: 198, tokens: 15234, cost: 2.89 },
  ],
  topTemplates: [
    { templateId: "cosmic-content", templateName: "Cosmic Content Creator", usage: 67, rating: 4.8 },
    { templateId: "code-reviewer", templateName: "Cosmic Code Reviewer", usage: 45, rating: 4.6 },
    { templateId: "story-weaver", templateName: "Galactic Story Weaver", usage: 34, rating: 4.9 },
    { templateId: "business-plan", templateName: "Stellar Business Strategist", usage: 23, rating: 4.4 },
  ],
}

const COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"]

export function NovaAnalyticsComponent() {
  const [analytics] = useState<NovaAnalytics>(mockAnalytics)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d")

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const conversationTypeData = Object.entries(analytics.conversationsByType)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name: type.replace("_", " "),
      value: count,
      percentage: ((count / analytics.totalConversations) * 100).toFixed(1),
    }))

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Nova Analytics</h1>
            <p className="text-slate-400">Track your AI usage and performance insights</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-slate-800 text-white rounded px-3 py-2 border border-slate-600"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Conversations</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.totalConversations)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+12.5%</span>
                <span className="text-slate-500 text-sm">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.totalMessages)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+8.3%</span>
                <span className="text-slate-500 text-sm">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tokens Used</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analytics.totalTokensUsed)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+15.7%</span>
                <span className="text-slate-500 text-sm">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Cost</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(analytics.totalCost)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+5.2%</span>
                <span className="text-slate-500 text-sm">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="usage">Usage Trends</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="content">Content Types</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-6">
            {/* Daily Usage Chart */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Daily Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversations"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      name="Conversations"
                    />
                    <Line type="monotone" dataKey="messages" stroke="#EC4899" strokeWidth={2} name="Messages" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Token Usage and Cost */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Token Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Bar dataKey="tokens" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Daily Costs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                        formatter={(value) => [formatCurrency(value as number), "Cost"]}
                      />
                      <Bar dataKey="cost" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            {/* Model Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Model Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.mostUsedModels}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="usage"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {analytics.mostUsedModels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Model Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.mostUsedModels.map((model, index) => (
                    <div key={model.modelId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-white font-medium">{model.modelName}</span>
                        </div>
                        <div className="text-slate-400 text-sm">{model.usage} uses</div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${model.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{model.percentage}% of total usage</span>
                        <span>Avg response: {analytics.averageResponseTime}s</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Content Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Conversation Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={conversationTypeData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Bar dataKey="value" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Content Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conversationTypeData.map((type, index) => (
                    <div key={type.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <div>
                          <div className="text-white font-medium capitalize">{type.name}</div>
                          <div className="text-slate-400 text-sm">{type.percentage}% of conversations</div>
                        </div>
                      </div>
                      <div className="text-white font-semibold">{type.value}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Top Templates */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Performing Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topTemplates.map((template, index) => (
                    <div
                      key={template.templateId}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{template.templateName}</div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <span>{template.usage} uses</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{template.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                        Popular
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
