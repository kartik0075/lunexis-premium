"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { VisionUploadData, VisionChapter } from "../../types/vision"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Upload,
  Video,
  ImageIcon,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  MessageCircle,
  Download,
  Clock,
  Sparkles,
} from "lucide-react"

interface VisionUploadProps {
  onBack: () => void
  onPublish: (data: VisionUploadData) => void
}

const moodOptions = [
  "calm",
  "hyper",
  "inspired",
  "dreamy",
  "energetic",
  "nostalgic",
  "cosmic",
  "educational",
  "creative",
]

export function VisionUpload({ onBack, onPublish }: VisionUploadProps) {
  const [uploadData, setUploadData] = useState<VisionUploadData>({
    videoFile: null,
    title: "",
    description: "",
    thumbnail: "",
    moodTags: [],
    chapters: [],
    isPrivate: false,
    allowComments: true,
    allowDownload: false,
  })

  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [activeTab, setActiveTab] = useState("details")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setUploadData((prev) => ({ ...prev, videoFile: file }))
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setUploadData((prev) => ({ ...prev, thumbnail: url }))
    }
  }

  const handleMoodToggle = (mood: string) => {
    setUploadData((prev) => ({
      ...prev,
      moodTags: prev.moodTags.includes(mood) ? prev.moodTags.filter((m) => m !== mood) : [...prev.moodTags, mood],
    }))
  }

  const addChapter = () => {
    const newChapter: Omit<VisionChapter, "id"> = {
      title: "",
      startTime: 0,
      endTime: 0,
      thumbnail: "",
    }
    setUploadData((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }))
  }

  const updateChapter = (index: number, field: keyof Omit<VisionChapter, "id">, value: string | number) => {
    setUploadData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => (i === index ? { ...chapter, [field]: value } : chapter)),
    }))
  }

  const removeChapter = (index: number) => {
    setUploadData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  const handlePublish = () => {
    if (!uploadData.videoFile || !uploadData.title) {
      alert("Please select a video and add a title")
      return
    }
    onPublish(uploadData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Upload Vision</span>
          </div>

          <Button
            onClick={handlePublish}
            disabled={!uploadData.videoFile || !uploadData.title}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload & Preview */}
          <div className="space-y-6">
            {/* Video Upload */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video File
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!previewUrl ? (
                  <div
                    className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 mb-2">Click to upload your Vision video</p>
                    <p className="text-slate-500 text-sm">MP4, MOV, AVI up to 2GB</p>
                    <p className="text-slate-500 text-xs mt-1">Recommended: 1080p or higher</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      controls
                      className="w-full aspect-video object-cover rounded-lg"
                      onLoadedMetadata={handleVideoLoadedMetadata}
                    />
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Duration: {formatTime(videoDuration)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-slate-600 text-slate-300"
                      >
                        Change Video
                      </Button>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Custom Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!uploadData.thumbnail ? (
                  <div
                    className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors aspect-video"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-300 text-sm">Upload custom thumbnail</p>
                    <p className="text-slate-500 text-xs">JPG, PNG (16:9 ratio recommended)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <img
                      src={uploadData.thumbnail || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="border-slate-600 text-slate-300"
                    >
                      Change Thumbnail
                    </Button>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Details & Settings */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {/* Basic Details */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-slate-300">
                        Title *
                      </Label>
                      <Input
                        id="title"
                        value={uploadData.title}
                        onChange={(e) => setUploadData((prev) => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white"
                        placeholder="Give your Vision an inspiring title..."
                        maxLength={100}
                      />
                      <div className="text-xs text-slate-500 mt-1">{uploadData.title.length}/100 characters</div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-slate-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={uploadData.description}
                        onChange={(e) => setUploadData((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-slate-800/50 border-slate-600 text-white resize-none"
                        placeholder="Share the story behind your Vision..."
                        rows={6}
                        maxLength={5000}
                      />
                      <div className="text-xs text-slate-500 mt-1">{uploadData.description.length}/5000 characters</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mood Tags */}
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Mood Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {moodOptions.map((mood) => (
                        <Badge
                          key={mood}
                          variant="outline"
                          className={`cursor-pointer transition-all capitalize ${
                            uploadData.moodTags.includes(mood)
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                              : "border-slate-600 text-slate-400 hover:border-slate-500"
                          }`}
                          onClick={() => handleMoodToggle(mood)}
                        >
                          #{mood}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chapters" className="space-y-4">
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Video Chapters
                      </CardTitle>
                      <Button
                        onClick={addChapter}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Chapter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {uploadData.chapters.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No chapters added yet</p>
                        <p className="text-sm">Add chapters to help viewers navigate your content</p>
                      </div>
                    ) : (
                      uploadData.chapters.map((chapter, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-medium">Chapter {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeChapter(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-slate-400 text-sm">Start Time (seconds)</Label>
                              <Input
                                type="number"
                                value={chapter.startTime}
                                onChange={(e) =>
                                  updateChapter(index, "startTime", Number.parseInt(e.target.value) || 0)
                                }
                                className="bg-slate-700 border-slate-600 text-white"
                                min={0}
                                max={videoDuration}
                              />
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">End Time (seconds)</Label>
                              <Input
                                type="number"
                                value={chapter.endTime}
                                onChange={(e) => updateChapter(index, "endTime", Number.parseInt(e.target.value) || 0)}
                                className="bg-slate-700 border-slate-600 text-white"
                                min={chapter.startTime}
                                max={videoDuration}
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-slate-400 text-sm">Chapter Title</Label>
                            <Input
                              value={chapter.title}
                              onChange={(e) => updateChapter(index, "title", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Enter chapter title..."
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Privacy & Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploadData.isPrivate ? (
                          <EyeOff className="w-5 h-5 text-slate-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-slate-400" />
                        )}
                        <div>
                          <div className="text-white font-medium">Visibility</div>
                          <div className="text-slate-400 text-sm">
                            {uploadData.isPrivate ? "Only you can see this video" : "Anyone can see this video"}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={!uploadData.isPrivate}
                        onCheckedChange={(checked) => setUploadData((prev) => ({ ...prev, isPrivate: !checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-medium">Comments</div>
                          <div className="text-slate-400 text-sm">Allow viewers to comment</div>
                        </div>
                      </div>
                      <Switch
                        checked={uploadData.allowComments}
                        onCheckedChange={(checked) => setUploadData((prev) => ({ ...prev, allowComments: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-medium">Downloads</div>
                          <div className="text-slate-400 text-sm">Allow viewers to download</div>
                        </div>
                      </div>
                      <Switch
                        checked={uploadData.allowDownload}
                        onCheckedChange={(checked) => setUploadData((prev) => ({ ...prev, allowDownload: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
