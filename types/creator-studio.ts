export interface CreatorProject {
  id: string
  userId: string
  title: string
  description: string
  type: ProjectType
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  lastEditedAt: string
  thumbnail: string
  duration?: number
  settings: ProjectSettings
  assets: ProjectAsset[]
  timeline: TimelineTrack[]
  effects: Effect[]
  transitions: Transition[]
  audio: AudioTrack[]
  collaborators: Collaborator[]
  versions: ProjectVersion[]
  metadata: ProjectMetadata
  exportSettings: ExportSettings
  tags: string[]
  category: string
  isPublic: boolean
  templateId?: string
}

export type ProjectType = "glow" | "vision" | "orbit_setup" | "time_capsule" | "ambient_mood" | "template"

export type ProjectStatus = "draft" | "in_progress" | "review" | "completed" | "published" | "archived"

export interface ProjectSettings {
  resolution: Resolution
  frameRate: number
  aspectRatio: string
  colorSpace: string
  bitrate: number
  quality: QualityPreset
  autoSave: boolean
  backupEnabled: boolean
  collaborationEnabled: boolean
  versionControl: boolean
}

export interface Resolution {
  width: number
  height: number
  label: string
}

export type QualityPreset = "draft" | "standard" | "high" | "ultra" | "custom"

export interface ProjectAsset {
  id: string
  name: string
  type: AssetType
  url: string
  thumbnail?: string
  duration?: number
  size: number
  format: string
  metadata: AssetMetadata
  tags: string[]
  createdAt: string
  usageCount: number
  isShared: boolean
}

export type AssetType =
  | "video"
  | "image"
  | "audio"
  | "text"
  | "effect"
  | "transition"
  | "template"
  | "3d_model"
  | "font"

export interface AssetMetadata {
  dimensions?: { width: number; height: number }
  duration?: number
  frameRate?: number
  bitrate?: number
  colorProfile?: string
  hasAlpha?: boolean
  originalSource?: string
  license?: string
  creator?: string
}

export interface TimelineTrack {
  id: string
  name: string
  type: TrackType
  isLocked: boolean
  isVisible: boolean
  isMuted?: boolean
  volume?: number
  clips: TimelineClip[]
  effects: TrackEffect[]
  keyframes: Keyframe[]
  color: string
  height: number
}

export type TrackType = "video" | "audio" | "text" | "effects" | "overlay" | "background"

export interface TimelineClip {
  id: string
  assetId: string
  startTime: number
  endTime: number
  duration: number
  trimStart: number
  trimEnd: number
  position: { x: number; y: number }
  scale: { x: number; y: number }
  rotation: number
  opacity: number
  blendMode: BlendMode
  effects: ClipEffect[]
  keyframes: Keyframe[]
  isLocked: boolean
  color: string
}

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft_light"
  | "hard_light"
  | "color_dodge"
  | "color_burn"

export interface Effect {
  id: string
  name: string
  type: EffectType
  category: EffectCategory
  parameters: EffectParameter[]
  presets: EffectPreset[]
  isGPUAccelerated: boolean
  description: string
  thumbnail: string
  tags: string[]
  creator: string
  rating: number
  usageCount: number
}

export type EffectType =
  | "color"
  | "blur"
  | "distortion"
  | "stylize"
  | "generate"
  | "composite"
  | "audio"
  | "3d"
  | "particle"

export type EffectCategory =
  | "basic"
  | "cosmic"
  | "cinematic"
  | "artistic"
  | "technical"
  | "audio"
  | "motion"
  | "ai_powered"

export interface EffectParameter {
  id: string
  name: string
  type: ParameterType
  value: any
  defaultValue: any
  min?: number
  max?: number
  step?: number
  options?: string[]
  isAnimatable: boolean
  unit?: string
  description: string
}

export type ParameterType = "number" | "boolean" | "color" | "text" | "select" | "range" | "point" | "curve"

export interface EffectPreset {
  id: string
  name: string
  description: string
  parameters: Record<string, any>
  thumbnail: string
  tags: string[]
}

export interface Transition {
  id: string
  name: string
  type: TransitionType
  duration: number
  easing: EasingFunction
  parameters: EffectParameter[]
  presets: EffectPreset[]
  thumbnail: string
  description: string
}

export type TransitionType = "fade" | "slide" | "zoom" | "rotate" | "wipe" | "dissolve" | "morph" | "3d" | "particle"

export type EasingFunction = "linear" | "ease_in" | "ease_out" | "ease_in_out" | "bounce" | "elastic" | "back"

export interface AudioTrack {
  id: string
  name: string
  url: string
  waveform: number[]
  volume: number
  pan: number
  isMuted: boolean
  effects: AudioEffect[]
  markers: AudioMarker[]
  type: AudioType
}

export type AudioType = "music" | "sfx" | "voice" | "ambient" | "generated"

export interface AudioEffect {
  id: string
  type: AudioEffectType
  parameters: Record<string, any>
  isEnabled: boolean
}

export type AudioEffectType =
  | "reverb"
  | "delay"
  | "eq"
  | "compressor"
  | "distortion"
  | "chorus"
  | "filter"
  | "normalize"

export interface AudioMarker {
  id: string
  time: number
  label: string
  type: MarkerType
  color: string
}

export type MarkerType = "beat" | "section" | "cue" | "sync" | "note"

export interface Collaborator {
  userId: string
  role: CollaboratorRole
  permissions: Permission[]
  addedAt: string
  lastActive: string
  status: CollaboratorStatus
}

export type CollaboratorRole = "owner" | "editor" | "reviewer" | "viewer" | "contributor"

export type Permission = "edit" | "comment" | "export" | "share" | "delete" | "manage_collaborators" | "publish"

export type CollaboratorStatus = "active" | "pending" | "inactive" | "blocked"

export interface ProjectVersion {
  id: string
  version: string
  description: string
  createdAt: string
  createdBy: string
  changes: VersionChange[]
  thumbnail: string
  size: number
  isAutoSave: boolean
}

export interface VersionChange {
  type: ChangeType
  description: string
  timestamp: string
  trackId?: string
  clipId?: string
  effectId?: string
}

export type ChangeType = "add" | "remove" | "modify" | "move" | "duplicate" | "split" | "merge"

export interface ProjectMetadata {
  totalDuration: number
  totalAssets: number
  totalEffects: number
  totalTracks: number
  renderTime?: number
  fileSize?: number
  exportCount: number
  viewCount: number
  likeCount: number
  shareCount: number
  lastExportAt?: string
  performance: PerformanceMetrics
}

export interface PerformanceMetrics {
  renderSpeed: number
  memoryUsage: number
  gpuUsage: number
  previewQuality: number
  realTimePlayback: boolean
}

export interface ExportSettings {
  format: ExportFormat
  resolution: Resolution
  frameRate: number
  bitrate: number
  quality: number
  codec: string
  audioCodec: string
  audioBitrate: number
  includeAlpha: boolean
  colorSpace: string
  destination: ExportDestination[]
  watermark?: Watermark
  metadata: ExportMetadata
}

export type ExportFormat = "mp4" | "mov" | "webm" | "gif" | "png_sequence" | "jpg_sequence" | "audio_only"

export type ExportDestination = "local" | "cloud" | "glow" | "vision" | "orbit" | "social_media" | "youtube" | "tiktok"

export interface Watermark {
  enabled: boolean
  type: "text" | "image" | "logo"
  content: string
  position: WatermarkPosition
  opacity: number
  size: number
}

export type WatermarkPosition = "top_left" | "top_right" | "bottom_left" | "bottom_right" | "center"

export interface ExportMetadata {
  title: string
  description: string
  tags: string[]
  category: string
  mood: string
  visibility: string
  allowComments: boolean
  allowDownload: boolean
}

export interface CreatorTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  type: ProjectType
  thumbnail: string
  previewUrl?: string
  creator: TemplateCreator
  settings: ProjectSettings
  assets: TemplateAsset[]
  timeline: TimelineTrack[]
  effects: Effect[]
  isPublic: boolean
  isPremium: boolean
  price?: number
  rating: number
  usageCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type TemplateCategory =
  | "intro"
  | "outro"
  | "transition"
  | "effect"
  | "complete_project"
  | "social_media"
  | "educational"
  | "entertainment"

export interface TemplateCreator {
  id: string
  name: string
  avatar: string
  isVerified: boolean
  isPartner: boolean
}

export interface TemplateAsset {
  id: string
  type: AssetType
  isPlaceholder: boolean
  replaceable: boolean
  name: string
  description: string
}

export interface CreatorStudioSettings {
  theme: StudioTheme
  layout: StudioLayout
  shortcuts: KeyboardShortcut[]
  preferences: StudioPreferences
  performance: PerformanceSettings
  collaboration: CollaborationSettings
  export: DefaultExportSettings
}

export type StudioTheme = "cosmic_dark" | "stellar_light" | "nebula_purple" | "aurora_blue" | "solar_orange"

export interface StudioLayout {
  panels: PanelLayout[]
  workspace: WorkspaceType
  timelineHeight: number
  previewSize: PreviewSize
  showWaveforms: boolean
  showThumbnails: boolean
}

export interface PanelLayout {
  id: string
  type: PanelType
  position: PanelPosition
  size: { width: number; height: number }
  isVisible: boolean
  isCollapsed: boolean
}

export type PanelType =
  | "project"
  | "assets"
  | "effects"
  | "timeline"
  | "preview"
  | "properties"
  | "audio"
  | "collaboration"

export type PanelPosition = "left" | "right" | "top" | "bottom" | "center" | "floating"

export type WorkspaceType = "editing" | "color" | "audio" | "effects" | "collaboration" | "export"

export type PreviewSize = "small" | "medium" | "large" | "fullscreen"

export interface KeyboardShortcut {
  id: string
  action: string
  keys: string[]
  description: string
  category: string
  isCustom: boolean
}

export interface StudioPreferences {
  autoSave: boolean
  autoSaveInterval: number
  showTooltips: boolean
  enableAnimations: boolean
  highQualityPreview: boolean
  realTimeEffects: boolean
  gpuAcceleration: boolean
  memoryLimit: number
  cacheSize: number
  undoLevels: number
}

export interface PerformanceSettings {
  renderQuality: QualityPreset
  previewQuality: QualityPreset
  enableGPU: boolean
  memoryUsage: "low" | "medium" | "high" | "unlimited"
  backgroundRendering: boolean
  multiThreading: boolean
  cacheStrategy: "aggressive" | "balanced" | "conservative"
}

export interface CollaborationSettings {
  allowRealTimeEditing: boolean
  showCursors: boolean
  enableComments: boolean
  autoSync: boolean
  conflictResolution: "manual" | "auto_merge" | "last_edit_wins"
  notificationLevel: "all" | "important" | "none"
}

export interface DefaultExportSettings {
  format: ExportFormat
  quality: QualityPreset
  resolution: Resolution
  includeWatermark: boolean
  autoUpload: boolean
  defaultDestination: ExportDestination
}

export interface CreatorAnalytics {
  overview: AnalyticsOverview
  projects: ProjectAnalytics[]
  performance: PerformanceAnalytics
  audience: AudienceAnalytics
  revenue: RevenueAnalytics
  trends: TrendAnalytics
}

export interface AnalyticsOverview {
  totalProjects: number
  totalViews: number
  totalLikes: number
  totalShares: number
  totalRevenue: number
  averageRating: number
  followerCount: number
  engagementRate: number
}

export interface ProjectAnalytics {
  projectId: string
  title: string
  type: ProjectType
  views: number
  likes: number
  shares: number
  comments: number
  watchTime: number
  completionRate: number
  revenue: number
  demographics: Demographics
  performance: ContentPerformance
}

export interface Demographics {
  ageGroups: Record<string, number>
  genders: Record<string, number>
  locations: Record<string, number>
  devices: Record<string, number>
}

export interface ContentPerformance {
  impressions: number
  clickThroughRate: number
  engagementRate: number
  retentionCurve: number[]
  dropOffPoints: number[]
  peakViewership: number
}

export interface PerformanceAnalytics {
  renderTimes: number[]
  exportTimes: number[]
  errorRate: number
  crashRate: number
  memoryUsage: number[]
  gpuUsage: number[]
  storageUsage: number
}

export interface AudienceAnalytics {
  totalFollowers: number
  followerGrowth: number[]
  engagement: EngagementMetrics
  demographics: Demographics
  topContent: ProjectAnalytics[]
  audienceRetention: number
}

export interface EngagementMetrics {
  likes: number
  comments: number
  shares: number
  saves: number
  clickThroughs: number
  averageWatchTime: number
}

export interface RevenueAnalytics {
  totalRevenue: number
  revenueGrowth: number[]
  revenueBySource: Record<string, number>
  topEarningContent: ProjectAnalytics[]
  averageRevenuePerView: number
  conversionRate: number
}

export interface TrendAnalytics {
  popularEffects: Effect[]
  trendingTemplates: CreatorTemplate[]
  emergingCategories: string[]
  seasonalTrends: SeasonalTrend[]
  competitorAnalysis: CompetitorData[]
}

export interface SeasonalTrend {
  period: string
  category: string
  growth: number
  keywords: string[]
}

export interface CompetitorData {
  name: string
  followers: number
  engagement: number
  topContent: string[]
  strategies: string[]
}

export interface TrackEffect {
  id: string
  name: string
  parameters: Record<string, any>
}

export interface ClipEffect {
  id: string
  name: string
  parameters: Record<string, any>
}
