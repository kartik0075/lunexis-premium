"use client"

import { useState } from "react"
import type { NovaTemplate, TemplateCategory } from "../../types/nova"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Star,
  Users,
  Sparkles,
  Code,
  PenTool,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Zap,
  Heart,
  TrendingUp,
  Filter,
} from "lucide-react"

// Mock templates
const mockTemplates: NovaTemplate[] = [
  {
    id: "cosmic-content",
    name: "Cosmic Content Creator",
    description: "Generate engaging cosmic-themed social media content with stellar storytelling",
    category: "content_creation",
    prompt:
      "Create a {{content_type}} about {{topic}} with a cosmic theme. Make it {{tone}} and include {{elements}}. Target audience: {{audience}}.",
    settings: {
      temperature: 0.8,
      maxTokens: 1000,
      enableVision: false,
    },
    variables: [
      {
        name: "content_type",
        description: "Type of content",
        type: "select",
        required: true,
        options: ["social media post", "blog article", "video script", "newsletter"],
      },
      { name: "topic", description: "Main topic or theme", type: "text", required: true },
      {
        name: "tone",
        description: "Content tone",
        type: "select",
        required: true,
        options: ["inspiring", "mysterious", "educational", "playful", "epic"],
      },
      {
        name: "elements",
        description: "Elements to include",
        type: "multiselect",
        required: false,
        options: ["emojis", "hashtags", "call-to-action", "questions", "statistics"],
      },
      {
        name: "audience",
        description: "Target audience",
        type: "text",
        required: false,
        defaultValue: "cosmic explorers and space enthusiasts",
      },
    ],
    examples: [
      {
        title: "Instagram Post about Black Holes",
        input: {
          content_type: "social media post",
          topic: "black holes",
          tone: "mysterious",
          elements: ["emojis", "hashtags"],
          audience: "space enthusiasts",
        },
        output:
          "🕳️ **The Cosmic Enigma: Black Holes** 🌌\n\nIn the depths of space, where light itself cannot escape, lies one of the universe's greatest mysteries...\n\n#BlackHoles #CosmicMystery #SpaceExploration",
      },
    ],
    tags: ["social-media", "cosmic", "content", "storytelling"],
    isPublic: true,
    createdBy: "LUNEXIS",
    usageCount: 1247,
  },
  {
    id: "code-reviewer",
    name: "Cosmic Code Reviewer",
    description: "Get detailed code reviews with cosmic-themed feedback and stellar suggestions",
    category: "coding",
    prompt:
      "Review this {{language}} code and provide feedback on:\n1. Code quality and best practices\n2. Performance optimizations\n3. Security considerations\n4. Cosmic-themed variable naming suggestions\n\nCode:\n```{{language}}\n{{code}}\n```",
    settings: {
      temperature: 0.3,
      maxTokens: 2000,
      enableCodeExecution: true,
    },
    variables: [
      {
        name: "language",
        description: "Programming language",
        type: "select",
        required: true,
        options: ["javascript", "python", "typescript", "react", "css", "html"],
      },
      { name: "code", description: "Code to review", type: "text", required: true },
    ],
    examples: [
      {
        title: "JavaScript Function Review",
        input: { language: "javascript", code: "function calc(a, b) { return a + b; }" },
        output:
          "🚀 **Cosmic Code Review** ✨\n\n**Code Quality**: Good basic structure, but could use stellar improvements...\n**Suggestions**: Consider renaming to `calculateCosmicSum` for better clarity...",
      },
    ],
    tags: ["code-review", "programming", "best-practices"],
    isPublic: true,
    createdBy: "LUNEXIS",
    usageCount: 892,
  },
  {
    id: "story-weaver",
    name: "Galactic Story Weaver",
    description: "Craft epic cosmic stories and narratives with rich world-building",
    category: "creative_writing",
    prompt:
      "Write a {{story_type}} story set in {{setting}} with the theme of {{theme}}. The story should be {{length}} and have a {{tone}} tone. Include these elements: {{elements}}.",
    settings: {
      temperature: 0.9,
      maxTokens: 3000,
    },
    variables: [
      {
        name: "story_type",
        description: "Type of story",
        type: "select",
        required: true,
        options: ["short story", "chapter", "scene", "flash fiction", "epic tale"],
      },
      { name: "setting", description: "Story setting", type: "text", required: true, defaultValue: "a distant galaxy" },
      { name: "theme", description: "Central theme", type: "text", required: true },
      {
        name: "length",
        description: "Story length",
        type: "select",
        required: true,
        options: ["brief", "medium", "long", "epic"],
      },
      {
        name: "tone",
        description: "Story tone",
        type: "select",
        required: true,
        options: ["adventurous", "mysterious", "romantic", "dark", "hopeful"],
      },
      {
        name: "elements",
        description: "Story elements",
        type: "multiselect",
        required: false,
        options: ["space travel", "alien encounters", "cosmic powers", "ancient mysteries", "time travel"],
      },
    ],
    examples: [],
    tags: ["creative-writing", "storytelling", "fiction", "cosmic"],
    isPublic: true,
    createdBy: "LUNEXIS",
    usageCount: 634,
  },
  {
    id: "business-plan",
    name: "Stellar Business Strategist",
    description: "Create comprehensive business plans and strategies with cosmic vision",
    category: "business",
    prompt:
      "Create a business {{document_type}} for {{business_idea}}. Focus on {{focus_areas}} and make it suitable for {{audience}}. Include market analysis, competitive landscape, and growth projections.",
    settings: {
      temperature: 0.5,
      maxTokens: 2500,
    },
    variables: [
      {
        name: "document_type",
        description: "Type of document",
        type: "select",
        required: true,
        options: ["plan", "strategy", "proposal", "pitch deck", "executive summary"],
      },
      { name: "business_idea", description: "Business concept", type: "text", required: true },
      {
        name: "focus_areas",
        description: "Key focus areas",
        type: "multiselect",
        required: true,
        options: [
          "market analysis",
          "financial projections",
          "marketing strategy",
          "operations",
          "team structure",
          "risk assessment",
        ],
      },
      {
        name: "audience",
        description: "Target audience",
        type: "select",
        required: true,
        options: ["investors", "partners", "internal team", "customers", "stakeholders"],
      },
    ],
    examples: [],
    tags: ["business", "strategy", "planning", "entrepreneurship"],
    isPublic: true,
    createdBy: "LUNEXIS",
    usageCount: 445,
  },
]

const categoryIcons: Record<TemplateCategory, any> = {
  content_creation: Sparkles,
  coding: Code,
  creative_writing: PenTool,
  business: Briefcase,
  education: GraduationCap,
  entertainment: Gamepad2,
  productivity: Zap,
  cosmic: Star,
}

interface NovaTemplatesProps {
  onSelectTemplate: (template: NovaTemplate) => void
  onCreateNew: () => void
}

export function NovaTemplates({ onSelectTemplate, onCreateNew }: NovaTemplatesProps) {
  const [templates] = useState<NovaTemplate[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all")
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "name">("popular")
  const [showFilters, setShowFilters] = useState(false)

  const categories: (TemplateCategory | "all")[] = [
    "all",
    "content_creation",
    "coding",
    "creative_writing",
    "business",
    "education",
    "entertainment",
    "productivity",
    "cosmic",
  ]

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.usageCount - a.usageCount
        case "recent":
          return new Date(b.id).getTime() - new Date(a.id).getTime() // Mock recent sort
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Nova Templates</h1>
            <p className="text-slate-400">Accelerate your creativity with AI-powered templates</p>
          </div>
          <Button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 text-white rounded px-3 py-2 border border-slate-600"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
          </select>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-slate-600 text-slate-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category === "all" ? Star : categoryIcons[category as TemplateCategory]
              return (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category === "all" ? "All" : category.replace("_", " ")}
                </Button>
              )
            })}
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const CategoryIcon = categoryIcons[template.category]

            return (
              <Card
                key={template.id}
                className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/70 transition-all cursor-pointer group"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-4 h-4 text-white" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 bg-purple-500/10 capitalize"
                      >
                        {template.category.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">{formatNumber(template.usageCount)}</span>
                    </div>
                  </div>

                  <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                    {template.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{template.description}</p>

                  {/* Template Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                        #{tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Template Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{template.variables.length} variables</span>
                      </div>
                      {template.isPublic && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>Public</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
            <Button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Create Your Own Template
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
