export interface NovaConversation {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  messages: NovaMessage[]
  type: ConversationType
  settings: ConversationSettings
  metadata: ConversationMetadata
}

export interface NovaMessage {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  type: MessageType
  attachments?: MessageAttachment[]
  reactions?: MessageReaction[]
  isEdited: boolean
  metadata?: MessageMetadata
}

export type ConversationType =
  | "chat"
  | "content_creation"
  | "code_assistance"
  | "creative_writing"
  | "image_generation"
  | "video_editing"
  | "music_composition"
  | "cosmic_guidance"

export type MessageType = "text" | "image" | "code" | "file" | "generated_content" | "suggestion" | "analysis"

export interface MessageAttachment {
  id: string
  type: "image" | "video" | "audio" | "document" | "code"
  url: string
  filename: string
  size: number
  metadata?: any
}

export interface MessageReaction {
  emoji: string
  count: number
  users: string[]
}

export interface ConversationSettings {
  model: AIModel
  temperature: number
  maxTokens: number
  systemPrompt?: string
  enableVision: boolean
  enableCodeExecution: boolean
  enableWebSearch: boolean
  autoSave: boolean
}

export interface ConversationMetadata {
  tokenUsage: number
  estimatedCost: number
  tags: string[]
  isStarred: boolean
  isArchived: boolean
  collaborators?: string[]
}

export interface MessageMetadata {
  tokenCount: number
  processingTime: number
  model: string
  confidence?: number
}

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: ModelCapability[]
  pricing: ModelPricing
  limits: ModelLimits
}

export interface ModelCapability {
  type: "text" | "vision" | "code" | "reasoning" | "creative"
  description: string
  enabled: boolean
}

export interface ModelPricing {
  inputTokens: number // per 1K tokens
  outputTokens: number // per 1K tokens
  currency: string
}

export interface ModelLimits {
  maxTokens: number
  maxImages: number
  rateLimitPerMinute: number
}

export interface NovaTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  prompt: string
  settings: Partial<ConversationSettings>
  variables: TemplateVariable[]
  examples: TemplateExample[]
  tags: string[]
  isPublic: boolean
  createdBy: string
  usageCount: number
}

export type TemplateCategory =
  | "content_creation"
  | "coding"
  | "creative_writing"
  | "business"
  | "education"
  | "entertainment"
  | "productivity"
  | "cosmic"

export interface TemplateVariable {
  name: string
  description: string
  type: "text" | "number" | "select" | "multiselect"
  required: boolean
  defaultValue?: any
  options?: string[]
}

export interface TemplateExample {
  title: string
  input: Record<string, any>
  output: string
}

export interface NovaWorkspace {
  id: string
  name: string
  description: string
  conversations: string[]
  templates: string[]
  collaborators: WorkspaceCollaborator[]
  settings: WorkspaceSettings
  createdAt: string
  updatedAt: string
}

export interface WorkspaceCollaborator {
  userId: string
  role: "owner" | "editor" | "viewer"
  permissions: string[]
  addedAt: string
}

export interface WorkspaceSettings {
  isPublic: boolean
  allowCollaboration: boolean
  defaultModel: string
  autoBackup: boolean
  retentionDays: number
}

export interface NovaAnalytics {
  totalConversations: number
  totalMessages: number
  totalTokensUsed: number
  totalCost: number
  averageResponseTime: number
  mostUsedModels: ModelUsage[]
  conversationsByType: Record<ConversationType, number>
  dailyUsage: DailyUsage[]
  topTemplates: TemplateUsage[]
}

export interface ModelUsage {
  modelId: string
  modelName: string
  usage: number
  percentage: number
}

export interface DailyUsage {
  date: string
  conversations: number
  messages: number
  tokens: number
  cost: number
}

export interface TemplateUsage {
  templateId: string
  templateName: string
  usage: number
  rating: number
}
