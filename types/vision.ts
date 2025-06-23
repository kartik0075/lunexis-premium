export interface VisionVideo {
  id: string
  userId: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  createdAt: string
  views: number
  likes: number
  dislikes: number
  comments: number
  shares: number
  isLiked: boolean
  isDisliked: boolean
  moodTags: string[]
  chapters: VisionChapter[]
  quality: VideoQuality[]
  captions: VisionCaption[]
  user: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
    subscribers: number
  }
  playlist?: {
    id: string
    title: string
    videos: string[]
    currentIndex: number
  }
}

export interface VisionChapter {
  id: string
  title: string
  startTime: number
  endTime: number
  thumbnail: string
}

export interface VideoQuality {
  label: string
  value: string
  url: string
}

export interface VisionCaption {
  language: string
  label: string
  url: string
}

export interface VisionComment {
  id: string
  userId: string
  user: {
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
  }
  content: string
  createdAt: string
  likes: number
  replies: VisionComment[]
  isLiked: boolean
  isPinned: boolean
}

export interface VisionUploadData {
  videoFile: File | null
  title: string
  description: string
  thumbnail: string
  moodTags: string[]
  chapters: Omit<VisionChapter, "id">[]
  isPrivate: boolean
  allowComments: boolean
  allowDownload: boolean
}
