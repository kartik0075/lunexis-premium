export interface GlowVideo {
  id: string
  userId: string
  videoUrl: string
  thumbnailUrl: string
  title: string
  description: string
  duration: number
  createdAt: string
  likes: number
  comments: number
  shares: number
  views: number
  isLiked: boolean
  moodTags: string[]
  effects: GlowEffect[]
  music?: GlowMusic
  user: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
  }
}

export interface GlowEffect {
  id: string
  name: string
  type: "filter" | "overlay" | "transition"
  intensity: number
  color?: string
}

export interface GlowMusic {
  id: string
  title: string
  artist: string
  duration: number
  url: string
  coverArt: string
}

export interface GlowUploadData {
  videoFile: File | null
  thumbnail: string
  title: string
  description: string
  moodTags: string[]
  effects: GlowEffect[]
  music: GlowMusic | null
  isPrivate: boolean
}
