export interface TimeCapsule {
  id: string
  userId: string
  title: string
  description: string
  content: CapsuleContent[]
  createdAt: string
  scheduledFor?: string
  deliveredAt?: string
  status: CapsuleStatus
  visibility: CapsuleVisibility
  recipients: CapsuleRecipient[]
  vault: string
  tags: string[]
  location?: CapsuleLocation
  mood: string
  theme: CapsuleTheme
  settings: CapsuleSettings
  metadata: CapsuleMetadata
  reactions: CapsuleReaction[]
  views: number
  isLocked: boolean
  unlockConditions?: UnlockCondition[]
}

export type CapsuleStatus = "draft" | "scheduled" | "sealed" | "delivered" | "opened" | "expired" | "archived"

export type CapsuleVisibility = "private" | "friends" | "public" | "recipients_only"

export interface CapsuleContent {
  id: string
  type: ContentType
  data: any
  title?: string
  description?: string
  timestamp: string
  metadata?: ContentMetadata
}

export type ContentType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "glow"
  | "vision"
  | "document"
  | "link"
  | "mood_snapshot"
  | "location_memory"
  | "playlist"
  | "conversation"

export interface ContentMetadata {
  size?: number
  duration?: number
  dimensions?: { width: number; height: number }
  format?: string
  quality?: string
  originalSource?: string
}

export interface CapsuleRecipient {
  id: string
  userId?: string
  email?: string
  name: string
  avatar?: string
  relationship: string
  deliveryMethod: DeliveryMethod
  hasOpened: boolean
  openedAt?: string
  message?: string
}

export type DeliveryMethod = "app" | "email" | "sms" | "physical"

export interface CapsuleLocation {
  latitude: number
  longitude: number
  address: string
  placeName?: string
  city: string
  country: string
}

export interface CapsuleTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  effects: ThemeEffect[]
}

export interface ThemeEffect {
  type: "particles" | "gradient" | "animation" | "sound"
  config: any
}

export interface CapsuleSettings {
  allowComments: boolean
  allowReactions: boolean
  allowSharing: boolean
  requirePassword: boolean
  password?: string
  maxViews?: number
  autoArchive: boolean
  archiveAfterDays?: number
  notifyOnOpen: boolean
  trackViews: boolean
}

export interface CapsuleMetadata {
  creationDevice: string
  creationLocation?: CapsuleLocation
  weatherData?: WeatherData
  cosmicData?: CosmicData
  emotionalState?: EmotionalState
  lifeContext?: LifeContext
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

export interface CosmicData {
  moonPhase: string
  constellation: string
  planetaryAlignment?: string
  astrologicalSign?: string
}

export interface EmotionalState {
  primary: string
  intensity: number
  secondary?: string[]
  context?: string
}

export interface LifeContext {
  lifeStage: string
  majorEvents: string[]
  goals: string[]
  challenges: string[]
}

export interface CapsuleReaction {
  id: string
  userId: string
  type: ReactionType
  emoji?: string
  timestamp: string
  message?: string
}

export type ReactionType = "love" | "wow" | "nostalgic" | "grateful" | "inspired" | "emotional"

export interface UnlockCondition {
  type: ConditionType
  value: any
  description: string
  isMet: boolean
}

export type ConditionType = "date" | "location" | "weather" | "mood" | "achievement" | "social" | "cosmic_event"

export interface MemoryVault {
  id: string
  userId: string
  name: string
  description: string
  theme: CapsuleTheme
  capsules: string[]
  collaborators: VaultCollaborator[]
  settings: VaultSettings
  createdAt: string
  updatedAt: string
  isPublic: boolean
  category: VaultCategory
  tags: string[]
  stats: VaultStats
}

export type VaultCategory =
  | "personal"
  | "family"
  | "travel"
  | "milestones"
  | "creative"
  | "professional"
  | "relationships"
  | "cosmic_journey"

export interface VaultCollaborator {
  userId: string
  role: "owner" | "editor" | "contributor" | "viewer"
  permissions: string[]
  addedAt: string
}

export interface VaultSettings {
  allowPublicContributions: boolean
  requireApproval: boolean
  autoOrganize: boolean
  backupEnabled: boolean
  encryptionEnabled: boolean
}

export interface VaultStats {
  totalCapsules: number
  totalContent: number
  totalViews: number
  totalReactions: number
  oldestCapsule: string
  newestCapsule: string
  mostViewedCapsule: string
}

export interface MemoryTimeline {
  id: string
  userId: string
  title: string
  description: string
  events: TimelineEvent[]
  style: TimelineStyle
  isPublic: boolean
  collaborators: string[]
  createdAt: string
  updatedAt: string
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: EventType
  content: CapsuleContent[]
  location?: CapsuleLocation
  mood: string
  importance: number
  connections: string[]
}

export type EventType = "milestone" | "memory" | "achievement" | "relationship" | "travel" | "creative" | "cosmic"

export interface TimelineStyle {
  layout: "vertical" | "horizontal" | "spiral" | "constellation"
  theme: CapsuleTheme
  showDates: boolean
  showMoods: boolean
  showConnections: boolean
  animationStyle: string
}

export interface MemoryTrigger {
  id: string
  userId: string
  name: string
  description: string
  conditions: TriggerCondition[]
  actions: TriggerAction[]
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
  createdAt: string
  settings: TriggerSettings
  metadata: TriggerMetadata
}

export interface TriggerCondition {
  id: string
  type: "date" | "location" | "weather" | "mood" | "activity" | "social" | "time_of_day" | "season"
  operator: "equals" | "contains" | "greater_than" | "less_than" | "within_radius" | "on_date" | "recurring"
  value: any
  description: string
  isActive: boolean
  metadata?: any
}

export interface TriggerAction {
  id: string
  type: "notify" | "unlock_capsule" | "create_memory" | "share" | "remind" | "suggest_content" | "play_audio"
  config: any
  description: string
  priority: "low" | "medium" | "high"
  delay?: number // seconds to delay action
}

export interface TriggerSettings {
  maxTriggersPerDay: number
  quietHours: { start: string; end: string }
  enabledDays: string[] // ["monday", "tuesday", etc.]
  requireConfirmation: boolean
  autoCreateMemories: boolean
  notificationStyle: "subtle" | "standard" | "prominent"
}

export interface TriggerMetadata {
  creationLocation?: CapsuleLocation
  associatedCapsules: string[]
  successRate: number
  lastModified: string
  tags: string[]
}

export interface LocationTrigger extends MemoryTrigger {
  location: CapsuleLocation
  radius: number // meters
  enterAction?: TriggerAction[]
  exitAction?: TriggerAction[]
  dwellTime?: number // minimum time in location before triggering
}

export interface DateTrigger extends MemoryTrigger {
  triggerDate: string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  timeOfDay?: string
  timezone: string
}

export interface RecurrencePattern {
  type: "daily" | "weekly" | "monthly" | "yearly" | "custom"
  interval: number // every N days/weeks/months/years
  daysOfWeek?: number[] // for weekly patterns
  dayOfMonth?: number // for monthly patterns
  monthOfYear?: number // for yearly patterns
  endDate?: string
  maxOccurrences?: number
}

export interface TriggerNotification {
  id: string
  triggerId: string
  userId: string
  title: string
  message: string
  type: "location_entered" | "date_anniversary" | "memory_suggestion" | "capsule_unlock"
  data: any
  isRead: boolean
  createdAt: string
  expiresAt?: string
  actions: NotificationAction[]
}

export interface NotificationAction {
  id: string
  label: string
  action: "create_memory" | "view_capsule" | "dismiss" | "snooze" | "share"
  data?: any
}

export interface TriggerAnalytics {
  totalTriggers: number
  activeTriggers: number
  triggersToday: number
  triggersThisWeek: number
  mostSuccessfulTrigger: string
  locationTriggerStats: LocationTriggerStats
  dateTriggerStats: DateTriggerStats
  engagementMetrics: TriggerEngagementMetrics
}

export interface LocationTriggerStats {
  totalLocationTriggers: number
  averageRadius: number
  mostTriggeredLocation: string
  uniqueLocationsTracked: number
}

export interface DateTriggerStats {
  totalDateTriggers: number
  recurringTriggers: number
  oneTimeTriggers: number
  upcomingTriggers: number
}

export interface TriggerEngagementMetrics {
  notificationOpenRate: number
  memoryCreationRate: number
  triggerDismissalRate: number
  averageResponseTime: number
}

export interface CapsuleTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  contentStructure: ContentTemplate[]
  defaultSettings: Partial<CapsuleSettings>
  theme: CapsuleTheme
  isPublic: boolean
  createdBy: string
  usageCount: number
  rating: number
}

export type TemplateCategory =
  | "birthday"
  | "anniversary"
  | "graduation"
  | "travel"
  | "baby"
  | "wedding"
  | "achievement"
  | "goodbye"
  | "time_travel"
  | "cosmic_event"

export interface ContentTemplate {
  type: ContentType
  title: string
  description: string
  isRequired: boolean
  placeholder?: string
  maxSize?: number
  allowMultiple: boolean
}

export interface CapsuleAnalytics {
  totalCapsules: number
  totalContent: number
  totalViews: number
  totalReactions: number
  averageOpenTime: number
  popularThemes: ThemeUsage[]
  contentTypeDistribution: Record<ContentType, number>
  deliveryStats: DeliveryStats
  vaultStats: VaultAnalytics[]
  timelineStats: TimelineAnalytics
  engagementMetrics: EngagementMetrics
}

export interface ThemeUsage {
  themeId: string
  themeName: string
  usage: number
  percentage: number
}

export interface DeliveryStats {
  scheduled: number
  delivered: number
  opened: number
  pending: number
  failed: number
}

export interface VaultAnalytics {
  vaultId: string
  vaultName: string
  capsuleCount: number
  viewCount: number
  reactionCount: number
  collaboratorCount: number
}

export interface TimelineAnalytics {
  totalTimelines: number
  totalEvents: number
  averageEventsPerTimeline: number
  mostPopularEventType: EventType
}

export interface EngagementMetrics {
  dailyActive: number
  weeklyActive: number
  monthlyActive: number
  averageSessionTime: number
  returnRate: number
}
