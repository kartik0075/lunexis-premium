"use client"

import { useState } from "react"
import type { MemoryTrigger, TriggerNotification } from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Zap,
  Activity,
  Bell,
  Search,
  Plus,
  BarChart3,
  MapPin,
  Calendar,
  Sparkles,
  Clock,
  TrendingUp,
  Pause,
  Play,
  Edit,
  Trash2,
} from "lucide-react"

// Mock data
const mockTriggers: MemoryTrigger[] = [
  {
    id: "trigger_1",
    userId: "user_1",
    name: "Coffee Shop Memories",
    description: "Trigger when I visit my favorite coffee shop",
    conditions: [
      {
        id: "condition_1",
        type: "location",
        operator: "within_radius",
        value: {
          latitude: 40.7128,
          longitude: -74.006,
          address: "Blue Bottle Coffee, NYC",
          city: "New York",
          country: "USA",
        },
        description: "Within 100m of Blue Bottle Coffee",
        isActive: true,
      },
    ],
    actions: [
      {
        id: "action_1",
        type: "notify",
        config: {
          title: "Coffee Shop Memory",
          message: "You're at your favorite spot! Want to capture this moment?",
          sound: true,
        },
        description: "Send notification",
        priority: "medium",
      },
      {
        id: "action_2",
        type: "create_memory",
        config: {
          autoFill: true,
          suggestContent: true,
        },
        description: "Suggest memory creation",
        priority: "high",
      },
    ],
    isActive: true,
    lastTriggered: "2024-01-15T10:30:00Z",
    triggerCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    settings: {
      maxTriggersPerDay: 3,
      quietHours: { start: "22:00", end: "08:00" },
      enabledDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      requireConfirmation: true,
      autoCreateMemories: false,
      notificationStyle: "standard",
    },
    metadata: {
      associatedCapsules: ["capsule_1", "capsule_3"],
      successRate: 0.85,
      lastModified: "2024-01-15T10:30:00Z",
      tags: ["coffee", "work", "routine"],
    },
  },
  {
    id: "trigger_2",
    userId: "user_1",
    name: "Anniversary Reminder",
    description: "Annual reminder of our first date",
    conditions: [
      {
        id: "condition_2",
        type: "date",
        operator: "on_date",
        value: "2024-02-14",
        description: "February 14th every year",
        isActive: true,
      },
    ],
    actions: [
      {
        id: "action_3",
        type: "notify",
        config: {
          title: "Anniversary Today! 💕",
          message: "It's been another year since our first date. Time to create new memories!",
          sound: true,
        },
        description: "Anniversary notification",
        priority: "high",
      },
      {
        id: "action_4",
        type: "unlock_capsule",
        config: {
          capsuleId: "capsule_anniversary_2023",
        },
        description: "Unlock last year's anniversary capsule",
        priority: "medium",
      },
    ],
    isActive: true,
    triggerCount: 2,
    createdAt: "2023-02-14T00:00:00Z",
    settings: {
      maxTriggersPerDay: 1,
      quietHours: { start: "23:00", end: "07:00" },
      enabledDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      requireConfirmation: false,
      autoCreateMemories: true,
      notificationStyle: "prominent",
    },
    metadata: {
      associatedCapsules: ["capsule_anniversary_2023", "capsule_anniversary_2024"],
      successRate: 1.0,
      lastModified: "2024-02-14T09:00:00Z",
      tags: ["anniversary", "love", "relationship"],
    },
  },
]

const mockNotifications: TriggerNotification[] = [
  {
    id: "notification_1",
    triggerId: "trigger_1",
    userId: "user_1",
    title: "Coffee Shop Memory",
    message: "You're at your favorite spot! Want to capture this moment?",
    type: "location_entered",
    data: {},
    isRead: false,
    createdAt: "2024-01-15T10:30:00Z",
    actions: [
      {
        id: "action_1",
        label: "Create Memory",
        action: "create_memory",
        data: { triggerId: "trigger_1" },
      },
      {
        id: "action_2",
        label: "Dismiss",
        action: "dismiss",
      },
    ],
  },
  {
    id: "notification_2",
    triggerId: "trigger_2",
    userId: "user_1",
    title: "Anniversary Today! 💕",
    message: "It's been another year since our first date. Time to create new memories!",
    type: "date_anniversary",
    data: {},
    isRead: true,
    createdAt: "2024-02-14T09:00:00Z",
    actions: [
      {
        id: "action_3",
        label: "View Capsule",
        action: "view_capsule",
        data: { capsuleId: "capsule_anniversary_2023" },
      },
      {
        id: "action_4",
        label: "Create New",
        action: "create_memory",
      },
    ],
  },
]

interface TriggerDashboardProps {
  onCreateTrigger: () => void
  onEditTrigger: (trigger: MemoryTrigger) => void
  onCreateMemory: (suggestion?: any) => void
}

export function TriggerDashboard({ onCreateTrigger, onEditTrigger, onCreateMemory }: TriggerDashboardProps) {
  const [triggers, setTriggers] = useState<MemoryTrigger[]>(mockTriggers)
  const [notifications, setNotifications] = useState<TriggerNotification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("triggers")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const filteredTriggers = triggers.filter((trigger) => {
    const matchesSearch =
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      filterType === "all" ||
      (filterType === "active" && trigger.isActive) ||
      (filterType === "inactive" && !trigger.isActive) ||
      trigger.conditions.some((condition) => condition.type === filterType)

    return matchesSearch && matchesFilter
  })

  const handleToggleTrigger = (triggerId: string) => {
    setTriggers(
      triggers.map((trigger) => (trigger.id === triggerId ? { ...trigger, isActive: !trigger.isActive } : trigger)),
    )
  }

  const handleDeleteTrigger = (triggerId: string) => {
    setTriggers(triggers.filter((trigger) => trigger.id !== triggerId))
  }

  const handleNotificationAction = (notificationId: string, action: string, data?: any) => {
    switch (action) {
      case "create_memory":
        onCreateMemory(data)
        break
      case "view_capsule":
        // Handle capsule viewing
        break
      case "dismiss":
        setNotifications(notifications.filter((n) => n.id !== notificationId))
        break
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const activeTriggers = triggers.filter((t) => t.isActive)
  const totalTriggerCount = triggers.reduce((sum, trigger) => sum + trigger.triggerCount, 0)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Triggers</p>
                <p className="text-2xl font-bold text-white">{triggers.length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Triggers</p>
                <p className="text-2xl font-bold text-white">{activeTriggers.length}</p>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Activations</p>
                <p className="text-2xl font-bold text-white">{totalTriggerCount}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Notifications</p>
                <p className="text-2xl font-bold text-white">{unreadNotifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-slate-800/50">
            <TabsTrigger value="triggers" className="data-[state=active]:bg-purple-500/20">
              <Target className="w-4 h-4 mr-2" />
              Triggers ({triggers.length})
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20">
              <Bell className="w-4 h-4 mr-2" />
              Notifications ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <Button onClick={onCreateTrigger} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            New Trigger
          </Button>
        </div>

        {/* Triggers Tab */}
        <TabsContent value="triggers" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search triggers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-800/50 border border-slate-600 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
                <option value="location">Location-Based</option>
                <option value="date">Date-Based</option>
              </select>
            </div>
          </div>

          {/* Triggers List */}
          <div className="space-y-4">
            {filteredTriggers.map((trigger) => (
              <Card
                key={trigger.id}
                className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{trigger.name}</h3>
                        <Badge
                          className={
                            trigger.isActive ? "bg-green-500/20 text-green-300" : "bg-slate-500/20 text-slate-400"
                          }
                        >
                          {trigger.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {trigger.conditions[0]?.type}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-4">{trigger.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Activity className="w-4 h-4" />
                          <span>Triggered {trigger.triggerCount} times</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.round(trigger.metadata.successRate * 100)}% success rate</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>
                            {trigger.lastTriggered
                              ? `Last: ${new Date(trigger.lastTriggered).toLocaleDateString()}`
                              : "Never triggered"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {trigger.metadata.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-purple-500/50 text-purple-300 bg-purple-500/10"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{trigger.actions.length} actions configured</span>
                        <span>•</span>
                        <span>{trigger.metadata.associatedCapsules.length} linked capsules</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleTrigger(trigger.id)}
                        className={
                          trigger.isActive
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-green-400 hover:text-green-300"
                        }
                      >
                        {trigger.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTrigger(trigger)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTriggers.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Triggers Found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first memory trigger to get started"}
              </p>
              <Button onClick={onCreateTrigger} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Plus className="w-4 h-4 mr-2" />
                Create Memory Trigger
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-slate-900/80 border-slate-700/50 backdrop-blur-sm ${
                  !notification.isRead ? "border-purple-500/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      {notification.type === "location_entered" && <MapPin className="w-5 h-5 text-white" />}
                      {notification.type === "date_anniversary" && <Calendar className="w-5 h-5 text-white" />}
                      {notification.type === "memory_suggestion" && <Sparkles className="w-5 h-5 text-white" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        {!notification.isRead && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.actions.map((action) => (
                          <Button
                            key={action.id}
                            size="sm"
                            variant={action.action === "create_memory" ? "default" : "outline"}
                            onClick={() => handleNotificationAction(notification.id, action.action, action.data)}
                            className={
                              action.action === "create_memory"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "border-slate-600 text-slate-300"
                            }
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Notifications</h3>
              <p className="text-slate-400">Your memory trigger notifications will appear here</p>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Trigger Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {triggers.map((trigger) => (
                    <div key={trigger.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{trigger.name}</p>
                        <p className="text-slate-400 text-sm">{trigger.triggerCount} activations</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{Math.round(trigger.metadata.successRate * 100)}%</p>
                        <p className="text-slate-400 text-sm">success rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Trigger Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["location", "date"].map((type) => {
                    const count = triggers.filter((t) => t.conditions.some((c) => c.type === type)).length
                    const percentage = triggers.length > 0 ? (count / triggers.length) * 100 : 0

                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300 capitalize">
                            {type}
                          </Badge>
                          <span className="text-slate-300">{count} triggers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-sm w-12 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
