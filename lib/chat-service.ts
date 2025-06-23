"use client"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: "text" | "image" | "video" | "audio" | "file" | "location" | "emoji"
  metadata?: any
  replyTo?: string
  reactions: MessageReaction[]
  isEdited: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageReaction {
  id: string
  userId: string
  emoji: string
  createdAt: string
}

export interface ChatRoom {
  id: string
  name?: string
  type: "direct" | "group" | "random" | "mood_room"
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  isActive: boolean
  settings: ChatSettings
  metadata?: any
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface ChatParticipant {
  userId: string
  userName: string
  userAvatar?: string
  role: "owner" | "admin" | "member"
  joinedAt: string
  lastSeen: string
  isOnline: boolean
  isTyping: boolean
}

export interface ChatSettings {
  allowMedia: boolean
  allowVoice: boolean
  allowLocation: boolean
  maxParticipants: number
  isPublic: boolean
  requireApproval: boolean
  autoDelete: boolean
  deleteAfterHours?: number
}

export interface TypingIndicator {
  userId: string
  userName: string
  chatId: string
  timestamp: string
}

export class ChatService {
  private typingTimeouts = new Map<string, NodeJS.Timeout>()

  // Chat Room Management
  async createChatRoom(room: Partial<ChatRoom>): Promise<ChatRoom> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert([
        {
          name: room.name,
          type: room.type,
          participants: room.participants,
          settings: room.settings,
          metadata: room.metadata,
          expires_at: room.expiresAt,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        chat_messages (
          id,
          content,
          sender_id,
          sender_name,
          created_at
        )
      `)
      .contains("participants", [{ userId }])
      .eq("is_active", true)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async joinChatRoom(chatId: string, participant: ChatParticipant): Promise<void> {
    const { error } = await supabase.rpc("join_chat_room", {
      chat_id: chatId,
      participant_data: participant,
    })

    if (error) throw error
  }

  async leaveChatRoom(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase.rpc("leave_chat_room", {
      chat_id: chatId,
      user_id: userId,
    })

    if (error) throw error
  }

  // Message Management
  async sendMessage(message: Partial<ChatMessage>): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          chat_id: message.chatId,
          sender_id: message.senderId,
          sender_name: message.senderName,
          sender_avatar: message.senderAvatar,
          content: message.content,
          type: message.type,
          metadata: message.metadata,
          reply_to: message.replyTo,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Update chat room's last message and timestamp
    await supabase
      .from("chat_rooms")
      .update({
        last_message: data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", message.chatId)

    return data
  }

  async getMessages(chatId: string, limit = 50, before?: string): Promise<ChatMessage[]> {
    let query = supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (before) {
      query = query.lt("created_at", before)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []).reverse()
  }

  async editMessage(messageId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from("chat_messages")
      .update({
        content,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId)

    if (error) throw error
  }

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from("chat_messages")
      .update({
        is_deleted: true,
        content: "This message was deleted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId)

    if (error) throw error
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase.rpc("add_message_reaction", {
      message_id: messageId,
      user_id: userId,
      emoji_code: emoji,
    })

    if (error) throw error
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase.rpc("remove_message_reaction", {
      message_id: messageId,
      user_id: userId,
      emoji_code: emoji,
    })

    if (error) throw error
  }

  // Typing Indicators
  async startTyping(chatId: string, userId: string, userName: string): Promise<void> {
    // Clear existing timeout
    const timeoutKey = `${chatId}-${userId}`
    if (this.typingTimeouts.has(timeoutKey)) {
      clearTimeout(this.typingTimeouts.get(timeoutKey))
    }

    // Send typing indicator
    await supabase.from("typing_indicators").upsert({
      chat_id: chatId,
      user_id: userId,
      user_name: userName,
      timestamp: new Date().toISOString(),
    })

    // Auto-stop typing after 3 seconds
    const timeout = setTimeout(() => {
      this.stopTyping(chatId, userId)
    }, 3000)

    this.typingTimeouts.set(timeoutKey, timeout)
  }

  async stopTyping(chatId: string, userId: string): Promise<void> {
    const timeoutKey = `${chatId}-${userId}`
    if (this.typingTimeouts.has(timeoutKey)) {
      clearTimeout(this.typingTimeouts.get(timeoutKey))
      this.typingTimeouts.delete(timeoutKey)
    }

    await supabase.from("typing_indicators").delete().eq("chat_id", chatId).eq("user_id", userId)
  }

  // Random Group Rooms
  async findRandomRoom(mood?: string, interests?: string[]): Promise<ChatRoom | null> {
    const { data, error } = await supabase.rpc("find_random_room", {
      user_mood: mood,
      user_interests: interests,
    })

    if (error) throw error
    return data
  }

  async createRandomRoom(mood: string, maxParticipants = 8): Promise<ChatRoom> {
    return this.createChatRoom({
      name: `${mood} Vibes Room`,
      type: "random",
      participants: [],
      settings: {
        allowMedia: true,
        allowVoice: true,
        allowLocation: false,
        maxParticipants,
        isPublic: true,
        requireApproval: false,
        autoDelete: true,
        deleteAfterHours: 24,
      },
      metadata: { mood },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Real-time Subscriptions
  subscribeToMessages(chatId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`chat_messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => callback(payload.new as ChatMessage),
      )
      .subscribe()
  }

  subscribeToTyping(chatId: string, callback: (indicators: TypingIndicator[]) => void) {
    return supabase
      .channel(`typing:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `chat_id=eq.${chatId}`,
        },
        async () => {
          // Fetch current typing indicators
          const { data } = await supabase
            .from("typing_indicators")
            .select("*")
            .eq("chat_id", chatId)
            .gte("timestamp", new Date(Date.now() - 5000).toISOString())

          callback(data || [])
        },
      )
      .subscribe()
  }

  subscribeToRoomUpdates(userId: string, callback: (room: ChatRoom) => void) {
    return supabase
      .channel(`chat_rooms:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_rooms",
          filter: `participants.cs.${JSON.stringify([{ userId }])}`,
        },
        (payload) => callback(payload.new as ChatRoom),
      )
      .subscribe()
  }

  // Presence Management
  async updatePresence(userId: string, isOnline: boolean): Promise<void> {
    const { error } = await supabase.from("user_presence").upsert({
      user_id: userId,
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    })

    if (error) throw error
  }

  async getUsersPresence(userIds: string[]): Promise<Record<string, boolean>> {
    const { data, error } = await supabase.from("user_presence").select("user_id, is_online").in("user_id", userIds)

    if (error) throw error

    return (data || []).reduce(
      (acc, item) => {
        acc[item.user_id] = item.is_online
        return acc
      },
      {} as Record<string, boolean>,
    )
  }

  // Voice Messages
  async uploadVoiceMessage(audioBlob: Blob, chatId: string): Promise<string> {
    const fileName = `voice_${Date.now()}.webm`
    const filePath = `voice_messages/${chatId}/${fileName}`

    const { data, error } = await supabase.storage.from("audio").upload(filePath, audioBlob)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from("audio").getPublicUrl(filePath)

    return publicUrl
  }
}

export const chatService = new ChatService()
