"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { chatService, type ChatMessage, type ChatRoom, type TypingIndicator } from "../../lib/chat-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Smile,
  Phone,
  Video,
  Info,
  Search,
  Reply,
  Edit,
  Trash2,
  Heart,
} from "lucide-react"

interface ChatInterfaceProps {
  chatRoom: ChatRoom
  currentUserId: string
  currentUserName: string
  currentUserAvatar?: string
  onBack?: () => void
}

export function ChatInterface({
  chatRoom,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onBack,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    loadMessages()

    // Subscribe to new messages
    const messageSubscription = chatService.subscribeToMessages(chatRoom.id, (message) => {
      setMessages((prev) => [...prev, message])
    })

    // Subscribe to typing indicators
    const typingSubscription = chatService.subscribeToTyping(chatRoom.id, setTypingUsers)

    return () => {
      messageSubscription.unsubscribe()
      typingSubscription.unsubscribe()
    }
  }, [chatRoom.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const chatMessages = await chatService.getMessages(chatRoom.id)
      setMessages(chatMessages)
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !editingMessage) return

    try {
      if (editingMessage) {
        await chatService.editMessage(editingMessage.id, newMessage)
        setEditingMessage(null)
      } else {
        await chatService.sendMessage({
          chatId: chatRoom.id,
          senderId: currentUserId,
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          content: newMessage,
          type: "text",
          replyTo: replyingTo?.id,
        })
        setReplyingTo(null)
      }

      setNewMessage("")
      await chatService.stopTyping(chatRoom.id, currentUserId)
      setIsTyping(false)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!isTyping && value.trim()) {
      setIsTyping(true)
      chatService.startTyping(chatRoom.id, currentUserId, currentUserName)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(async () => {
      if (isTyping) {
        await chatService.stopTyping(chatRoom.id, currentUserId)
        setIsTyping(false)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await chatService.addReaction(messageId, currentUserId, emoji)
    } catch (error) {
      console.error("Failed to add reaction:", error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId)
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
        try {
          const audioUrl = await chatService.uploadVoiceMessage(audioBlob, chatRoom.id)
          await chatService.sendMessage({
            chatId: chatRoom.id,
            senderId: currentUserId,
            senderName: currentUserName,
            senderAvatar: currentUserAvatar,
            content: audioUrl,
            type: "audio",
            metadata: { duration: audioChunks.length },
          })
        } catch (error) {
          console.error("Failed to send voice message:", error)
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getOtherParticipants = () => {
    return chatRoom.participants.filter((p) => p.userId !== currentUserId)
  }

  const renderMessage = (message: ChatMessage) => {
    const isOwn = message.senderId === currentUserId
    const replyMessage = message.replyTo ? messages.find((m) => m.id === message.replyTo) : null

    return (
      <div key={message.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"} group`}>
        {!isOwn && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
            <AvatarFallback>{message.senderName[0]}</AvatarFallback>
          </Avatar>
        )}

        <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
          {!isOwn && <span className="text-xs text-slate-400 mb-1">{message.senderName}</span>}

          <div
            className={`rounded-lg px-3 py-2 ${
              isOwn ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-slate-700 text-slate-100"
            }`}
          >
            {replyMessage && (
              <div className="border-l-2 border-white/30 pl-2 mb-2 text-xs opacity-70">
                <div className="font-medium">{replyMessage.senderName}</div>
                <div className="truncate">{replyMessage.content}</div>
              </div>
            )}

            {message.type === "text" && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

            {message.type === "audio" && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Mic className="w-4 h-4" />
                </Button>
                <div className="flex-1 h-1 bg-white/30 rounded-full">
                  <div className="h-full bg-white rounded-full w-1/3"></div>
                </div>
                <span className="text-xs">0:15</span>
              </div>
            )}

            {message.type === "image" && (
              <img src={message.content || "/placeholder.svg"} alt="Shared image" className="max-w-full rounded-lg" />
            )}

            {message.isEdited && <span className="text-xs opacity-60 ml-2">(edited)</span>}
          </div>

          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-500">{formatTime(message.createdAt)}</span>

            {/* Message Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex gap-1">
                {message.reactions.map((reaction, index) => (
                  <span key={index} className="text-xs bg-slate-600 rounded-full px-1">
                    {reaction.emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Message Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReplyingTo(message)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                <Reply className="w-3 h-3" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleReaction(message.id, "❤️")}
                className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
              >
                <Heart className="w-3 h-3" />
              </Button>

              {isOwn && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingMessage(message)
                      setNewMessage(message.content)
                      inputRef.current?.focus()
                    }}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMessage(message.id)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTypingIndicator = () => {
    const otherTypingUsers = typingUsers.filter((user) => user.userId !== currentUserId)
    if (otherTypingUsers.length === 0) return null

    return (
      <div className="flex gap-3 items-center">
        <Avatar className="w-8 h-8">
          <AvatarFallback>{otherTypingUsers[0].userName[0]}</AvatarFallback>
        </Avatar>
        <div className="bg-slate-700 rounded-lg px-3 py-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Chat Header */}
      <CardHeader className="border-b border-slate-700/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400">
                ←
              </Button>
            )}

            <div className="flex items-center gap-3">
              {chatRoom.type === "direct" && getOtherParticipants().length === 1 ? (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getOtherParticipants()[0].userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{getOtherParticipants()[0].userName[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{chatRoom.participants.length}</span>
                </div>
              )}

              <div>
                <CardTitle className="text-white text-lg">
                  {chatRoom.name ||
                    (chatRoom.type === "direct" && getOtherParticipants().length === 1
                      ? getOtherParticipants()[0].userName
                      : `Group Chat (${chatRoom.participants.length})`)}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>{chatRoom.participants.filter((p) => p.isOnline).length} online</span>
                  {chatRoom.type === "random" && (
                    <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                      Random Room
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        {renderTypingIndicator()}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Reply className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Replying to</span>
              <span className="text-white font-medium">{replyingTo.senderName}</span>
              <span className="text-slate-400 truncate max-w-xs">{replyingTo.content}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 w-6 p-0 text-slate-400"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Edit Preview */}
      {editingMessage && (
        <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Edit className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Editing message</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingMessage(null)
                setNewMessage("")
              }}
              className="h-6 w-6 p-0 text-slate-400"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={editingMessage ? "Edit message..." : "Type a message..."}
              className="bg-slate-800/50 border-slate-600/50 text-white pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onMouseDown={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onMouseLeave={stopVoiceRecording}
            className={`text-slate-400 hover:text-white ${isRecording ? "bg-red-500/20 text-red-400" : ""}`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 grid grid-cols-8 gap-2 z-50">
            {["😀", "😂", "😍", "🥰", "😎", "🤔", "😢", "😡", "👍", "👎", "❤️", "🔥", "✨", "🎉", "💯", "🚀"].map(
              (emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setNewMessage((prev) => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="text-xl hover:bg-slate-700 rounded p-1"
                >
                  {emoji}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
