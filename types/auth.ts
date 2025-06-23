export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  moodStatus: MoodStatus
  ambientTheme: AmbientTheme
  badges: Badge[]
  stats: UserStats
  isVerified: boolean
  followers: number
  following: number
  totalLikes: number
  joinedAt: string
  lastActive: string
  preferences: UserPreferences
}

export interface MoodStatus {
  current: "calm" | "hyper" | "inspired" | "dreamy" | "energetic" | "nostalgic" | "cosmic" | "love" | "sad"
  emoji: string
  lastUpdated: string
  ambientColor: string
  intensity: number
  isPublic: boolean
}

export interface AmbientTheme {
  primary: string
  secondary: string
  accent: string
  name: string
  particles: boolean
  effects: string[]
}

export interface Badge {
  id: string
  name: string
  icon: string
  color: string
  description: string
  unlockedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface UserStats {
  glowPosts: number
  visionVideos: number
  orbitStreams: number
  totalViews: number
  timeCapsules: number
  communitiesJoined: number
  createdContent: number
  totalEngagement: number
}

export interface UserPreferences {
  theme: "dark" | "light" | "auto"
  notifications: NotificationSettings
  privacy: PrivacySettings
  content: ContentSettings
}

export interface NotificationSettings {
  likes: boolean
  comments: boolean
  follows: boolean
  mentions: boolean
  liveStreams: boolean
  communityUpdates: boolean
  email: boolean
  push: boolean
}

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private"
  showMoodStatus: boolean
  showActivity: boolean
  allowMessages: "everyone" | "friends" | "none"
  showOnlineStatus: boolean
}

export interface ContentSettings {
  autoplay: boolean
  dataUsage: "high" | "medium" | "low"
  contentFilter: "all" | "friends" | "curated"
  language: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  username: string
  displayName: string
}

export interface ProfileUpdateData {
  displayName?: string
  bio?: string
  avatar?: string
  moodStatus?: Partial<MoodStatus>
  ambientTheme?: Partial<AmbientTheme>
  preferences?: Partial<UserPreferences>
}
