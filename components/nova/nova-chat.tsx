"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { NovaConversation, NovaMessage, AIModel } from "../../types/nova"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Paperclip,
  Mic,
  ImageIcon,
  Code,
  Sparkles,
  Copy,
  ThumbsUp,
  MoreHorizontal,
  Brain,
  Wand2,
  Eye,
  Settings,
} from "lucide-react"

// Mock AI models
const availableModels: AIModel[] = [
  {
    id: "nova-cosmic",
    name: "Nova Cosmic",
    provider: "LUNEXIS",
    description: "Our flagship AI model optimized for creative and cosmic content",
    capabilities: [
      { type: "text", description: "Advanced text generation", enabled: true },
      { type: "vision", description: "Image understanding", enabled: true },
      { type: "creative", description: "Creative writing and ideation", enabled: true },
      { type: "reasoning", description: "Complex reasoning tasks", enabled: true },
    ],
    pricing: { inputTokens: 0.01, outputTokens: 0.03, currency: "USD" },
    limits: { maxTokens: 128000, maxImages: 10, rateLimitPerMinute: 60 },
  },
  {
    id: "nova-code",
    name: "Nova Code",
    provider: "LUNEXIS",
    description: "Specialized for coding, debugging, and technical assistance",
    capabilities: [
      { type: "text", description: "Code generation and explanation", enabled: true },
      { type: "code", description: "Code execution and debugging", enabled: true },
      { type: "reasoning", description: "Technical problem solving", enabled: true },
    ],
    pricing: { inputTokens: 0.008, outputTokens: 0.024, currency: "USD" },
    limits: { maxTokens: 64000, maxImages: 0, rateLimitPerMinute: 100 },
  },
  {
    id: "nova-vision",
    name: "Nova Vision",
    provider: "LUNEXIS",
    description: "Advanced image analysis and generation capabilities",
    capabilities: [
      { type: "vision", description: "Image analysis and understanding", enabled: true },
      { type: "creative", description: "Image generation and editing", enabled: true },
      { type: "text", description: "Image-to-text descriptions", enabled: true },
    ],
    pricing: { inputTokens: 0.015, outputTokens: 0.045, currency: "USD" },
    limits: { maxTokens: 32000, maxImages: 20, rateLimitPerMinute: 30 },
  },
]

// Mock conversation
const mockConversation: NovaConversation = {
  id: "conv_1",
  userId: "user_1",
  title: "Cosmic Content Creation",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  type: "content_creation",
  messages: [
    {
      id: "msg_1",
      conversationId: "conv_1",
      role: "user",
      content: "Help me create a cosmic-themed social media post about exploring new galaxies",
      timestamp: "2024-01-15T10:00:00Z",
      type: "text",
      isEdited: false,
      reactions: [{ emoji: "✨", count: 2, users: ["user_1", "user_2"] }],
    },
    {
      id: "msg_2",
      conversationId: "conv_1",
      role: "assistant",
      content: `🌌 **Embark on a Cosmic Journey** 🚀

*"In the vast expanse of the universe, every star is a story waiting to be discovered, every galaxy a new chapter in the cosmic tale of existence."*

✨ **Tonight's Adventure:**
- Discovering uncharted stellar systems
- Witnessing the birth of new stars
- Exploring the mysteries of dark matter
- Finding beauty in the cosmic dance of celestial bodies

The universe is calling, fellow cosmic explorers! What wonders will we uncover in the infinite tapestry of space? Share your own cosmic discoveries below! 

#CosmicExploration #GalaxyDiscovery #StarGazing #UniverseWonders #CosmicJourney #LUNEXIS`,
      timestamp: "2024-01-15T10:01:00Z",
      type: "generated_content",
      isEdited: false,
      metadata: {
        tokenCount: 156,
        processingTime: 2.3,
        model: "nova-cosmic",
        confidence: 0.94,
      },
    },
  ],
  settings: {
    model: availableModels[0],
    temperature: 0.7,
    maxTokens: 4000,
    enableVision: true,
    enableCodeExecution: false,
    enableWebSearch: true,
    autoSave: true,
  },
  metadata: {
    tokenUsage: 1247,
    estimatedCost: 0.045,
    tags: ["content-creation", "social-media", "cosmic"],
    isStarred: false,
    isArchived: false,
  },
}

interface NovaChatProps {
  conversationId?: string
  onNewConversation?: () => void
}

export function NovaChat({ conversationId, onNewConversation }: NovaChatProps) {
  const [conversation, setConversation] = useState<NovaConversation>(mockConversation)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0])
  const [showSettings, setShowSettings] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    const userMessage: NovaMessage = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      role: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: attachments.length > 0 ? "image" : "text",
      attachments: attachments.map((file) => ({
        id: `att_${Date.now()}`,
        type: file.type.startsWith("image/") ? "image" : "document",
        url: URL.createObjectURL(file),
        filename: file.name,
        size: file.size,
      })),
      isEdited: false,
      reactions: [],
    }

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))

    setNewMessage("")
    setAttachments([])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse: NovaMessage = {
          id: `msg_${Date.now() + 1}`,
          conversationId: conversation.id,
          role: "assistant",
          content: generateAIResponse(newMessage, selectedModel),
          timestamp: new Date().toISOString(),
          type: "text",
          isEdited: false,
          reactions: [],
          metadata: {
            tokenCount: Math.floor(Math.random() * 200) + 50,
            processingTime: Math.random() * 3 + 1,
            model: selectedModel.id,
            confidence: Math.random() * 0.3 + 0.7,
          },
        }

        setConversation((prev) => ({
          ...prev,
          messages: [...prev.messages, aiResponse],
          updatedAt: new Date().toISOString(),
        }))

        setIsLoading(false)
      },
      1500 + Math.random() * 2000,
    )
  }

  const generateAIResponse = (userInput: string, model: AIModel): string => {
    const responses = [
      "I'd be happy to help you with that! Let me provide you with a comprehensive solution that aligns with the cosmic aesthetic of LUNEXIS.",
      "That's a fascinating request! Here's how we can approach this from a creative and cosmic perspective:",
      "Excellent question! Let me break this down and provide you with some stellar insights:",
      "I love the cosmic energy in your request! Here's what I recommend:",
      "Perfect timing for some cosmic creativity! Let me help you craft something amazing:",
    ]

    return (
      responses[Math.floor(Math.random() * responses.length)] +
      "\n\n" +
      "✨ This is a simulated AI response. In the full implementation, this would connect to actual AI models to provide real assistance with content creation, coding, creative writing, and more cosmic endeavors!"
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: Show toast notification
  }

  const addReaction = (messageId: string, emoji: string) => {
    setConversation((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, "current_user"] } : r,
              ),
            }
          } else {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1, users: ["current_user"] }],
            }
          }
        }
        return msg
      }),
    }))
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">{conversation.title}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                {selectedModel.name}
              </Badge>
              <span>•</span>
              <span>{conversation.messages.length} messages</span>
              <span>•</span>
              <span>${conversation.metadata.estimatedCost.toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onNewConversation} className="text-slate-400 hover:text-white">
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversation.messages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={`max-w-3xl ${message.role === "user" ? "order-1" : ""}`}>
              <Card
                className={`${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30"
                    : "bg-slate-900/80 border-slate-700/50"
                } backdrop-blur-sm`}
              >
                <CardContent className="p-4">
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${
                          message.role === "user" ? "text-purple-300" : "text-white"
                        }`}
                      >
                        {message.role === "user" ? "You" : selectedModel.name}
                      </span>
                      <span className="text-slate-500 text-xs">{formatTimestamp(message.timestamp)}</span>
                      {message.metadata && (
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {message.metadata.tokenCount} tokens
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 w-6 p-0 text-slate-500 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-500 hover:text-white">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{message.content}</div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                          {attachment.type === "image" ? (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.filename}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                              <Paperclip className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-slate-300 text-sm">{attachment.filename}</div>
                            <div className="text-slate-500 text-xs">{(attachment.size / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      {message.reactions.map((reaction) => (
                        <Button
                          key={reaction.emoji}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs border-slate-600 hover:border-slate-500"
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addReaction(message.id, "👍")}
                        className="h-6 w-6 p-0 text-slate-500 hover:text-white"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* AI Metadata */}
                  {message.role === "assistant" && message.metadata && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>⚡ {message.metadata.processingTime.toFixed(1)}s</span>
                        <span>🎯 {(message.metadata.confidence! * 100).toFixed(0)}% confidence</span>
                        <span>🧠 {message.metadata.model}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-slate-400 text-sm">Nova is thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="w-3 h-3 text-slate-400" />
                  ) : (
                    <Paperclip className="w-3 h-3 text-slate-400" />
                  )}
                </div>
                <span className="text-slate-300 text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                  className="h-4 w-4 p-0 text-slate-500 hover:text-red-400"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Nova anything... ✨"
              className="bg-slate-800/50 border-slate-600 text-white resize-none pr-12"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />

            {/* Input Actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                <Paperclip className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <Mic className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && attachments.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Wand2 className="w-3 h-3 mr-1" />
            Generate Content
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Code className="w-3 h-3 mr-1" />
            Code Help
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Eye className="w-3 h-3 mr-1" />
            Analyze Image
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 min-w-80 z-50">
          <h4 className="text-white font-semibold mb-3">Conversation Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium">AI Model</label>
              <select
                value={selectedModel.id}
                onChange={(e) =>
                  setSelectedModel(availableModels.find((m) => m.id === e.target.value) || availableModels[0])
                }
                className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600"
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <p className="text-slate-500 text-xs mt-1">{selectedModel.description}</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium">
                Temperature: {conversation.settings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={conversation.settings.temperature}
                onChange={(e) =>
                  setConversation((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, temperature: Number.parseFloat(e.target.value) },
                  }))
                }
                className="w-full mt-1"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium">Max Tokens</label>
              <input
                type="number"
                value={conversation.settings.maxTokens}
                onChange={(e) =>
                  setConversation((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, maxTokens: Number.parseInt(e.target.value) },
                  }))
                }
                className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-600"
                min="100"
                max="32000"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Enable Vision</span>
                <input
                  type="checkbox"
                  checked={conversation.settings.enableVision}
                  onChange={(e) =>
                    setConversation((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, enableVision: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Web Search</span>
                <input
                  type="checkbox"
                  checked={conversation.settings.enableWebSearch}
                  onChange={(e) =>
                    setConversation((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, enableWebSearch: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Auto Save</span>
                <input
                  type="checkbox"
                  checked={conversation.settings.autoSave}
                  onChange={(e) =>
                    setConversation((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, autoSave: e.target.checked },
                    }))
                  }
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
