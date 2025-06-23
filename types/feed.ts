export type ContentType = "glow" | "vision" | "orbit"
export type MoodTag = "calm" | "hyper" | "inspired" | "dreamy" | "energetic" | "nostalgic"

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  isVerified?: boolean
}

export interface BaseContent {
  id: string
  type: ContentType
  user: User
  title: string
  description: string
  thumbnail: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  moodTags: MoodTag[]
  duration?: string
  viewCount: number
}

export interface GlowContent extends BaseContent {
  type: "glow"
  videoUrl: string
}

export interface VisionContent extends BaseContent {
  type: "vision"
  videoUrl: string
  chapters?: { title: string; timestamp: string }[]
}

export interface OrbitContent extends BaseContent {
  type: "orbit"
  streamUrl: string
  isLive: boolean
  viewerCount: number
  category: string
}

export type FeedContent = GlowContent | VisionContent | OrbitContent
