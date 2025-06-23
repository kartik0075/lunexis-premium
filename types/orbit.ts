export interface OrbitStream {
  id: string
  userId: string
  title: string
  description: string
  category: StreamCategory
  game?: GameInfo
  streamUrl: string
  thumbnailUrl: string
  isLive: boolean
  startedAt: string
  duration: number
  viewerCount: number
  peakViewers: number
  likes: number
  shares: number
  isLiked: boolean
  moodTags: string[]
  streamKey: string
  quality: StreamQuality[]
  user: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
    followers: number
    isPartner: boolean
  }
  chatSettings: ChatSettings
  streamSettings: StreamSettings
}

export interface StreamCategory {
  id: string
  name: string
  icon: string
  color: string
}

export interface GameInfo {
  id: string
  name: string
  cover: string
  genre: string[]
  developer: string
}

export interface StreamQuality {
  label: string
  value: string
  bitrate: number
  resolution: string
}

export interface ChatSettings {
  enabled: boolean
  slowMode: number
  subscribersOnly: boolean
  moderatorsOnly: boolean
  allowLinks: boolean
  allowEmotes: boolean
  bannedWords: string[]
}

export interface StreamSettings {
  title: string
  category: string
  game?: string
  isPrivate: boolean
  recordStream: boolean
  enableChat: boolean
  enableDonations: boolean
  maturityRating: "everyone" | "teen" | "mature"
}

export interface ChatMessage {
  id: string
  userId: string
  user: {
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
    isSubscriber: boolean
    isModerator: boolean
    isStreamer: boolean
    badges: ChatBadge[]
  }
  content: string
  timestamp: string
  type: "message" | "system" | "donation" | "follow" | "subscription"
  emotes?: ChatEmote[]
  mentions?: string[]
  isDeleted: boolean
  donationAmount?: number
}

export interface ChatBadge {
  id: string
  name: string
  icon: string
  color: string
}

export interface ChatEmote {
  id: string
  name: string
  url: string
  startIndex: number
  endIndex: number
}

export interface StreamAlert {
  id: string
  type: "follow" | "subscription" | "donation" | "raid" | "host"
  user: {
    username: string
    displayName: string
    avatar: string
  }
  message?: string
  amount?: number
  duration: number
}

export interface OrbitUploadData {
  title: string
  description: string
  category: string
  game?: string
  thumbnail: string
  moodTags: string[]
  settings: StreamSettings
}
