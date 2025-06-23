export interface MoodState {
  id: string
  name: string
  emoji: string
  color: string
  gradient: string[]
  description: string
  intensity: number // 1-10
  category: MoodCategory
  effects: AmbientEffect[]
  soundscape?: string
  particles?: ParticleConfig
}

export interface AmbientEffect {
  type: "gradient" | "particles" | "glow" | "pulse" | "wave" | "constellation"
  config: EffectConfig
  duration?: number
  intensity: number
}

export interface EffectConfig {
  colors: string[]
  speed: number
  size: number
  opacity: number
  direction?: "up" | "down" | "left" | "right" | "radial"
  pattern?: "spiral" | "wave" | "burst" | "flow"
}

export interface ParticleConfig {
  count: number
  size: { min: number; max: number }
  speed: { min: number; max: number }
  colors: string[]
  shapes: ("circle" | "star" | "diamond" | "heart")[]
  behavior: "float" | "orbit" | "cascade" | "dance"
}

export type MoodCategory =
  | "energetic"
  | "calm"
  | "creative"
  | "social"
  | "introspective"
  | "adventurous"
  | "romantic"
  | "nostalgic"

export interface UserMoodStatus {
  userId: string
  currentMood: MoodState
  intensity: number
  customMessage?: string
  location?: string
  activity?: string
  isPrivate: boolean
  expiresAt?: string
  createdAt: string
  ambientSettings: AmbientSettings
}

export interface AmbientSettings {
  enableEffects: boolean
  effectIntensity: number
  enableSoundscape: boolean
  soundscapeVolume: number
  enableParticles: boolean
  particleCount: number
  autoMoodDetection: boolean
  shareWithFriends: boolean
  showInProfile: boolean
}

export interface MoodHistory {
  id: string
  userId: string
  mood: MoodState
  intensity: number
  timestamp: string
  duration: number
  triggers?: string[]
  context?: MoodContext
  notes?: string
}

export interface MoodContext {
  weather?: string
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  dayOfWeek: string
  activity?: string
  location?: string
  socialContext?: "alone" | "friends" | "family" | "work" | "public"
  contentConsumed?: string[]
}

export interface MoodAnalytics {
  userId: string
  period: "day" | "week" | "month" | "year"
  dominantMoods: { mood: MoodState; percentage: number }[]
  moodPatterns: MoodPattern[]
  triggers: { trigger: string; frequency: number }[]
  averageIntensity: number
  moodStability: number
  socialInfluence: number
  recommendations: MoodRecommendation[]
}

export interface MoodPattern {
  type: "daily" | "weekly" | "seasonal" | "event-based"
  pattern: string
  confidence: number
  description: string
}

export interface MoodRecommendation {
  type: "content" | "activity" | "social" | "wellness"
  title: string
  description: string
  action: string
  confidence: number
}

export interface MoodCommunity {
  id: string
  name: string
  description: string
  mood: MoodState
  memberCount: number
  isPublic: boolean
  activities: CommunityActivity[]
  moderators: string[]
  createdAt: string
}

export interface CommunityActivity {
  id: string
  type: "chat" | "challenge" | "share" | "support"
  title: string
  description: string
  participants: number
  startTime: string
  endTime?: string
}

export interface MoodSync {
  id: string
  participants: string[]
  targetMood: MoodState
  syncLevel: number
  duration: number
  effects: SyncEffect[]
  isActive: boolean
  createdAt: string
}

export interface SyncEffect {
  type: "visual" | "audio" | "haptic"
  intensity: number
  synchronization: number
}
