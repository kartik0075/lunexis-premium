"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { ChatMessage, ChatSettings, StreamAlert } from "../../types/orbit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Settings, Users, Gift, UserPlus, Trash2, Ban, Shield, Smile } from "lucide-react"

// Mock chat messages
const mockChatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    userId: "user_1",
    user: {
      username: "cosmic_viewer",
      displayName: "Cosmic Viewer",
      avatar: "/placeholder.svg?height=32&width=32",
      isVerified: true,
      isSubscriber: true,
      isModerator: false,
      isStreamer: false,
      badges: [
        { id: "sub", name: "Subscriber", icon: "⭐", color: "#8B5CF6" },
        { id: "verified", name: "Verified", icon: "✓", color: "#3B82F6" },
      ],
    },
    content: "This gameplay is incredible! How did you pull off that combo? 🔥",
    timestamp: "2024-01-15T10:30:00Z",
    type: "message",
    emotes: [],
    mentions: [],
    isDeleted: false,
  },
  {
    id: "msg_2",
    userId: "system",
    user: {
      username: "system",
      displayName: "LUNEXIS",
      avatar: "/placeholder.svg?height=32&width=32",
      isVerified: false,
      isSubscriber: false,
      isModerator: false,
      isStreamer: false,
      badges: [],
    },
    content: "StarGazer47 just followed the stream! Welcome to the cosmic community! 🌟",
    timestamp: "2024-01-15T10:29:00Z",
    type: "follow",
    emotes: [],
    mentions: [],
    isDeleted: false,
  },
  {
    id: "msg_3",
    userId: "user_3",
    user: {
      username: "nebula_gamer",
      displayName: "Nebula Gamer",
      avatar: "/placeholder.svg?height=32&width=32",
      isVerified: false,
      isSubscriber: false,
      isModerator: true,
      isStreamer: false,
      badges: [{ id: "mod", name: "Moderator", icon: "🛡️", color: "#10B981" }],
    },
    content: "Remember to follow the stream rules everyone! Keep it cosmic and positive ✨",
    timestamp: "2024-01-15T10:28:00Z",
    type: "message",
    emotes: [],
    mentions: [],
    isDeleted: false,
  },
  {
    id: "msg_4",
    userId: "user_4",
    user: {
      username: "galaxy_supporter",
      displayName: "Galaxy Supporter",
      avatar: "/placeholder.svg?height=32&width=32",
      isVerified: false,
      isSubscriber: true,
      isModerator: false,
      isStreamer: false,
      badges: [
        { id: "sub", name: "Subscriber", icon: "⭐", color: "#8B5CF6" },
        { id: "donor", name: "Supporter", icon: "💎", color: "#F59E0B" },
      ],
    },
    content: "Just donated $25! Keep up the amazing content! 💜",
    timestamp: "2024-01-15T10:27:00Z",
    type: "donation",
    emotes: [],
    mentions: [],
    isDeleted: false,
    donationAmount: 25,
  },
]

interface OrbitChatProps {
  streamId: string
  chatSettings: ChatSettings
  viewerCount: number
  isStreamer?: boolean
  isModerator?: boolean
}

export function OrbitChat({
  streamId,
  chatSettings,
  viewerCount,
  isStreamer = false,
  isModerator = false,
}: OrbitChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [showEmotes, setShowEmotes] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [alerts, setAlerts] = useState<StreamAlert[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Simulate new messages and alerts
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          user: {
            username: `viewer_${Math.floor(Math.random() * 1000)}`,
            displayName: `Cosmic Viewer ${Math.floor(Math.random() * 1000)}`,
            avatar: "/placeholder.svg?height=32&width=32",
            isVerified: Math.random() > 0.8,
            isSubscriber: Math.random() > 0.6,
            isModerator: false,
            isStreamer: false,
            badges: Math.random() > 0.6 ? [{ id: "sub", name: "Subscriber", icon: "⭐", color: "#8B5CF6" }] : [],
          },
          content: [
            "Amazing gameplay! 🎮",
            "This is so cool!",
            "How do you do that?",
            "Love this stream! ✨",
            "Epic moment!",
            "GG!",
            "Incredible skills!",
          ][Math.floor(Math.random() * 7)],
          timestamp: new Date().toISOString(),
          type: "message",
          emotes: [],
          mentions: [],
          isDeleted: false,
        }
        setMessages((prev) => [...prev, newMsg])
      }
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatSettings.enabled) return

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: "current_user",
      user: {
        username: "you",
        displayName: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isVerified: false,
        isSubscriber: true,
        isModerator: isModerator,
        isStreamer: isStreamer,
        badges: [
          ...(isStreamer ? [{ id: "streamer", name: "Streamer", icon: "👑", color: "#EF4444" }] : []),
          ...(isModerator ? [{ id: "mod", name: "Moderator", icon: "🛡️", color: "#10B981" }] : []),
        ],
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "message",
      emotes: [],
      mentions: [],
      isDeleted: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isDeleted: true } : msg)))
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours}h`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card className="h-full bg-slate-900/80 backdrop-blur-sm border-slate-700/50 flex flex-col">
      {/* Chat Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Stream Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Users className="w-4 h-4" />
              <span>{formatNumber(viewerCount)}</span>
            </div>
            {(isStreamer || isModerator) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-slate-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
          <span className="text-slate-400 text-sm">{isConnected ? "Connected to chat" : "Disconnected"}</span>
        </div>
      </CardHeader>

      {/* Chat Messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto px-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`${message.isDeleted ? "opacity-50" : ""}`}>
              {message.type === "message" ? (
                <div className="flex gap-2 group">
                  <img
                    src={message.user.avatar || "/placeholder.svg"}
                    alt={message.user.displayName}
                    className="w-6 h-6 rounded-full flex-shrink-0 mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* User Badges */}
                      <div className="flex items-center gap-1">
                        {message.user.badges.map((badge) => (
                          <span key={badge.id} className="text-xs" style={{ color: badge.color }} title={badge.name}>
                            {badge.icon}
                          </span>
                        ))}
                      </div>

                      <span
                        className={`font-semibold text-sm ${
                          message.user.isStreamer
                            ? "text-red-400"
                            : message.user.isModerator
                              ? "text-green-400"
                              : message.user.isSubscriber
                                ? "text-purple-400"
                                : "text-slate-300"
                        }`}
                      >
                        {message.user.displayName}
                      </span>

                      <span className="text-slate-500 text-xs">{formatTimeAgo(message.timestamp)}</span>

                      {/* Moderation Actions */}
                      {(isStreamer || isModerator) && !message.user.isStreamer && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                            className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-500 hover:text-orange-400"
                          >
                            <Ban className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className={`text-sm ${message.isDeleted ? "italic text-slate-500" : "text-slate-200"}`}>
                      {message.isDeleted ? "Message deleted" : message.content}
                    </p>
                  </div>
                </div>
              ) : message.type === "donation" ? (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">{message.user.displayName}</span>
                    <span className="text-yellow-300 text-sm">donated ${message.donationAmount}</span>
                  </div>
                  <p className="text-slate-200 text-sm">{message.content}</p>
                </div>
              ) : message.type === "follow" ? (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm">{message.content}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-2">
                  <span className="text-slate-400 text-sm">{message.content}</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-700/50">
        {chatSettings.enabled ? (
          <div className="space-y-2">
            {/* Chat restrictions notice */}
            {(chatSettings.subscribersOnly || chatSettings.moderatorsOnly || chatSettings.slowMode > 0) && (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Shield className="w-3 h-3" />
                {chatSettings.moderatorsOnly
                  ? "Moderators only"
                  : chatSettings.subscribersOnly
                    ? "Subscribers only"
                    : chatSettings.slowMode > 0
                      ? `Slow mode: ${chatSettings.slowMode}s`
                      : ""}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Send a message..."
                  className="bg-slate-800/50 border-slate-600 text-white pr-10"
                  maxLength={500}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmotes(!showEmotes)}
                  className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-white"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-slate-500 text-right">{newMessage.length}/500</div>
          </div>
        ) : (
          <div className="text-center py-4">
            <MessageCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Chat is disabled for this stream</p>
          </div>
        )}
      </div>

      {/* Chat Settings Panel */}
      {showSettings && (isStreamer || isModerator) && (
        <div className="absolute top-16 right-4 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 min-w-64 z-50">
          <h4 className="text-white font-semibold mb-3">Chat Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Enable Chat</span>
              <input type="checkbox" checked={chatSettings.enabled} className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Subscribers Only</span>
              <input type="checkbox" checked={chatSettings.subscribersOnly} className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Slow Mode</span>
              <select className="bg-slate-800 text-white text-sm rounded px-2 py-1 border border-slate-600">
                <option value={0}>Off</option>
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
