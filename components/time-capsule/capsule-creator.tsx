"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { TimeCapsule, CapsuleContent, CapsuleRecipient, CapsuleTheme } from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Clock,
  Users,
  ImageIcon,
  Video,
  FileText,
  MapPin,
  Heart,
  Lock,
  Eye,
  Send,
  Plus,
  X,
  Mic,
  Link,
  Palette,
  Save,
  Timer,
} from "lucide-react"

// Mock themes
const availableThemes: CapsuleTheme[] = [
  {
    id: "cosmic_purple",
    name: "Cosmic Purple",
    colors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#F59E0B",
      background: "linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)",
    },
    fonts: { heading: "Inter", body: "Inter" },
    effects: [{ type: "particles", config: { count: 50, color: "#8B5CF6" } }],
  },
  {
    id: "sunset_glow",
    name: "Sunset Glow",
    colors: {
      primary: "#F59E0B",
      secondary: "#EF4444",
      accent: "#EC4899",
      background: "linear-gradient(135deg, #FED7AA 0%, #F59E0B 100%)",
    },
    fonts: { heading: "Inter", body: "Inter" },
    effects: [{ type: "gradient", config: { direction: "radial" } }],
  },
  {
    id: "ocean_depths",
    name: "Ocean Depths",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4",
      accent: "#8B5CF6",
      background: "linear-gradient(135deg, #0F172A 0%, #0EA5E9 100%)",
    },
    fonts: { heading: "Inter", body: "Inter" },
    effects: [{ type: "animation", config: { type: "wave" } }],
  },
]

interface CapsuleCreatorProps {
  onSave: (capsule: Partial<TimeCapsule>) => void
  onCancel: () => void
  editingCapsule?: TimeCapsule
}

export function CapsuleCreator({ onSave, onCancel, editingCapsule }: CapsuleCreatorProps) {
  const [title, setTitle] = useState(editingCapsule?.title || "")
  const [description, setDescription] = useState(editingCapsule?.description || "")
  const [scheduledFor, setScheduledFor] = useState(editingCapsule?.scheduledFor || "")
  const [selectedTheme, setSelectedTheme] = useState<CapsuleTheme>(editingCapsule?.theme || availableThemes[0])
  const [content, setContent] = useState<CapsuleContent[]>(editingCapsule?.content || [])
  const [recipients, setRecipients] = useState<CapsuleRecipient[]>(editingCapsule?.recipients || [])
  const [tags, setTags] = useState<string[]>(editingCapsule?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [mood, setMood] = useState(editingCapsule?.mood || "nostalgic")
  const [visibility, setVisibility] = useState(editingCapsule?.visibility || "private")
  const [currentStep, setCurrentStep] = useState(1)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddContent = (type: string) => {
    const newContent: CapsuleContent = {
      id: `content_${Date.now()}`,
      type: type as any,
      data: "",
      timestamp: new Date().toISOString(),
    }

    if (type === "text") {
      newContent.data = "Write your memory here..."
      newContent.title = "Memory Note"
    } else if (type === "image" || type === "video" || type === "audio") {
      fileInputRef.current?.click()
      return
    }

    setContent([...content, newContent])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newContent: CapsuleContent[] = files.map((file) => ({
      id: `content_${Date.now()}_${Math.random()}`,
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "audio",
      data: URL.createObjectURL(file),
      title: file.name,
      timestamp: new Date().toISOString(),
      metadata: {
        size: file.size,
        format: file.type,
      },
    }))

    setContent([...content, ...newContent])
  }

  const handleUpdateContent = (id: string, updates: Partial<CapsuleContent>) => {
    setContent(content.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const handleRemoveContent = (id: string) => {
    setContent(content.filter((item) => item.id !== id))
  }

  const handleAddRecipient = () => {
    const newRecipient: CapsuleRecipient = {
      id: `recipient_${Date.now()}`,
      name: "",
      email: "",
      relationship: "friend",
      deliveryMethod: "app",
      hasOpened: false,
    }
    setRecipients([...recipients, newRecipient])
  }

  const handleUpdateRecipient = (id: string, updates: Partial<CapsuleRecipient>) => {
    setRecipients(recipients.map((recipient) => (recipient.id === id ? { ...recipient, ...updates } : recipient)))
  }

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter((recipient) => recipient.id !== id))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    const capsuleData: Partial<TimeCapsule> = {
      title,
      description,
      content,
      scheduledFor: scheduledFor || undefined,
      theme: selectedTheme,
      recipients,
      tags,
      mood,
      visibility: visibility as any,
      status: scheduledFor ? "scheduled" : "draft",
      settings: {
        allowComments: true,
        allowReactions: true,
        allowSharing: visibility !== "private",
        requirePassword: false,
        autoArchive: true,
        notifyOnOpen: true,
        trackViews: true,
      },
    }

    onSave(capsuleData)
  }

  const moods = [
    { id: "nostalgic", name: "Nostalgic", emoji: "🌅", color: "text-orange-400" },
    { id: "grateful", name: "Grateful", emoji: "🙏", color: "text-green-400" },
    { id: "excited", name: "Excited", emoji: "⚡", color: "text-yellow-400" },
    { id: "peaceful", name: "Peaceful", emoji: "🕊️", color: "text-blue-400" },
    { id: "adventurous", name: "Adventurous", emoji: "🚀", color: "text-purple-400" },
    { id: "romantic", name: "Romantic", emoji: "💕", color: "text-pink-400" },
    { id: "reflective", name: "Reflective", emoji: "🌙", color: "text-indigo-400" },
    { id: "joyful", name: "Joyful", emoji: "✨", color: "text-cyan-400" },
  ]

  const contentTypes = [
    { id: "text", name: "Text Note", icon: FileText, description: "Write a memory or message" },
    { id: "image", name: "Photo", icon: Image, description: "Add photos and images" },
    { id: "video", name: "Video", icon: Video, description: "Record or upload videos" },
    { id: "audio", name: "Voice Note", icon: Mic, description: "Record audio messages" },
    { id: "link", name: "Link", icon: Link, description: "Save important links" },
    { id: "location_memory", name: "Location", icon: MapPin, description: "Capture a place" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {editingCapsule ? "Edit Time Capsule" : "Create Time Capsule"}
            </h1>
            <p className="text-slate-400">Preserve memories for the future ✨</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              {editingCapsule ? "Update" : "Create"} Capsule
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && <div className="w-12 h-0.5 bg-slate-700 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={`step-${currentStep}`} onValueChange={(value) => setCurrentStep(Number(value.split("-")[1]))}>
          {/* Step 1: Basic Information */}
          <TabsContent value="step-1">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Capsule Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your time capsule a meaningful title..."
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this time capsule represents..."
                    className="bg-slate-800/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-slate-300 text-sm font-medium mb-2 block">Mood</label>
                    <div className="grid grid-cols-2 gap-2">
                      {moods.map((moodOption) => (
                        <Button
                          key={moodOption.id}
                          variant={mood === moodOption.id ? "default" : "outline"}
                          onClick={() => setMood(moodOption.id)}
                          className={`justify-start ${
                            mood === moodOption.id
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "border-slate-600 text-slate-300"
                          }`}
                        >
                          <span className="mr-2">{moodOption.emoji}</span>
                          {moodOption.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-medium mb-2 block">Visibility</label>
                    <div className="space-y-2">
                      {[
                        { id: "private", name: "Private", icon: Lock, desc: "Only you can see this" },
                        { id: "friends", name: "Friends", icon: Users, desc: "Your friends can see this" },
                        { id: "public", name: "Public", icon: Eye, desc: "Anyone can see this" },
                      ].map((option) => (
                        <Button
                          key={option.id}
                          variant={visibility === option.id ? "default" : "outline"}
                          onClick={() => setVisibility(option.id)}
                          className={`w-full justify-start ${
                            visibility === option.id
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "border-slate-600 text-slate-300"
                          }`}
                        >
                          <option.icon className="w-4 h-4 mr-2" />
                          <div className="text-left">
                            <div>{option.name}</div>
                            <div className="text-xs opacity-70">{option.desc}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 bg-purple-500/10"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTag(tag)}
                          className="h-4 w-4 p-0 ml-1 text-purple-300 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      placeholder="Add a tag..."
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                    <Button onClick={handleAddTag} variant="outline" className="border-slate-600">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Next: Add Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Content */}
          <TabsContent value="step-2">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Types */}
                <div>
                  <h3 className="text-slate-300 font-medium mb-3">Add Content to Your Capsule</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contentTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant="outline"
                        onClick={() => handleAddContent(type.id)}
                        className="h-auto p-4 border-slate-600 text-slate-300 hover:bg-slate-800 flex-col"
                      >
                        <type.icon className="w-6 h-6 mb-2" />
                        <div className="text-center">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs opacity-70">{type.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Content List */}
                {content.length > 0 && (
                  <div>
                    <h3 className="text-slate-300 font-medium mb-3">Content ({content.length})</h3>
                    <div className="space-y-3">
                      {content.map((item) => (
                        <Card key={item.id} className="bg-slate-800/50 border-slate-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.type === "text" && <FileText className="w-5 h-5 text-white" />}
                                {item.type === "image" && <ImageIcon className="w-5 h-5 text-white" />}
                                {item.type === "video" && <Video className="w-5 h-5 text-white" />}
                                {item.type === "audio" && <Mic className="w-5 h-5 text-white" />}
                                {item.type === "link" && <Link className="w-5 h-5 text-white" />}
                                {item.type === "location_memory" && <MapPin className="w-5 h-5 text-white" />}
                              </div>

                              <div className="flex-1">
                                <Input
                                  value={item.title || ""}
                                  onChange={(e) => handleUpdateContent(item.id, { title: e.target.value })}
                                  placeholder="Content title..."
                                  className="bg-slate-700/50 border-slate-600 text-white mb-2"
                                />

                                {item.type === "text" && (
                                  <Textarea
                                    value={item.data}
                                    onChange={(e) => handleUpdateContent(item.id, { data: e.target.value })}
                                    placeholder="Write your memory..."
                                    className="bg-slate-700/50 border-slate-600 text-white"
                                  />
                                )}

                                {(item.type === "image" || item.type === "video") && item.data && (
                                  <div className="mt-2">
                                    {item.type === "image" ? (
                                      <img
                                        src={item.data || "/placeholder.svg"}
                                        alt={item.title}
                                        className="w-32 h-32 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <video src={item.data} className="w-32 h-32 object-cover rounded-lg" controls />
                                    )}
                                  </div>
                                )}

                                {item.type === "audio" && item.data && (
                                  <audio src={item.data} controls className="mt-2" />
                                )}

                                {item.type === "link" && (
                                  <Input
                                    value={item.data}
                                    onChange={(e) => handleUpdateContent(item.id, { data: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-slate-700/50 border-slate-600 text-white"
                                  />
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveContent(item.id)}
                                className="text-slate-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(1)} variant="outline" className="border-slate-600">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Next: Schedule & Recipients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Schedule & Recipients */}
          <TabsContent value="step-3">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Schedule & Recipients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Delivery Date (Optional)</label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {scheduledFor && (
                      <Button
                        variant="outline"
                        onClick={() => setScheduledFor("")}
                        className="border-slate-600 text-slate-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mt-1">
                    {scheduledFor
                      ? "This capsule will be delivered on the scheduled date"
                      : "Leave empty to create an immediate capsule"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-slate-300 text-sm font-medium">Recipients (Optional)</label>
                    <Button
                      onClick={handleAddRecipient}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Recipient
                    </Button>
                  </div>

                  {recipients.length > 0 && (
                    <div className="space-y-3">
                      {recipients.map((recipient) => (
                        <Card key={recipient.id} className="bg-slate-800/50 border-slate-700/50">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <Input
                                value={recipient.name}
                                onChange={(e) => handleUpdateRecipient(recipient.id, { name: e.target.value })}
                                placeholder="Recipient name..."
                                className="bg-slate-700/50 border-slate-600 text-white"
                              />
                              <Input
                                value={recipient.email || ""}
                                onChange={(e) => handleUpdateRecipient(recipient.id, { email: e.target.value })}
                                placeholder="Email address..."
                                type="email"
                                className="bg-slate-700/50 border-slate-600 text-white"
                              />
                              <div className="flex gap-2">
                                <select
                                  value={recipient.relationship}
                                  onChange={(e) =>
                                    handleUpdateRecipient(recipient.id, { relationship: e.target.value })
                                  }
                                  className="flex-1 bg-slate-700/50 border border-slate-600 text-white rounded px-3 py-2"
                                >
                                  <option value="friend">Friend</option>
                                  <option value="family">Family</option>
                                  <option value="partner">Partner</option>
                                  <option value="colleague">Colleague</option>
                                  <option value="other">Other</option>
                                </select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRecipient(recipient.id)}
                                  className="text-slate-400 hover:text-red-400"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {recipients.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No recipients added. This capsule will be private to you.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(2)} variant="outline" className="border-slate-600">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(4)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Next: Theme & Finalize
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Theme & Finalize */}
          <TabsContent value="step-4">
            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Finalize
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 block">Choose a Theme</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableThemes.map((theme) => (
                      <Button
                        key={theme.id}
                        variant={selectedTheme.id === theme.id ? "default" : "outline"}
                        onClick={() => setSelectedTheme(theme)}
                        className={`h-auto p-4 ${
                          selectedTheme.id === theme.id
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "border-slate-600 text-slate-300"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className="w-16 h-16 rounded-lg mx-auto mb-2"
                            style={{ background: theme.colors.background }}
                          />
                          <div className="font-medium">{theme.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 block">Preview</label>
                  <Card
                    className="border-slate-700/50 overflow-hidden"
                    style={{ background: selectedTheme.colors.background }}
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">{title || "Your Time Capsule"}</h3>
                        <p className="text-slate-200 mb-4">{description || "A beautiful memory preserved in time"}</p>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {mood}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {content.length} items
                          </div>
                          {scheduledFor && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary */}
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Capsule Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Content Items:</span>
                      <span className="text-white ml-2">{content.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Recipients:</span>
                      <span className="text-white ml-2">{recipients.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Visibility:</span>
                      <span className="text-white ml-2 capitalize">{visibility}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Status:</span>
                      <span className="text-white ml-2">{scheduledFor ? "Scheduled" : "Immediate"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(3)} variant="outline" className="border-slate-600">
                    Previous
                  </Button>
                  <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Send className="w-4 h-4 mr-2" />
                    {editingCapsule ? "Update" : "Create"} Time Capsule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
