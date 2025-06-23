export interface SocialProfile {
  id: string
  userId: string
  displayName: string
  username: string
  bio: string
  avatar: string
  coverImage: string
  location?: string
  website?: string
  joinedAt: string
  lastActive: string
  isVerified: boolean
  isOnline: boolean

  // Social Stats
  followers: number
  following: number
  friends: number
  totalLikes: number
  totalViews: number

  // Cosmic Identity
  cosmicTitle: string
  constellation: string
  moodStatus: {
    current: string
    color: string
    lastUpdated: string
  }

  // Achievements
  badges: SocialBadge[]
  level: number
  experience: number
  reputation: number

  // Privacy Settings
  privacy: ProfilePrivacy

  // Social Connections
  connections: SocialConnection[]
  blockedUsers: string[]

  // Activity
  recentActivity: SocialActivity[]
  interests: string[]
  favoriteContent: string[]
}

export interface SocialConnection {
  id: string
  userId: string
  targetUserId: string
  type: ConnectionType
  status: ConnectionStatus
  createdAt: string
  mutualFriends: number
  sharedInterests: string[]
  interactionScore: number
}

export type ConnectionType = "friend" | "follower" | "following" | "mutual" | "blocked"
export type ConnectionStatus = "pending" | "accepted" | "declined" | "blocked"

export interface SocialBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: BadgeRarity
  category: BadgeCategory
  unlockedAt: string
  progress?: number
  maxProgress?: number
}

export type BadgeRarity = "common" | "rare" | "epic" | "legendary" | "cosmic"
export type BadgeCategory = "creator" | "social" | "explorer" | "achiever" | "cosmic" | "special"

export interface ProfilePrivacy {
  profileVisibility: "public" | "friends" | "private"
  showOnlineStatus: boolean
  showActivity: boolean
  showConnections: boolean
  allowMessages: "everyone" | "friends" | "none"
  allowTagging: boolean
  showBadges: boolean
  showStats: boolean
}

export interface SocialActivity {
  id: string
  userId: string
  type: ActivityType
  action: string
  targetId?: string
  targetType?: string
  metadata: Record<string, any>
  timestamp: string
  visibility: "public" | "friends" | "private"
  reactions: ActivityReaction[]
  comments: ActivityComment[]
}

export type ActivityType =
  | "content_created"
  | "content_liked"
  | "content_shared"
  | "content_commented"
  | "user_followed"
  | "user_friended"
  | "community_joined"
  | "community_created"
  | "achievement_unlocked"
  | "badge_earned"
  | "level_up"
  | "mood_changed"
  | "event_attended"
  | "challenge_completed"
  | "collaboration_started"

export interface ActivityReaction {
  id: string
  userId: string
  emoji: string
  timestamp: string
}

export interface ActivityComment {
  id: string
  userId: string
  content: string
  timestamp: string
  replies: ActivityComment[]
  reactions: ActivityReaction[]
}

export interface SocialCommunity {
  id: string
  name: string
  description: string
  avatar: string
  coverImage: string
  category: CommunityCategory
  tags: string[]

  // Community Stats
  memberCount: number
  postCount: number
  activeMembers: number
  growthRate: number

  // Community Settings
  visibility: "public" | "private" | "invite_only"
  joinRequirement: "open" | "approval" | "invite"
  contentModeration: "open" | "moderated" | "restricted"

  // Community Management
  createdBy: string
  createdAt: string
  moderators: CommunityModerator[]
  rules: CommunityRule[]

  // Community Features
  features: CommunityFeature[]
  customization: CommunityCustomization

  // Activity
  recentPosts: SocialPost[]
  upcomingEvents: CommunityEvent[]
  pinnedPosts: string[]

  // Analytics
  analytics: CommunityAnalytics
}

export type CommunityCategory =
  | "creative"
  | "gaming"
  | "music"
  | "art"
  | "tech"
  | "lifestyle"
  | "education"
  | "entertainment"
  | "cosmic"
  | "wellness"
  | "business"

export interface CommunityModerator {
  userId: string
  role: "owner" | "admin" | "moderator"
  permissions: string[]
  appointedAt: string
  appointedBy: string
}

export interface CommunityRule {
  id: string
  title: string
  description: string
  severity: "warning" | "timeout" | "ban"
  createdAt: string
}

export interface CommunityFeature {
  type: "events" | "challenges" | "polls" | "live_chat" | "voice_rooms" | "marketplace"
  enabled: boolean
  settings: Record<string, any>
}

export interface CommunityCustomization {
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundImage?: string
  }
  layout: "feed" | "forum" | "gallery" | "hybrid"
  widgets: CommunityWidget[]
}

export interface CommunityWidget {
  id: string
  type: "welcome" | "rules" | "stats" | "events" | "leaderboard" | "recent_activity"
  position: number
  settings: Record<string, any>
  visible: boolean
}

export interface CommunityEvent {
  id: string
  communityId: string
  title: string
  description: string
  type: EventType
  startTime: string
  endTime: string
  timezone: string
  location?: EventLocation

  // Event Management
  createdBy: string
  hosts: string[]
  maxAttendees?: number
  requiresApproval: boolean

  // Attendees
  attendees: EventAttendee[]
  waitlist: EventAttendee[]

  // Event Content
  agenda: EventAgendaItem[]
  resources: EventResource[]

  // Settings
  visibility: "public" | "community" | "private"
  allowGuests: boolean
  recordEvent: boolean

  // Analytics
  analytics: EventAnalytics
}

export type EventType =
  | "meetup"
  | "workshop"
  | "livestream"
  | "gaming"
  | "creative"
  | "discussion"
  | "showcase"
  | "collaboration"
  | "cosmic_gathering"

export interface EventLocation {
  type: "virtual" | "physical" | "hybrid"
  details: string
  coordinates?: { lat: number; lng: number }
  platform?: string
  link?: string
}

export interface EventAttendee {
  userId: string
  status: "going" | "maybe" | "not_going"
  registeredAt: string
  checkedIn: boolean
  role?: "host" | "speaker" | "moderator" | "attendee"
}

export interface EventAgendaItem {
  id: string
  title: string
  description: string
  startTime: string
  duration: number
  speaker?: string
  type: "presentation" | "discussion" | "activity" | "break"
}

export interface EventResource {
  id: string
  name: string
  type: "link" | "file" | "video" | "document"
  url: string
  description?: string
}

export interface SocialPost {
  id: string
  authorId: string
  communityId?: string
  content: string
  type: PostType
  attachments: PostAttachment[]

  // Engagement
  likes: number
  comments: number
  shares: number
  views: number

  // Metadata
  createdAt: string
  updatedAt?: string
  isEdited: boolean
  isPinned: boolean

  // Moderation
  isReported: boolean
  moderationStatus: "approved" | "pending" | "rejected"

  // Visibility
  visibility: "public" | "friends" | "community" | "private"
  tags: string[]
  mentions: string[]

  // Interactions
  reactions: PostReaction[]
  comments: PostComment[]
  shares: PostShare[]
}

export type PostType = "text" | "image" | "video" | "audio" | "poll" | "event" | "link" | "glow" | "vision"

export interface PostAttachment {
  id: string
  type: "image" | "video" | "audio" | "document" | "link"
  url: string
  thumbnail?: string
  metadata: Record<string, any>
}

export interface PostReaction {
  id: string
  userId: string
  emoji: string
  timestamp: string
}

export interface PostComment {
  id: string
  postId: string
  authorId: string
  content: string
  timestamp: string
  parentId?: string
  replies: PostComment[]
  reactions: PostReaction[]
  isEdited: boolean
}

export interface PostShare {
  id: string
  userId: string
  platform: string
  timestamp: string
  message?: string
}

export interface SocialChallenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  category: string
  difficulty: "easy" | "medium" | "hard" | "cosmic"

  // Challenge Details
  objectives: ChallengeObjective[]
  rewards: ChallengeReward[]
  requirements: string[]

  // Timing
  startDate: string
  endDate: string
  duration: number

  // Participation
  participants: ChallengeParticipant[]
  maxParticipants?: number
  teamBased: boolean

  // Progress Tracking
  submissions: ChallengeSubmission[]
  leaderboard: ChallengeLeaderboard[]

  // Community
  createdBy: string
  communityId?: string
  tags: string[]

  // Analytics
  analytics: ChallengeAnalytics
}

export type ChallengeType =
  | "creative"
  | "social"
  | "skill"
  | "exploration"
  | "collaboration"
  | "wellness"
  | "learning"
  | "cosmic"
  | "seasonal"

export interface ChallengeObjective {
  id: string
  description: string
  type: "create" | "engage" | "explore" | "learn" | "connect"
  target: number
  unit: string
  points: number
}

export interface ChallengeReward {
  type: "badge" | "experience" | "cosmic_credits" | "title" | "access"
  value: string | number
  description: string
  rarity?: BadgeRarity
}

export interface ChallengeParticipant {
  userId: string
  joinedAt: string
  progress: Record<string, number>
  completed: boolean
  rank?: number
  teamId?: string
}

export interface ChallengeSubmission {
  id: string
  challengeId: string
  userId: string
  content: string
  attachments: PostAttachment[]
  submittedAt: string
  votes: number
  comments: PostComment[]
}

export interface SocialMessage {
  id: string
  conversationId: string
  senderId: string
  recipientId?: string
  content: string
  type: MessageType
  attachments: MessageAttachment[]

  // Status
  timestamp: string
  readAt?: string
  deliveredAt: string
  isEdited: boolean
  isDeleted: boolean

  // Features
  reactions: MessageReaction[]
  replyTo?: string
  forwarded: boolean

  // Metadata
  metadata: Record<string, any>
}

export type MessageType = "text" | "image" | "video" | "audio" | "file" | "location" | "contact" | "sticker"

export interface MessageAttachment {
  id: string
  type: MessageType
  url: string
  filename?: string
  size?: number
  duration?: number
  thumbnail?: string
}

export interface MessageReaction {
  userId: string
  emoji: string
  timestamp: string
}

export interface SocialConversation {
  id: string
  type: "direct" | "group"
  participants: ConversationParticipant[]

  // Conversation Details
  name?: string
  avatar?: string
  description?: string

  // Messages
  messages: SocialMessage[]
  lastMessage?: SocialMessage
  unreadCount: number

  // Settings
  settings: ConversationSettings

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ConversationParticipant {
  userId: string
  role: "admin" | "member"
  joinedAt: string
  lastReadAt: string
  permissions: string[]
  nickname?: string
}

export interface ConversationSettings {
  notifications: boolean
  muteUntil?: string
  theme: string
  disappearingMessages: boolean
  messageRetention: number
  allowInvites: boolean
  requireApproval: boolean
}

// Analytics Interfaces
export interface CommunityAnalytics {
  memberGrowth: AnalyticsDataPoint[]
  engagement: EngagementMetrics
  contentStats: ContentStats
  demographics: DemographicsData
  topContributors: ContributorStats[]
}

export interface EventAnalytics {
  registrations: AnalyticsDataPoint[]
  attendance: AttendanceMetrics
  engagement: EngagementMetrics
  feedback: FeedbackData
  demographics: DemographicsData
}

export interface ChallengeAnalytics {
  participation: AnalyticsDataPoint[]
  completion: CompletionMetrics
  engagement: EngagementMetrics
  submissions: SubmissionStats
  leaderboard: ChallengeLeaderboard[]
}

export interface AnalyticsDataPoint {
  date: string
  value: number
  change?: number
}

export interface EngagementMetrics {
  likes: number
  comments: number
  shares: number
  views: number
  activeUsers: number
  avgSessionTime: number
}

export interface ContentStats {
  totalPosts: number
  postsByType: Record<PostType, number>
  topTags: TagStats[]
  viralContent: string[]
}

export interface DemographicsData {
  ageGroups: Record<string, number>
  locations: Record<string, number>
  interests: Record<string, number>
  devices: Record<string, number>
}

export interface ContributorStats {
  userId: string
  posts: number
  likes: number
  comments: number
  engagement: number
  rank: number
}

export interface AttendanceMetrics {
  registered: number
  attended: number
  noShows: number
  avgDuration: number
  peakAttendance: number
}

export interface FeedbackData {
  ratings: Record<number, number>
  averageRating: number
  comments: string[]
  suggestions: string[]
}

export interface CompletionMetrics {
  started: number
  completed: number
  abandoned: number
  completionRate: number
  avgCompletionTime: number
}

export interface SubmissionStats {
  total: number
  approved: number
  pending: number
  rejected: number
  avgVotes: number
}

export interface ChallengeLeaderboard {
  userId: string
  rank: number
  score: number
  progress: number
  achievements: string[]
}

export interface TagStats {
  tag: string
  count: number
  growth: number
}
